import React from 'react';
import { Sun, Moon, LogOut, MessageSquare, Layout, Home, Settings as SettingsIcon, Bell, Newspaper, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { user, logout, setIsAriaOpen, isAriaOpen } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const getLinkStyle = (path: string, activeColor: string) => {
    const isActive = location.pathname === path || (path === '/blog' && location.pathname.startsWith('/blog'));
    if (isActive) return activeColor;
    return 'text-slate-950 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400';
  };

  const isComplete = user?.onboardingStatus === 'COMPLETED';

  return (
    <>
      {/* Top Desktop Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 pt-6 pointer-events-none">
        <nav className="max-w-[1600px] mx-auto h-20 glass-premium border border-slate-200/50 dark:border-white/5 rounded-[28px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-700 pointer-events-auto overflow-hidden">
          <div className="w-full h-full px-8 flex justify-between items-center">
            <div className="flex items-center space-x-12">
              <Link to="/" className="flex items-center space-x-4 group">
                <Logo size={40} className="group-hover:rotate-12 transition-transform duration-700 rounded-xl overflow-hidden shadow-lg" />
                <span className="text-xl font-black brand-font tracking-tighter bg-gradient-premium bg-clip-text text-transparent hidden lg:block">
                  COLLABSET
                </span>
              </Link>

              {/* Desktop Nav Links */}
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black transition-all hover:scale-105 active:scale-95 ${getLinkStyle('/', 'text-purple-600')}`}>
                  <Home className="w-3.5 h-3.5" /> <span>Home</span>
                </Link>
                <Link to="/blog" className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black transition-all hover:scale-105 active:scale-95 ${getLinkStyle('/blog', 'text-purple-600')}`}>
                  <Newspaper className="w-3.5 h-3.5" /> <span>Blog</span>
                </Link>
                {isComplete && user?.role !== 'Admin' ? (
                  <>
                    <Link to="/dashboard" className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black transition-all hover:scale-105 active:scale-95 ${getLinkStyle('/dashboard', 'text-purple-600')}`}>
                      <Layout className="w-3.5 h-3.5" /> <span>Market</span>
                    </Link>
                    <Link to="/chat" className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black transition-all hover:scale-105 active:scale-95 ${getLinkStyle('/chat', 'text-purple-600')}`}>
                      <MessageSquare className="w-3.5 h-3.5" /> <span>Chat</span>
                    </Link>
                    <button 
                      onClick={() => setIsAriaOpen(!isAriaOpen)} 
                      className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black transition-all hover:scale-110 active:scale-95 ${isAriaOpen ? 'text-purple-600' : 'text-slate-950 dark:text-slate-400'}`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> <span>AI Assistant</span>
                    </button>
                  </>
                ) : user && !isComplete && user.role !== 'Admin' ? (
                  <Link to="/complete-profile" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black text-amber-600 animate-soft-bounce">
                    <Sparkles className="w-3.5 h-3.5" /> <span>Complete Profile</span>
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="flex items-center space-x-3 md:space-x-5">
              <button
                onClick={toggleTheme}
                className="p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 text-slate-950 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-all active:scale-90 border border-slate-200 dark:border-white/5 backdrop-blur-md shadow-sm"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-purple-600" />}
              </button>

              {user ? (
                <div className="flex items-center space-x-3 md:space-x-5">
                  <Link to="/notifications" className="relative p-3 rounded-2xl text-slate-950 dark:text-slate-400 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all active:scale-90">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"></span>
                  </Link>

                  <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

                  <Link 
                    to="/settings" 
                    className="group relative flex items-center space-x-4 p-1.5 pr-4 rounded-2xl hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-white/10"
                  >
                    <div className="w-10 h-10 rounded-[14px] bg-gradient-premium p-[1.5px] shadow-lg group-hover:rotate-6 transition-transform">
                       <div className="w-full h-full rounded-[12px] bg-white dark:bg-slate-900 flex items-center justify-center font-black text-purple-600 dark:text-purple-400 overflow-hidden">
                          {user.avatar ? (
                            <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                          ) : (
                            user.name.charAt(0)
                          )}
                       </div>
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-xs font-black dark:text-white leading-none mb-1 uppercase tracking-tighter">{user.name.split(' ')[0]}</p>
                      <div className="flex items-center gap-1 opacity-60">
                        <SettingsIcon size={8} />
                        <p className="text-[7px] font-black uppercase tracking-widest">Settings</p>
                      </div>
                    </div>
                  </Link>

                  <button
                    onClick={logout}
                    className="p-3 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-90"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/signup?mode=login" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-purple-600 transition-all px-4">
                    Log In
                  </Link>
                  <Link to="/signup" className="px-6 py-3 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] active-scale transition-all shadow-lg hover:shadow-purple-500/20">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      <div className="h-24" />

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-[100] pointer-events-none">
        <div className="glass-premium border border-slate-200/60 dark:border-white/10 rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden pointer-events-auto h-16">
          <div className="flex justify-around items-center h-full px-4">
            <Link to="/" className={`flex flex-col items-center gap-1 transition-all active:scale-75 ${getLinkStyle('/', 'text-purple-600')}`}>
              <Home className="w-5 h-5" />
              <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
            </Link>

            <Link to="/blog" className={`flex flex-col items-center gap-1 transition-all active:scale-75 ${getLinkStyle('/blog', 'text-purple-600')}`}>
              <Newspaper className="w-5 h-5" />
              <span className="text-[8px] font-black uppercase tracking-widest">Blog</span>
            </Link>
            
            {isComplete ? (
              <>
                <Link to="/dashboard" className={`flex flex-col items-center gap-1 transition-all active:scale-75 ${getLinkStyle('/dashboard', 'text-purple-600')}`}>
                  <Layout className="w-5 h-5" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Market</span>
                </Link>
                <button onClick={() => setIsAriaOpen(!isAriaOpen)} className={`flex flex-col items-center gap-1 transition-all active:scale-75 ${isAriaOpen ? 'text-purple-600' : 'text-slate-900 dark:text-slate-400'}`}>
                  <div className="relative">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest">AI</span>
                </button>
              </>
            ) : user ? (
              <Link to="/complete-profile" className={`flex flex-col items-center gap-1 transition-all active:scale-75 ${getLinkStyle('/complete-profile', 'text-amber-600 animate-pulse')}`}>
                <Sparkles className="w-5 h-5" />
                <span className="text-[8px] font-black uppercase tracking-widest">Setup</span>
              </Link>
            ) : (
              <Link to="/signup" className={`flex flex-col items-center gap-1 transition-all active:scale-75 ${getLinkStyle('/signup', 'text-purple-600')}`}>
                <LogOut className="w-5 h-5 rotate-180" />
                <span className="text-[8px] font-black uppercase tracking-widest">Join</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};