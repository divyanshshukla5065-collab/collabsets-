
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, Star, Shield, Zap, CheckCircle, 
  Instagram, Users, Briefcase, Award 
} from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-40">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none overflow-hidden">
           <div className="absolute top-1/4 -left-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl animate-pulse" />
           <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-amber-500 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl lg:text-8xl font-black brand-font tracking-tight dark:text-white mb-6 leading-[1.1]">
              India's Premier <br />
              <span className="text-gradient-premium">Collab Marketplace</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400 mb-12 font-medium">
              Bridge the gap between vision and influence. We connect top-tier brands with India's most impactful creators for transparent, result-driven collaborations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <Link
              to="/signup"
              className="px-10 py-5 bg-gradient-premium rounded-2xl text-white font-bold text-xl shadow-2xl hover:shadow-purple-500/40 transition-all flex items-center justify-center group"
            >
              Get Started Free
              <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/signup?role=brand"
              className="px-10 py-5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-bold text-xl hover:border-amber-500 transition-all"
            >
              Hire Creators
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust & Metrics */}
      <section className="bg-slate-50 dark:bg-slate-800/50 py-16 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-around gap-12 text-center">
          {[
            { value: "500+", label: "Brands Registered", icon: <Briefcase className="w-5 h-5" /> },
            { value: "25k+", label: "Verified Creators", icon: <Users className="w-5 h-5" /> },
            { value: "₹2Cr+", label: "Total Payouts", icon: <Award className="w-5 h-5" /> },
            { value: "4.9/5", label: "User Rating", icon: <Star className="w-5 h-5" /> }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-purple-600 dark:text-purple-400 mb-2">{stat.icon}</div>
              <p className="text-3xl font-black dark:text-white">{stat.value}</p>
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black dark:text-white mb-4">How It Works</h2>
          <div className="h-1.5 w-24 bg-gradient-premium mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { step: "01", title: "Create Profile", desc: "Sign up and verify your profile with 100% transparency. Link your Instagram and LinkedIn." },
            { step: "02", title: "Discover & Connect", desc: "Brands browse creators using advanced filters. Creators explore high-budget campaigns." },
            { step: "03", title: "Collab & Get Paid", desc: "Secure collab requests, real-time chat, and guaranteed payments within the platform." }
          ].map((item, i) => (
            <div key={i} className="relative p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] shadow-sm hover:shadow-xl transition-all group">
              <div className="absolute -top-6 -left-2 text-7xl font-black text-slate-100 dark:text-slate-800 select-none group-hover:text-purple-50 transition-colors">{item.step}</div>
              <h3 className="text-2xl font-bold dark:text-white mb-4 relative z-10">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
             <h2 className="text-5xl font-black mb-8 leading-tight">Built for Trust. <br /> Designed for Growth.</h2>
             <div className="space-y-6">
                {[
                  "Verified creator metrics and insights",
                  "Escrow-style secure payments in INR",
                  "Direct real-time chat system",
                  "End-to-end legal transparency"
                ].map((text, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <CheckCircle className="text-amber-500 w-6 h-6 flex-shrink-0" />
                    <span className="text-xl font-medium text-slate-300">{text}</span>
                  </div>
                ))}
             </div>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
             <div className="aspect-square bg-gradient-premium rounded-3xl p-8 flex flex-col justify-end">
                <Instagram className="w-12 h-12 mb-4" />
                <p className="text-xl font-bold">Auto-fetch Insights</p>
             </div>
             <div className="aspect-square bg-slate-800 rounded-3xl p-8 flex flex-col justify-end translate-y-12">
                <Shield className="w-12 h-12 mb-4 text-purple-400" />
                <p className="text-xl font-bold">Fraud Protection</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};
