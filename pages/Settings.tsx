
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Lock, Bell, Moon, Sun, Shield, 
  Trash2, LogOut, ChevronRight, Mail, 
  CreditCard, Smartphone, Key, AlertTriangle, CheckCircle, Pencil
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
// Fix: Verified named exports from react-router-dom
import { useNavigate, Link } from 'react-router-dom';

const SettingItem: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  onClick?: () => void;
  action?: React.ReactNode;
}> = ({ icon, title, description, onClick, action }) => (
  <button 
    onClick={onClick}
    disabled={!onClick}
    className={`w-full p-6 md:p-8 flex items-center justify-between transition-all text-left ${onClick ? 'hover:bg-slate-50 dark:hover:bg-slate-800/30' : 'cursor-default'}`}
  >
    <div className="flex items-center gap-6">
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-sm md:text-base font-black text-slate-950 dark:text-white uppercase tracking-widest leading-none mb-1.5">{title}</h3>
        <p className="text-xs md:text-sm text-slate-500 font-bold">{description}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      {action ? action : onClick && <ChevronRight className="text-slate-300" />}
    </div>
  </button>
);

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-y border-slate-100 dark:border-slate-800">
    <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">{title}</h2>
  </div>
);

export const Settings: React.FC = () => {
  const { user, logout, sendPasswordReset } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [loadingReset, setLoadingReset] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setLoadingReset(true);
    try {
      await sendPasswordReset(user.email);
      setSuccessMsg('Reset link sent to your inbox!');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <header className="mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-6xl font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-2">
            Settings <span className="text-gradient-premium">.</span>
          </h1>
          <p className="text-slate-500 font-bold">Manage your account preferences and security.</p>
        </motion.div>
      </header>

      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-6 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-800 rounded-3xl flex items-center gap-4 text-green-600 dark:text-green-400 font-black shadow-lg"
        >
          <CheckCircle className="w-6 h-6 flex-shrink-0" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mb-12">
        <SectionHeader title="Account Identity" />
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          <SettingItem 
            icon={<User size={24} />}
            title="Public Profile"
            description="Edit your marketplace details, niche, and rates."
            onClick={() => navigate('/profile')}
            action={
              <Link to="/profile" className="px-4 py-2 bg-slate-950 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                Edit
              </Link>
            }
          />
          <SettingItem 
            icon={<Mail size={24} />}
            title="Email Address"
            description={user?.email || 'No email set'}
          />
          <SettingItem 
            icon={<Smartphone size={24} />}
            title="Phone Verification"
            description="Secure your account with mobile OTP."
            onClick={() => {}}
          />
        </div>

        <SectionHeader title="Preferences" />
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          <SettingItem 
            icon={theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            title="Appearance"
            description={`Currently set to ${theme} mode.`}
            onClick={toggleTheme}
            action={
              <div className="w-14 h-8 bg-slate-100 dark:bg-slate-800 rounded-full p-1 flex items-center transition-all cursor-pointer" onClick={toggleTheme}>
                 <motion.div 
                  animate={{ x: theme === 'dark' ? 24 : 0 }}
                  className="w-6 h-6 bg-white dark:bg-purple-600 rounded-full shadow-sm" 
                />
              </div>
            }
          />
          <SettingItem 
            icon={<Bell size={24} />}
            title="Notifications"
            description="Manage how you receive alerts and campaign news."
            onClick={() => navigate('/notifications')}
          />
        </div>

        <SectionHeader title="Security & Finance" />
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          <SettingItem 
            icon={<Key size={24} />}
            title="Security Key"
            description="Request a secure password reset link."
            onClick={handlePasswordReset}
            action={
              <button 
                onClick={handlePasswordReset}
                disabled={loadingReset}
                className="text-[10px] font-black text-purple-600 uppercase tracking-widest hover:underline"
              >
                {loadingReset ? 'Sending...' : 'Reset Password'}
              </button>
            }
          />
          <SettingItem 
            icon={<CreditCard size={24} />}
            title="Payments"
            description="Review your payouts and collaboration history."
            onClick={() => {}}
          />
        </div>

        <SectionHeader title="Danger Zone" />
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          <SettingItem 
            icon={<LogOut className="text-slate-400" size={24} />}
            title="Log Out"
            description="Securely sign out of your active session."
            onClick={logout}
          />
          <SettingItem 
            icon={<Trash2 className="text-red-500" size={24} />}
            title="Delete Account"
            description="Permanently remove your profile from the network."
            onClick={() => {}}
            action={
              <button className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 hover:bg-red-100 transition-all active:scale-95">
                <Trash2 size={18} />
              </button>
            }
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-slate-400 font-bold text-xs uppercase tracking-[0.2em] opacity-50">
        <Shield size={14} />
        <span>Secured by Collabset Infrastructure</span>
      </div>
    </div>
  );
};
