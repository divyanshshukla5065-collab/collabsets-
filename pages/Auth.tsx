import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, ArrowRight, RefreshCw, AlertCircle, Eye, EyeOff, Inbox } from 'lucide-react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

export const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signup, login, loginWithGoogle, sendPasswordReset } = useAuth();
  const isLogin = searchParams.get('mode') === 'login';
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    role: (searchParams.get('role') as any) || 'Influencer' 
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const formatError = (err: any): string => {
    if (!err) return 'Something went wrong. Please try again.';
    const message = err.message || String(err);
    const code = err.code || '';
    if (code === 'auth/email-already-in-use') return 'This email is already registered. Please login.';
    if (code === 'auth/invalid-credential') return 'Incorrect email or password.';
    if (code === 'auth/weak-password') return 'Password is too short. Use at least 6 characters.';
    return message.replace('Firebase: ', '').replace('Error ', '').trim();
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      setError("Please enter your email.");
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await sendPasswordReset(formData.email);
      setIsEmailSent(true);
    } catch (err: any) {
      setError(formatError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isGoogleLoading) return;
    setError('');
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle(formData.role);
    } catch (err: any) {
      setError(formatError(err));
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate('/dashboard');
      } else {
        await signup(formData.name, formData.email, formData.password, formData.role);
        navigate('/complete-profile');
      }
    } catch (err: any) {
      setError(formatError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-slate-50 dark:bg-[#030712]">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white dark:bg-slate-900 p-12 md:p-16 rounded-[48px] shadow-3xl border border-slate-100 dark:border-slate-800 text-center">
          <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-3xl flex items-center justify-center mx-auto mb-8"><Inbox className="w-10 h-10 text-purple-600" /></div>
          <h2 className="text-3xl font-black mb-4 dark:text-white uppercase tracking-tighter">Check Your Email</h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold mb-10 leading-relaxed text-base">We've sent a recovery link to:<br/><span className="text-slate-900 dark:text-slate-200 font-black">{formData.email}</span></p>
          <button onClick={() => { setIsEmailSent(false); setIsForgotPassword(false); navigate('/signup?mode=login'); }} className="w-full py-5 bg-gradient-premium text-white font-black rounded-2xl shadow-xl active-scale uppercase tracking-widest text-xs">Back to Login</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-slate-50 dark:bg-[#030712] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl w-full flex flex-col bg-white dark:bg-slate-900 rounded-[56px] shadow-3xl border border-slate-100 dark:border-slate-800 overflow-hidden relative z-10">
        <div className="p-10 md:p-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black brand-font mb-4 text-slate-950 dark:text-white uppercase tracking-tighter py-2 leading-none">
            {isForgotPassword ? 'Reset Password' : (isLogin ? 'Log In' : 'Sign Up')}
          </h2>
          <p className="text-slate-500 font-bold mb-12 text-base md:text-lg">
            {isForgotPassword ? 'Enter your email to get a reset link.' : 'The premium network for high-tier creators and brands.'}
          </p>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 p-5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-4 text-red-600 dark:text-red-400 text-xs font-bold shadow-sm overflow-hidden">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {isForgotPassword ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
               <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                <input type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-4 focus:ring-purple-600/10 outline-none text-slate-950 dark:text-white font-bold text-sm shadow-inner" />
              </div>
              <button type="submit" disabled={isLoading} className="w-full py-5 bg-gradient-premium text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl active-scale">
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <button type="button" onClick={() => setIsForgotPassword(false)} className="w-full py-3 text-slate-400 font-black text-[9px] uppercase tracking-[0.3em] hover:text-purple-600 transition-colors">Go Back</button>
            </form>
          ) : (
            <>
              {!isLogin && (
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-10 border border-slate-200 dark:border-slate-700">
                  <button type="button" onClick={() => setFormData({...formData, role: 'Influencer'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${formData.role === 'Influencer' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}>I'm a Creator</button>
                  <button type="button" onClick={() => setFormData({...formData, role: 'Brand'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${formData.role === 'Brand' ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}>I'm a Brand</button>
                </div>
              )}

              <div className="space-y-6">
                <button type="button" onClick={handleGoogleLogin} disabled={isGoogleLoading || isLoading} className="w-full py-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-[10px] text-slate-950 dark:text-white uppercase tracking-[0.1em] flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all active-scale">
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G" />
                  {isGoogleLoading ? 'Connecting...' : 'Sign in with Google'}
                </button>

                <div className="relative py-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
                  <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.3em] text-slate-400"><span className="bg-white dark:bg-slate-900 px-4">Or use email</span></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && (
                    <div className="relative group">
                      <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                      <input type="text" placeholder="Full Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-4 focus:ring-purple-600/10 outline-none text-slate-950 dark:text-white font-bold text-sm shadow-inner" />
                    </div>
                  )}
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                    <input type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-4 focus:ring-purple-600/10 outline-none text-slate-950 dark:text-white font-bold text-sm shadow-inner" />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                    <input type={showPassword ? "text" : "password"} placeholder="Password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full pl-14 pr-12 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-4 focus:ring-purple-600/10 outline-none text-slate-950 dark:text-white font-bold text-sm shadow-inner" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                  </div>

                  {!isLogin && (
                    <div className="relative group">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                      <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" required value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full pl-14 pr-12 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-4 focus:ring-purple-600/10 outline-none text-slate-950 dark:text-white font-bold text-sm shadow-inner" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors">{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                    </div>
                  )}

                  {isLogin && <button type="button" onClick={() => setIsForgotPassword(true)} className="text-[9px] font-black text-slate-400 hover:text-purple-600 uppercase tracking-[0.2em] block ml-auto transition-colors">Forgot Password?</button>}

                  <button type="submit" disabled={isLoading || isGoogleLoading} className="w-full py-6 bg-gradient-premium text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl active-scale mt-8 flex items-center justify-center gap-3 hover:shadow-purple-500/20 transition-all">
                    {isLoading ? <RefreshCw className="animate-spin" size={18} /> : (isLogin ? 'Log In' : 'Sign Up')}
                    {!isLoading && <ArrowRight size={18} />}
                  </button>
                </form>
              </div>

              <div className="mt-10 text-center text-slate-500 font-bold text-sm">
                {isLogin ? "Need an account?" : "Already have an account?"}{" "}
                <Link to={isLogin ? "/signup" : "/signup?mode=login"} className="text-purple-600 font-black hover:underline ml-1">
                  {isLogin ? 'Sign Up' : 'Log In'}
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};