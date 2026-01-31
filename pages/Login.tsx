
import React, { useState } from 'react';
// Fix: Verified named exports from react-router-dom
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowLeft } from 'lucide-react';

export const Login: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const { login } = useAuth();
  const navigate = useNavigate();
  // Using email state instead of name as login requires email/password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission with both email and password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    
    try {
      // login expects (email, password) per AuthContext definition
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-800"
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-sm text-slate-500 hover:text-purple-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </button>

        <h2 className="text-3xl font-black brand-font dark:text-white mb-2">
          Welcome Back, <span className="text-gradient-premium uppercase">{role}</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Sign in to access your COLLABSET dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold dark:text-slate-200 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold dark:text-slate-200 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl bg-gradient-premium text-white font-bold shadow-lg transition-all ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'
            }`}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Don't have an account? <span className="text-purple-600 font-bold cursor-pointer hover:underline" onClick={() => navigate('/signup')}>Sign up</span>
        </div>
      </motion.div>
    </div>
  );
};
