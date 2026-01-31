
import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

export const Splash: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-slate-950 text-white"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: 1,
          opacity: 1,
        }}
        transition={{ 
          duration: 0.8,
          ease: "easeOut",
        }}
        className="flex flex-col items-center"
      >
        <div className="mb-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Logo size={100} className="shadow-[0_0_50px_rgba(124,58,237,0.3)] rounded-3xl" />
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-4xl md:text-6xl font-black brand-font tracking-[0.15em] bg-gradient-to-r from-purple-400 via-amber-400 to-amber-700 bg-clip-text text-transparent mb-6"
        >
          COLLABSET
        </motion.div>
        
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100px' }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="h-[2px] bg-gradient-to-r from-purple-500 to-amber-500 rounded-full"
        />
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-slate-500 font-black tracking-[0.3em] text-[8px] uppercase"
        >
          Engineered for speed & growth
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
