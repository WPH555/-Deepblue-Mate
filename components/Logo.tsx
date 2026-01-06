
import React from 'react';

export const CyberLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="100%" stopColor="#6200EA" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Brain Stock (Top) */}
      <path 
        d="M50 5C42 5 35 10 35 18C35 20 36 22 37 24C34 26 32 30 32 34C32 40 37 45 43 45L50 45V5Z" 
        fill="url(#cyberGradient)" 
        fillOpacity="0.8"
      />
      <path 
        d="M50 5C58 5 65 10 65 18C65 20 64 22 63 24C66 26 68 30 68 34C68 40 63 45 57 45L50 45V5Z" 
        fill="url(#cyberGradient)" 
        fillOpacity="0.6"
      />
      
      {/* Circuit Shank */}
      <rect x="47" y="25" width="6" height="45" fill="url(#cyberGradient)" />
      <path d="M47 35H40V37H47V35Z" fill="#00F0FF" />
      <path d="M53 50H60V52H53V50Z" fill="#6200EA" />
      <circle cx="38" cy="36" r="2" fill="#00F0FF" />
      <circle cx="62" cy="51" r="2" fill="#6200EA" />

      {/* Anchor Flukes */}
      <path 
        d="M50 90C30 90 15 75 10 55L18 55C22 68 35 80 50 80C65 80 78 68 82 55L90 55C85 75 70 90 50 90Z" 
        fill="url(#cyberGradient)" 
        filter="url(#glow)"
      />
      
      {/* Digital Accents */}
      <path d="M10 55L5 50L10 45V55Z" fill="#00F0FF" />
      <path d="M90 55L95 50L90 45V55Z" fill="#6200EA" />
    </svg>
  );
};
