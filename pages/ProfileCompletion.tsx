
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  Instagram, DollarSign, Camera, Check, 
  Briefcase, Globe, RefreshCw, Upload, 
  Sparkles, AlertCircle, PencilLine,
  ArrowRight, Save, Link as LinkIcon, User as UserIcon, Calendar
} from 'lucide-react';
import { CATEGORIES, CITIES } from '../constants';
import Cropper from 'react-easy-crop';
import { DriftLoader } from '../components/DriftLoader';
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
  <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
    {children}
    {required && <span className="text-red-500 text-xs font-bold">*</span>}
  </label>
);

export const ProfileCompletion: React.FC = () => {
  const { user, completeProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInfluencer = user?.role === 'Influencer';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<any>(isInfluencer ? {
    avatar: PRESET_AVATARS[0],
    name: user?.name || '',
    instagramHandle: '',
    twitterUrl: '',
    linkedinUrl: '',
    followers: 0,
    avgViews: 0,
    category: 'Fashion & Lifestyle',
    city: 'Mumbai',
    gender: 'Female',
    age: 21,
    pricePerPost: 5000,
    bio: ''
  } : {
    avatar: PRESET_AVATARS[0],
    brandName: '',
    category: 'Food & Dining',
    city: 'Mumbai',
    website: '',
    instagramUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    avgCampaignBudget: 50000,
    logo: '',
    bio: ''
  });

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

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

  const handleFetchStats = () => {
    if (!form.instagramHandle.trim()) {
      setError("Enter your handle first.");
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setForm({
        ...form,
        followers: Math.floor(Math.random() * 50000) + 10000,
        avgViews: Math.floor(Math.random() * 5000) + 1000,
      });
      setLoading(false);
    }, 1500);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    const instaValue = isInfluencer ? form.instagramHandle : form.instagramUrl;
    if (!instaValue || !instaValue.trim()) {
      setError(isInfluencer ? "Instagram handle is required." : "Brand Instagram URL is required.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setIsSaving(true);
    try {
      await completeProfile(form);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to save profile.");
      setIsSaving(false);
    }
  };

  const bioProgress = ((form.bio?.length || 0) / BIO_CHAR_LIMIT) * 100;

  if (isInitialLoading) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-950">
        <DriftLoader size="lg" />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-16 text-slate-500 font-black uppercase tracking-[0.5em] text-sm text-center">Syncing with network...</motion.p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-20 lg:py-32 pb-48">
      <div className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl lg:text-7xl font-black text-slate-950 dark:text-white mb-4 leading-none tracking-tighter uppercase">Setup Your Profile</h1>
          <p className="text-xl text-slate-500 font-bold">This information helps brands and creators find you in the marketplace.</p>
        </div>
        <div className="flex flex-col items-end gap-4">
          <span className="text-5xl font-black text-purple-600">Final Step</span>
          <div className="w-64 h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
             <motion.div initial={{ width: '50%' }} animate={{ width: '100%' }} className="h-full bg-gradient-premium rounded-full" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-12 p-8 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-[32px] flex items-center gap-6 text-red-600 dark:text-red-400 font-bold shadow-2xl">
            <AlertCircle className="w-8 h-8 flex-shrink-0" />
            <span className="text-lg">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-16">
        {/* Profile Picture Desktop Wide */}
        <section className="bg-white dark:bg-slate-900 p-12 lg:p-20 rounded-[80px] border border-slate-100 dark:border-slate-800 shadow-xl">
          <h3 className="text-3xl font-black mb-16 flex items-center text-slate-950 dark:text-white uppercase tracking-tighter">
            <Camera className="w-8 h-8 mr-6 text-purple-600" /> 1. Select Profile Picture
          </h3>

          <div className="flex flex-col xl:flex-row items-center gap-20">
            <div className="relative group shrink-0">
               <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-[64px] p-2 bg-gradient-premium shadow-3xl transition-transform duration-700 group-hover:scale-105">
                  <div className="w-full h-full rounded-[56px] overflow-hidden bg-white dark:bg-slate-800 relative">
                    <img src={form.avatar} className="w-full h-full object-cover" alt="Preview" />
                  </div>
               </div>
               <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute -bottom-6 -right-6 p-8 bg-white dark:bg-slate-800 rounded-[36px] shadow-3xl text-purple-600 border border-slate-100 dark:border-slate-700 hover:scale-110 active:scale-90 transition-all z-20">
                 <Upload className="w-8 h-8" />
               </button>
               <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            <div className="flex-1 w-full space-y-10">
              <InputLabel>Or use a preset</InputLabel>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                {PRESET_AVATARS.map((p, idx) => (
                  <button key={idx} type="button" onClick={() => setForm({ ...form, avatar: p })} className={`relative rounded-[28px] overflow-hidden aspect-square border-[6px] transition-all duration-500 ${form.avatar === p ? 'border-purple-600 scale-110 shadow-2xl' : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'}`}>
                    <img src={p} className="w-full h-full object-cover" alt="Preset" />
                  </button>
                ))}
              </div>
              <p className="text-lg text-slate-500 font-bold leading-relaxed max-w-2xl">
                A professional headshot significantly increases your visibility to partners. 1:1 aspect ratio is recommended.
              </p>
            </div>
          </div>
        </section>

        {/* Info Grid Desktop Two Columns */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-10 p-12 lg:p-16 bg-white dark:bg-slate-900 rounded-[64px] border border-slate-100 dark:border-slate-800 shadow-xl">
              <h3 className="text-2xl font-black flex items-center text-slate-950 dark:text-white uppercase tracking-tighter mb-4">
                <Briefcase className="w-7 h-7 mr-5 text-purple-600" /> Core Details
              </h3>
              
              <div className="space-y-10">
                <div>
                  <InputLabel required>{isInfluencer ? 'Full Name' : 'Brand Name'}</InputLabel>
                  <div className="relative">
                    <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-400" />
                    <input 
                      type="text" 
                      placeholder={isInfluencer ? "e.g. John Doe" : "e.g. Nike"}
                      required
                      value={isInfluencer ? form.name : form.brandName}
                      onChange={(e) => setForm({...form, [isInfluencer ? 'name' : 'brandName']: e.target.value})}
                      className="w-full pl-16 pr-6 py-6 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl focus:ring-4 focus:ring-purple-600/10 outline-none text-slate-950 dark:text-white font-bold text-lg shadow-inner" 
                    />
                  </div>
                </div>

                <div>
                  <InputLabel required>{isInfluencer ? 'Instagram Handle' : 'Instagram URL'}</InputLabel>
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-pink-500" />
                      <input 
                        type="text" 
                        placeholder={isInfluencer ? "@username" : "https://..."}
                        required
                        value={isInfluencer ? form.instagramHandle : form.instagramUrl}
                        onChange={(e) => setForm({...form, [isInfluencer ? 'instagramHandle' : 'instagramUrl']: e.target.value})}
                        className="w-full pl-16 pr-6 py-6 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl focus:ring-4 focus:ring-purple-600/10 outline-none text-slate-950 dark:text-white font-bold text-lg shadow-inner" 
                      />
                    </div>
                    {isInfluencer && (
                      <button type="button" onClick={handleFetchStats} className="px-8 bg-slate-100 dark:bg-slate-800 rounded-3xl text-slate-600 hover:bg-slate-200 transition-all active:scale-95 shadow-md">
                        {loading ? <RefreshCw className="w-7 h-7 animate-spin" /> : <RefreshCw className="w-7 h-7" />}
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <InputLabel>Niche</InputLabel>
                      <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl focus:ring-4 focus:ring-purple-600/10 outline-none text-slate-950 dark:text-white font-black cursor-pointer shadow-inner">
                        {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                   </div>
                   <div>
                      <InputLabel>City</InputLabel>
                      <select value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl focus:ring-4 focus:ring-purple-600/10 outline-none text-slate-950 dark:text-white font-black cursor-pointer shadow-inner">
                        {CITIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                   </div>
                </div>
              </div>
          </div>

          <div className="space-y-10 p-12 lg:p-16 bg-white dark:bg-slate-900 rounded-[64px] border border-slate-100 dark:border-slate-800 shadow-xl">
              <h3 className="text-2xl font-black flex items-center text-slate-950 dark:text-white uppercase tracking-tighter mb-4">
                <Globe className="w-7 h-7 mr-5 text-amber-500" /> Commercials
              </h3>
              
              <div className="space-y-10">
                <div>
                   <InputLabel>{isInfluencer ? 'Price per Post (₹)' : 'Campaign Budget (₹)'}</InputLabel>
                   <div className="relative">
                     <span className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 font-black text-2xl">₹</span>
                     <input 
                       type="number" 
                       required
                       value={isInfluencer ? form.pricePerPost : form.avgCampaignBudget}
                       onChange={(e) => setForm({...form, [isInfluencer ? 'pricePerPost' : 'avgCampaignBudget']: parseInt(e.target.value)})}
                       className="w-full pl-16 pr-8 py-7 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl focus:ring-4 focus:ring-purple-600/10 outline-none text-slate-950 dark:text-white font-black text-3xl shadow-inner" 
                     />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {isInfluencer ? (
                     <>
                        <div>
                          <InputLabel>Followers</InputLabel>
                          <input type="number" readOnly value={form.followers} className="w-full px-8 py-6 bg-slate-100 dark:bg-slate-800/50 border-none rounded-3xl text-slate-400 font-black text-xl outline-none" />
                        </div>
                        <div>
                          <InputLabel>Avg Views</InputLabel>
                          <input type="number" readOnly value={form.avgViews} className="w-full px-8 py-6 bg-slate-100 dark:bg-slate-800/50 border-none rounded-3xl text-slate-400 font-black text-xl outline-none" />
                        </div>
                     </>
                   ) : (
                     <div className="md:col-span-2">
                        <InputLabel>Brand Website</InputLabel>
                        <div className="relative">
                          <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                          <input 
                            type="url" 
                            placeholder="https://..."
                            value={form.website}
                            onChange={(e) => setForm({...form, website: e.target.value})}
                            className="w-full pl-16 pr-6 py-6 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl focus:ring-4 focus:ring-purple-600/10 outline-none text-slate-950 dark:text-white font-bold text-lg shadow-inner" 
                          />
                        </div>
                     </div>
                   )}
                </div>

                <div>
                   <InputLabel>Professional Bio</InputLabel>
                   <div className="relative group">
                      <textarea 
                        rows={5}
                        maxLength={BIO_CHAR_LIMIT}
                        value={form.bio || ''}
                        onChange={(e) => setForm({...form, bio: e.target.value})}
                        className="w-full px-8 py-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[40px] focus:ring-4 focus:ring-purple-600/10 outline-none text-slate-950 dark:text-white font-bold text-lg resize-none h-48 transition-all shadow-inner leading-relaxed"
                        placeholder={isInfluencer ? "Tell brands why they should work with you..." : "Share your brand's vision and target goals..."}
                      />
                      <div className="absolute bottom-6 right-8 text-slate-400 font-black text-xs uppercase tracking-widest bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-md border border-slate-100 dark:border-slate-800">
                        {form.bio?.length || 0} / {BIO_CHAR_LIMIT}
                      </div>
                   </div>
                </div>
              </div>
          </div>
        </div>

        {/* Action Button - Desktop Fixed Center */}
        <div className="flex justify-center pt-10">
          <button 
            type="submit"
            disabled={isSaving}
            className="group px-24 py-8 bg-gradient-premium text-white font-black text-2xl rounded-[40px] shadow-[0_40px_100px_-20px_rgba(124,58,237,0.5)] active:scale-95 flex items-center justify-center gap-6 disabled:opacity-50 transition-all hover:scale-105"
          >
            {isSaving ? <RefreshCw size={32} className="animate-spin" /> : <Save size={32} />}
            {isSaving ? 'Saving...' : 'Finalize & Launch'}
            {!isSaving && <ArrowRight size={32} className="ml-4 group-hover:translate-x-2 transition-transform" />}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {imageSrc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/95 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-2xl aspect-square bg-white dark:bg-slate-900 rounded-[64px] overflow-hidden flex flex-col shadow-3xl">
              <div className="flex-1 relative bg-black">
                <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} cropShape="round" showGrid={false} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
              </div>
              <div className="p-12 space-y-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <div className="flex gap-6">
                  <button type="button" onClick={() => setImageSrc(null)} className="flex-1 py-6 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-xl rounded-3xl active:scale-95 transition-all">Discard</button>
                  <button type="button" onClick={getCroppedImg} className="flex-1 py-6 bg-gradient-premium text-white font-black text-xl rounded-3xl shadow-2xl active-scale transition-all hover:scale-105">Apply Crop</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
