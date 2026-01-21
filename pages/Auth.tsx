
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, ShieldCheck, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

export const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signup, user, verifyOtp, login } = useAuth();
  const isLogin = searchParams.get('mode') === 'login';
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: (searchParams.get('role') as any) || 'Influencer' });
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let interval: any;
    if (user?.onboardingStatus === 'OTP_PENDING' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [user, timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(formData.email);
      } else {
        await signup(formData.name, formData.email, formData.role);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyOtp(otp);
    if (!success) setError('Invalid OTP. Please try 123456');
    else navigate('/complete-profile');
  };

  if (user?.onboardingStatus === 'OTP_PENDING' && !isLogin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-100 dark:bg-purple-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8">
            <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black mb-2 dark:text-white leading-tight">Verify Your Email</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 md:mb-10 text-sm font-medium">We've sent a 6-digit code to <br/><span className="font-bold text-slate-800 dark:text-slate-200">{user.email}</span></p>
          
          <form onSubmit={handleOtpVerify} className="space-y-6">
            <input
              type="text"
              maxLength={6}
              placeholder="0 0 0 0 0 0"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full text-center text-3xl md:text-4xl tracking-[0.4em] md:tracking-[0.5em] font-black py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none dark:text-white"
            />
            {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}
            <button type="submit" className="w-full py-5 bg-gradient-premium text-white font-black text-lg md:text-xl rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
              Verify OTP
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-4">
            <p className="text-slate-500 text-xs md:text-sm font-medium">
              Didn't receive code? {timer > 0 ? `Resend in ${timer}s` : <button onClick={() => setTimer(60)} className="text-purple-600 font-bold hover:underline">Resend Now</button>}
            </p>
            <button onClick={() => navigate('/')} className="text-slate-400 hover:text-slate-600 text-[10px] md:text-xs font-bold flex items-center uppercase tracking-widest">
              <RefreshCw className="w-4 h-4 mr-2" /> Change Email
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 md:py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl w-full flex flex-col bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-black brand-font mb-2 dark:text-white leading-tight">
            {isLogin ? 'Welcome Back' : 'Join Collabset'}
          </h2>
          <p className="text-slate-500 mb-8 font-medium text-sm md:text-base">
            {isLogin ? 'Log in to manage your collabs' : 'Start your journey with India\'s elite marketplace'}
          </p>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {!isLogin && (
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-8">
              <button 
                onClick={() => setFormData({...formData, role: 'Influencer'})}
                className={`flex-1 py-3 rounded-xl text-xs md:text-sm font-black transition-all ${formData.role === 'Influencer' ? 'bg-white dark:bg-slate-700 shadow-sm text-purple-600' : 'text-slate-500'}`}
              >Influencer</button>
              <button 
                onClick={() => setFormData({...formData, role: 'Brand'})}
                className={`flex-1 py-3 rounded-xl text-xs md:text-sm font-black transition-all ${formData.role === 'Brand' ? 'bg-white dark:bg-slate-700 shadow-sm text-amber-600' : 'text-slate-500'}`}
              >Brand</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none dark:text-white font-medium text-sm"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none dark:text-white font-medium text-sm"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none dark:text-white font-medium text-sm"
              />
            </div>
            
            {!isLogin && (
              <div className="flex items-start gap-3 py-2">
                <input type="checkbox" required className="w-5 h-5 mt-0.5 rounded accent-purple-600 flex-shrink-0" id="terms" />
                <label htmlFor="terms" className="text-xs text-slate-500 font-medium leading-relaxed">
                  I agree to the <Link to="/terms" className="text-purple-600 font-bold hover:underline">Terms & Conditions</Link>
                </label>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-5 bg-gradient-premium text-white font-black text-lg md:text-xl rounded-2xl shadow-lg transition-all flex items-center justify-center group mt-4 ${isLoading ? 'opacity-70 cursor-wait' : 'hover:scale-[1.01] active:scale-95'}`}
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
              {!isLoading && <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 text-center text-slate-500 font-medium text-sm">
            {isLogin ? "New to Collabset?" : "Already a member?"}{" "}
            <Link to={isLogin ? "/signup" : "/signup?mode=login"} className="text-purple-600 font-black hover:underline">
              {isLogin ? 'Create Account' : 'Sign In'}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
