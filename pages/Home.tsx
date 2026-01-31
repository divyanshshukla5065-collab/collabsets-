import React from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Activity, Newspaper, ArrowUpRight, Shield } from 'lucide-react';
import { AIRobotMascot } from '../components/AIRobotMascot';
import { ReviewMarquee } from '../components/ReviewMarquee';
import { PartnerMarquee } from '../components/PartnerMarquee';
import { useAuth } from '../context/AuthContext';
import { MOCK_BLOG_POSTS } from '../constants';

const HeadingWord: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <motion.span
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    className="inline-block"
  >
    {children}&nbsp;
  </motion.span>
);

export const Home: React.FC = () => {
  const { user } = useAuth();
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 600], [0, 150]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="bg-slate-50 dark:bg-[#030712] overflow-x-hidden relative pb-32">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-purple-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-amber-500/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* Desktop Optimized Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-32 px-6">
        <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-[0.08] dark:opacity-[0.04]">
          <AIRobotMascot />
        </motion.div>

        <div className="max-w-[1600px] w-full mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/80 dark:bg-slate-900/60 backdrop-blur-3xl border border-slate-200/50 dark:border-white/10 rounded-full text-slate-950 dark:text-white text-[9px] lg:text-[10px] font-black uppercase tracking-[0.4em] mb-10 shadow-sm">
              <Activity size={12} className="text-purple-600 animate-pulse" />
              Verified Network Active
            </div>
            
            <h1 className="fluid-hero font-black brand-font tracking-tighter text-slate-950 dark:text-white mb-8 leading-[0.9] py-2">
              <div className="flex justify-center flex-wrap mb-2 md:mb-4">
                <HeadingWord delay={0.1}>Build</HeadingWord>
                <HeadingWord delay={0.2}>Connections.</HeadingWord>
              </div>
              <div className="flex justify-center items-center">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="px-10 md:px-20 py-5 md:py-8 bg-gradient-premium rounded-[30px] md:rounded-[60px] text-white shadow-xl inline-flex items-center justify-center relative overflow-hidden"
                >
                  <span className="whitespace-nowrap relative z-10 text-xl md:text-3xl lg:text-5xl">Scale Faster.</span>
                </motion.div>
              </div>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }}
              className="max-w-2xl lg:max-w-3xl mx-auto text-base md:text-lg lg:text-xl text-slate-500 dark:text-slate-400 mb-14 font-medium leading-relaxed"
            >
              India's premium marketplace for top-tier creators and leading brands. Built for transparency, speed, and real revenue growth.
            </motion.p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="flex flex-col sm:flex-row justify-center items-center gap-5 px-4">
            <Link to={user ? "/dashboard" : "/signup"} className="w-full sm:w-auto px-10 py-4 bg-slate-950 text-white dark:bg-white dark:text-slate-950 rounded-2xl font-black text-sm shadow-lg hover:scale-105 transition-all flex items-center justify-center group active-scale">
              Join Now <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to={user ? "/dashboard" : "/signup?role=brand"} className="w-full sm:w-auto px-10 py-4 bg-white dark:bg-slate-900/80 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-2xl text-slate-950 dark:text-white font-black text-sm hover:border-purple-600 transition-all flex items-center justify-center active-scale shadow-sm">
              Hire Talent
            </Link>
          </motion.div>
        </div>
      </section>

      <ReviewMarquee />
      <PartnerMarquee />

      {/* High-Density Stats */}
      <section className="bg-slate-950 text-white py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 opacity-[0.02] pointer-events-none">
          <Shield size={400} />
        </div>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-24">
            {[
              { label: "Verified Creators", value: "25K+" },
              { label: "Elite Brands", value: "500+" },
              { label: "Revenue Moved", value: "₹2Cr+" },
              { label: "Satisfaction", value: "4.9/5" }
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <p className="text-4xl md:text-6xl font-black mb-2 tracking-tighter leading-none">{stat.value}</p>
                <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em] opacity-70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Desktop Blog Grid */}
      <section className="py-32 max-w-[1600px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-16">
          <div className="max-w-xl">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-full text-purple-600 dark:text-purple-400 text-[9px] font-black uppercase tracking-[0.2em] mb-6">
               <Newspaper size={12} /> Market Intelligence
             </div>
             <h2 className="text-4xl md:text-6xl font-black text-slate-950 dark:text-white tracking-tighter uppercase leading-[0.9] py-2">Expert Insights</h2>
          </div>
          <Link to="/blog" className="px-8 py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] active-scale flex items-center gap-3 shadow-md">
            Read All <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
           {MOCK_BLOG_POSTS.slice(0, 3).map((post, i) => (
             <motion.div key={i} whileHover={{ y: -10 }} transition={{ type: 'spring', damping: 25 }}>
                <Link to={`/blog/${post.slug}`} className="group block relative bg-white dark:bg-slate-900 rounded-[48px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all h-[450px]">
                   <img src={post.cover} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-1000" alt={post.title} />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                   <div className="absolute bottom-0 left-0 right-0 p-10">
                      <span className="px-3 py-1 bg-purple-600 text-white rounded-lg text-[8px] font-black uppercase tracking-widest mb-6 inline-block">Analysis</span>
                      <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-6 group-hover:text-purple-400 transition-colors leading-tight">{post.title}</h3>
                      <div className="flex items-center gap-3 text-white font-black text-[9px] uppercase tracking-[0.3em] opacity-70 group-hover:opacity-100 transition-all">
                         Deep Dive <ArrowUpRight size={14} />
                      </div>
                   </div>
                </Link>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Simplified CTA */}
      <section className="py-20 px-6">
        <div className="max-w-[1600px] mx-auto text-center bg-slate-950 rounded-[64px] p-16 md:p-24 relative overflow-hidden border border-white/5 shadow-2xl">
           <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
           <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.8] py-2">Start Your <br /> <span className="text-gradient-premium">Success Story.</span></h2>
           <p className="text-lg md:text-2xl text-slate-400 font-medium mb-12 max-w-xl mx-auto leading-relaxed">
             Join the thousands of verified creators and brands shaping India's creator economy.
           </p>
           <div className="flex flex-wrap justify-center gap-6">
              <Link to="/signup" className="px-12 py-5 bg-white text-slate-950 font-black rounded-2xl text-base shadow-xl active-scale uppercase">Sign Up Now</Link>
              <Link to="/team" className="px-12 py-5 bg-white/5 text-white border border-white/10 font-black rounded-2xl text-base active-scale uppercase hover:bg-white/10 transition-all">About Us</Link>
           </div>
        </div>
      </section>
    </div>
  );
};