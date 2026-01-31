
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, MessageSquare, ShieldCheck, Trash2, Info, Sparkles, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// Fix: Verified named exports from react-router-dom
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'connection' | 'chat' | 'system' | 'verification';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  link?: string;
}

export const Notifications: React.FC = () => {
  const { user } = useAuth();
  
  // Mock notifications for demonstration
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'verification',
      title: 'Identity Verified',
      message: 'Your profile has been successfully verified by our admins. Welcome to the elite tier!',
      timestamp: Date.now() - 3600000,
      read: false,
      link: '/profile'
    },
    {
      id: '2',
      type: 'connection',
      title: 'New Collaboration Request',
      message: 'A brand just sent you a new proposal for a summer campaign.',
      timestamp: Date.now() - 7200000,
      read: false,
      link: '/dashboard'
    },
    {
      id: '3',
      type: 'chat',
      title: 'New Message',
      message: 'UMAIMA sent you a personalized insight regarding your profile metrics.',
      timestamp: Date.now() - 86400000,
      read: true,
      link: '/chat'
    }
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'connection': return <UserPlus className="text-purple-600" />;
      case 'chat': return <MessageSquare className="text-blue-500" />;
      case 'verification': return <ShieldCheck className="text-green-500" />;
      default: return <Info className="text-slate-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-2">
            Activity <span className="text-gradient-premium">Feed</span>
          </h1>
          <p className="text-slate-500 font-bold flex items-center gap-2">
            Stay updated with your latest collaborations and insights.
            {unreadCount > 0 && <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest">{unreadCount} New</span>}
          </p>
        </motion.div>
        
        <div className="flex gap-3">
          <button 
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-purple-600 transition-all active:scale-95 disabled:opacity-50"
          >
            Mark All Read
          </button>
          <button 
            onClick={clearAll}
            className="px-6 py-3 bg-red-50 dark:bg-red-950/20 text-red-600 border border-red-100 dark:border-red-900/30 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {notifications.map((notif, idx) => (
            <motion.div
              key={notif.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className={`group relative p-6 md:p-8 rounded-[32px] border transition-all flex items-start gap-6 ${
                notif.read 
                ? 'bg-white/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800' 
                : 'bg-white dark:bg-slate-900 border-purple-200 dark:border-purple-800 shadow-lg shadow-purple-500/5'
              }`}
            >
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                notif.read ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-purple-50 dark:bg-purple-900/30'
              }`}>
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-black uppercase tracking-widest text-xs md:text-sm ${notif.read ? 'text-slate-500' : 'text-slate-950 dark:text-white'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap ml-4">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className={`text-sm font-bold leading-relaxed mb-4 ${notif.read ? 'text-slate-400' : 'text-slate-700 dark:text-slate-400'}`}>
                  {notif.message}
                </p>
                {notif.link && (
                  <Link 
                    to={notif.link} 
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-600 hover:gap-3 transition-all"
                  >
                    Take Action <CheckCircle size={14} />
                  </Link>
                )}
              </div>

              <button 
                onClick={() => deleteNotification(notif.id)}
                className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
              >
                <Trash2 size={16} />
              </button>

              {!notif.read && (
                <div className="absolute top-8 -left-1 w-2 h-8 bg-purple-600 rounded-full blur-[2px]" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="py-32 flex flex-col items-center text-center bg-slate-50 dark:bg-slate-900/50 rounded-[48px] border border-dashed border-slate-200 dark:border-slate-800"
          >
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
              <Sparkles className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Inbox Clean</h3>
            <p className="text-slate-500 font-bold max-w-xs">No new updates right now. We'll alert you when magic happens.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
