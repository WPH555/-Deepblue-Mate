
import React from 'react';

export const CyberBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-20">
      {/* Top-Right Radar Sweep */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px]">
        <div className="radar-container w-full h-full relative">
          <div className="absolute inset-0 rounded-full border border-[#00F0FF]/20"></div>
          <div className="absolute inset-[50px] rounded-full border border-[#00F0FF]/15"></div>
          <div className="absolute inset-[100px] rounded-full border border-[#00F0FF]/10"></div>
          <div className="radar-sweep absolute inset-0 rounded-full"></div>
        </div>
      </div>

      {/* Bottom-Left Topographic Lines */}
      <svg className="absolute bottom-[-50px] left-[-50px] w-[500px] h-[500px]" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M0 450C50 430 150 480 250 440C350 400 450 420 500 380" 
          stroke="#00F0FF" strokeWidth="0.5" fill="none" opacity="0.4"
        />
        <path 
          d="M0 400C80 380 180 430 280 390C380 350 480 370 500 330" 
          stroke="#00F0FF" strokeWidth="0.5" fill="none" opacity="0.3"
        />
        <path 
          d="M0 350C100 330 200 380 300 340C400 300 500 320 500 280" 
          stroke="#00F0FF" strokeWidth="0.5" fill="none" opacity="0.2"
        />
        <path 
          d="M0 300C120 280 220 330 320 290C420 250 500 270 500 230" 
          stroke="#00F0FF" strokeWidth="0.5" fill="none" opacity="0.1"
        />
      </svg>

      <style>{`
        .radar-sweep {
          background: conic-gradient(from 0deg, transparent 80%, rgba(0, 240, 255, 0.2) 100%);
          animation: rotateRadar 10s linear infinite;
        }
        @keyframes rotateRadar {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
