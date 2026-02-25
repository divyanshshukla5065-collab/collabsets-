import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Instagram, Linkedin, Twitter, Quote, Heart, 
  ShieldCheck, UserCheck, Plus, Image as ImageIcon, 
  Newspaper, Save, X, RefreshCw, Code, TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';

export const Team: React.FC = () => {
  const { user, saveBlogPost } = useAuth();
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Market Trends',
    cover: '',
    readTime: '5 min read'
  });

  // Authorization check for blog management
  const canUploadBlog = user?.role === 'Admin' || 
                        user?.role === 'Team' || 
                        (user?.email && user.email.endsWith('@collabset.in'));

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveBlogPost(blogForm);
      setIsBlogModalOpen(false);
      setBlogForm({ title: '', slug: '', excerpt: '', content: '', category: 'Market Trends', cover: '', readTime: '5 min read' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-32 text-center"
        >
          <h1 className="text-5xl md:text-8xl font-black text-slate-950 dark:text-white mb-6 tracking-tighter uppercase leading-none">
            THE <span className="text-gradient-premium">LEADERSHIP</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.5em] text-[10px] md:text-xs">
            The Visionaries Architecting Collabset
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-12 lg:gap-16 mb-48 items-start">
          <LeaderCard 
            name="Shalini Shukla"
            title="Proprietor & Director"
            image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1000&fit=crop"
            roleColor="text-amber-500"
            icon={<ShieldCheck className="text-amber-500" />}
            bio="The cornerstone of Collabset's legal and strategic foundation. Shalini oversees the platform's overarching governance, ensuring excellence in every transaction."
            insta="https://instagram.com"
            linkedin="https://linkedin.com"
          />

          <LeaderCard 
            name="DIVYANSH SHUKLA"
            title="Founder & CEO"
            image="https://i.postimg.cc/k4p9QZNn/Whats-App-Image-2026-01-24-at-11-02-06-PM.jpg"
            roleColor="text-purple-600"
            icon={<UserCheck className="text-purple-600" />}
            bio="The creative architect behind the Collabset vision. Divyansh's expertise in engineering high-speed digital networks has redefined creator-brand synergy."
            insta="https://www.instagram.com/divyansh_builds?igsh=NDVhb3ZraTZxZ2Z5"
            linkedin="https://www.linkedin.com/in/collabset-startup-764210397"
          />

          <LeaderCard 
            name="ARPIT SINHA"
            title="Web Developer"
            image="https://i.postimg.cc/5tSYxg08/Whats-App-Image-2026-02-03-at-11-54-53-PM.jpg"
            roleColor="text-blue-500"
            icon={<Code className="text-blue-500" />}
            bio="The technical engine ensuring Collabset's infrastructure remains elite. Arpit designs robust systems and high-performance interfaces for our global network."
            insta="https://instagram.com"
            linkedin="https://linkedin.com"
          />

          <LeaderCard 
            name="UMAIMA"
            title="CMO & Sales Executive"
            image="https://i.postimg.cc/bYtRb0Tp/Whats-App-Image-2026-02-13-at-12-40-57-AM.jpg"
            roleColor="text-emerald-500"
            icon={<TrendingUp className="text-emerald-500" />}
            bio="Formerly Alisha, Umaima is the strategic force behind Collabset's market positioning. She spearheads our sales protocols and brand outreach."
            insta="https://instagram.com"
            linkedin="https://linkedin.com"
          />
        </div>

        {/* Global Mission Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center space-y-12 mb-48"
        >
          <div className="relative max-w-4xl mx-auto py-16">
            <Quote className="absolute -top-8 -left-8 w-20 h-20 text-slate-100 dark:text-slate-800/50 -z-10" />
            <p className="text-3xl md:text-5xl text-slate-900 dark:text-slate-200 font-black leading-tight tracking-tighter uppercase italic">
              "We are building more than a network; <br className="hidden md:block" /> we are engineering a legacy of transparency."
            </p>
          </div>
          <div className="flex justify-center">
            <div className="h-2 w-40 bg-gradient-premium rounded-full" />
          </div>
        </motion.div>

        {/* Team Operations / Blog Power */}
        {canUploadBlog && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-16 bg-slate-900 rounded-[64px] border border-white/5 shadow-2xl relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none">
               <Newspaper size={240} className="text-purple-600" />
             </div>
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div>
                   <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Team Protocol</h2>
                   <p className="text-slate-400 font-bold text-lg max-w-lg leading-relaxed">Publish new market insights and platform updates directly to the Collabset Gazette.</p>
                </div>
                <button 
                  onClick={() => setIsBlogModalOpen(true)}
                  className="px-12 py-6 bg-gradient-premium text-white font-black rounded-3xl shadow-2xl active-scale uppercase tracking-[0.2em] text-sm flex items-center gap-4 hover:scale-105 transition-all"
                >
                  <Plus size={24} /> Create New Insight
                </button>
             </div>
          </motion.div>
        )}
      </div>

      {/* Blog Upload Modal */}
      <AnimatePresence>
        {isBlogModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsBlogModalOpen(false)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ scale: 0.95, y: 30 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 30 }}
              className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[60px] shadow-3xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[92vh]"
            >
               <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-950/30">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-purple-50 dark:bg-purple-950/30 text-purple-600 rounded-2xl flex items-center justify-center shadow-inner"><Newspaper size={24} /></div>
                    <div>
                      <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Manifest New Insight</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Aria Publishing Protocol</p>
                    </div>
                  </div>
                  <button onClick={() => setIsBlogModalOpen(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X size={24} /></button>
               </div>

               <div className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar">
                  <form onSubmit={handleSaveBlog} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                       <div>
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3 px-1">Article Headline</label>
                         <input required type="text" placeholder="e.g. The Future of Content" value={blogForm.title} onChange={(e) => setBlogForm({...blogForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-lg font-black tracking-tight focus:ring-2 focus:ring-purple-600 outline-none text-slate-950 dark:text-white" />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3 px-1">Niche Classification</label>
                         <select value={blogForm.category} onChange={(e) => setBlogForm({...blogForm, category: e.target.value})} className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-purple-600 outline-none shadow-sm cursor-pointer">
                           <option>Market Trends</option>
                           <option>Brand Growth</option>
                           <option>Creator Success</option>
                           <option>Platform News</option>
                         </select>
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3 px-1">Cover Image Identity (URL)</label>
                         <div className="relative">
                            <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input required type="url" placeholder="https://images.unsplash.com/..." value={blogForm.cover} onChange={(e) => setBlogForm({...blogForm, cover: e.target.value})} className="w-full pl-14 pr-8 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-bold focus:ring-2 focus:ring-purple-600 outline-none" />
                         </div>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div>
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3 px-1">Executive Summary (Excerpt)</label>
                         <textarea required rows={6} value={blogForm.excerpt} onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})} className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800 border-none rounded-[32px] text-sm font-bold focus:ring-2 focus:ring-purple-600 outline-none h-44 resize-none leading-relaxed" placeholder="Brief summary for market registry..." />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3 px-1">Read Complexity</label>
                         <input required type="text" placeholder="e.g. 5 min read" value={blogForm.readTime} onChange={(e) => setBlogForm({...blogForm, readTime: e.target.value})} className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-purple-600 outline-none" />
                       </div>
                    </div>

                    <div className="lg:col-span-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3 px-1">Article Core (Deep Dive)</label>
                       <textarea required rows={14} value={blogForm.content} onChange={(e) => setBlogForm({...blogForm, content: e.target.value})} className="w-full px-10 py-10 bg-slate-50 dark:bg-slate-800 border-none rounded-[48px] text-lg font-medium focus:ring-2 focus:ring-purple-600 outline-none h-96 resize-none leading-loose shadow-inner" placeholder="Draft the comprehensive analysis here..." />
                    </div>
                  </form>
               </div>

               <div className="p-10 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-6 bg-slate-50/20">
                  <button onClick={() => setIsBlogModalOpen(false)} className="px-10 py-5 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-slate-950 transition-colors">Discard Draft</button>
                  <button onClick={handleSaveBlog} disabled={isSaving} className="px-14 py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl flex items-center gap-3 active:scale-95 disabled:opacity-50 hover:scale-105 transition-all">
                    {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                    Manifest Insight
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LeaderCard = ({ name, title, image, bio, roleColor, icon, insta, linkedin }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="space-y-10 group">
      <motion.div
        className="relative rounded-[64px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] cursor-pointer aspect-[3/4] bg-slate-200 dark:bg-slate-800 border border-slate-100 dark:border-slate-800"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02, y: -8 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-cover select-none pointer-events-none transition-all duration-1000 ease-in-out"
          style={{ 
            filter: isHovered ? 'grayscale(0%) brightness(1.05)' : 'grayscale(100%) brightness(0.85)',
          }}
          animate={{ scale: isHovered ? 1.08 : 1 }}
        />
        
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity duration-700 ${isHovered ? 'opacity-40' : 'opacity-80'}`} />
        
        {!isHovered && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center mb-6 border border-white/20 shadow-2xl">
              <Heart className="w-10 h-10 text-white fill-white/80" />
            </div>
            <p className="font-black uppercase tracking-[0.5em] text-[10px] text-white/70">Unlock Vision</p>
          </div>
        )}

        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="absolute bottom-12 left-0 right-0 flex justify-center gap-8 z-20 px-10"
            >
              <a href={insta} target="_blank" rel="noreferrer" className="p-5 bg-white/90 backdrop-blur-md rounded-2xl text-slate-900 hover:scale-110 shadow-2xl transition-transform border border-white"><Instagram size={24} /></a>
              <a href={linkedin} target="_blank" rel="noreferrer" className="p-5 bg-white/90 backdrop-blur-md rounded-2xl text-slate-900 hover:scale-110 shadow-2xl transition-transform border border-white"><Linkedin size={24} /></a>
              <a href="#" className="p-5 bg-white/90 backdrop-blur-md rounded-2xl text-slate-900 hover:scale-110 shadow-2xl transition-transform border border-white"><Twitter size={24} /></a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="text-center md:text-left space-y-6 px-4">
        <div>
          <h2 className="text-4xl font-black text-slate-950 dark:text-white tracking-tighter uppercase leading-none mb-3">{name}</h2>
          <div className="flex items-center justify-center md:justify-start gap-3">
            {icon}
            <p className={`${roleColor} font-black text-[11px] uppercase tracking-[0.3em]`}>{title}</p>
          </div>
        </div>
        <p className="text-base text-slate-600 dark:text-slate-400 font-bold leading-relaxed">{bio}</p>
      </div>
    </div>
  );
};