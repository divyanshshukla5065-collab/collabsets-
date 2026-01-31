
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';

export const SuccessBloom: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden pointer-events-none"
        >
          {/* Intense Backdrop Blur Layer - Slightly Dimmed */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/10 dark:bg-slate-950/40 backdrop-blur-2xl"
          />

          {/* Main Bloom Glow - Opacity and scale adjusted to be less "blinding" */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 3], 
              opacity: [0, 0.6, 0] 
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute w-[400px] h-[400px] bg-[radial-gradient(circle,_#7c3aed_0%,_#d97706_30%,_transparent_70%)] rounded-full blur-[80px]"
          />

          {/* Secondary Flash - Muted */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute inset-0 bg-white dark:bg-slate-900 mix-blend-overlay opacity-30"
          />

          {/* Success Content */}
          <div className="relative z-10 text-center flex flex-col items-center">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
              className="w-24 h-24 bg-gradient-premium rounded-[32px] flex items-center justify-center shadow-2xl mb-8"
            >
              <Star className="text-white w-12 h-12 fill-white" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-4xl md:text-6xl font-black text-slate-950 dark:text-white uppercase tracking-tighter brand-font"
            >
              CONGRATULATIONS
              <br />
              <span className="text-gradient-premium">TO COLLABSET</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6 flex items-center gap-2 text-slate-600 dark:text-slate-400 font-black uppercase tracking-[0.3em] text-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Access Granted
              <Sparkles className="w-4 h-4 text-purple-500" />
            </motion.div>
          </div>

          {/* Floating Particles - Reduced count */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 0,
                scale: 0 
              }}
              animate={{ 
                x: (Math.random() - 0.5) * 600, 
                y: (Math.random() - 0.5) * 600,
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: 2, 
                delay: 0.4 + (i * 0.05),
                ease: "easeOut"
              }}
              className="absolute w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]"
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
