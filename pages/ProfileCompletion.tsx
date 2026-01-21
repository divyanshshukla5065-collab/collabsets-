
import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Instagram, MapPin, DollarSign, Camera, Check, Briefcase, Globe, Info, RefreshCw, Upload, X } from 'lucide-react';
import { CATEGORIES, CITIES } from '../constants';
import Cropper from 'react-easy-crop';

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
];

export const ProfileCompletion: React.FC = () => {
  const { user, completeProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const isInfluencer = user?.role === 'Influencer';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<any>(isInfluencer ? {
    avatar: PRESET_AVATARS[0],
    instagramHandle: '',
    followers: 0,
    avgViews: 0,
    category: 'Fashion & Lifestyle',
    city: 'Mumbai',
    gender: 'Female',
    age: 21,
    pricePerPost: 5000,
    linkedinUrl: '',
    bio: ''
  } : {
    avatar: PRESET_AVATARS[0],
    brandName: '',
    category: 'Food & Dining',
    city: 'Mumbai',
    website: '',
    avgCampaignBudget: 50000,
    logo: ''
  });

  // Cropping State
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

    // Draw the circular cropped image
    ctx.beginPath();
    ctx.arc(200, 200, 200, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      400,
      400
    );

    const base64Image = canvas.toDataURL('image/jpeg');
    setForm({ ...form, avatar: base64Image });
    setImageSrc(null);
  };

  const handleFetchInsta = () => {
    setLoading(true);
    setTimeout(() => {
      setForm({
        ...form,
        followers: Math.floor(Math.random() * 50000) + 10000,
        avgViews: Math.floor(Math.random() * 5000) + 1000,
      });
      setLoading(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeProfile(form);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black dark:text-white mb-2 leading-tight">Identity & Profile</h1>
            <p className="text-slate-500 font-medium">Create a strong first impression for premium brand deals.</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-purple-600">85% Complete</span>
          </div>
        </div>
        <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div initial={{ width: '40%' }} animate={{ width: '85%' }} className="h-full bg-gradient-premium rounded-full" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Avatar Selection Section */}
        <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-2xl font-black mb-8 flex items-center dark:text-white">
            <Camera className="w-6 h-6 mr-3 text-purple-600" /> Choose Profile Picture
          </h3>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="relative group">
               <div className="w-40 h-40 md:w-56 md:h-56 rounded-full p-2 bg-gradient-premium shadow-2xl transition-transform group-hover:scale-105">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-slate-800 relative">
                    <img src={form.avatar} className="w-full h-full object-cover" alt="Avatar Preview" />
                  </div>
               </div>
               <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-4 right-4 p-4 bg-white dark:bg-slate-800 rounded-full shadow-xl text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors z-20"
               >
                 <Upload className="w-6 h-6" />
               </button>
               <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            <div className="flex-1 w-full">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Quick Presets</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {PRESET_AVATARS.map((p, idx) => (
                  <button 
                    key={idx} 
                    type="button"
                    onClick={() => setForm({ ...form, avatar: p })}
                    className={`relative rounded-2xl overflow-hidden aspect-square border-4 transition-all ${form.avatar === p ? 'border-purple-600 scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={p} className="w-full h-full object-cover" />
                    {form.avatar === p && (
                      <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center text-white">
                        <Check className="w-6 h-6" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="mt-8 text-sm text-slate-500 font-medium leading-relaxed">
                Professional portraits increase engagement by up to 40%. You can use one of our high-quality presets or upload your own custom photo.
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm h-full">
              <h3 className="text-xl font-bold mb-6 flex items-center dark:text-white">
                <Briefcase className="w-5 h-5 mr-3 text-purple-600" /> Basic Details
              </h3>
              
              <div className="space-y-4">
                {isInfluencer ? (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase mb-2">Instagram Handle</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="@username"
                            required
                            value={form.instagramHandle}
                            onChange={(e) => setForm({...form, instagramHandle: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none dark:text-white font-medium" 
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={handleFetchInsta}
                          className="px-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                        >
                          {loading ? '...' : <RefreshCw className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase mb-2">Brand Name</label>
                      <input 
                        type="text" 
                        required
                        value={form.brandName}
                        onChange={(e) => setForm({...form, brandName: e.target.value})}
                        className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none dark:text-white font-medium" 
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase mb-2">Primary Niche</label>
                  <select 
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                    className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none dark:text-white font-medium"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase mb-2">Home City</label>
                  <select 
                    value={form.city}
                    onChange={(e) => setForm({...form, city: e.target.value})}
                    className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none dark:text-white font-medium"
                  >
                    {CITIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm h-full">
              <h3 className="text-xl font-bold mb-6 flex items-center dark:text-white">
                <DollarSign className="w-5 h-5 mr-3 text-amber-500" /> Commercials
              </h3>
              
              <div className="space-y-4">
                {isInfluencer ? (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase mb-2">Avg Price Per Post (₹ INR)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                        <input 
                          type="number" 
                          required
                          value={form.pricePerPost}
                          onChange={(e) => setForm({...form, pricePerPost: parseInt(e.target.value)})}
                          className="w-full pl-8 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none dark:text-white font-medium" 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-sm font-bold text-slate-400 uppercase mb-2">Followers</label>
                          <input type="number" readOnly value={form.followers} className="w-full px-4 py-4 bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl dark:text-slate-400 outline-none font-bold" />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-slate-400 uppercase mb-2">Avg Views</label>
                          <input type="number" readOnly value={form.avgViews} className="w-full px-4 py-4 bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl dark:text-slate-400 outline-none font-bold" />
                       </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase mb-2">Campaign Budget (₹ INR)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                        <input 
                          type="number" 
                          required
                          value={form.avgCampaignBudget}
                          onChange={(e) => setForm({...form, avgCampaignBudget: parseInt(e.target.value)})}
                          className="w-full pl-8 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none dark:text-white font-medium" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase mb-2">Official Website</label>
                      <input 
                        type="url" 
                        placeholder="https://..."
                        value={form.website}
                        onChange={(e) => setForm({...form, website: e.target.value})}
                        className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none dark:text-white font-medium" 
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full py-8 bg-gradient-premium text-white font-black text-2xl rounded-3xl shadow-2xl hover:scale-[1.01] active:scale-95 transition-all">
          Save Profile & Access Marketplace
        </button>
      </form>

      {/* Cropping Modal */}
      <AnimatePresence>
        {imageSrc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xl aspect-square bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="flex-1 relative bg-slate-200 dark:bg-slate-800">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="p-8 space-y-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black dark:text-white uppercase tracking-widest">Adjust Zoom</span>
                    <span className="text-xs font-bold text-purple-600">{(zoom * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e: any) => setZoom(e.target.value)}
                    className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setImageSrc(null)}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 dark:text-white font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={getCroppedImg}
                    className="flex-1 py-4 bg-gradient-premium text-white font-bold rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Apply Crop
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
