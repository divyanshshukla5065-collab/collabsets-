
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Hammer, Users, Heart, ArrowUpRight } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const currentYear = 2026;

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 pt-20 pb-10 px-4 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <Logo size={40} className="rounded-xl shadow-lg group-hover:rotate-12 transition-transform duration-500" />
              <span className="text-xl font-black brand-font tracking-tighter bg-gradient-premium bg-clip-text text-transparent">
                COLLABSET
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed max-w-xs">
              India's premier architect for creator-brand synergies. Engineering transparency and growth in the digital economy.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Platform</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/team" className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-widest hover:text-purple-600 transition-colors flex items-center gap-2 group">
                  <Users size={14} /> The Leadership <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-widest hover:text-purple-600 transition-colors">
                  Market Insights
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Governance</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/terms#terms" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-purple-600 transition-colors flex items-center gap-2">
                  <Shield size={12} /> Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/terms#privacy" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-purple-600 transition-colors flex items-center gap-2">
                  <Hammer size={12} /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms#refund" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-purple-600 transition-colors flex items-center gap-2">
                  <Heart size={12} /> Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800">
            <h4 className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em] mb-4">Elite Support</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-4">Need assistance with a campaign or identity verification?</p>
            <a href="mailto:collabsets.in@gmail.com" className="text-sm font-black text-slate-950 dark:text-white hover:underline">collabsets.in@gmail.com</a>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
            @{currentYear} COLLABSET COPYRIGHT CLAIMED
          </p>
          <div className="flex items-center gap-6">
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Infrastructure: Stable
             </span>
             <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
               Handcrafted for Growth
             </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
