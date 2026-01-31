
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 48 }) => {
  // Using the direct image link provided by the user
  const logoUrl = "https://i.postimg.cc/GTyvGvfJ/Whats-App-Image-2026-01-21-at-6-22-32-AM.jpg";
  
  return (
    <div 
      className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-transparent ${className}`}
      style={{ width: size, height: size }}
    >
      <img 
        src={logoUrl} 
        alt="COLLABSET Logo" 
        className="w-full h-full object-contain"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          // Fallback if the direct link fails
          if (target.src !== logoUrl) {
            target.src = logoUrl;
          }
        }}
      />
    </div>
  );
};
