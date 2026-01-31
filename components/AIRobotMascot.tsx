
import React from 'react';
import { motion } from 'framer-motion';

export const AIRobotMascot: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        animate={{
          x: [0, 200, 400, 100, -200, 0],
          y: [0, 100, -100, 200, -50, 0],
          rotate: [0, 10, -10, 5, -5, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        className="relative w-32 h-32 md:w-48 md:h-48"
      >
        {/* Robot Head Wrapper */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          {/* Glowing Aura */}
          <div className="absolute inset-0 bg-purple-500/20 blur-[60px] rounded-full animate-pulse" />
          
          {/* Robot SVG Body */}
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_30px_rgba(124,58,237,0.3)]">
            {/* Main Head */}
            <rect x="40" y="40" width="120" height="100" rx="30" fill="url(#bot-grad)" className="dark:opacity-90" />
            
            {/* Glass Face Shield */}
            <rect x="55" y="55" width="90" height="50" rx="15" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            
            {/* Eyes */}
            <motion.g
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <circle cx="80" cy="80" r="8" fill="#22d3ee" className="shadow-[0_0_10px_#22d3ee]" />
              <circle cx="120" cy="80" r="8" fill="#22d3ee" className="shadow-[0_0_10px_#22d3ee]" />
            </motion.g>

            {/* Antennas */}
            <line x1="100" y1="40" x2="100" y2="20" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" />
            <circle cx="100" cy="15" r="5" fill="#d97706" className="animate-pulse" />

            {/* Bottom Floating Jets */}
            <motion.path
              d="M70 140 L100 170 L130 140"
              fill="none"
              stroke="url(#jet-grad)"
              strokeWidth="6"
              strokeLinecap="round"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                strokeWidth: [4, 8, 4]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />

            <defs>
              <linearGradient id="bot-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#4c1d95" />
              </linearGradient>
              <linearGradient id="jet-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Floating Data Nodes around robot */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 -m-8"
          >
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_10px_#fbbf24]" />
            <div className="absolute bottom-1/4 right-0 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
