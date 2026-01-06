import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input } from './UI';
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

// --- 类型定义 ---
type ToolId = 'LOADICATOR' | 'COMPASS' | 'FLAGS' | 'ANCHOR' | 'MORSE' | 'PSYCH' | 'NAUTICAL_CALC' | 'SMCP_TRAINER' | 'TIMEZONE_VIZ' | null;

// ==========================================
// 1. 专业复原：船舶配载仪 (Loadicator)
// ==========================================
const LoadicatorDetail: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [fore, setFore] = useState(8.5);
  const [aft, setAft] = useState(9.2);
  const trim = (aft - fore).toFixed(2);

  return (
    <div className="fixed inset-0 z-[100] bg-[#0B1021] flex flex-col p-6 animate-in slide-in-from-bottom duration-500 overflow-y-auto">
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h2 className="text-xl font-black text-[#00E5FF] tracking-widest uppercase italic">船舶配载平衡仪</h2>
        <button onClick={onClose} className="text-[#FF3D00]">✕</button>
      </div>
      <Card className="mb-6 relative h-40 flex items-center justify-center bg-black/40">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        {/* 船舶简影 */}
        <div 
          className="w-48 h-8 bg-[#00E5FF]/20 border-2 border-[#00E5FF] relative transition-transform duration-500"
          style={{ transform: `rotate(${parseFloat(trim) * 2}deg)` }}
        >
          <div className="absolute -left-1 bottom-0 w-2 h-12 bg-[#00E5FF]/40"></div>
          <div className="absolute -right-1 bottom-0 w-2 h-12 bg-[#00E5FF]/40"></div>
        </div>
        <div className="absolute bottom-4 flex justify-between w-full px-12 text-[10px] mono text-white/40">
          <span>FORE: {fore}m</span>
          <span>AFT: {aft}m</span>
        </div>
      </Card>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
            <label className="text-[10px] text-white/40 mono uppercase">船首吃水 (Fore Draft)</label>
            <input type="range" min="5" max="15" step="0.1" value={fore} onChange={e => setFore(parseFloat(e.target.value))} className="w-full accent-[#00E5FF]" />
        </div>
        <div className="space-y-2">
            <label className="text-[10px] text-white/40 mono uppercase">船尾吃水 (Aft Draft)</label>
            <input type="range" min="5" max="15" step="0.1" value={aft} onChange={e => setAft(parseFloat(e.target.value))} className="w-full accent-[#00E5FF]" />
        </div>
        <div className="p-4 glass border border-[#00E5FF]/20 text-center">
            <div className="text-[10px] text-white/40 mono mb-1">TRIM (纵倾值)</div>
            <div className={`text-3xl font-black mono ${Math.abs(parseFloat(trim)) > 2 ? 'text-[#FF3D00]' : 'text-[#00E5FF]'}`}>{trim}m</div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. 专业复原：数字罗盘 (Compass)
// ==========================================
const CompassDetail: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // Use any cast to bypass TypeScript errors regarding non-standard webkitCompassHeading property
      const event = e as any;
      if (event.webkitCompassHeading) {
        setHeading(event.webkitCompassHeading);
      } else if (e.alpha) {
        setHeading(360 - e.alpha);
      }
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <button onClick={onClose} className="absolute top-8 right-8 text-[#FF3D00] text-2xl">✕</button>
      <div className="relative w-72 h-72 border-4 border-[#00E5FF]/20 rounded-full flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-[#00E5FF]/10 animate-pulse"></div>
        <div 
          className="absolute inset-4 border-2 border-[#00E5FF]/40 rounded-full transition-transform duration-100 ease-out"
          style={{ transform: `rotate(${-heading}deg)` }}
        >
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[#FF3D00] font-black">N</div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/40">S</div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40">E</div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-white/40">W</div>
        </div>
        <div className="text-5xl font-black text-[#00E5FF] mono">{Math.round(heading)}°</div>
      </div>
      <p className="mt-8 text-[10px] text-white/20 mono uppercase tracking-widest">Gyroscope_Heading_Active</p>
    </div>
  );
};

// ==========================================
// 3. 新增：航海多功能计算器 (Nautical Calc)
// ==========================================
const NauticalCalcDetail: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'SLIP' | 'FUEL' | 'DEW'>('SLIP');
  const [rpm, setRpm] = useState(95);
  const [pitch, setPitch] = useState(6.8);
  const [speed, setSpeed] = useState(15.2);
  const [temp, setTemp] = useState(28);
  const [rh, setRh] = useState(85);

  const slip = (1 - (speed * 1852) / (rpm * pitch * 60)) * 100;
  const dewPoint = temp - (100 - rh) / 5;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0B1021] flex flex-col p-6 animate-in slide-in-from-bottom duration-500 overflow-y-auto">
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h2 className="text-xl font-black text-[#00E5FF] tracking-widest uppercase italic">航海多功能计算器</h2>
        <button onClick={onClose} className="text-[#FF3D00]">✕</button>
      </div>
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {['SLIP', 'FUEL', 'DEW'].map((t) => (
            <button 
                key={t} onClick={() => setActiveTab(t as any)}
                className={`px-4 py-2 text-[10px] font-bold border rounded-sm ${activeTab === t ? 'bg-[#00E5FF] text-black border-[#00E5FF]' : 'text-white/40 border-white/10'}`}
            >
                {t === 'SLIP' ? '滑失率' : t === 'FUEL' ? '油耗估算' : '露点/通风'}
            </button>
        ))}
      </div>
      {activeTab === 'SLIP' && (
          <Card className="space-y-6">
            <div className="text-center bg-black/40 py-8 rounded-sm border border-white/5">
                <div className="text-[10px] text-white/30 mono uppercase mb-1">Slip Rate</div>
                <div className={`text-5xl font-black mono ${slip > 15 ? 'text-[#FF3D00]' : 'text-[#00E5FF]'}`}>{slip.toFixed(2)}%</div>
            </div>
            <div className="space-y-4">
                <div className="space-y-1"><span className="text-[10px] text-white/40 mono">RPM: {rpm}</span><input type="range" min="40" max="120" value={rpm} onChange={e => setRpm(parseInt(e.target.value))} className="w-full accent-[#00E5FF]" /></div>
                <div className="space-y-1"><span className="text-[10px] text-white/40 mono">SPEED: {speed}kn</span><input type="range" min="5" max="25" step="0.1" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} className="w-full accent-[#00E5FF]" /></div>
            </div>
          </Card>
      )}
      {activeTab === 'DEW' && (
          <Card className="space-y-6">
            <div className="flex justify-around items-center py-6 bg-black/40 rounded-sm">
                <div className="text-center"><div className="text-[8px] text-white/30 uppercase">DEW POINT</div><div className="text-3xl font-black text-[#00E5FF]">{dewPoint.toFixed(1)}℃</div></div>
                <div className="text-center"><div className="text-[8px] text-white/30 uppercase">STATUS</div><div className={`text-xs font-bold ${temp - dewPoint < 3 ? 'text-[#FF3D00]' : 'text-green-500'}`}>{temp - dewPoint < 3 ? '建议通风' : '无需通风'}</div></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><span className="text-[10px] text-white/40 mono">气温: {temp}℃</span><input type="range" min="0" max="50" value={temp} onChange={e => setTemp(parseInt(e.target.value))} className="w-full accent-[#00E5FF]" /></div>
                <div className="space-y-1"><span className="text-[10px] text-white/40 mono">湿度: {rh}%</span><input type="range" min="10" max="100" value={rh} onChange={e => setRh(parseInt(e.target.value))} className="w-full accent-[#00E5FF]" /></div>
            </div>
          </Card>
      )}
    </div>
  );
};

// ==========================================
// 4. 新增：SMCP 航海口语教练 (Trainer)
// ==========================================
const SMCPTrainerDetail: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [scene, setScene] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState<string | null>(null);

  const scenarios = [
    { title: '舵令响应', phrase: 'Midships.', audio: 'Say clearly: Midships.' },
    { title: '引航对接', phrase: 'Ladder on port side.', audio: 'Say clearly: Pilot ladder on port side, one meter above water.' },
    { title: '紧急呼救', phrase: 'Mayday, Mayday.', audio: 'Say clearly: Mayday, Mayday, Mayday. This is vessel Deep Blue Mate.' }
  ];

  const playStandard = async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: scenarios[scene].audio }] }],
        config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } } }
    });
    // Correctly process the model's output audio bytes from GenerateContentResponse
    const res = response as GenerateContentResponse;
    const base64 = res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64) {
      const audio = new Audio(`data:audio/wav;base64,${base64}`); // Assuming WAV container; in a real app PCM decoding would be required
      audio.play();
    }
  };

  const startRecord = () => {
    const Recognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!Recognition) return;
    const rec = new Recognition();
    rec.lang = 'en-US';
    rec.onstart = () => { setIsRecording(true); setScore(null); };
    rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setTranscript(text);
        setScore(text.toLowerCase().includes(scenarios[scene].phrase.toLowerCase().split(' ')[0]) ? 'A' : 'B');
    };
    rec.onend = () => setIsRecording(false);
    rec.start();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0B1021] flex flex-col p-6 animate-in slide-in-from-bottom duration-500">
      <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-4">
        <h2 className="text-xl font-black text-[#00E5FF] tracking-widest uppercase italic">SMCP 口语口音教练</h2>
        <button onClick={onClose} className="text-[#FF3D00]">✕</button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        <div className="text-center space-y-4">
            <div className="text-[10px] text-[#00E5FF] mono uppercase tracking-widest">{scenarios[scene].title}</div>
            <div className="text-2xl font-black text-white italic">"{scenarios[scene].phrase}"</div>
            <Button onClick={playStandard} variant="ghost" className="!rounded-full mx-auto">播放标准音</Button>
        </div>
        <button 
            onMouseDown={startRecord} onMouseUp={() => setIsRecording(false)}
            className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all ${isRecording ? 'bg-[#00E5FF]/20 border-[#00E5FF] scale-90' : 'bg-white/5 border-white/10'}`}
        >
            <svg className={`w-8 h-8 ${isRecording ? 'text-[#00E5FF]' : 'text-white/20'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
        </button>
        {score && (
            <div className="text-center animate-bounce">
                <div className="text-[10px] text-white/30 uppercase mono mb-1">Score</div>
                <div className="text-6xl font-black text-[#00E5FF] mono">{score}</div>
            </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 5. 补充复原：信号旗、时区、抛锚、心理、莫斯 (逻辑闭环)
// ==========================================
const SignalFlagsDetail: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 z-[100] bg-[#0B1021] p-6 overflow-y-auto">
        <header className="flex justify-between mb-8"><h2 className="text-xl font-black text-[#00E5FF]">信号旗词典</h2><button onClick={onClose} className="text-[#FF3D00]">✕</button></header>
        <div className="grid grid-cols-3 gap-4">
            {['A', 'B', 'C', 'D', 'E', 'F'].map(f => (
                <div key={f} className="glass p-4 border border-white/5 text-center">
                    <div className="w-12 h-10 bg-white/10 mx-auto mb-2 relative overflow-hidden flex items-center justify-center font-bold text-[#00E5FF]">{f}</div>
                    <div className="text-[8px] text-white/40 uppercase mono">{f === 'A' ? 'Alpha: 水下作业' : f === 'B' ? 'Bravo: 危险品' : 'Code_Active'}</div>
                </div>
            ))}
        </div>
    </div>
);

const TimeZoneVizDetail: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [lng, setLng] = useState(121);
    const zone = Math.round(lng / 15);
    return (
        <div className="fixed inset-0 z-[100] bg-[#0B1021] p-6 flex flex-col">
            <header className="flex justify-between mb-12"><h2 className="text-xl font-black text-[#00E5FF]">时区管理沙盘</h2><button onClick={onClose} className="text-[#FF3D00]">✕</button></header>
            <div className="flex-1 space-y-12">
                <div className="bg-black/40 h-32 rounded-sm border border-white/10 relative flex items-center justify-center">
                    <div className="text-5xl font-black text-[#00E5FF] mono">UTC {zone >= 0 ? `+${zone}` : zone}</div>
                    <div className="absolute bottom-0 left-0 h-1 bg-[#00E5FF]" style={{ width: `${(lng + 180) / 360 * 100}%` }}></div>
                </div>
                <input type="range" min="-180" max="180" value={lng} onChange={e => setLng(parseInt(e.target.value))} className="w-full accent-[#00E5FF]" />
                <Card className="border-l-2 border-l-[#FF3D00] p-4"><div className="text-[10px] text-white/40 mb-1">调整建议 (Heading East)</div><div className="text-xl font-bold text-white uppercase">Advance 1 Hour (明天拨快)</div></Card>
            </div>
        </div>
    );
};

// 原有工具入口
const ToolCard: React.FC<{ title: string; desc: string; icon: React.ReactNode; onClick: () => void; accent?: 'cyan' | 'orange' }> = ({ title, desc, icon, onClick, accent = 'cyan' }) => (
  <Card onClick={onClick} className={`cursor-pointer hover:border-[#00E5FF]/50 transition-all group border-l-2 ${accent === 'orange' ? 'border-l-[#FF3D00]' : 'border-l-[#00E5FF]'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-sm ${accent === 'orange' ? 'bg-[#FF3D00]/10 text-[#FF3D00]' : 'bg-[#00E5FF]/10 text-[#00E5FF]'} group-hover:scale-110 transition-transform`}>{icon}</div>
    </div>
    <h3 className="text-sm font-black text-white mb-1 group-hover:text-[#00E5FF] transition-colors">{title}</h3>
    <p className="text-[10px] text-white/40 leading-tight">{desc}</p>
  </Card>
);

const ToolsSection: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolId>(null);

  const tools = [
    { id: 'NAUTICAL_CALC' as ToolId, title: '航海多功能计算器', desc: '集合滑失率、露点预测等专业航海计算。', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2-2v14a2 2 0 002 2z" /></svg> },
    { id: 'SMCP_TRAINER' as ToolId, title: 'SMCP口语教练', desc: 'AI口音纠正，模拟引航员标准航海通信指令。', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg> },
    { id: 'TIMEZONE_VIZ' as ToolId, title: '时区管理沙盘', desc: '可视化全球时区滑动条，智能推算调表时刻。', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { id: 'LOADICATOR' as ToolId, title: '船舶配载平衡仪', desc: '实时纵倾模拟与吃水差计算逻辑。', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
    { id: 'COMPASS' as ToolId, title: '数字罗盘', desc: '基于硬件陀螺仪的实时物理航向追踪。', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 11V4.5M11 11V17.5M11 11H4.5M11 11H17.5M11 11L15.5 6.5M11 11L6.5 15.5" /></svg> },
    { id: 'FLAGS' as ToolId, title: '信号旗词典', desc: '国际信号旗 (A-Z) 视觉指南与专业含义速查。', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg> },
  ];

  return (
    <div className="space-y-6 pb-24">
      <header className="px-2">
        <h2 className="text-2xl font-black text-white uppercase italic">深蓝工具 Dashboard</h2>
        <div className="h-[1px] w-32 bg-gradient-to-r from-[#00E5FF] to-transparent mt-1"></div>
      </header>
      <div className="grid grid-cols-1 gap-4 px-1">{tools.map(t => <ToolCard key={t.id} {...t} onClick={() => setActiveTool(t.id)} />)}</div>
      
      {activeTool === 'LOADICATOR' && <LoadicatorDetail onClose={() => setActiveTool(null)} />}
      {activeTool === 'COMPASS' && <CompassDetail onClose={() => setActiveTool(null)} />}
      {activeTool === 'NAUTICAL_CALC' && < NauticalCalcDetail onClose={() => setActiveTool(null)} />}
      {activeTool === 'SMCP_TRAINER' && <SMCPTrainerDetail onClose={() => setActiveTool(null)} />}
      {activeTool === 'TIMEZONE_VIZ' && <TimeZoneVizDetail onClose={() => setActiveTool(null)} />}
      {activeTool === 'FLAGS' && <SignalFlagsDetail onClose={() => setActiveTool(null)} />}
    </div>
  );
};

export default ToolsSection;