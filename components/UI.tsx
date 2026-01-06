
import React from 'react';

export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  loading?: boolean;
  disabled?: boolean;
}> = ({ children, onClick, variant = 'primary', className = '', loading = false, disabled = false }) => {
  const baseStyle = "px-6 py-2 rounded-sm font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]";
  const variants = {
    primary: "bg-[#00E5FF] text-black hover:shadow-[0_0_20px_rgba(0,229,255,0.6)] border border-[#00E5FF]",
    secondary: "bg-[#FF3D00] text-white hover:shadow-[0_0_20px_rgba(255,61,0,0.6)] border border-[#FF3D00]",
    ghost: "border border-white/20 text-white/70 hover:bg-white/5 hover:text-white"
  };

  return (
    <button
      disabled={loading || disabled}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {loading ? <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" /> : children}
    </button>
  );
};

// Added onClick prop to allow Card components to handle click events, fixing errors in child components like ToolCard.
export const Card: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`glass p-6 rounded-sm relative mb-4 overflow-hidden ${className}`}
  >
    {/* FUI Decorative Corners */}
    <div className="corner corner-tl"></div>
    <div className="corner corner-tr"></div>
    <div className="corner corner-bl"></div>
    <div className="corner corner-br"></div>
    
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-2 text-white placeholder-white/20 focus:outline-none focus:border-[#00E5FF] transition-all mono text-xs"
  />
);
