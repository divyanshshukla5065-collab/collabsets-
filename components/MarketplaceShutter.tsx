
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const MarketplaceShutter: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isOpening, setIsOpening] = useState(false);

  const playShutterSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      
      // 1. Mechanical "Clunk" (Start)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(40, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);

      // 2. Sliding Friction (White Noise)
      const bufferSize = ctx.sampleRate * 1.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1000, ctx.currentTime);
      noiseFilter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.8);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0, ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
      
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start();
    } catch (e) {
      console.warn("Audio context not supported or blocked by browser policy", e);
    }
  };

  useEffect(() => {
    // Wait for the user to see the text for a second
    const timer = setTimeout(() => {
      setIsOpening(true);
      playShutterSound();
    }, 1500);

    // Unmount the shutter after the animation finishes
    const endTimer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(timer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  // Create 12 horizontal slats for the shutter effect
  const slats = Array.from({ length: 12 });

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Slat Container */}
      <div className="absolute inset-0 flex flex-col">
        {slats.map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 0 }}
            animate={isOpening ? { y: '-100%' } : { y: 0 }}
            transition={{
              duration: 0.8,
              delay: i * 0.04,
              ease: [0.45, 0, 0.55, 1]
            }}
            className="flex-1 w-full bg-slate-900 border-b border-slate-800 relative"
          >
            {/* Architectural detail on slats */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5 shadow-[0_-1px_3px_rgba(0,0,0,0.5)]" />
          </motion.div>
        ))}
      </div>

      {/* Center Text */}
      <AnimatePresence>
        {!isOpening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, letterSpacing: '0.2em' }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              letterSpacing: '0.4em'
            }}
            exit={{ 
              opacity: 0, 
              scale: 1.1,
              // Removed blur filter to fix the blurry transition issue
              transition: { duration: 0.4 }
            }}
            className="relative z-10 flex flex-col items-center text-center px-6"
          >
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-amber-500 font-black text-xs md:text-sm uppercase mb-4"
            >
              System Protocol Active
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-[0.3em] leading-tight">
              market place <br />
              <span className="text-gradient-premium">is opening</span>
            </h2>
            <div className="mt-8 flex gap-2">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                  className="w-2 h-2 rounded-full bg-amber-500"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(124,58,237,0.15)_0%,_transparent_70%)]" />
      </div>
    </div>
  );
};
