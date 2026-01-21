
import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

export const Splash: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 2.2 }}
      onAnimationComplete={() => {
        document.body.style.overflow = 'auto';
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.05, 1],
          opacity: 1,
        }}
        transition={{ 
          duration: 1.2,
          ease: "easeOut",
        }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{ 
            y: [0, -4, 0],
            filter: ["drop-shadow(0 0 15px rgba(217,119,6,0.2))", "drop-shadow(0 0 25px rgba(217,119,6,0.4))", "drop-shadow(0 0 15px rgba(217,119,6,0.2))"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Logo size={160} className="mb-10" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-6xl font-black brand-font tracking-[0.15em] bg-gradient-to-r from-purple-400 via-amber-400 to-amber-700 bg-clip-text text-transparent mb-6"
        >
          COLLABSET
        </motion.div>
        
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '140px' }}
          transition={{ duration: 1, delay: 0.8 }}
          className="h-[2px] bg-gradient-to-r from-purple-500 to-amber-500 rounded-full"
        />
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-slate-500 font-bold tracking-[0.3em] text-[10px] uppercase"
        >
          India's Elite Creator Network
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
