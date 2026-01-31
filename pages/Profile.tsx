
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  Instagram, MapPin, DollarSign, Camera, Check, 
  Briefcase, Globe, Upload, ShieldCheck, Twitter, 
  Linkedin, Sparkles, User as UserIcon, Youtube, 
  AlertCircle, Save, Layout, RefreshCw, PencilLine,
  ChevronLeft
} from 'lucide-react';
import { CATEGORIES, CITIES } from '../constants';
import Cropper from 'react-easy-crop';
// Fix: Verified named exports from react-router-dom
import { useNavigate } from 'react-router-dom';

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
];

const BIO_CHAR_LIMIT = 500;

const InputLabel: React.FC<{ children: React.ReactNode; required?: boolean }> = ({ children, required }) => (
  <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-3">
    {children}
    {required && <span className="text-red-500 text-xs font-bold">*</span>}
  </label>
);

export const Profile: React.FC = () => {
  const { user, completeProfile } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isInfluencer = user?.role === 'Influencer';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<any>({
    avatar: PRESET_AVATARS[0],
    name: '',
    brandName: '',
    instagramHandle: '',
    instagramUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    youtubeUrl: '',
    category: CATEGORIES[1],
    city: CITIES[1],
    pricePerPost: 0,
    avgCampaignBudget: 0,
    bio: '',
    website: '',
    followers: 0,
    avgViews: 0,
  });

  useEffect(() => {
    if (user) {
      setForm({
        avatar: user.avatar || PRESET_AVATARS[0],
        name: user.name || '',
        brandName: user.brandName || '',
        instagramHandle: user.instagramHandle || '',
        instagramUrl: user.instagramUrl || '',
        twitterUrl: user.twitterUrl || '',
        linkedinUrl: user.linkedinUrl || '',
        youtubeUrl: user.youtubeUrl || '',
        category: user.category || CATEGORIES[1],
        city: user.city || CITIES[1],
        pricePerPost: user.pricePerPost || 0,
        avgCampaignBudget: user.avgCampaignBudget || 0,
        bio: user.bio || '',
        website: user.website || '',
        followers: user.followers || 0,
        avgViews: user.avgViews || 0,
      });
    }
  }, [user]);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const canvas = document.createElement('canvas');
    const image = new Image();
    image.src = imageSrc;
    await new Promise((res) => (image.onload = res));
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 400;
    canvas.height = 400;
    ctx.beginPath();
    ctx.arc(200, 200, 200, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(image, croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height, 0, 0, 400, 400);
    const base64Image = canvas.toDataURL('image/jpeg');
    setForm({ ...form, avatar: base64Image });
    setImageSrc(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    const instaValue = isInfluencer ? form.instagramHandle : form.instagramUrl;
    if (!instaValue || !instaValue.trim()) {
      setError(isInfluencer ? "Instagram handle is mandatory." : "Brand Instagram URL is mandatory.");
      setIsSaving(false);
      return;
    }

    setIsSaving(true);
    try {
      await completeProfile(form);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError("Failed to update profile.");
      setIsSaving(false);
    }
  };

  const bioText = form.bio || '';
  const bioLength = bioText.length;
  const bioProgress = (bioLength / BIO_CHAR_LIMIT) * 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/20 pb-32">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-16">
        {/* Page Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-black text-[10px] uppercase tracking-widest mb-4 transition-colors group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Marketplace
            </button>
            <h1 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white mb-2 tracking-tighter uppercase">Edit Profile</h1>
            <p className="text-slate-500 font-bold">Manage your digital identity and market presence.</p>
          </motion.div>
          <div className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl flex items-center gap-3 shadow-sm">
             <ShieldCheck className="text-purple-600" />
             <span className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-widest">Verified {user?.role}</span>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-3xl flex items-center gap-4 text-red-600 dark:text-red-400 font-bold">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Avatar Section */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[44px] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-2xl font-black mb-10 flex items-center text-slate-950 dark:text-white">
              <Camera className="w-6 h-6 mr-4 text-purple-600" /> Profile Visuals
            </h3>
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="relative">
                <div className="w-44 h-44 md:w-60 md:h-60 rounded-[48px] p-2 bg-gradient-premium shadow-2xl relative">
                  <div className="w-full h-full rounded-[40px] overflow-hidden bg-white dark:bg-slate-800">
                    <img src={form.avatar} className="w-full h-full object-cover" alt="Profile" />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()} 
                    className="absolute -bottom-4 -right-4 p-5 bg-white dark:bg-slate-800 rounded-[24px] shadow-2xl text-purple-600 hover:scale-110 active:scale-95 transition-all border border-slate-100 dark:border-slate-700"
                  >
                    <Upload className="w-6 h-6" />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
              </div>
              <div className="flex-1 w-full space-y-8">
                <div>
                  <InputLabel required>{isInfluencer ? 'Display Name' : 'Brand Name'}</InputLabel>
                  <input 
                    type="text" 
                    value={form.name} 
                    onChange={(e) => setForm({...form, name: e.target.value})} 
                    placeholder="Enter your name..."
                    className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none text-slate-950 dark:text-white font-bold text-lg shadow-inner" 
                  />
                </div>
                {!isInfluencer && (
                  <div>
                    <InputLabel required>Company Handle</InputLabel>
                    <input 
                      type="text" 
                      value={form.brandName} 
                      onChange={(e) => setForm({...form, brandName: e.target.value})} 
                      placeholder="@company"
                      className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none text-slate-950 dark:text-white font-bold text-lg shadow-inner" 
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="p-8 md:p-12 bg-white dark:bg-slate-900 rounded-[44px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
               <h3 className="text-xl font-black flex items-center text-slate-950 dark:text-white">
                  <Globe className="w-5 h-5 mr-3 text-amber-500" /> Marketplace Scope
               </h3>
               <div className="space-y-6">
                  <div>
                    <InputLabel>Core Niche</InputLabel>
                    <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none text-slate-950 dark:text-white font-bold cursor-pointer shadow-inner">
                      {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <InputLabel>Primary City</InputLabel>
                    <select value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none text-slate-950 dark:text-white font-bold cursor-pointer shadow-inner">
                      {CITIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
               </div>
            </section>

            <section className="p-8 md:p-12 bg-white dark:bg-slate-900 rounded-[44px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
               <h3 className="text-xl font-black flex items-center text-slate-950 dark:text-white">
                  <DollarSign className="w-5 h-5 mr-3 text-green-500" /> Commercials
               </h3>
               <div className="space-y-6">
                  <div>
                    <InputLabel>{isInfluencer ? 'Price per Content (₹)' : 'Avg. Project Budget (₹)'}</InputLabel>
                    <div className="relative">
                      <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="number" 
                        value={isInfluencer ? form.pricePerPost : form.avgCampaignBudget} 
                        onChange={(e) => setForm({...form, [isInfluencer ? 'pricePerPost' : 'avgCampaignBudget']: parseInt(e.target.value)})} 
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none text-slate-950 dark:text-white font-bold text-lg shadow-inner" 
                      />
                    </div>
                  </div>
                  <div>
                    <InputLabel>Followers / Reach</InputLabel>
                    <input 
                      type="number" 
                      value={form.followers} 
                      onChange={(e) => setForm({...form, followers: parseInt(e.target.value)})} 
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none text-slate-950 dark:text-white font-bold shadow-inner" 
                    />
                  </div>
               </div>
            </section>
          </div>

          {/* Bio Section */}
          <section className="p-8 md:p-12 bg-white dark:bg-slate-900 rounded-[44px] border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black flex items-center text-slate-950 dark:text-white">
                <PencilLine className="w-6 h-6 mr-4 text-purple-600" /> Professional Bio
              </h3>
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${bioLength >= BIO_CHAR_LIMIT ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                {bioLength} / {BIO_CHAR_LIMIT}
              </span>
            </div>
            <div className="relative group">
              <textarea 
                value={form.bio || ''} 
                maxLength={BIO_CHAR_LIMIT}
                onChange={(e) => setForm({...form, bio: e.target.value})} 
                className="w-full px-8 py-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[32px] focus:ring-2 focus:ring-purple-600 outline-none text-slate-950 dark:text-white font-bold text-lg leading-relaxed h-64 resize-none transition-all shadow-inner" 
                placeholder={isInfluencer ? "Introduce your content style, audience demographics, and past success stories..." : "Describe your brand's mission, values, and what you look for in long-term partners..."}
              />
              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-b-[32px] overflow-hidden">
                <motion.div 
                  initial={false}
                  animate={{ width: `${bioProgress}%` }}
                  className={`h-full ${bioProgress > 90 ? 'bg-red-500' : 'bg-purple-600'}`}
                />
              </div>
            </div>
          </section>

          {/* Social Presence */}
          <section className="p-8 md:p-12 bg-white dark:bg-slate-900 rounded-[44px] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-2xl font-black mb-10 flex items-center text-slate-950 dark:text-white">
              <Sparkles className="w-6 h-6 mr-4 text-pink-500" /> Verified Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <InputLabel required>{isInfluencer ? 'Instagram Handle' : 'Instagram URL'}</InputLabel>
                <div className="relative">
                  <Instagram className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                  <input 
                    type="text" 
                    placeholder={isInfluencer ? "@username" : "https://instagram.com/..."}
                    value={isInfluencer ? form.instagramHandle : form.instagramUrl} 
                    onChange={(e) => setForm({...form, [isInfluencer ? 'instagramHandle' : 'instagramUrl']: e.target.value})} 
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none text-slate-950 dark:text-white font-bold shadow-inner" 
                  />
                </div>
              </div>
              <div>
                <InputLabel>Twitter (X)</InputLabel>
                <div className="relative">
                  <Twitter className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-950 dark:text-white" />
                  <input 
                    type="url" 
                    placeholder="https://..."
                    value={form.twitterUrl} 
                    onChange={(e) => setForm({...form, twitterUrl: e.target.value})} 
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none text-slate-950 dark:text-white font-bold shadow-inner" 
                  />
                </div>
              </div>
              <div>
                <InputLabel>LinkedIn</InputLabel>
                <div className="relative">
                  <Linkedin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
                  <input 
                    type="url" 
                    placeholder="https://..."
                    value={form.linkedinUrl} 
                    onChange={(e) => setForm({...form, linkedinUrl: e.target.value})} 
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none text-slate-950 dark:text-white font-bold shadow-inner" 
                  />
                </div>
              </div>
            </div>
          </section>
        </form>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 md:p-6 flex justify-center pointer-events-none">
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="w-full max-w-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-[32px] p-4 md:p-5 shadow-2xl flex items-center justify-between gap-4 pointer-events-auto"
        >
          <div className="hidden sm:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Unsaved Changes</p>
          </div>
          <div className="flex gap-3 flex-1 sm:flex-none">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              className="flex-1 sm:flex-none px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white font-black text-sm rounded-[24px] hover:bg-slate-200 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              onClick={() => handleSubmit()}
              disabled={isSaving}
              className="flex-1 sm:flex-none px-10 py-4 bg-gradient-premium text-white font-black text-sm rounded-[24px] shadow-lg shadow-purple-500/20 active-scale flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSaving ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {isSaving ? 'Syncing...' : 'Save & Exit'}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Cropper Modal */}
      <AnimatePresence>
        {imageSrc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-xl aspect-square bg-white dark:bg-slate-900 rounded-[44px] overflow-hidden flex flex-col shadow-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex-1 relative bg-slate-900">
                <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} cropShape="round" showGrid={false} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
              </div>
              <div className="p-8 space-y-6 bg-white dark:bg-slate-900">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Adjust Crop</span>
                    <span className="text-xs font-black text-purple-600">{Math.round(zoom * 100)}%</span>
                  </div>
                  <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full accent-purple-600" />
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setImageSrc(null)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black rounded-2xl">Cancel</button>
                  <button type="button" onClick={getCroppedImg} className="flex-1 py-4 bg-gradient-premium text-white font-black rounded-2xl active-scale">Apply Crop</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
