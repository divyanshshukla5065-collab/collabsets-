
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SmokeParticle {
  id: number;
  x: number;
  y: number;
}

export const DriftLoader: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const [particles, setParticles] = useState<SmokeParticle[]>([]);
  const [angle, setAngle] = useState(0);

  const dimensions = {
    sm: { container: 'w-24 h-24', car: 'w-8 h-4' },
    md: { container: 'w-48 h-48', car: 'w-12 h-6' },
    lg: { container: 'w-64 h-64', car: 'w-16 h-8' }
  }[size];

  // Update angle for circular drift
  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => (prev + 10) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Generate smoke particles behind the car
  useEffect(() => {
    const rad = (angle * Math.PI) / 180;
    const radius = size === 'lg' ? 60 : size === 'md' ? 40 : 20;
    
    // Position of rear wheels (approximate)
    const px = Math.cos(rad) * radius;
    const py = Math.sin(rad) * radius;

    const newParticle = {
      id: Date.now(),
      x: px,
      y: py
    };

    setParticles((prev) => [...prev.slice(-20), newParticle]);
  }, [angle, size]);

  return (
    <div className={`relative flex items-center justify-center ${dimensions.container}`}>
      {/* Track Circle */}
      <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full opacity-20" />
      
      {/* Smoke Particles */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.6, scale: 0.5, x: p.x, y: p.y }}
            animate={{ 
              opacity: 0, 
              scale: 2.5, 
              x: p.x + (Math.random() - 0.5) * 20, 
              y: p.y + (Math.random() - 0.5) * 20 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute w-4 h-4 bg-slate-300 dark:bg-slate-600 rounded-full blur-md"
          />
        ))}
      </AnimatePresence>

      {/* The Car */}
      <motion.div
        style={{
          rotate: angle + 90, // Orient car along the path
          x: Math.cos((angle * Math.PI) / 180) * (size === 'lg' ? 60 : size === 'md' ? 40 : 20),
          y: Math.sin((angle * Math.PI) / 180) * (size === 'lg' ? 60 : size === 'md' ? 40 : 20),
        }}
        className={`absolute ${dimensions.car} bg-gradient-premium rounded-sm shadow-lg z-10`}
      >
        {/* Windshield */}
        <div className="absolute top-1 right-1 w-1/3 h-full bg-white/30 rounded-sm" />
        {/* Headlights */}
        <div className="absolute -top-1 right-0 w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_10px_#fbbf24]" />
        <div className="absolute -bottom-1 right-0 w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_10px_#fbbf24]" />
        {/* Rear Lights (Braking/Drift effect) */}
        <div className="absolute -top-1 left-0 w-1 h-1 bg-red-500 rounded-full shadow-[0_0_5px_#ef4444]" />
        <div className="absolute -bottom-1 left-0 w-1 h-1 bg-red-500 rounded-full shadow-[0_0_5px_#ef4444]" />
      </motion.div>

      {/* Central Glow */}
      <div className="absolute w-12 h-12 bg-purple-500/10 blur-xl rounded-full" />
    </div>
  );
};
