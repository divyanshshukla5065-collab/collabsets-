
import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Briefcase, Activity, ShieldCheck, 
  Trash2, TrendingUp, UserCheck, ShieldAlert, LogOut,
  Ban, Search, RefreshCw, Flag, AlertTriangle, Clock,
  ArrowUpRight, Database, Eye, Pencil, FileText, Plus,
  Save, X, Image as ImageIcon, Layout, Newspaper
} from 'lucide-react';
import { Logo } from '../components/Logo';

export const AdminDashboard: React.FC = () => {
  const { 
    allUsers, requests, blogs, 
    adminVerifyUser, adminDeleteUser, adminBlockUser, 
    saveBlogPost, deleteBlogPost, logout 
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'users' | 'blogs'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Blog State
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Market Trends',
    cover: '',
    readTime: '5 min read'
  });

  const stats = useMemo(() => {
    const activeCollabs = requests.filter(r => r.status === 'Accepted').length;
    const flagged = allUsers.filter(u => u.isBlocked).length;
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recent = allUsers.filter(u => (u.createdAt || 0) > dayAgo).length;
    return { total: allUsers.length, recent, activeCollabs, flagged };
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
    try {
      await action();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingId('saving-blog');
    try {
      await saveBlogPost(editingBlog ? { ...blogForm, id: editingBlog.id } : blogForm);
      setIsBlogModalOpen(false);
      setBlogForm({ title: '', slug: '', excerpt: '', content: '', category: 'Market Trends', cover: '', readTime: '5 min read' });
      setEditingBlog(null);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleEditBlog = (blog: any) => {
    setEditingBlog(blog);
    setBlogForm(blog);
    setIsBlogModalOpen(true);
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
          
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white dark:bg-slate-700 text-cyan-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Registry
            </button>
            <button 
              onClick={() => setActiveTab('blogs')}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'blogs' ? 'bg-white dark:bg-slate-700 text-cyan-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              CMS Insights
            </button>
          </div>

          <button onClick={logout} className="flex items-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95">
            <LogOut size={14} /> Exit
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1.5 w-12 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            <h1 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tighter uppercase">
              {activeTab === 'users' ? 'Platform Registry' : 'Insight Intelligence'}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Registry Size" value={stats.total} icon={<Database />} color="bg-slate-900" />
            <StatCard title="Recent Growth" value={`+${stats.recent}`} icon={<TrendingUp />} color="bg-purple-600" />
            <StatCard title="Active Network" value={stats.activeCollabs} icon={<Activity />} color="bg-green-500" />
            <StatCard title="Risk Reports" value={stats.flagged} icon={<ShieldAlert />} color="bg-red-500" />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'users' ? (
            <motion.div 
              key="users" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
            >
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
          ) : (
            <motion.div 
              key="blogs" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
               <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-950/30">
                    <div>
                      <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">Insights CMS</h3>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Content Publication Suite</p>
                    </div>
                    <button 
                      onClick={() => { setEditingBlog(null); setBlogForm({ title: '', slug: '', excerpt: '', content: '', category: 'Market Trends', cover: '', readTime: '5 min read' }); setIsBlogModalOpen(true); }}
                      className="px-6 py-3.5 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Plus size={16} /> New Article
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                      <thead>
                        <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
                          <th className="px-8 py-4">Article Integrity</th>
                          <th className="px-8 py-4">Niche</th>
                          <th className="px-8 py-4">Identity</th>
                          <th className="px-8 py-4 text-right">Operations</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {blogs.map((blog) => (
                          <tr key={blog.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                            <td className="px-8 py-5">
                               <div className="flex items-center gap-4">
                                  <img src={blog.cover} className="w-16 h-10 rounded-lg object-cover bg-slate-100" />
                                  <div>
                                     <p className="font-black dark:text-white uppercase tracking-tighter text-sm line-clamp-1">{blog.title}</p>
                                     <p className="text-[10px] text-slate-400 font-bold">{blog.slug}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-5">
                               <span className="px-2.5 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg text-[8px] font-black uppercase tracking-widest">{blog.category}</span>
                            </td>
                            <td className="px-8 py-5">
                               <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{blog.date}</p>
                            </td>
                            <td className="px-8 py-5 text-right">
                               <div className="flex justify-end gap-2.5 opacity-20 group-hover:opacity-100 transition-opacity">
                                  <AdminActionBtn icon={<Pencil size={14} />} label="Edit" color="text-cyan-600" onClick={() => handleEditBlog(blog)} />
                                  <AdminActionBtn icon={<Trash2 size={14} />} label="Delete" color="text-red-600" onClick={() => { if(confirm('Delete article permanently?')) deleteBlogPost(blog.id) }} />
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Blog Editor Modal */}
      <AnimatePresence>
        {isBlogModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsBlogModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[44px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]"
            >
               <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-950/30 text-cyan-500 rounded-2xl flex items-center justify-center"><Newspaper /></div>
                    <div>
                      <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">{editingBlog ? 'Refine Insight' : 'Manifest New Insight'}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aria Publishing Protocol</p>
                    </div>
                  </div>
                  <button onClick={() => setIsBlogModalOpen(false)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full"><X /></button>
               </div>

               <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  <form onSubmit={handleSaveBlog} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                       <div>
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Article Headline</label>
                         <input required type="text" placeholder="e.g. The Future of Content" value={blogForm.title} onChange={(e) => setBlogForm({...blogForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-cyan-500 outline-none text-slate-950 dark:text-white" />
                       </div>
                       <div>
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">URI Slug (Auto-generated)</label>
                         <input required type="text" value={blogForm.slug} readOnly className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-950 border-none rounded-2xl text-[10px] font-black text-slate-400 outline-none" />
                       </div>
                       <div>
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Niche Classification</label>
                         <select value={blogForm.category} onChange={(e) => setBlogForm({...blogForm, category: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-cyan-500 outline-none shadow-sm cursor-pointer">
                           <option>Market Trends</option>
                           <option>Brand Growth</option>
                           <option>Creator Success</option>
                           <option>Platform News</option>
                         </select>
                       </div>
                       <div>
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Read Complexity</label>
                         <input required type="text" placeholder="e.g. 5 min read" value={blogForm.readTime} onChange={(e) => setBlogForm({...blogForm, readTime: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-cyan-500 outline-none" />
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div>
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Cover Image Identity (URL)</label>
                         <div className="relative">
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input required type="url" placeholder="https://images.unsplash.com/..." value={blogForm.cover} onChange={(e) => setBlogForm({...blogForm, cover: e.target.value})} className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[10px] font-bold focus:ring-2 focus:ring-cyan-500 outline-none" />
                         </div>
                       </div>
                       <div>
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Executive Summary (Excerpt)</label>
                         <textarea required rows={4} value={blogForm.excerpt} onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-cyan-500 outline-none h-32 resize-none" placeholder="Brief summary for registry..." />
                       </div>
                    </div>

                    <div className="md:col-span-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Article Core (HTML Supported)</label>
                       <textarea required rows={12} value={blogForm.content} onChange={(e) => setBlogForm({...blogForm, content: e.target.value})} className="w-full px-8 py-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[32px] text-base font-medium focus:ring-2 focus:ring-cyan-500 outline-none h-96 resize-none leading-relaxed" placeholder="Write the deep dive here. Use HTML tags for formatting if needed..." />
                    </div>
                  </form>
               </div>

               <div className="p-8 border-t border-slate-50 dark:border-slate-800 flex justify-end gap-4 bg-slate-50/20">
                  <button onClick={() => setIsBlogModalOpen(false)} className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-950 transition-colors">Discard Draft</button>
                  <button onClick={handleSaveBlog} disabled={processingId === 'saving-blog'} className="px-10 py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95 disabled:opacity-50">
                    {processingId === 'saving-blog' ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                    {editingBlog ? 'Commit Updates' : 'Publish to Market'}
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <motion.div whileHover={{ y: -4 }} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-6 group">
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-500`}>{React.cloneElement(icon, { size: 24 })}</div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-black dark:text-white tracking-tighter">{value}</p>
    </div>
  </motion.div>
);

const AdminActionBtn = ({ icon, label, color, onClick, isLoading }: any) => (
  <button onClick={onClick} disabled={isLoading} className={`p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm transition-all active:scale-90 hover:shadow-md ${color} flex items-center gap-2 group/btn`}>
    {isLoading ? <RefreshCw className="animate-spin" size={14} /> : icon}
    <span className="text-[8px] font-black uppercase tracking-widest hidden lg:block">{label}</span>
  </button>
);

const HealthMetric = ({ label, value, progress, color }: any) => (
  <div>
    <div className="flex justify-between items-center mb-3">
       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
       <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">{value}</span>
    </div>
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
       <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className={`h-full ${color} rounded-full`} />
    </div>
  </div>
);
