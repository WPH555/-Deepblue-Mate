
import React, { useState, useEffect } from 'react';
import { AppSection } from './types.ts';
import { COLORS, ICONS } from './constants.tsx';
import { Card } from './components/UI.tsx';
import { CyberLogo } from './components/Logo.tsx';
import { CyberBackground } from './components/CyberBackground.tsx';

// 导入重组后的功能组件
import AnalysisSection from './components/AnalysisSection.tsx'; // 作业感知 (Operations)
import ToolsSection from './components/ToolsSection.tsx';         // 深蓝工具 (Tools)
import ManagementSection from './components/ManagementSection.tsx'; // 合规审计 (Management)
import ChatSection from './components/ChatSection.tsx';         // 心灵港湾 (Care)

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.CARE);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio) {
        setHasApiKey(await (window as any).aistudio.hasSelectedApiKey());
      } else {
        setHasApiKey(true);
      }
    };
    checkKey();
  }, []);

  const handleKeySelection = async () => {
    if ((window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const navItems = [
    { 
      id: AppSection.OPERATIONS, 
      label: '作业感知', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ) 
    },
    { 
      id: AppSection.TOOLS, 
      label: '深蓝工具', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ) 
    },
    { 
      id: AppSection.MANAGEMENT, 
      label: '合规审计', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ) 
    },
    { 
      id: AppSection.CARE, 
      label: '心灵港湾', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ) 
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case AppSection.OPERATIONS: return <AnalysisSection />;
      case AppSection.TOOLS: return <ToolsSection />;
      case AppSection.MANAGEMENT: return <ManagementSection />;
      case AppSection.CARE: return <ChatSection />;
      default: return <ChatSection />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-white/10 bg-[#0B1021]">
      <CyberBackground />
      
      {/* Cinematic Header */}
      <header className="h-16 flex items-center justify-between px-6 glass border-b border-[#00E5FF]/20 z-20 relative">
        <div className="flex items-center gap-3">
          <div className="relative">
            <CyberLogo className="w-8 h-8 filter drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs font-bold tracking-[0.3em] text-[#00E5FF] mono">深蓝伴侣</h1>
            <span className="text-[7px] text-white/30 mono uppercase tracking-widest">DeepBlue Mate OS v1.0.8</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!hasApiKey && (
            <button onClick={handleKeySelection} className="text-[8px] border border-[#FF3D00] text-[#FF3D00] px-2 py-0.5 rounded-sm font-bold animate-pulse uppercase mono">
              AUTH_REQ
            </button>
          )}
          <div className="text-[10px] mono text-white/30 uppercase flex flex-col items-end">
            <span>SYS_ONLINE</span>
            <span className="text-[6px] text-green-500">PING: 24MS</span>
          </div>
        </div>
      </header>

      {/* Main Screen Content */}
      <main className="flex-1 overflow-y-auto relative p-4 pb-24 custom-scrollbar">
        {renderContent()}
      </main>

      {/* Futuristic Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 glass border-t border-[#00E5FF]/10 flex items-center justify-around px-2 z-30 pb-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`flex flex-col items-center justify-center gap-1 transition-all duration-500 relative flex-1 ${
              activeSection === item.id ? 'text-[#00E5FF]' : 'text-white/20 hover:text-white/50'
            }`}
          >
            {activeSection === item.id && (
              <div className="absolute -top-1 w-12 h-[1px] bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]"></div>
            )}
            <div className={`transition-all duration-300 ${activeSection === item.id ? 'scale-110' : ''}`}>
              {item.icon}
            </div>
            <span className={`text-[8px] font-bold tracking-widest uppercase mono ${
              activeSection === item.id ? 'opacity-100' : 'opacity-40'
            }`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Global Status Bar Overlay */}
      <div className="absolute top-20 left-0 right-0 px-6 flex justify-between pointer-events-none z-10">
        <div className="text-[7px] mono text-white/10 flex items-center gap-1">
          <div className="w-1 h-1 bg-green-500 rounded-full animate-ping"></div>
          UPLINK: ACTIVE
        </div>
        <div className="text-[7px] mono text-white/10 uppercase tracking-[0.2em]">
          AREA: {activeSection}
        </div>
      </div>
    </div>
  );
};

export default App;
