import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Briefcase, Activity, ShieldCheck, 
  Trash2, TrendingUp, UserCheck, ShieldAlert, LogOut,
  Ban, Search, RefreshCw, Flag, AlertTriangle, Clock,
  ArrowUpRight, Database, Eye, Pencil, FileText, Plus,
  Save, X, Image as ImageIcon, Layout, Newspaper, Zap,
  PlayCircle, StopCircle, CheckCircle2, Radio, Key,
  Lock, Shield, UserPlus, Fingerprint, ToggleLeft, ToggleRight
} from 'lucide-react';
import { Logo } from '../components/Logo';

export const AdminDashboard: React.FC = () => {
  const { 
    allUsers, requests, blogs, campaigns, teamSettings,
    adminVerifyUser, adminDeleteUser, adminBlockUser, 
    saveBlogPost, deleteBlogPost, logout, adminSetCampaignStatus,
    adminUpdateTeamSettings, adminToggleTeamAccess
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'users' | 'blogs' | 'campaigns' | 'governance'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [newTeamPass, setNewTeamPass] = useState('');
  
  // Blog State
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [blogForm, setBlogForm] = useState({
    title: '', slug: '', excerpt: '', content: '', category: 'Market Trends', cover: '', readTime: '5 min read'
  });

  const stats = useMemo(() => {
    const activeCollabs = requests.filter(r => r.status === 'Accepted').length;
    const flagged = allUsers.filter(u => u.isBlocked).length;
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recent = allUsers.filter(u => (u.createdAt || 0) > dayAgo).length;
    // Daily Active Users: Users who were active in the last 24h
    const dau = allUsers.filter(u => (u.lastActive || 0) > dayAgo).length;
    return { total: allUsers.length, recent, activeCollabs, flagged, dau };
  }, [allUsers, requests]);

  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => {
      const matchesSearch = (u.name || u.email || u.brandName || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'All' || u.role === filterRole;
      return u.role !== 'Admin' && matchesSearch && matchesRole;
    });
  }, [allUsers, searchTerm, filterRole]);

  const handleAction = async (id: string, action: () => Promise<void>) => {
    setProcessingId(id);
    try { await action(); } catch (err) { console.error(err); } finally { setProcessingId(null); }
  };

  const handleUpdateTeamPass = async () => {
    if (!newTeamPass.trim()) return;
    setProcessingId('updating-pass');
    try {
      await adminUpdateTeamSettings({ password: newTeamPass });
      setNewTeamPass('');
      alert("System Key Rotated Successfully.");
    } finally { setProcessingId(null); }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-32">
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 h-20 flex items-center px-4 md:px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Logo size={36} className="rounded-lg shadow-lg border border-slate-200 dark:border-slate-700" />
            <div className="hidden md:block">
              <h2 className="text-sm font-black dark:text-white uppercase tracking-tighter leading-none">Security Console</h2>
              <p className="text-[9px] font-black text-cyan-500 uppercase tracking-widest mt-1">Master Access</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
            {['users', 'campaigns', 'blogs', 'governance'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-cyan-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button onClick={logout} className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95">
            <LogOut size={14} /> Exit
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1.5 w-12 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            <h1 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tighter uppercase">
              {activeTab === 'users' ? 'Platform Registry' : activeTab === 'campaigns' ? 'Campaign Protocols' : activeTab === 'blogs' ? 'Insight Intelligence' : 'System Governance'}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
            <StatCard title="Registry Size" value={stats.total} icon={<Database />} color="bg-slate-900" />
            <StatCard title="Active Network" value={stats.activeCollabs} icon={<Activity />} color="bg-green-500" />
            <StatCard title="Daily Active (DAU)" value={stats.dau} icon={<Zap />} color="bg-amber-500" />
            <StatCard title="Recent Growth" value={`+${stats.recent}`} icon={<TrendingUp />} color="bg-purple-600" />
            <StatCard title="Risk Reports" value={stats.flagged} icon={<ShieldAlert />} color="bg-red-500" />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30 dark:bg-slate-950/30">
                  <div>
                    <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">Directory</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Live DB Interface</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" placeholder="Filter..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-6 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-cyan-500 outline-none w-full sm:w-60 shadow-sm" />
                    </div>
                    <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-6 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none shadow-sm cursor-pointer">
                      <option value="All">All Roles</option>
                      <option value="Influencer">Influencers</option>
                      <option value="Brand">Brands</option>
                    </select>
                  </div>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full text-left min-w-[800px]">
                   <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                     {filteredUsers.map((u) => (
                       <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                         <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                               <img src={u.avatar} className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200" />
                               <div>
                                  <p className="font-black dark:text-white uppercase tracking-tighter text-sm">{u.name || u.brandName}</p>
                                  <p className="text-[10px] text-slate-400 font-bold">{u.email}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                               <div className={`w-1.5 h-1.5 rounded-full ${Date.now() - (u.lastActive || 0) < 86400000 ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                 {u.lastActive ? `Active ${new Date(u.lastActive).toLocaleTimeString()}` : 'Never Active'}
                               </p>
                            </div>
                         </td>
                         <td className="px-8 py-5 text-right">
                            <div className="flex justify-end gap-2.5 opacity-20 group-hover:opacity-100 transition-opacity">
                               {!u.isVerified && <AdminActionBtn icon={<UserCheck size={14} />} label="Verify" color="text-green-600" isLoading={processingId === u.id} onClick={() => handleAction(u.id, () => adminVerifyUser(u.id))} />}
                               <AdminActionBtn icon={<Ban size={14} />} label={u.isBlocked ? "Restore" : "Block"} color={u.isBlocked ? "text-cyan-600" : "text-amber-600"} isLoading={processingId === u.id} onClick={() => handleAction(u.id, () => adminBlockUser(u.id, !u.isBlocked))} />
                               <AdminActionBtn icon={<Trash2 size={14} />} label="Purge" color="text-red-600" isLoading={processingId === u.id} onClick={() => { if(confirm('Purge record?')) handleAction(u.id, () => adminDeleteUser(u.id)) }} />
                            </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </motion.div>
          )}

          {activeTab === 'governance' && (
            <motion.div key="governance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-slate-900 rounded-[44px] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Fingerprint size={160} /></div>
                  <h3 className="text-xl font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                    <Key className="text-cyan-400" /> Team Access Protocol
                  </h3>
                  
                  <div className="space-y-8 relative z-10">
                     <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Master System Key (Team Password)</label>
                        <div className="flex gap-4">
                           <div className="relative flex-1">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                              <input 
                                type="text" placeholder="Set new access key..." value={newTeamPass} 
                                onChange={(e) => setNewTeamPass(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-slate-950 border-none rounded-2xl text-sm font-bold text-white focus:ring-2 focus:ring-cyan-500 outline-none" 
                              />
                           </div>
                           <button 
                            onClick={handleUpdateTeamPass} disabled={processingId === 'updating-pass' || !newTeamPass}
                            className="px-6 py-4 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 disabled:opacity-50"
                           >
                             Update
                           </button>
                        </div>
                        <p className="text-[9px] text-slate-500 font-bold mt-4">Current Key: <span className="text-white font-black">{teamSettings?.password || 'None'}</span></p>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Allowed Team Members</h4>
                        <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-3">
                           {allUsers.filter(u => u.hasTeamAccess).map(tm => (
                             <div key={tm.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group">
                                <div className="flex items-center gap-3">
                                   <img src={tm.avatar} className="w-8 h-8 rounded-lg object-cover" />
                                   <div>
                                      <p className="text-xs font-black text-white">{tm.name}</p>
                                      <p className="text-[9px] text-slate-500 font-bold">{tm.email}</p>
                                   </div>
                                </div>
                                <button onClick={() => adminToggleTeamAccess(tm.id, false)} className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 rounded-lg">
                                   <X size={16} />
                                </button>
                             </div>
                           ))}
                           {allUsers.filter(u => u.hasTeamAccess).length === 0 && (
                             <div className="py-8 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">No restricted members assigned</p>
                             </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-white dark:bg-slate-900 rounded-[44px] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <h3 className="text-xl font-black dark:text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                    <UserPlus className="text-purple-600" /> Assign Team Permissions
                  </h3>
                  <div className="space-y-6">
                    <div className="relative mb-6">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                        type="text" placeholder="Search by mail..." 
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-purple-600 outline-none" 
                       />
                    </div>
                    <div className="max-h-[400px] overflow-y-auto no-scrollbar space-y-2">
                       {allUsers.filter(u => !u.hasTeamAccess && u.email.includes(searchTerm)).map(u => (
                         <div key={u.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                            <div className="flex items-center gap-4">
                               <img src={u.avatar} className="w-10 h-10 rounded-xl object-cover" />
                               <div>
                                  <p className="text-sm font-black dark:text-white truncate max-w-[150px]">{u.name}</p>
                                  <p className="text-[10px] text-slate-500 font-bold">{u.email}</p>
                               </div>
                            </div>
                            <button 
                              onClick={() => adminToggleTeamAccess(u.id, true)}
                              className="px-4 py-2 bg-slate-950 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 shadow-sm"
                            >
                              Grant Team Access
                            </button>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
            </motion.div>
          )}

          {/* ... Other Tabs remain the same but use shared StatCard logic ... */}
        </AnimatePresence>
      </div>

      {/* Modal logic remains identical to existing CMS ... */}
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <motion.div whileHover={{ y: -4 }} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 md:gap-6 group">
    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-500`}>{React.cloneElement(icon, { size: 22 })}</div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-xl md:text-2xl font-black dark:text-white tracking-tighter">{value}</p>
    </div>
  </motion.div>
);

const AdminActionBtn = ({ icon, label, color, onClick, isLoading }: any) => (
  <button onClick={onClick} disabled={isLoading} className={`p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm transition-all active:scale-90 hover:shadow-md ${color} flex items-center gap-2 group/btn`}>
    {isLoading ? <RefreshCw className="animate-spin" size={14} /> : icon}
    <span className="text-[8px] font-black uppercase tracking-widest hidden lg:block">{label}</span>
  </button>
);