
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Clock, User, ChevronRight, Sparkles, 
  Search, BookOpen, TrendingUp, Filter 
} from 'lucide-react';

export const Blog: React.FC = () => {
  const { blogs } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const blogCategories = ['All', ...new Set(blogs.map(post => post.category))];

  const filteredPosts = blogs.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-32">
      <section className="pt-20 md:pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <BookOpen size={400} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 text-[10px] font-black uppercase tracking-widest mb-6"
            >
              <Sparkles size={12} /> The Collabset Gazette
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-950 dark:text-white uppercase tracking-tighter mb-6 leading-none">
              Elite <span className="text-gradient-premium">Insights</span> & Trends.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-bold leading-relaxed max-w-2xl">
              Engineering the future of creativity. Expert strategies, market reports, and success stories from India's most powerful network.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 mb-12 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-100 dark:border-slate-800 p-4 md:p-6 rounded-[32px] shadow-xl flex flex-col lg:flex-row items-center gap-6">
            <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar w-full">
              {blogCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    activeCategory === cat 
                    ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700 hover:border-purple-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="w-full lg:w-80 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none text-slate-950 dark:text-white font-bold text-xs"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post, idx) => (
                <BlogCard key={post.id} post={post} index={idx} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">No Articles Found</h3>
            <p className="text-slate-500 font-bold mt-2">The registry is currently processing new intelligence.</p>
          </div>
        )}
      </section>
    </div>
  );
};

const BlogCard: React.FC<{ post: any; index: number }> = ({ post, index }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
    >
      <Link to={`/blog/${post.slug}`} className="block relative overflow-hidden aspect-[16/10]">
        <img 
          src={post.cover} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          alt={post.title} 
        />
        <div className="absolute top-6 left-6">
          <span className="px-4 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-widest text-purple-600 shadow-xl">
            {post.category}
          </span>
        </div>
      </Link>
      
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-4 mb-6">
           <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
             <Clock size={12} /> {post.readTime}
           </div>
           <div className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
           <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
             <User size={12} /> {post.author}
           </div>
        </div>

        <h3 className="text-xl md:text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight mb-4 group-hover:text-purple-600 transition-colors line-clamp-2 leading-tight">
          {post.title}
        </h3>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 font-bold leading-relaxed mb-8 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800">
          <Link 
            to={`/blog/${post.slug}`} 
            className="inline-flex items-center gap-3 text-[10px] font-black text-slate-950 dark:text-white uppercase tracking-widest group-hover:gap-5 transition-all"
          >
            Read Deep Dive <ArrowRight size={14} className="text-purple-600" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
