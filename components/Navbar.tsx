
import React from 'react';
import { Sun, Moon, LogOut, MessageSquare, Layout, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-100 dark:border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <Logo size={40} className="group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" />
            <span className="text-2xl font-black brand-font tracking-tighter bg-gradient-premium bg-clip-text text-transparent">
              COLLABSET
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            {user?.role === 'Admin' && (
               <Link 
                  to="/admin" 
                  className={`flex items-center gap-2 text-sm font-black transition-colors ${location.pathname === '/admin' ? 'text-cyan-500' : 'text-slate-500 hover:text-cyan-500'}`}
                >
                  <ShieldAlert className="w-4 h-4" /> Admin Panel
                </Link>
            )}

            {user?.onboardingStatus === 'COMPLETED' && user?.role !== 'Admin' && (
              <div className="hidden md:flex items-center space-x-6">
                <Link 
                  to="/dashboard" 
                  className={`flex items-center gap-2 text-sm font-black transition-colors ${location.pathname === '/dashboard' ? 'text-purple-600' : 'text-slate-500 hover:text-purple-600'}`}
                >
                  <Layout className="w-4 h-4" /> Dashboard
                </Link>
                <Link 
                  to="/chat" 
                  className={`flex items-center gap-2 text-sm font-black transition-colors ${location.pathname === '/chat' ? 'text-purple-600' : 'text-slate-500 hover:text-purple-600'}`}
                >
                  <MessageSquare className="w-4 h-4" /> Messages
                </Link>
              </div>
            )}

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-purple-600" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={logout}
                  className="p-2.5 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-2xl bg-gradient-premium p-[2px]">
                   <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center font-black text-purple-600 dark:text-purple-400">
                      {user.name.charAt(0)}
                   </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/signup?mode=login" className="hidden sm:block text-sm font-black text-slate-700 dark:text-slate-200 hover:text-purple-600 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="px-6 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black hover:scale-105 transition-transform shadow-lg">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
