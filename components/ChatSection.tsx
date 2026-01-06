
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/gemini.ts';
import { ChatMessage, AISettings } from '../types.ts';
import { Button, Input, Card } from './UI.tsx';

const SettingsDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSave: (s: AISettings) => void;
}> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<AISettings>(settings);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'fail'>('idle');

  if (!isOpen) return null;

  const presets: Record<string, Partial<AISettings>> = {
    'XiaomiMimo': { baseUrl: 'https://api.xiaomimimo.com/v1/', modelName: 'mimo-v2-flash', provider: 'XiaomiMimo' },
    'DeepSeek': { baseUrl: 'https://api.deepseek.com/v1/', modelName: 'deepseek-chat', provider: 'DeepSeek' },
    'Gemini': { baseUrl: 'https://generativelanguage.googleapis.com/', modelName: 'gemini-3-pro-preview', provider: 'Gemini' },
  };

  const handlePreset = (name: string) => {
    setLocalSettings({ ...localSettings, ...presets[name] });
    setTestStatus('idle');
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    try {
      // 临时保存设置以供测试
      localStorage.setItem('ai_settings', JSON.stringify(localSettings));
      await geminiService.chatWithCaptain("PING");
      setTestStatus('success');
    } catch (e) {
      setTestStatus('fail');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <Card className="w-full max-w-sm border-[#00E5FF]/40 bg-[#0B1021]">
        <h3 className="text-sm font-bold text-[#00E5FF] mb-6 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
          大模型接口设置 (AI API Settings)
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[8px] text-white/30 mono uppercase px-1">服务商预设 (Provider)</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(presets).map(p => (
                <button 
                  key={p} 
                  onClick={() => handlePreset(p)}
                  className={`text-[8px] py-1 border rounded-sm mono transition-all ${localSettings.provider === p ? 'border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/10 shadow-[0_0_10px_rgba(0,229,255,0.2)]' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] text-white/30 mono uppercase px-1">接口基地址 (Base URL)</label>
            <Input 
              value={localSettings.baseUrl} 
              onChange={e => { setLocalSettings({...localSettings, baseUrl: e.target.value}); setTestStatus('idle'); }}
              placeholder="https://api.xiaomimimo.com/v1/"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[8px] text-white/30 mono uppercase px-1">接口密钥 (API Key)</label>
            <div className="relative">
              <Input 
                type="password"
                value="••••••••••••••••"
                readOnly
                className="opacity-50 cursor-not-allowed select-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[7px] text-[#00E5FF] mono font-bold bg-[#0B1021] px-1">SYSTEM_MANAGED</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] text-white/30 mono uppercase px-1">模型名称 (Model Name)</label>
            <Input 
              value={localSettings.modelName} 
              onChange={e => { setLocalSettings({...localSettings, modelName: e.target.value}); setTestStatus('idle'); }}
              placeholder="mimo-v2-flash"
            />
          </div>

          <div className="pt-2">
            <Button 
              variant="ghost" 
              className={`w-full !text-[9px] !py-2 ${testStatus === 'success' ? 'border-green-500 text-green-400' : testStatus === 'fail' ? 'border-red-500 text-red-400' : ''}`}
              onClick={handleTestConnection}
              loading={testStatus === 'testing'}
            >
              {testStatus === 'idle' && '测试接口连接 (Test Connection)'}
              {testStatus === 'testing' && '连接中...'}
              {testStatus === 'success' && '✓ 连接成功 (Connected)'}
              {testStatus === 'fail' && '✗ 连接失败 (Failed)'}
            </Button>
          </div>

          <div className="flex gap-3 mt-4">
            <Button variant="ghost" className="flex-1" onClick={onClose}>取消</Button>
            <Button variant="primary" className="flex-1" onClick={() => onSave(localSettings)}>保存并应用</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const ChatSection: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [aiSettings, setAiSettings] = useState<AISettings>(() => {
    const saved = localStorage.getItem('ai_settings');
    return saved ? JSON.parse(saved) : {
      baseUrl: 'https://api.xiaomimimo.com/v1/',
      modelName: 'gemini-3-pro-preview',
      provider: 'Gemini'
    };
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const response = await geminiService.chatWithCaptain(input, history as any);
      setMessages(prev => [...prev, { role: 'model', content: response || "...", timestamp: Date.now() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "海面上起雾了，信号有些断断续续。放轻松，孩子，等雾散了我还在。☕", timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = (newSettings: AISettings) => {
    setAiSettings(newSettings);
    localStorage.setItem('ai_settings', JSON.stringify(newSettings));
    setIsSettingsOpen(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] relative">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FF3D00]/20 border border-[#FF3D00]/40 flex items-center justify-center">
            <span className="text-lg">👴</span>
          </div>
          <div>
            <div className="text-xs font-bold text-white">退休的老船长</div>
            <div className="text-[8px] text-[#00E5FF] animate-pulse mono">在线 · 听候倾诉</div>
          </div>
        </div>
        
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="w-8 h-8 rounded-full glass flex items-center justify-center text-white/30 hover:text-[#00E5FF] transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 px-2 pb-4 scroll-smooth custom-scrollbar" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="mt-10 flex flex-col items-center text-center space-y-4">
            <div className="p-6 glass rounded-full bg-[#FF3D00]/5 border-[#FF3D00]/20 animate-float">
              <span className="text-4xl">⚓</span>
            </div>
            <div className="space-y-2 max-w-[240px]">
              <h3 className="text-[#FF3D00] font-bold text-sm">欢迎来到心灵港湾</h3>
              <p className="text-[10px] text-white/50 leading-relaxed">
                “无论海浪多大，这里永远是你的避风港。想聊聊家乡、孩子，或者只是想听听海风的声音吗？”
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[80%] relative p-3 rounded-2xl text-xs leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-[#00E5FF]/15 border border-[#00E5FF]/30 text-white rounded-tr-none' 
                : 'bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-white rounded-tl-none'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div className={`text-[8px] mt-1 opacity-30 mono ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="glass px-4 py-2 rounded-2xl rounded-tl-none border border-[#FF3D00]/20">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-[#FF3D00] rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-[#FF3D00] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1 h-1 bg-[#FF3D00] rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 glass p-1.5 rounded-2xl flex items-center gap-2 border-[#00E5FF]/20">
        <div className="flex-1">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="和老船长聊聊天..."
            className="w-full bg-transparent border-none focus:ring-0 text-white text-xs px-3 py-2 placeholder-white/30"
          />
        </div>
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="p-2 bg-[#FF3D00] text-white rounded-xl shadow-lg shadow-[#FF3D00]/20 active:scale-95 disabled:opacity-50 transition-all"
        >
          <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>

      <SettingsDialog 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={aiSettings} 
        onSave={saveSettings} 
      />

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default ChatSection;
