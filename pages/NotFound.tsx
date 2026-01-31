import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Ghost, Sparkles } from 'lucide-react';
import { Logo } from '../components/Logo';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10"
      >
        <div className="flex justify-center mb-12">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              y: [0, -10, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 5,
              ease: "easeInOut"
            }}
          >
            <Logo size={100} className="rounded-3xl shadow-2xl shadow-purple-500/20" />
          </motion.div>
        </div>

        <h1 className="text-8xl md:text-[12rem] font-black text-white/5 uppercase tracking-tighter leading-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
          404
        </h1>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-purple-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <Ghost size={14} /> Out of Orbit
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-tight">
            Lost in the <br />
            <span className="text-gradient-premium">Studio.</span>
          </h2>
          <p className="text-slate-400 font-bold max-w-md mx-auto mb-12 text-lg">
            This vision doesn't exist yet. The path you've taken leads to a digital void. Let's get you back to the network.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
          <Link
            to="/"
            className="w-full sm:w-auto px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Home size={16} /> Return to Studio
          </Link>
        </div>
      </motion.div>

      {/* Decorative Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          animate={{
            y: [-20, -100],
            x: Math.random() * 100 - 50,
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '20%'
          }}
        />
      ))}
    </div>
  );
};