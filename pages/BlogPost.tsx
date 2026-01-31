
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  Calendar, User, Clock, Share2, 
  MessageCircle, ArrowLeft, Bookmark, Sparkles, Handshake 
} from 'lucide-react';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogs } = useAuth();
  const navigate = useNavigate();
  const post = blogs.find(p => p.slug === slug);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-3xl font-black text-slate-950 dark:text-white uppercase">Insight Not Found</h2>
        <p className="text-slate-500 font-bold mt-2">Searching current registry for intelligence...</p>
        <button onClick={() => navigate('/blog')} className="mt-8 px-10 py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest active-scale">Back to Insights</button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-premium z-[60] origin-left"
        style={{ scaleX }}
      />

      <div className="fixed top-24 left-4 md:left-8 z-50">
        <button 
          onClick={() => navigate('/blog')}
          className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white hover:scale-105 transition-all shadow-xl active-scale"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <article className="pb-32">
        <header className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
          <img src={post.cover} className="w-full h-full object-cover" alt={post.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-transparent to-black/30" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-20">
            <div className="max-w-4xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-3 px-4 py-2 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-2xl">
                {post.category}
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl md:text-7xl font-black text-slate-950 dark:text-white uppercase tracking-tighter mb-8 leading-[1.1] md:leading-[1]">
                {post.title}
              </motion.h1>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gradient-premium p-0.5 shadow-lg">
                      <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                        <User size={18} className="text-purple-600" />
                      </div>
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authored by</p>
                     <p className="text-xs font-black text-slate-900 dark:text-white uppercase">{post.author}</p>
                   </div>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
                <div className="flex items-center gap-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 mt-12 md:mt-20">
          <main className=" prose prose-slate dark:prose-invert prose-xl max-w-none">
             <div 
              className="text-slate-800 dark:text-slate-300 font-medium leading-relaxed blog-content-styles"
              dangerouslySetInnerHTML={{ __html: post.content }} 
             />

             <div className="mt-24 p-8 md:p-12 bg-slate-950 rounded-[44px] text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Sparkles size={160} /></div>
               <h3 className="text-3xl font-black mb-6 flex items-center gap-4 uppercase tracking-tighter">Manifest Your Success</h3>
               <p className="text-slate-400 font-bold mb-8 text-lg leading-relaxed">Turn these insights into campaign reality. Join the elite network today.</p>
               <div className="flex flex-wrap gap-4">
                 <Link to="/signup" className="px-8 py-4 bg-white text-slate-950 font-black rounded-2xl hover:scale-105 transition-all text-sm uppercase tracking-widest shadow-xl">Join Now</Link>
               </div>
             </div>
          </main>
        </div>
      </article>

      <style>{`
        .blog-content-styles p { margin-bottom: 2rem; font-size: 1.125rem; line-height: 1.8; }
        .blog-content-styles h2 { font-size: 2.25rem; font-weight: 900; color: #0f172a; margin-top: 3rem; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: -0.05em; }
        .dark .blog-content-styles h2 { color: #f8fafc; }
        .blog-content-styles blockquote { border-left: 6px solid #7c3aed; padding-left: 2rem; margin: 3rem 0; font-style: italic; font-size: 1.5rem; color: #4b5563; }
        .dark .blog-content-styles blockquote { color: #94a3b8; }
      `}</style>
    </div>
  );
};
