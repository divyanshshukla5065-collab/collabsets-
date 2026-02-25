import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, ChevronRight, ChevronLeft, Check, 
  Zap, Package, Users, DollarSign, Target, 
  FileText, ArrowRight, Save, Trash2, Edit3,
  Calendar, Smartphone, Video, Image as ImageIcon,
  MessageCircle, BarChart3, ShieldCheck, PartyPopper,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { DeliverableType } from '../types';
import { SuccessBloom } from '../components/SuccessBloom';

const STEPS = [
  { id: 1, title: 'Concept', icon: <Rocket size={18} /> },
  { id: 2, title: 'Tasks', icon: <Video size={18} /> },
  { id: 3, title: 'Talent', icon: <Users size={18} /> },
  { id: 4, title: 'Narrative', icon: <FileText size={18} /> },
  { id: 5, title: 'Manifest', icon: <Zap size={18} /> }
];

export const CreateCampaign: React.FC = () => {
  const { user, createCampaign } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isManifested, setIsManifested] = useState(false);

  const [form, setForm] = useState({
    name: '',
    type: 'Paid' as 'Paid' | 'Barter',
    deliverables: [] as DeliverableType[],
    creatorCount: 5,
    minFollowers: 10000,
    budget: 399,
    niche: 'Fashion & Lifestyle',
    description: '',
    targetAge: '18-24',
    targetGender: 'All'
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const toggleDeliverable = (type: DeliverableType) => {
    setForm(prev => ({
      ...prev,
      deliverables: prev.deliverables.includes(type) 
        ? prev.deliverables.filter(d => d !== type)
        : [...prev.deliverables, type]
    }));
  };

  const handleManifest = async () => {
    setIsSubmitting(true);
    try {
      await createCampaign(form);
      setIsManifested(true);
      // We don't navigate immediately anymore, we show the success UI
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const canProgress = () => {
    if (currentStep === 1) return form.name.trim().length > 3;
    if (currentStep === 2) return form.deliverables.length > 0;
    if (currentStep === 4) return form.description.length > 20;
    return true;
  };

  if (isManifested) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        <SuccessBloom isVisible={true} />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-[64px] p-12 md:p-20 text-center shadow-3xl border border-slate-100 dark:border-slate-800 relative z-10"
        >
          <div className="w-24 h-24 bg-gradient-premium rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl">
            <PartyPopper size={48} className="text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-950 dark:text-white uppercase tracking-tighter mb-6 leading-tight">
            Congratulations!
          </h1>
          
          <div className="space-y-6 mb-12">
            <p className="text-xl text-slate-600 dark:text-slate-300 font-bold leading-relaxed">
              Your campaign <span className="text-purple-600">"{form.name}"</span> has been manifested successfully.
            </p>
            
            <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-[32px] border border-amber-100 dark:border-amber-800 flex items-start gap-4 text-left">
              <ShieldCheck className="text-amber-600 shrink-0 mt-1" size={24} />
              <div>
                <p className="text-sm font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-1">Approval Protocol</p>
                <p className="text-xs font-bold text-amber-600/80 dark:text-amber-300/80 leading-relaxed">
                  To maintain network integrity, your campaign will go live in the marketplace once it is reviewed and approved by our Administrative Team.
                </p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-6 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-[28px] font-black text-lg uppercase tracking-widest active-scale shadow-2xl flex items-center justify-center gap-4 group"
          >
            <LayoutDashboard size={20} /> Return to Dashboard
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-32">
      <div className="max-w-4xl mx-auto px-6 pt-24 md:pt-32">
        
        {/* Modern Stepper */}
        <div className="mb-16">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
            <motion.div 
              className="absolute top-1/2 left-0 h-0.5 bg-purple-600 -translate-y-1/2 z-0"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
            
            {STEPS.map((step) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                  currentStep >= step.id 
                  ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/20' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                }`}>
                  {currentStep > step.id ? <Check size={18} /> : step.icon}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${currentStep >= step.id ? 'text-slate-950 dark:text-white' : 'text-slate-400'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Sections */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white uppercase tracking-tighter mb-4">The Campaign Concept</h1>
                <p className="text-slate-500 font-bold">Start with a strong identity for your collaboration.</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-10 rounded-[44px] border border-slate-100 dark:border-slate-800 shadow-xl space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Campaign Moniker</label>
                  <input 
                    type="text" placeholder="e.g. Summer Launch 2025" 
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl focus:ring-4 focus:ring-purple-600/10 outline-none text-slate-950 dark:text-white font-bold text-xl shadow-inner"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Collaboration Model</label>
                  <div className="grid grid-cols-2 gap-6">
                     <button 
                      onClick={() => setForm({...form, type: 'Paid'})}
                      className={`p-8 rounded-[32px] border-4 transition-all flex flex-col items-center gap-4 ${form.type === 'Paid' ? 'border-purple-600 bg-purple-50/30 dark:bg-purple-900/10' : 'border-slate-50 dark:border-slate-800 opacity-60 hover:opacity-100'}`}
                     >
                       <div className={`p-4 rounded-2xl ${form.type === 'Paid' ? 'bg-purple-600 text-white shadow-xl' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                         <DollarSign size={24} />
                       </div>
                       <div className="text-center">
                         <h3 className="font-black text-slate-950 dark:text-white uppercase tracking-widest text-xs">Commercial Paid</h3>
                         <p className="text-[9px] text-slate-500 font-bold mt-1">Direct monetary compensation</p>
                       </div>
                     </button>
                     <button 
                      onClick={() => setForm({...form, type: 'Barter'})}
                      className={`p-8 rounded-[32px] border-4 transition-all flex flex-col items-center gap-4 ${form.type === 'Barter' ? 'border-amber-500 bg-amber-50/30 dark:bg-amber-900/10' : 'border-slate-50 dark:border-slate-800 opacity-60 hover:opacity-100'}`}
                     >
                       <div className={`p-4 rounded-2xl ${form.type === 'Barter' ? 'bg-amber-500 text-white shadow-xl' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                         <Package size={24} />
                       </div>
                       <div className="text-center">
                         <h3 className="font-black text-slate-950 dark:text-white uppercase tracking-widest text-xs">Product Barter</h3>
                         <p className="text-[9px] text-slate-500 font-bold mt-1">Product exchange for content</p>
                       </div>
                     </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white uppercase tracking-tighter mb-4">Required Assets</h1>
                <p className="text-slate-500 font-bold">Select what the influencer needs to manifest.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DeliverableCard 
                  type="Reel" icon={<Video size={32} />} 
                  description="High-engagement short video" 
                  selected={form.deliverables.includes('Reel')} 
                  onClick={() => toggleDeliverable('Reel')} 
                />
                <DeliverableCard 
                  type="Post" icon={<ImageIcon size={32} />} 
                  description="Static image or carousel" 
                  selected={form.deliverables.includes('Post')} 
                  onClick={() => toggleDeliverable('Post')} 
                />
                <DeliverableCard 
                  type="Story" icon={<Smartphone size={32} />} 
                  description="24-hour temporary insight" 
                  selected={form.deliverables.includes('Story')} 
                  onClick={() => toggleDeliverable('Story')} 
                />
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white uppercase tracking-tighter mb-4">Talent Profile</h1>
                <p className="text-slate-500 font-bold">Define your ideal creator specifications.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white dark:bg-slate-900 p-8 rounded-[44px] border border-slate-100 dark:border-slate-800 shadow-xl space-y-8">
                    <div className="space-y-3">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Target Niche</label>
                       <select value={form.niche} onChange={e => setForm({...form, niche: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none text-slate-950 dark:text-white font-black text-xs uppercase tracking-widest">
                         {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Creator Count</label>
                       <div className="flex items-center gap-4">
                          <input type="range" min="1" max="100" value={form.creatorCount} onChange={e => setForm({...form, creatorCount: parseInt(e.target.value)})} className="flex-1 accent-purple-600" />
                          <span className="w-12 text-center font-black text-purple-600">{form.creatorCount}</span>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Min Followers</label>
                       <input type="number" value={form.minFollowers} onChange={e => setForm({...form, minFollowers: parseInt(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-slate-950 dark:text-white" />
                    </div>
                 </div>

                 <div className="bg-white dark:bg-slate-900 p-8 rounded-[44px] border border-slate-100 dark:border-slate-800 shadow-xl space-y-8">
                    <div className="space-y-3">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Campaign Budget (INR)</label>
                       <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                          <input 
                            type="number" min="399" value={form.budget} onChange={e => setForm({...form, budget: Math.max(399, parseInt(e.target.value))})}
                            className="w-full pl-12 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none text-slate-950 dark:text-white font-black text-2xl shadow-inner"
                          />
                       </div>
                       <p className="text-[8px] font-black text-purple-600 uppercase tracking-widest px-1">Min required: ₹399</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-3">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Target Age</label>
                          <select value={form.targetAge} onChange={e => setForm({...form, targetAge: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl font-bold text-xs">
                             <option>13-17</option><option>18-24</option><option>25-34</option><option>35+</option>
                          </select>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Target Gender</label>
                          <select value={form.targetGender} onChange={e => setForm({...form, targetGender: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl font-bold text-xs">
                             <option>All</option><option>Male</option><option>Female</option>
                          </select>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white uppercase tracking-tighter mb-4">The Narrative</h1>
                <p className="text-slate-500 font-bold">Provide the brief and specific campaign details.</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-10 rounded-[44px] border border-slate-100 dark:border-slate-800 shadow-xl">
                 <textarea 
                  rows={8} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="What is the goal? What are the key talking points? Be as descriptive as possible..."
                  className="w-full p-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[32px] outline-none focus:ring-4 focus:ring-purple-600/10 text-slate-950 dark:text-white font-medium text-lg resize-none shadow-inner leading-relaxed"
                 />
                 <div className="mt-6 flex justify-between items-center px-4">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Min 20 characters</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${form.description.length >= 20 ? 'text-green-500' : 'text-slate-400'}`}>
                      {form.description.length} Chars
                    </span>
                 </div>
              </div>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white uppercase tracking-tighter mb-4">Review Manifest</h1>
                <p className="text-slate-500 font-bold">Verification of campaign protocol before broadcast.</p>
              </div>

              <div className="bg-slate-950 text-white rounded-[48px] p-10 md:p-16 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12"><Rocket size={200} /></div>
                 
                 <div className="flex justify-between items-start mb-12 relative z-10">
                    <div>
                       <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">{form.name}</h2>
                       <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-purple-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{form.type}</span>
                          <span className="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest">{form.niche}</span>
                       </div>
                    </div>
                    <button onClick={() => setCurrentStep(1)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"><Edit3 size={18} /></button>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 relative z-10">
                    <SummaryItem label="Budget" value={`₹${form.budget}`} icon={<DollarSign size={14} />} />
                    <SummaryItem label="Talent" value={`${form.creatorCount} Creators`} icon={<Users size={14} />} />
                    <SummaryItem label="Deliverables" value={form.deliverables.join(', ')} icon={<Video size={14} />} />
                    <SummaryItem label="Target" value={`${form.targetAge} ${form.targetGender}`} icon={<Target size={14} />} />
                 </div>

                 <div className="space-y-4 relative z-10 mb-16">
                    <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Narrative Protocol</p>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed italic line-clamp-4">"{form.description}"</p>
                 </div>

                 <button 
                  onClick={handleManifest} disabled={isSubmitting}
                  className="w-full py-6 bg-white text-slate-950 rounded-[28px] font-black text-lg uppercase tracking-widest active-scale shadow-2xl flex items-center justify-center gap-4"
                 >
                   {isSubmitting ? <RefreshCw className="animate-spin" /> : <><ShieldCheck /> Manifest Campaign</>}
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="mt-12 flex items-center justify-between">
           {currentStep > 1 ? (
             <button onClick={prevStep} className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest active-scale flex items-center gap-3">
               <ChevronLeft size={16} /> Retreat
             </button>
           ) : <div />}

           {currentStep < 5 && (
             <button 
              disabled={!canProgress()}
              onClick={nextStep} 
              className="px-12 py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] active-scale shadow-xl disabled:opacity-30 flex items-center gap-3"
             >
               Proceed Protocol <ChevronRight size={18} />
             </button>
           )}
        </div>

      </div>
    </div>
  );
};

const DeliverableCard = ({ type, icon, description, selected, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`p-10 rounded-[40px] border-4 transition-all flex flex-col items-center text-center gap-6 relative group ${
      selected 
      ? 'border-purple-600 bg-white dark:bg-slate-900 shadow-2xl scale-105' 
      : 'border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 opacity-60 hover:opacity-100'
    }`}
  >
    {selected && (
      <div className="absolute top-6 right-6 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg animate-soft-bounce">
        <Check size={16} />
      </div>
    )}
    <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center transition-all ${
      selected ? 'bg-purple-600 text-white shadow-xl' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
    }`}>
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter mb-1">{type}</h3>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{description}</p>
    </div>
  </button>
);

const SummaryItem = ({ label, value, icon }: any) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-purple-400">
      {icon}
      <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-sm font-black text-white truncate">{value}</p>
  </div>
);

const RefreshCw = ({ className }: { className?: string }) => (
  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
  </motion.div>
);
