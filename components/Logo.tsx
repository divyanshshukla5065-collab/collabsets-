
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Multi-stop gradient for a premium metallic gold finish */}
        <linearGradient id="premiumGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="25%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="75%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        
        {/* Gloss effect overlay */}
        <linearGradient id="glossOverlay" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="50%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.1" />
        </linearGradient>

        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* 
        This path represents the exact 'Double Hook Hexagonal S' logo.
        It consists of two symmetrical strokes that form a stylized S.
      */}
      <g filter="url(#logoGlow)">
        {/* Top Hook */}
        <path
          d="M 84 32 L 50 12 L 16 32 V 55 L 50 35"
          stroke="url(#premiumGold)"
          strokeWidth="13"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          fill="none"
        />
        {/* Bottom Hook */}
        <path
          d="M 16 68 L 50 88 L 84 68 V 45 L 50 65"
          stroke="url(#premiumGold)"
          strokeWidth="13"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          fill="none"
        />
        
        {/* Subtle highlights for 3D depth */}
        <path
          d="M 84 32 L 50 12 L 16 32 V 55 L 50 35"
          stroke="url(#glossOverlay)"
          strokeWidth="13"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          fill="none"
        />
        <path
          d="M 16 68 L 50 88 L 84 68 V 45 L 50 65"
          stroke="url(#glossOverlay)"
          strokeWidth="13"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          fill="none"
        />
      </g>
    </svg>
  );
};
