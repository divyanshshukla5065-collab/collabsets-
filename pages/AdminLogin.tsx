
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowRight, RefreshCw, Eye, EyeOff, ChevronLeft, Terminal, ShieldCheck, Mail } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    
    setIsLoading(true);
    try {
      await adminLogin(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Access Denied: Authentication Identity Failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-slate-950 relative overflow-hidden">
      {/* Visual Identity Layers */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full relative z-10">
        <div className="bg-slate-900 border border-slate-800 rounded-[44px] shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="p-10 md:p-14">
            <div className="flex flex-col items-center mb-10 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full animate-pulse" />
                <Logo size={84} className="relative rounded-2xl border border-slate-700 shadow-2xl" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter brand-font">Administrative Access</h2>
              <p className="text-slate-500 font-bold text-[9px] uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                <span className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" /> Platform Governance Terminal
              </p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold overflow-hidden">
                  <ShieldAlert size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Authority Identity</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-cyan-500 transition-colors" />
                  <input 
                    type="email" 
                    placeholder="Admin Email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full pl-12 pr-6 py-5 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 outline-none text-white font-bold text-sm transition-all shadow-inner" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Authorization Key</label>
                  <span className="text-[8px] font-black text-cyan-500/40 uppercase flex items-center gap-1"><ShieldCheck size={10} /> Secure Layer</span>
                </div>
                <div className="relative group">
                  <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-cyan-500 transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Master Password" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full pl-12 pr-12 py-5 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 outline-none text-white font-black text-lg transition-all shadow-inner" 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-cyan-400 transition-colors">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading || !password || !email} 
                className={`w-full py-5 bg-white text-slate-950 font-black text-sm rounded-2xl shadow-2xl transition-all flex items-center justify-center active:scale-[0.98] gap-3 disabled:opacity-50 hover:bg-cyan-50 group`}
              >
                {isLoading ? <RefreshCw size={20} className="animate-spin" /> : (
                  <>Unlock Console <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>

            <div className="mt-12 text-center border-t border-slate-800 pt-8">
              <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-600 hover:text-cyan-500 uppercase tracking-[0.2em] transition-all">
                <ChevronLeft size={14} /> Abandon Gateway
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center items-center gap-4 text-slate-800 font-black text-[9px] uppercase tracking-[0.4em] pointer-events-none select-none">
          <span>Governance Protocol 9.0</span>
          <div className="w-1 h-1 bg-slate-800 rounded-full" />
          <span>Internal Access Only</span>
        </div>
      </motion.div>
    </div>
  );
};
