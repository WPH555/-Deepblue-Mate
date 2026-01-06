
import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Card } from './UI';

// --- 类型定义 ---
interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isSelf: boolean;
  side: 'left' | 'right';
}

interface InspectionZone {
  id: string;
  name: string;
  status: 'pending' | 'ok';
  time?: string;
}

// ==========================================
// 1. 数字传话筒 (Speaking Tube) - 全屏组件
// ==========================================
const SpeakingTubeDetail: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [role, setRole] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: '系统', content: '船内局域网已连接。当前频道：通用频道_ALPHA', time: '08:00', isSelf: false, side: 'left' }
  ]);
  const [input, setInput] = useState('');
  const [isPing, setIsPing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const roles = [
    { name: '船长', dept: '驾驶台', side: 'left' },
    { name: '大副', dept: '驾驶台', side: 'left' },
    { name: '轮机长', dept: '机舱', side: 'right' },
    { name: '水手长', dept: '甲板', side: 'right' }
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const triggerPing = () => {
    setIsPing(true);
    setTimeout(() => setIsPing(false), 2000);
  };

  const handleSend = () => {
    if (!input.trim() || !role) return;
    
    const userRole = roles.find(r => r.name === role);
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: role,
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
      side: (userRole?.side as any) || 'left'
    };

    setMessages(prev => [...prev, newMessage]);
    const currentInput = input;
    setInput('');

    if (currentInput.toLowerCase().includes('test') || currentInput.includes('测试')) {
      setTimeout(() => {
        triggerPing();
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: '大副',
          content: '收到，正在前往船首 (Copy that, proceeding to bow).',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSelf: false,
          side: 'left'
        }]);
      }, 2000);
    }
  };

  if (!role) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0B1021] flex flex-col p-6 animate-in slide-in-from-bottom duration-500">
        <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-4">
          <h2 className="text-xl font-black text-[#00E5FF] tracking-widest uppercase italic">身份验证: 传话筒</h2>
          <button onClick={onClose} className="text-[#FF3D00]">取消</button>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-2">
            <div className="text-[#00E5FF] mono text-[10px] animate-pulse">AUTHENTICATION_REQUIRED</div>
            <h3 className="text-white font-bold">请选择您的当前岗位以接通</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {roles.map(r => (
              <button key={r.name} onClick={() => setRole(r.name)} className="glass p-6 border border-white/5 hover:border-[#00E5FF] transition-all group">
                <div className="text-xs text-white/30 mb-1 mono group-hover:text-[#00E5FF]">{r.dept}</div>
                <div className="text-sm font-bold text-white uppercase">{r.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#030712] flex flex-col animate-in slide-in-from-bottom duration-500">
      <div className="h-14 glass border-b border-[#00E5FF]/20 px-6 flex items-center justify-between relative overflow-hidden">
        {isPing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-1 h-1 bg-[#00E5FF] rounded-full animate-ping-large"></div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_green]"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#00E5FF] mono uppercase">Digital Speaking Tube</span>
            <span className="text-[7px] text-white/30 mono uppercase tracking-widest">Bridging Deck & Engine Room</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[8px] text-white/40 mono uppercase">Active_User</div>
            <div className="text-[10px] font-bold text-white">{role}</div>
          </div>
          <button onClick={onClose} className="text-[#FF3D00] text-lg px-2 hover:bg-[#FF3D00]/10 rounded-full transition-all">✕</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-black/80 relative">
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-grid-pattern"></div>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.side === 'right' ? 'items-end' : 'items-start'} animate-in fade-in duration-300`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[8px] mono text-white/30">{msg.time}</span>
              <span className={`text-[9px] font-bold mono uppercase ${msg.side === 'right' ? 'text-blue-400' : 'text-green-400'}`}>[{msg.sender}]</span>
            </div>
            <div className={`max-w-[85%] p-3 glass border ${msg.side === 'right' ? 'border-blue-500/30 rounded-tr-none' : 'border-green-500/30 rounded-tl-none'} relative group`}>
              <p className={`text-xs mono leading-relaxed ${msg.side === 'right' ? 'text-blue-100' : 'text-green-100'}`}>
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-black border-t border-white/10">
        <div className="flex gap-3 bg-[#00E5FF]/5 border border-[#00E5FF]/20 rounded-sm p-1">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="键入指令或发送消息..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-xs text-[#00E5FF] mono placeholder-[#00E5FF]/20 px-3 py-2"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-[#00E5FF] text-black px-6 text-[10px] font-black uppercase tracking-tighter disabled:opacity-30 active:scale-95 transition-all"
          >
            SEND
          </button>
        </div>
      </div>

      <style>{`
        @keyframes ping-large {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(10); opacity: 0; }
        }
        .animate-ping-large { animation: ping-large 1s ease-out; }
        .bg-grid-pattern {
           background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0);
           background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

// --- 子功能 1: 实时船位探测 (Position Map) ---
const PositionMap: React.FC = () => {
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 31.2304, lng: 121.4737 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.02}%2C${coords.lat - 0.02}%2C${coords.lng + 0.02}%2C${coords.lat + 0.02}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`;

  return (
    <Card className="p-0 overflow-hidden min-h-[200px] border-[#00E5FF]/20 relative mb-4">
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md px-2 py-1 border-l-2 border-[#00E5FF]">
          <span className="text-[8px] text-white/40 mono block uppercase">Latitude</span>
          <span className="text-xs text-[#00E5FF] mono font-bold">{coords.lat.toFixed(4)}° N</span>
        </div>
      </div>
      <iframe 
        title="Maritime Map" width="100%" height="220" frameBorder="0" scrolling="no" src={mapUrl}
        style={{ filter: 'invert(90%) hue-rotate(180deg) brightness(0.6) contrast(1.2)' }}
        className="relative z-10"
      ></iframe>
    </Card>
  );
};

// --- 子功能 2: 船体锈蚀智能分析 ---
const RustAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [rustLevel, setRustLevel] = useState<number | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => { setImage(ev.target?.result as string); setRustLevel(null); };
      reader.readAsDataURL(file);
    }
  };

  const analyzePixels = () => {
    if (!image || !canvasRef.current) return;
    setAnalyzing(true);
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      const scale = Math.min(200 / img.width, 200 / img.height);
      canvas.width = img.width * scale; canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let rustPixels = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 90 && data[i+1] > 30 && data[i+1] < data[i] * 0.75) rustPixels++;
      }
      setTimeout(() => { setRustLevel(Math.min(100, Math.round((rustPixels / (data.length / 4)) * 600))); setAnalyzing(false); }, 1500);
    };
  };

  return (
    <Card className="flex flex-col gap-4 border-l-2 border-l-[#00E5FF] mb-4">
      <h3 className="text-[#00E5FF] font-bold text-sm uppercase tracking-widest flex items-center gap-2">船体锈蚀智能分析</h3>
      <div className="relative aspect-video glass rounded-sm overflow-hidden flex items-center justify-center">
        {image ? (
          <img src={image} className="w-full h-full object-cover" alt="Inspection" />
        ) : (
          <label className="cursor-pointer p-8 flex flex-col items-center">
            <svg className="w-12 h-12 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
            <span className="text-[10px] text-white/30 mono mt-2">上传影像数据</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        )}
      </div>
      {image && !analyzing && rustLevel === null && <Button onClick={analyzePixels} variant="primary">执行分析</Button>}
      {rustLevel !== null && <div className="text-right text-xl font-bold mono text-[#FF3D00]">RUST: {rustLevel}%</div>}
      <canvas ref={canvasRef} className="hidden" />
    </Card>
  );
};

// --- 子功能 3: 机舱智能仪表盘 (Redesigned) ---
const SmartInspection: React.FC = () => {
  const params = [
    { label: '主机温度', value: 72, unit: '℃', max: 100, status: 'NORMAL' },
    { label: '排烟温度', value: 380, unit: '℃', max: 500, status: 'NORMAL' },
    { label: '冷却水压', value: 2.8, unit: 'bar', max: 5.0, status: 'NORMAL' },
    { label: '燃油消耗', value: 12.4, unit: 't/h', max: 20.0, status: 'NORMAL' },
  ];

  return (
    <Card className="border-l-2 border-l-[#00E5FF] mb-4 bg-black/20">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[#00E5FF] font-bold text-sm uppercase tracking-widest">机舱关键运行参数</h3>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[8px] mono text-white/40">SYS_NOMINAL</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-6">
        {params.map((p) => (
          <div key={p.label} className="space-y-2 group">
            <div className="flex justify-between items-end">
                <span className="text-[10px] text-white/40 font-medium">{p.label}</span>
                <span className="text-xs font-black text-white mono">{p.value} <span className="text-[8px] text-white/20">{p.unit}</span></span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden relative">
                <div 
                    className="h-full bg-gradient-to-r from-[#00E5FF] to-[#00E5FF]/40 transition-all duration-1000"
                    style={{ width: `${(p.value / p.max) * 100}%` }}
                ></div>
                {/* 扫描线效果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-1/4 animate-scan-fast"></div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scan-fast {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        .animate-scan-fast { animation: scan-fast 2s linear infinite; }
      `}</style>
    </Card>
  );
};

// --- 子功能 4: 智能巡检打卡 (New) ---
const InspectionCheckIn: React.FC = () => {
    const [zones, setZones] = useState<InspectionZone[]>([
        { id: '1', name: '驾驶台 (Bridge)', status: 'pending' },
        { id: '2', name: '船首甲板 (Bow Deck)', status: 'pending' },
        { id: '3', name: '主机舱 (Main Engine Room)', status: 'pending' },
        { id: '4', name: '舵机间 (Steering Room)', status: 'pending' },
        { id: '5', name: '生活区 (Living Quarters)', status: 'pending' },
    ]);

    const handleCheckIn = (id: string) => {
        setZones(prev => prev.map(z => z.id === id ? { 
            ...z, 
            status: 'ok', 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
        } : z));
    };

    return (
        <Card className="border-l-2 border-l-[#FF3D00] mb-4 bg-black/20">
            <h3 className="text-[#FF3D00] font-bold text-sm uppercase tracking-widest mb-4">智能巡检实时打卡</h3>
            <div className="space-y-3">
                {zones.map(zone => (
                    <button
                        key={zone.id}
                        disabled={zone.status === 'ok'}
                        onClick={() => handleCheckIn(zone.id)}
                        className={`w-full flex items-center justify-between p-3 glass border transition-all duration-300 relative group ${
                            zone.status === 'ok' 
                            ? 'border-green-500/40 bg-green-500/5 cursor-default' 
                            : 'border-white/5 hover:border-[#00E5FF]/50 active:scale-[0.98]'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-1.5 h-1.5 rounded-full ${zone.status === 'ok' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-white/20 animate-pulse'}`}></div>
                            <span className={`text-[11px] font-bold uppercase mono ${zone.status === 'ok' ? 'text-green-400' : 'text-white/60'}`}>{zone.name}</span>
                        </div>
                        {zone.status === 'ok' ? (
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] text-green-500/80 font-black mono">SUCCESS_UPLOADED</span>
                                <span className="text-[7px] text-white/30 mono">{zone.time}</span>
                            </div>
                        ) : (
                            <span className="text-[8px] text-[#00E5FF] mono opacity-0 group-hover:opacity-100 transition-opacity">CLICK_TO_LOG</span>
                        )}
                        {zone.status === 'ok' && (
                            <div className="absolute inset-0 bg-green-500/5 pointer-events-none animate-pulse"></div>
                        )}
                    </button>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-[8px] text-white/20 mono uppercase">Audit_Trail: MLC_STCW_COMPLIANT</span>
                <span className="text-[10px] font-bold text-white/40 mono">{zones.filter(z => z.status === 'ok').length} / {zones.length} COMPLETE</span>
            </div>
        </Card>
    );
};

// ==========================================
// 5. 主板块组件 (AnalysisSection)
// ==========================================
const AnalysisSection: React.FC = () => {
  const [isTubeOpen, setIsTubeOpen] = useState(false);
  const [isAlertActive, setIsAlertActive] = useState(false);

  const triggerSOS = () => {
    setIsAlertActive(true);
    // 自动重置报警状态
    setTimeout(() => setIsAlertActive(false), 5000);
  };

  return (
    <div className={`space-y-4 animate-in fade-in duration-500 pb-16 relative ${isAlertActive ? 'animate-vibrate' : ''}`}>
      
      {/* 紧急报警图层 */}
      {isAlertActive && (
        <div className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[#FF3D00]/20 animate-pulse"></div>
            <div className="absolute inset-0 border-[20px] border-[#FF3D00]/30 animate-ping"></div>
            <div className="text-[4rem] font-black text-[#FF3D00] mono italic opacity-20 rotate-12 select-none">EMERGENCY_DANGER</div>
            <div className="bg-[#FF3D00] text-black px-8 py-4 font-black text-2xl animate-bounce shadow-[0_0_50px_#FF3D00]">SOS_SIGNAL_SENT</div>
        </div>
      )}

      <header className="mb-4 flex justify-between items-center">
        <div>
            <h2 className="text-xl font-bold text-white tracking-tighter uppercase italic">作业感知中心</h2>
            <div className="flex items-center gap-2 mt-1">
                <div className="h-[1px] w-24 bg-gradient-to-r from-[#00E5FF]/20 to-transparent"></div>
                <span className="text-[8px] mono text-[#00E5FF] uppercase tracking-widest">Op_Perception_Hub</span>
            </div>
        </div>
        
        {/* SOS 红色小点按钮 */}
        <button 
            onClick={triggerSOS}
            className="w-10 h-10 rounded-full glass border border-[#FF3D00]/40 flex items-center justify-center group active:scale-90 transition-all relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-[#FF3D00]/10 group-hover:bg-[#FF3D00]/20 transition-colors"></div>
            <div className="w-3 h-3 bg-[#FF3D00] rounded-full shadow-[0_0_15px_#FF3D00] animate-pulse"></div>
            <span className="absolute bottom-1 text-[5px] text-[#FF3D00] mono font-bold">SOS</span>
        </button>
      </header>

      {/* --- 数字传话筒入口 --- */}
      <Card 
        onClick={() => setIsTubeOpen(true)}
        className="cursor-pointer border-l-4 border-l-[#00E5FF] !bg-[#00E5FF]/5 hover:!bg-[#00E5FF]/10 transition-all group overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#00E5FF]/20 rounded-sm text-[#00E5FF] group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-black text-white group-hover:text-[#00E5FF] transition-colors">数字传话筒 (Speaking Tube)</h3>
              <p className="text-[10px] text-white/40 mt-1">船内实时通信终端 · 岗位验证已就绪</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] mono text-green-500">LIVE</span>
          </div>
        </div>
      </Card>

      <PositionMap />
      <RustAnalyzer />
      <SmartInspection />
      <InspectionCheckIn />

      {isTubeOpen && <SpeakingTubeDetail onClose={() => setIsTubeOpen(false)} />}

      <style>{`
        @keyframes vibrate {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }
        .animate-vibrate { animation: vibrate 0.1s linear infinite; }
      `}</style>
    </div>
  );
};

export default AnalysisSection;
