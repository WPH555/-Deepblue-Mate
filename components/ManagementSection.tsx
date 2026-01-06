
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input } from './UI';
import { roomDb } from '../services/storage';
import { InventoryItem, ShipCertificate } from '../types';

// --- 子功能 1: 休息时间记录 (Rest Hour Logger) - [保持不变] ---
const RestHourManager: React.FC = () => {
  const [hours, setHours] = useState<boolean[]>(roomDb.getRestHours());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const restCount = hours.filter(h => !h).length;
  const isViolation = restCount < 10;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const slotWidth = canvas.width / 24;
      hours.forEach((isWork, i) => {
        ctx.fillStyle = isWork ? 'rgba(255, 61, 0, 0.8)' : 'rgba(0, 229, 255, 0.3)';
        ctx.fillRect(i * slotWidth + 1, 5, slotWidth - 2, canvas.height - 15);
        if (i % 6 === 0) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.font = '8px JetBrains Mono';
          ctx.fillText(`${i}h`, i * slotWidth, canvas.height - 2);
        }
      });
    };
    draw();
  }, [hours]);

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const x = clientX - rect.left;
    const slot = Math.floor((x / rect.width) * 24);
    if (slot >= 0 && slot < 24) {
      const newHours = [...hours];
      newHours[slot] = !newHours[slot];
      setHours(newHours);
      roomDb.saveRestHours(newHours);
    }
  };

  return (
    <Card className="space-y-4 border-l-2 border-l-[#00E5FF]">
      <div className="flex justify-between items-center">
        <h3 className="text-[#00E5FF] font-bold text-sm uppercase tracking-widest">休息时间管理 (MLC 2006)</h3>
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-sm uppercase ${isViolation ? 'bg-[#FF3D00] text-white animate-pulse' : 'bg-green-500/20 text-green-400'}`}>
          {isViolation ? '违反公约' : '合规'}
        </span>
      </div>
      <div className="bg-black/50 rounded-sm border border-white/10 overflow-hidden p-2 shadow-inner">
        <canvas ref={canvasRef} width={400} height={70} className="w-full h-14 cursor-crosshair touch-none" onClick={handleInteraction} />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex gap-4">
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF3D00]"></div><span className="text-[10px] text-white/40">作业</span></div>
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#00E5FF]/30"></div><span className="text-[10px] text-white/40">休息</span></div>
        </div>
        <div className="text-xs font-black mono text-white">合计休息: <span className={isViolation ? 'text-[#FF3D00]' : 'text-[#00E5FF]'}>{restCount}h</span></div>
      </div>
    </Card>
  );
};

// --- 子功能 2: 关键备件库存监控 (Dynamic) - [保持不变] ---
const SparePartInventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newStock, setNewStock] = useState('0');
  const [newMax, setNewMax] = useState('10');

  useEffect(() => { setItems(roomDb.getInventory()); }, []);

  const updateStock = (id: string, delta: number) => {
    const newItems = items.map(item => item.id === id ? { ...item, stock: Math.max(0, Math.min(item.maxStock, item.stock + delta)) } : item);
    setItems(newItems);
    roomDb.saveInventory(newItems);
  };

  const handleAddItem = () => {
    if (!newName) return;
    const item = roomDb.addInventoryItem(newName, parseInt(newStock), parseInt(newMax));
    setItems([...items, item]);
    setIsAdding(false);
    setNewName('');
  };

  return (
    <Card className="space-y-4 border-l-2 border-l-white/10">
      <div className="flex justify-between items-center">
        <h3 className="text-[#00E5FF] font-bold text-sm uppercase tracking-widest">关键备件库存监控</h3>
        <button onClick={() => setIsAdding(true)} className="w-6 h-6 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center hover:bg-[#00E5FF]/40 transition-all">+</button>
      </div>
      <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar pr-1">
        {items.map(item => {
          const p = (item.stock / item.maxStock) * 100;
          const isLow = p < 35;
          return (
            <div key={item.id} className="space-y-1.5 group">
              <div className="flex justify-between text-[10px] items-end">
                <span className="text-white/80 font-bold group-hover:text-[#00E5FF] transition-colors">{item.name}</span>
                <span className="mono text-white/30">{item.stock} / {item.maxStock} UNIT</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className={`h-full transition-all duration-700 ${isLow ? 'bg-[#FF3D00] shadow-[0_0_8px_#FF3D00]' : 'bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]'}`} style={{ width: `${p}%` }}></div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => updateStock(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white/5 border border-white/10 rounded-sm text-white/60 hover:border-white/20">-</button>
                  <button onClick={() => updateStock(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white/5 border border-white/10 rounded-sm text-white/60 hover:border-white/20">+</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-xs border-[#00E5FF]/30">
            <h4 className="text-[#00E5FF] font-bold text-xs mb-4 uppercase tracking-widest">新增库存备件</h4>
            <div className="space-y-3">
              <Input placeholder="备件名称" value={newName} onChange={e => setNewName(e.target.value)} />
              <div className="flex gap-2">
                <Input type="number" placeholder="当前库存" value={newStock} onChange={e => setNewStock(e.target.value)} />
                <Input type="number" placeholder="最大值" value={newMax} onChange={e => setNewMax(e.target.value)} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" className="flex-1" onClick={() => setIsAdding(false)}>取消</Button>
                <Button className="flex-1" onClick={handleAddItem}>添加</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
};

// --- 子功能 3: 船舶法定证书管理 (Dynamic) - [保持不变] ---
const CertificateWallet: React.FC = () => {
  const [certs, setCerts] = useState<ShipCertificate[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newExpiry, setNewExpiry] = useState('');

  useEffect(() => { setCerts(roomDb.getCertificates()); }, []);

  const getStatus = (expiry: string) => {
    const expDate = new Date(expiry);
    const now = new Date();
    const diffDays = Math.floor((expDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    if (diffDays < 0) return { label: '证书过期', color: 'text-[#FF3D00]', bg: 'bg-[#FF3D00]/10', border: 'border-[#FF3D00]/30', pulse: 'animate-pulse', days: diffDays };
    if (diffDays < 90) return { label: `${diffDays} 天后到期`, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', pulse: '', days: diffDays };
    return { label: '有效期内', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30', pulse: '', days: diffDays };
  };

  const handleAddCert = () => {
    if (!newName || !newExpiry) return;
    const cert = roomDb.addCertificate(newName, new Date(newExpiry).toISOString());
    setCerts([...certs, cert]);
    setIsAdding(false);
    setNewName('');
    setNewExpiry('');
  };

  return (
    <Card className="space-y-4 border-l-2 border-l-white/10">
      <div className="flex justify-between items-center">
        <h3 className="text-[#00E5FF] font-bold text-sm uppercase tracking-widest">船舶法定证书管理</h3>
        <button onClick={() => setIsAdding(true)} className="w-6 h-6 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center hover:bg-[#00E5FF]/40 transition-all">+</button>
      </div>
      <div className="space-y-2.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
        {certs.map(cert => {
          const status = getStatus(cert.expiryDate);
          return (
            <div key={cert.id} className={`p-3 glass border ${status.border} rounded-sm flex items-center justify-between group relative`}>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white group-hover:text-[#00E5FF] transition-colors uppercase">{cert.name}</span>
                <span className="text-[8px] text-white/30 mono mt-0.5">{new Date(cert.expiryDate).toLocaleDateString()}</span>
              </div>
              <div className={`text-[8px] px-2 py-0.5 rounded-sm font-black uppercase ${status.bg} ${status.color} ${status.pulse} border ${status.border}`}>
                {status.label}
              </div>
            </div>
          );
        })}
      </div>
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-xs border-[#00E5FF]/30">
            <h4 className="text-[#00E5FF] font-bold text-xs mb-4 uppercase tracking-widest">新增航行证书</h4>
            <div className="space-y-3">
              <Input placeholder="证书名称" value={newName} onChange={e => setNewName(e.target.value)} />
              <div className="space-y-1">
                <label className="text-[8px] text-white/20 mono uppercase px-1">失效日期</label>
                <Input type="date" value={newExpiry} onChange={e => setNewExpiry(e.target.value)} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" className="flex-1" onClick={() => setIsAdding(false)}>取消</Button>
                <Button className="flex-1" onClick={handleAddCert}>添加</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
};

// --- [新功能] 子功能 4: 舱室环境合规检测仪 (Cabin Environment Monitor) ---
const CabinEnvironmentMonitor: React.FC = () => {
  const [lux, setLux] = useState(450);
  const [noise, setNoise] = useState(52);

  useEffect(() => {
    const timer = setInterval(() => {
      setLux(prev => Math.max(300, Math.min(600, prev + (Math.random() - 0.5) * 10)));
      setNoise(prev => Math.max(40, Math.min(65, prev + (Math.random() - 0.5) * 4)));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="border-l-2 border-l-[#FF3D00] bg-black/20">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[#FF3D00] font-bold text-sm uppercase tracking-widest">舱室环境实时合规检测</h3>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF3D00] animate-pulse"></span>
            <span className="text-[8px] mono text-white/40">SENSOR_ACTIVE</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* 光照仪表 */}
        <div className="text-center p-4 glass border border-white/5 relative group">
            <div className="text-[8px] text-white/30 uppercase mono mb-1">Illumination</div>
            <div className="text-2xl font-black text-[#00E5FF] mono">{Math.round(lux)} <span className="text-[8px] opacity-40">LUX</span></div>
            <div className="h-1 bg-white/5 mt-3 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-1000 ${lux < 350 ? 'bg-[#FF3D00]' : 'bg-[#00E5FF]'}`}
                    style={{ width: `${(lux / 600) * 100}%` }}
                ></div>
            </div>
            <div className="text-[7px] text-white/20 mt-1 mono">MLC: &gt;300 LUX</div>
        </div>
        {/* 噪音仪表 */}
        <div className="text-center p-4 glass border border-white/5 relative group">
            <div className="text-[8px] text-white/30 uppercase mono mb-1">Noise Level</div>
            <div className="text-2xl font-black text-[#FF3D00] mono">{noise.toFixed(1)} <span className="text-[8px] opacity-40">dB</span></div>
            <div className="h-1 bg-white/5 mt-3 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-1000 ${noise > 60 ? 'bg-[#FF3D00]' : 'bg-[#FF3D00]/50'}`}
                    style={{ width: `${(noise / 80) * 100}%` }}
                ></div>
            </div>
            <div className="text-[7px] text-white/20 mt-1 mono">MAX: 60 dB</div>
        </div>
      </div>
    </Card>
  );
};

// --- [新功能] 子功能 5: 每日海事知识模块 (Daily Maritime Knowledge) ---
const MaritimeKnowledge: React.FC = () => {
    const facts = [
        { title: "COLREGs 第5条", content: "每一船在任何时候均应以视觉、听觉以及一切有效手段保持正规的瞭望。" },
        { title: "MARPOL 垃圾管理", content: "在距离最近陆地3海里以内，禁止将任何食品废弃物排入海中。" },
        { title: "MLC 2006 权利", content: "所有海员均有权获得安全且受保护的、符合安全标准的作业场所。" },
    ];
    const [fact] = useState(facts[Math.floor(Math.random() * facts.length)]);

    return (
        <div className="mt-2 glass p-4 border border-white/10 rounded-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9H10.07L12 5.84zM5.5 13L2 19h20l-3.5-6h-13zm3.12 4l1.17-2h4.42l1.17 2H8.62z"/></svg>
            </div>
            <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-3 bg-[#00E5FF]"></div>
                <h4 className="text-[10px] font-black text-[#00E5FF] uppercase tracking-widest italic">{fact.title}</h4>
            </div>
            <p className="text-[11px] text-white/60 leading-relaxed font-medium">
                {fact.content}
            </p>
            <div className="mt-3 flex justify-end">
                <span className="text-[7px] text-white/20 mono uppercase tracking-tighter">Daily_Maritime_Insight // DeepBlue_Mate</span>
            </div>
        </div>
    );
};

const ManagementSection: React.FC = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-20">
      <header className="mb-2 px-1">
        <h2 className="text-xl font-bold text-white tracking-tighter">合规管理中心</h2>
        <div className="flex items-center gap-2">
          <p className="text-[10px] mono text-[#00E5FF] opacity-60 uppercase tracking-widest">Compliance Hub</p>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-[#00E5FF]/20 to-transparent"></div>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-4">
        {/* 保留原有功能 */}
        <RestHourManager />
        <SparePartInventory />
        <CertificateWallet />
        
        {/* 新增功能 */}
        <CabinEnvironmentMonitor />
        <MaritimeKnowledge />
      </div>
    </div>
  );
};

export default ManagementSection;
