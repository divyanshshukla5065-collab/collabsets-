import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../constants';
import { 
  Search, Bot, Zap, CreditCard, Activity, 
  Handshake, ShieldCheck, Filter, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MarketplaceShutter } from '../components/MarketplaceShutter';
import { useNavigate } from 'react-router-dom';

// Simple fuzzy matching helper: checks if characters of 'query' appear in 'target' in order
const fuzzyMatch = (query: string, target: string): boolean => {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  let i = 0;
  let j = 0;
  while (i < q.length && j < t.length) {
    if (q[i] === t[j]) i++;
    j++;
  }
  return i === q.length;
};

export const Dashboard: React.FC = () => {
  const { user, allUsers, deals, toggleBarterStatus } = useAuth();
  const navigate = useNavigate();
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isShutterActive, setIsShutterActive] = useState(true);
  const [showBarterOnly, setShowBarterOnly] = useState(false);
  const [showBarterOnboarding, setShowBarterOnboarding] = useState(false);

  const isBrand = user?.role === 'Brand';
  const isInfluencer = user?.role === 'Influencer';

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    if (isBrand && user?.onboardingStatus === 'COMPLETED' && user?.isBarterEnabled === undefined) {
      setTimeout(() => setShowBarterOnboarding(true), 4500);
    }
    return () => clearTimeout(timer);
  }, [isBrand, user?.onboardingStatus, user?.isBarterEnabled]);

  const filteredData = useMemo(() => {
    const targetRole = isBrand ? 'Influencer' : 'Brand';
    const searchTokens = search.toLowerCase().split(/\s+/).filter(Boolean);

    return allUsers.filter(u => {
      // 1. Role Filter
      if (u.role !== targetRole) return false;

      // 2. Barter Filter
      if (showBarterOnly && !u.isBarterEnabled) return false;

      // 3. Category Filter
      if (category !== 'All' && u.category !== category) return false;

      // 4. Advanced Keyword & Fuzzy Search
      if (searchTokens.length > 0) {
        const searchableText = [
          u.name,
          u.brandName,
          u.category,
          u.city,
          u.bio
        ].filter(Boolean).join(' ').toLowerCase();

        // Must match EVERY keyword (Intersection search)
        const allKeywordsMatch = searchTokens.every(token => {
          // Check for direct inclusion or fuzzy sequence match
          return searchableText.includes(token) || fuzzyMatch(token, searchableText);
        });

        if (!allKeywordsMatch) return false;
      }

      return true;
    });
  }, [allUsers, isBrand, search, category, showBarterOnly]);

  const activeDeals = useMemo(() => {
    return deals.filter(d => isInfluencer ? d.influencerId === user?.id : d.brandId === user?.id);
  }, [deals, isInfluencer, user?.id]);

  const financialStats = useMemo(() => {
    if (!isInfluencer) return null;
    const claimed = activeDeals.filter(d => d.paymentStatus === 'RELEASED').reduce((acc, d) => acc + d.amount, 0);
    const due = activeDeals.filter(d => d.paymentStatus === 'HELD_IN_ESCROW').reduce((acc, d) => acc + d.amount, 0);
    return { claimed, due, count: activeDeals.length };
  }, [isInfluencer, activeDeals]);

  return (
    <>
      <AnimatePresence>
        {isShutterActive && <MarketplaceShutter onComplete={() => setIsShutterActive(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showBarterOnboarding && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-3xl"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }}
              className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-[48px] p-10 text-center border border-white/10 shadow-3xl relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
              <div className="w-20 h-20 bg-purple-600 rounded-[24px] flex items-center justify-center mx-auto mb-8 shadow-xl">
                <Handshake className="text-white w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter mb-4">Enable Barter?</h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold mb-10 text-base leading-relaxed px-6">
                Exchange products for professional content. Perfect for new launches and rapid product seeding.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => { toggleBarterStatus(true); setShowBarterOnboarding(false); }}
                  className="w-full py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl active-scale uppercase tracking-widest text-[10px] shadow-xl"
                >
                  Yes, Enable
                </button>
                <button 
                  onClick={() => { toggleBarterStatus(false); setShowBarterOnboarding(false); }}
                  className="w-full py-4 text-slate-400 font-black uppercase tracking-widest text-[9px] hover:text-slate-600 transition-colors"
                >
                  Not Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-slate-50 dark:bg-[#030712] pb-48">
        <div className="max-w-[1600px] mx-auto px-8 py-12 lg:py-20">
          
          {/* Top Desktop Metrics */}
          {isInfluencer && financialStats && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 mb-20"
            >
              <FinanceCard label="Total Earned" value={`₹${financialStats.claimed.toLocaleString()}`} icon={<BarChart3 />} color="text-emerald-500" />
              <FinanceCard label="Pending Payments" value={`₹${financialStats.due.toLocaleString()}`} icon={<CreditCard />} color="text-amber-500" />
              <FinanceCard label="Active Deals" value={financialStats.count.toString()} icon={<Zap />} color="text-purple-500" />
            </motion.div>
          )}

          <header className="mb-20">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
              <div className="max-w-2xl">
                <motion.div 
                  initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-purple-600/10 text-purple-600 dark:text-purple-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-purple-500/20"
                >
                  <Activity size={12} /> Marketplace Directory
                </motion.div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-950 dark:text-white tracking-tighter uppercase leading-[0.8] py-2">
                  Market <br /> <span className="text-gradient-premium">Network</span>
                </h1>
              </div>
              
              <div className="flex flex-col sm:flex-row w-full lg:max-w-3xl gap-5">
                <div className="relative flex-1 group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                  <input 
                    type="text" placeholder={`Try "Mumbai Tech" or "Fashion Delhi"...`}
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[28px] shadow-xl focus:ring-4 focus:ring-purple-600/10 outline-none text-slate-950 dark:text-white font-bold text-base"
                  />
                </div>
                <button 
                  onClick={() => navigate('/chat')}
                  className="px-10 py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-900 rounded-[28px] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl active-scale hover:shadow-purple-500/20 transition-all"
                >
                  <Bot size={20} className="text-purple-600" /> AI Assistant
                </button>
              </div>
            </div>
          </header>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            {/* Desktop Sticky Sidebar */}
            <aside className="lg:w-80 flex-shrink-0 space-y-12 lg:sticky lg:top-32">
              
              <motion.div 
                whileHover={{ y: -5 }}
                className={`p-8 rounded-[44px] border-2 transition-all duration-700 relative overflow-hidden ${
                  showBarterOnly 
                  ? 'bg-slate-950 border-purple-500 shadow-2xl shadow-purple-500/20' 
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className={`p-4 rounded-2xl ${showBarterOnly ? 'bg-purple-600 text-white shadow-xl' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    <Handshake size={24} />
                  </div>
                  {isInfluencer && (
                    <button 
                      onClick={() => toggleBarterStatus(!user?.isBarterEnabled)}
                      className={`w-12 h-6 rounded-full p-1 transition-all ${user?.isBarterEnabled ? 'bg-purple-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                       <motion.div animate={{ x: user?.isBarterEnabled ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full shadow-md" />
                    </button>
                  )}
                </div>
                <h3 className={`text-lg font-black uppercase tracking-tight mb-2 ${showBarterOnly ? 'text-white' : 'text-slate-950 dark:text-white'}`}>Barter Mode</h3>
                <p className={`text-[9px] font-black uppercase tracking-widest mb-8 ${showBarterOnly ? 'text-purple-400' : 'text-slate-400'}`}>Exchange Products for Content</p>
                <button 
                  onClick={() => setShowBarterOnly(!showBarterOnly)}
                  className={`w-full py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${
                    showBarterOnly 
                    ? 'bg-white text-slate-950 shadow-xl' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {showBarterOnly ? 'Show All' : 'Only Barter'}
                </button>
              </motion.div>

              <div className="space-y-8 px-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-3">
                  <Filter size={16} /> Filters
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {CATEGORIES.map(c => (
                    <button 
                      key={c} onClick={() => setCategory(c)}
                      className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        category === c 
                        ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-md' 
                        : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800 hover:text-purple-600'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Content Feed - Desktop 3 Columns */}
            <main className="flex-1">
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredData.map((item, i) => (
                    <UserCard key={item.id} data={item} index={i} isBrandView={isBrand} onAction={() => navigate(`/marketplace/${item.id}`)} />
                  ))}
                </AnimatePresence>
              </motion.div>

              {filteredData.length === 0 && !isLoading && (
                <div className="py-40 text-center flex flex-col items-center">
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-[40px] flex items-center justify-center mb-8 shadow-inner">
                    <Search className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tighter mb-4">No Matches</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-bold max-w-sm text-base leading-relaxed">The network registry found zero entries for these parameters.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

const FinanceCard = ({ label, value, icon, color }: any) => (
  <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-xl flex items-center gap-8 group hover:border-purple-500/20 transition-all duration-500">
    <div className={`w-16 h-16 rounded-[24px] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform ${color}`}>
      {React.cloneElement(icon, { size: 30 })}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-4xl lg:text-5xl font-black dark:text-white tracking-tighter leading-none">{value}</p>
    </div>
  </div>
);

const UserCard = ({ data, index, isBrandView, onAction }: any) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
    transition={{ delay: index * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="bg-white dark:bg-slate-900 rounded-[48px] p-8 border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-700 group relative overflow-hidden flex flex-col h-full"
  >
    {data.isBarterEnabled && (
      <div className="absolute top-8 right-8">
         <div className="bg-purple-600 text-white text-[8px] font-black uppercase px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-soft-bounce">
           <Handshake size={10} /> Barter
         </div>
      </div>
    )}
    
    <div className="flex items-center gap-6 mb-10">
      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 rounded-[28px] p-1 bg-gradient-premium shadow-xl group-hover:scale-105 transition-transform duration-700">
          <img src={data.avatar} className="w-full h-full rounded-[24px] object-cover bg-white dark:bg-slate-950" />
        </div>
        {data.isVerified && (
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-lg border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-lg">
            <ShieldCheck size={14} className="text-white" />
          </div>
        )}
      </div>
      <div className="min-w-0">
         <h3 className="text-xl lg:text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tighter truncate leading-tight py-1">{isBrandView ? data.name : (data.brandName || data.name)}</h3>
         <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest mt-1.5">{data.category}</p>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-10">
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100/50 dark:border-white/5">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{isBrandView ? 'Followers' : 'Budget'}</p>
        <p className="text-lg font-black dark:text-white">
          {isBrandView 
            ? (data.followers >= 1000 ? `${(data.followers/1000).toFixed(1)}K` : data.followers)
            : `₹${((data.avgCampaignBudget || 0)/1000).toFixed(0)}K+`
          }
        </p>
      </div>
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100/50 dark:border-white/5">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Rate</p>
        <p className="text-lg font-black dark:text-white">₹{(isBrandView ? data.pricePerPost : (data.avgCampaignBudget || 0))?.toLocaleString()}</p>
      </div>
    </div>
    
    <button 
      onClick={onAction}
      className="mt-auto w-full py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-900 rounded-[24px] font-black text-[10px] uppercase tracking-widest active-scale group-hover:bg-purple-600 group-hover:text-white transition-all shadow-lg"
    >
      View Profile
    </button>
  </motion.div>
);