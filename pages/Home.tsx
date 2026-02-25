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
  const yHero = useTransform(scrollY, [0, 600], [0, 100]);
  const opacityHero = useTransform(scrollY, [0, 400], [0.06, 0]);

  return (
    <div className="bg-slate-50 dark:bg-[#030712] overflow-x-hidden relative pb-40">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-purple-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-amber-500/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* Desktop Optimized Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-40 pb-48 px-6">
        <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
          <AIRobotMascot />
        </motion.div>

        <div className="max-w-[1600px] w-full mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/80 dark:bg-slate-900/60 backdrop-blur-3xl border border-slate-200/50 dark:border-white/10 rounded-full text-slate-950 dark:text-white text-[10px] font-black uppercase tracking-[0.4em] mb-20 shadow-sm">
              <Activity size={12} className="text-purple-600 animate-pulse" />
              Verified Network Active
            </div>
            
            <h1 className="fluid-hero font-black brand-font tracking-tighter text-slate-950 dark:text-white mb-20 py-2">
              <div className="flex justify-center flex-wrap mb-10 md:mb-14">
                <HeadingWord delay={0.1}>Build</HeadingWord>
                <HeadingWord delay={0.2}>Connections.</HeadingWord>
              </div>
              <div className="flex justify-center items-center">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="px-14 md:px-28 py-10 md:py-16 bg-gradient-premium rounded-[50px] md:rounded-[80px] text-white shadow-2xl inline-flex items-center justify-center relative overflow-hidden group"
                >
                  {/* Subtle Elegant Shine */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine pointer-events-none" />
                  <span className="whitespace-nowrap relative z-10 text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-none">Scale Faster.</span>
                </motion.div>
              </div>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }}
              className="max-w-2xl lg:max-w-4xl mx-auto text-lg md:text-2xl lg:text-3xl text-slate-500 dark:text-slate-400 mb-20 font-medium leading-relaxed"
            >
              India's premium architectural marketplace for top-tier creators and leading brands. <br className="hidden md:block" /> 
              Engineered for absolute transparency and exponential growth.
            </motion.p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="flex flex-col sm:flex-row justify-center items-center gap-8 px-4">
            <Link to={user ? "/dashboard" : "/signup"} className="w-full sm:w-auto px-16 py-6 bg-slate-950 text-white dark:bg-white dark:text-slate-950 rounded-2xl font-black text-base uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center group active-scale">
              Join Now <ChevronRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to={user ? "/dashboard" : "/signup?role=brand"} className="w-full sm:w-auto px-16 py-6 bg-white dark:bg-slate-900/80 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-2xl text-slate-950 dark:text-white font-black text-base uppercase tracking-widest hover:border-purple-600 transition-all flex items-center justify-center active-scale shadow-sm">
              Hire Talent
            </Link>
          </motion.div>
        </div>
      </section>

      <ReviewMarquee />
      <PartnerMarquee />

      {/* High-Density Stats with Increased Spacing */}
      <section className="bg-slate-950 text-white py-40 md:py-60 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 opacity-[0.03] pointer-events-none">
          <Shield size={600} />
        </div>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 lg:gap-40">
            {[
              { label: "Verified Creators", value: "100+" },
              { label: "Elite Brands", value: "100+" },
              { label: "Satisfaction", value: "4.9/5" }
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.15 }}
                className="relative overflow-hidden p-12 rounded-[56px] group bg-white/[0.02] border border-white/5"
              >
                {/* Visual Shine Element */}
                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine pointer-events-none" style={{ animationDelay: `${i * 2}s` }} />
                
                <p className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter leading-none group-hover:text-purple-400 transition-colors duration-500">{stat.value}</p>
                <p className="text-[12px] md:text-sm font-black text-purple-400 uppercase tracking-[0.6em] opacity-60 group-hover:opacity-100 transition-opacity">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid with Optimized Typography */}
      <section className="py-40 max-w-[1600px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-24">
          <div className="max-w-2xl">
             <div className="inline-flex items-center gap-2 px-5 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-full text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
               <Newspaper size={14} /> Market Intelligence
             </div>
             <h2 className="text-5xl md:text-8xl font-black text-slate-950 dark:text-white tracking-tighter uppercase leading-[0.9] py-2">Expert Insights</h2>
          </div>
          <Link to="/blog" className="px-10 py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] active-scale flex items-center gap-4 shadow-md">
            Read All <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
           {MOCK_BLOG_POSTS.slice(0, 3).map((post, i) => (
             <motion.div key={i} whileHover={{ y: -15 }} transition={{ type: 'spring', damping: 25 }}>
                <Link to={`/blog/${post.slug}`} className="group block relative bg-white dark:bg-slate-900 rounded-[56px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all h-[520px]">
                   <img src={post.cover} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-1000" alt={post.title} />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                   <div className="absolute bottom-0 left-0 right-0 p-12">
                      <span className="px-4 py-2 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest mb-8 inline-block shadow-lg">Analysis</span>
                      <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-8 group-hover:text-purple-400 transition-colors leading-tight">{post.title}</h3>
                      <div className="flex items-center gap-4 text-white font-black text-[10px] uppercase tracking-[0.4em] opacity-60 group-hover:opacity-100 transition-all">
                         Deep Dive <ArrowUpRight size={18} />
                      </div>
                   </div>
                </Link>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Simplified CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-[1600px] mx-auto text-center bg-slate-950 rounded-[100px] p-24 md:p-40 relative overflow-hidden border border-white/5 shadow-2xl">
           <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
           <h2 className="text-6xl md:text-9xl font-black text-white mb-14 tracking-tighter uppercase leading-[0.8] py-2">Start Your <br /> <span className="text-gradient-premium">Success Story.</span></h2>
           <p className="text-2xl md:text-4xl text-slate-400 font-medium mb-20 max-w-3xl mx-auto leading-relaxed">
             Join the thousands of verified creators and brands shaping India's creator economy.
           </p>
           <div className="flex flex-wrap justify-center gap-10">
              <Link to="/signup" className="px-16 py-7 bg-white text-slate-950 font-black rounded-3xl text-xl shadow-2xl active-scale uppercase tracking-widest">Sign Up Now</Link>
              <Link to="/team" className="px-16 py-7 bg-white/5 text-white border border-white/10 font-black rounded-3xl text-xl active-scale uppercase tracking-widest hover:bg-white/10 transition-all">About Us</Link>
           </div>
        </div>
      </section>
    </div>
  );
};