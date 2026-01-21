
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_INFLUENCERS, MOCK_BRANDS, CATEGORIES, CITIES } from '../constants';
import { Filter, Search, MapPin, Instagram, UserPlus, CheckCircle, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { user, sendRequest, requests } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [city, setCity] = useState('All');
  const [priceMax, setPriceMax] = useState(100000);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const isBrand = user?.role === 'Brand';

  const filteredData = useMemo(() => {
    const source = isBrand ? MOCK_INFLUENCERS : MOCK_BRANDS;
    return source.filter(item => {
      const name = isBrand ? item.name : item.brandName;
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || item.category === category;
      const matchesCity = city === 'All' || item.city === city;
      const matchesPrice = isBrand ? item.pricePerPost <= priceMax : true;
      return matchesSearch && matchesCategory && matchesCity && matchesPrice;
    });
  }, [isBrand, search, category, city, priceMax]);

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <label className="block text-xs font-black text-slate-400 uppercase mb-3">Niche</label>
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-purple-600 outline-none dark:text-white font-bold"
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-black text-slate-400 uppercase mb-3">City</label>
        <select 
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-purple-600 outline-none dark:text-white font-bold"
        >
          {CITIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {isBrand && (
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase mb-3">Max Budget (₹{priceMax.toLocaleString()})</label>
          <input 
            type="range" 
            min="1000" 
            max="100000" 
            step="1000"
            value={priceMax}
            onChange={(e) => setPriceMax(parseInt(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="w-full md:w-auto">
          <h1 className="text-3xl md:text-4xl font-black dark:text-white">Dashboard</h1>
          <p className="text-slate-500 font-medium">Explore top-tier opportunities today.</p>
        </div>
        
        <div className="flex w-full md:max-w-md gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder={`Search...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-purple-600 outline-none dark:text-white font-medium"
            />
          </div>
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden p-4 bg-purple-600 text-white rounded-2xl shadow-lg"
          >
            <Filter className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:w-72 flex-shrink-0">
          <div className="sticky top-24 p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-xl font-bold mb-8 flex items-center dark:text-white">
              <Filter className="w-5 h-5 mr-3 text-purple-600" /> Filters
            </h2>
            <FilterContent />
          </div>
        </aside>

        {/* Mobile Filters Drawer */}
        <AnimatePresence>
          {showMobileFilters && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileFilters(false)}
                className="fixed inset-0 bg-black/60 z-[60] md:hidden"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="fixed inset-x-0 bottom-0 bg-white dark:bg-slate-900 z-[70] p-8 rounded-t-[40px] shadow-2xl md:hidden"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black dark:text-white">Filters</h2>
                  <button onClick={() => setShowMobileFilters(false)} className="p-2 text-slate-400">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <FilterContent />
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full mt-10 py-4 bg-gradient-premium text-white font-black rounded-2xl"
                >
                  Apply Filters
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredData.map((item, i) => (
                <Card 
                  key={item.id} 
                  data={item} 
                  index={i} 
                  isBrand={isBrand}
                  requestStatus={requests.find(r => r.toId === item.id)?.status}
                  onConnect={() => sendRequest(item.id)}
                />
              ))}
            </AnimatePresence>
            {filteredData.length === 0 && (
              <div className="col-span-full py-20 text-center text-slate-400 font-medium italic">
                No matches found for your current filters.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const Card = ({ data, index, isBrand, onConnect, requestStatus }: any) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-white dark:bg-slate-900 p-5 md:p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="relative">
            <img src={isBrand ? data.avatar : data.logo} className="w-14 h-14 md:w-16 md:h-16 rounded-2xl object-cover bg-slate-100" />
            {!isBrand && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900" />}
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold dark:text-white leading-tight">{isBrand ? data.name : data.brandName}</h3>
            <p className="text-slate-400 text-xs md:text-sm font-semibold">{data.category}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[10px] font-black text-slate-400 uppercase">From</p>
          <p className="text-base md:text-lg font-black text-purple-600">₹{isBrand ? data.pricePerPost.toLocaleString() : (data.budget/10).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 mb-6">
        <div className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-2 truncate">
           <MapPin className="w-3 h-3 md:w-4 md:h-4 text-slate-400 flex-shrink-0" />
           <span className="text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-300 truncate">{data.city}</span>
        </div>
        {isBrand && (
          <div className="flex-1 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center gap-2">
             <Instagram className="w-3 h-3 md:w-4 md:h-4 text-purple-600 flex-shrink-0" />
             <span className="text-[10px] md:text-xs font-bold text-purple-600">{Math.floor(data.followers/1000)}K</span>
          </div>
        )}
      </div>

      {requestStatus ? (
        <div className={`w-full py-4 rounded-2xl flex items-center justify-center font-bold text-sm ${
          requestStatus === 'Pending' ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-green-50 text-green-600'
        }`}>
          {requestStatus === 'Pending' ? <><Clock className="w-4 h-4 mr-2" /> Request Sent</> : <><CheckCircle className="w-4 h-4 mr-2" /> Accepted</>}
        </div>
      ) : (
        <button 
          onClick={onConnect}
          className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-purple-600 dark:hover:bg-purple-500 dark:hover:text-white transition-all shadow-lg active:scale-95"
        >
          <UserPlus className="w-4 h-4" /> Connect Now
        </button>
      )}
    </motion.div>
  );
};
