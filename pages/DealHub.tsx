
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Camera, Edit3, Upload, CheckCircle, 
  CreditCard, ShieldCheck, Globe, Link as LinkIcon,
  Clock, ArrowRight, Zap, Info, DollarSign
} from 'lucide-react';
import { ProjectStatus, PaymentStatus } from '../types';

const PROJECT_STEPS: { key: ProjectStatus; label: string; icon: any }[] = [
  { key: 'DEAL_SIGNED', label: 'Deal Signed', icon: <ShieldCheck size={18} /> },
  { key: 'SHOOTING', label: 'Shooting', icon: <Camera size={18} /> },
  { key: 'EDITING', label: 'Editing', icon: <Edit3 size={18} /> },
  { key: 'UPLOADING', label: 'Uploading', icon: <Upload size={18} /> },
  { key: 'COMPLETED', label: 'Completed', icon: <CheckCircle size={18} /> },
];

const PAYMENT_STEPS: { key: PaymentStatus; label: string; icon: any }[] = [
  { key: 'AWAITING_BRAND', label: 'Awaiting Brand', icon: <Clock size={18} /> },
  { key: 'HELD_IN_ESCROW', label: 'Held by Collabset', icon: <ShieldCheck size={18} /> },
  { key: 'RELEASED', label: 'Funds Released', icon: <CheckCircle size={18} /> },
];

export const DealHub: React.FC = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const { deals, user, updateDealStatus, updatePaymentStatus } = useAuth();
  const navigate = useNavigate();
  const [workLink, setWorkLink] = useState('');

  const deal = useMemo(() => deals.find(d => d.id === dealId), [deals, dealId]);
  
  if (!deal) return null;

  const isInfluencer = user?.id === deal.influencerId;
  const isBrand = user?.id === deal.brandId;

  const currentStepIndex = PROJECT_STEPS.findIndex(s => s.key === deal.projectStatus);
  const currentPayStepIndex = PAYMENT_STEPS.findIndex(s => s.key === deal.paymentStatus);

  const handleNextStep = () => {
    if (currentStepIndex < PROJECT_STEPS.length - 1) {
      updateDealStatus(deal.id, PROJECT_STEPS[currentStepIndex + 1].key, workLink);
    }
  };

  const handlePay = () => {
    if (isBrand && deal.paymentStatus === 'AWAITING_BRAND') {
      updatePaymentStatus(deal.id, 'HELD_IN_ESCROW');
    } else if (isBrand && deal.paymentStatus === 'HELD_IN_ESCROW' && deal.projectStatus === 'COMPLETED') {
      updatePaymentStatus(deal.id, 'RELEASED');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest mb-10 group transition-colors">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-[44px] p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Zap size={200} className="text-purple-600" />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 relative z-10">
            <div>
              <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em] mb-2">Collaboration Agreement</p>
              <h1 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">
                {isInfluencer ? deal.brandName : deal.influencerName} <span className="text-slate-300 dark:text-slate-700">/</span> Mission
              </h1>
            </div>
            <div className="bg-slate-950 text-white px-8 py-5 rounded-3xl text-center shadow-xl">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contract Value</p>
               <p className="text-3xl font-black">₹{deal.amount.toLocaleString()}</p>
            </div>
          </div>

          {/* Amazon-Style Project Map */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-black text-slate-950 dark:text-white uppercase tracking-tight flex items-center gap-2">
                 <Globe size={20} className="text-purple-600" /> Project Milestone Map
               </h3>
               <span className="text-[10px] font-black bg-purple-100 dark:bg-purple-900/30 text-purple-600 px-3 py-1 rounded-full uppercase">Live Sync</span>
            </div>

            <div className="relative">
               <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 rounded-full" />
               <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(currentStepIndex / (PROJECT_STEPS.length - 1)) * 100}%` }}
                className="absolute top-1/2 left-0 h-1 bg-gradient-premium -translate-y-1/2 rounded-full" 
               />
               
               <div className="relative flex justify-between">
                 {PROJECT_STEPS.map((step, idx) => {
                   const isActive = idx <= currentStepIndex;
                   const isCurrent = idx === currentStepIndex;
                   return (
                     <div key={step.key} className="flex flex-col items-center gap-3">
                        <motion.div 
                          animate={{ scale: isCurrent ? 1.2 : 1, rotate: isCurrent ? [0, 5, -5, 0] : 0 }}
                          transition={{ repeat: isCurrent ? Infinity : 0, duration: 4 }}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 transition-all duration-500 z-10 ${
                            isActive 
                            ? 'bg-slate-950 border-purple-500 text-white shadow-lg shadow-purple-500/20' 
                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-700'
                          }`}
                        >
                          {step.icon}
                        </motion.div>
                        <p className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                          {step.label}
                        </p>
                     </div>
                   );
                 })}
               </div>
            </div>
          </div>

          {/* Influencer Controls */}
          {isInfluencer && deal.projectStatus !== 'COMPLETED' && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-700">
               <div className="flex flex-col md:flex-row items-end gap-6">
                  <div className="flex-1 w-full">
                     <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Submission Link (Optional)</label>
                     <input 
                      type="url" 
                      value={workLink}
                      onChange={(e) => setWorkLink(e.target.value)}
                      placeholder="https://instagram.com/reel/..."
                      className="w-full px-6 py-4 bg-white dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none text-slate-950 dark:text-white font-bold"
                     />
                  </div>
                  <button 
                    onClick={handleNextStep}
                    className="w-full md:w-auto px-10 py-4 bg-gradient-premium text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl active-scale flex items-center justify-center gap-3"
                  >
                    Advance to {PROJECT_STEPS[currentStepIndex + 1]?.label} <ArrowRight size={16} />
                  </button>
               </div>
            </div>
          )}

          {/* Deal Details */}
          {deal.workLink && (
            <div className="mt-12 p-6 bg-purple-50 dark:bg-purple-900/10 rounded-3xl border border-purple-100 dark:border-purple-800 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-purple-600 shadow-sm"><LinkIcon size={18} /></div>
                  <div>
                    <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest">Active Deliverable</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate max-w-xs">{deal.workLink}</p>
                  </div>
               </div>
               <a href={deal.workLink} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 active-scale">Verify Work</a>
            </div>
          )}
        </div>

        {/* Payment Process Map Card */}
        <div className="bg-slate-950 rounded-[44px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute bottom-0 left-0 p-8 opacity-5 pointer-events-none rotate-12">
            <DollarSign size={180} />
          </div>

          <h3 className="text-xl font-black uppercase tracking-widest mb-12 flex items-center gap-3 relative z-10">
            <CreditCard className="text-amber-400" /> Secure Payment Protocol
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
             {PAYMENT_STEPS.map((step, idx) => {
               const isActive = idx <= currentPayStepIndex;
               const isCurrent = idx === currentPayStepIndex;
               return (
                 <div key={step.key} className={`p-6 rounded-3xl border-2 transition-all duration-500 flex flex-col items-center text-center ${
                   isActive 
                   ? 'bg-white/5 border-amber-500/40' 
                   : 'bg-black/20 border-white/5 opacity-40'
                 }`}>
                   <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
                     isActive ? 'bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-white/5'
                   }`}>
                     {step.icon}
                   </div>
                   <h4 className="text-xs font-black uppercase tracking-widest mb-2">{step.label}</h4>
                   <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                     {step.key === 'AWAITING_BRAND' && 'Waiting for Brand to secure the campaign budget.'}
                     {step.key === 'HELD_IN_ESCROW' && 'Funds verified and held securely in Collabset escrow.'}
                     {step.key === 'RELEASED' && 'Funds transferred to Influencer account successfully.'}
                   </p>
                 </div>
               );
             })}
          </div>

          {isBrand && (
            <div className="mt-12 flex justify-center">
               {deal.paymentStatus === 'AWAITING_BRAND' && (
                 <button onClick={handlePay} className="px-12 py-5 bg-amber-500 text-slate-950 font-black rounded-2xl shadow-xl shadow-amber-500/20 active-scale uppercase tracking-widest text-sm flex items-center gap-3">
                   <DollarSign size={20} /> Secure Campaign Funds
                 </button>
               )}
               {deal.paymentStatus === 'HELD_IN_ESCROW' && deal.projectStatus === 'COMPLETED' && (
                 <button onClick={handlePay} className="px-12 py-5 bg-green-500 text-white font-black rounded-2xl shadow-xl shadow-green-500/20 active-scale uppercase tracking-widest text-sm flex items-center gap-3">
                   <CheckCircle size={20} /> Release Funds to Influencer
                 </button>
               )}
               {deal.paymentStatus === 'HELD_IN_ESCROW' && deal.projectStatus !== 'COMPLETED' && (
                 <div className="px-8 py-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                    <Info size={18} className="text-amber-400" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Funds are held. Waiting for project completion.</p>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
