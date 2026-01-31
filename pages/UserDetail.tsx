
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Instagram, Twitter, Linkedin, MapPin, Users, DollarSign, 
  ChevronLeft, ChevronRight, ShieldCheck, Briefcase, Globe, Info, 
  MessageCircle, Send, CheckCircle, Zap, Globe2, Link as LinkIcon
} from 'lucide-react';

export const UserDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { allUsers, user: currentUser, sendCollabRequest, createDirectChat, requests } = useAuth();
  const navigate = useNavigate();

  const user = useMemo(() => allUsers.find(u => u.id === userId), [allUsers, userId]);
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <Info className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-black text-slate-950 dark:text-white uppercase">Profile Not Found</h2>
        <p className="text-slate-500 font-bold mt-2">The user you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-8 px-8 py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest active-scale">Return to Market</button>
      </div>
    );
  }

  const isInfluencer = user.role === 'Influencer';
  const requestStatus = requests.find(r => 
    (r.fromId === currentUser?.id && r.toId === user.id) || 
    (r.fromId === user.id && r.toId === currentUser?.id)
  )?.status;

  const handleAction = async () => {
    if (currentUser?.role === 'Brand') {
      await createDirectChat(user.id);
      navigate('/chat');
    } else {
      await sendCollabRequest(user.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-32">
      {/* Hero Header */}
      <div className="h-64 md:h-80 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
        <button 
          onClick={() => navigate('/dashboard')}
          className="absolute top-8 left-4 md:left-8 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all"
        >
          <ChevronLeft size={16} /> Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Profile Info */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 rounded-[44px] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 text-center"
            >
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-[48px] p-2 bg-gradient-premium shadow-xl">
                  <div className="w-full h-full rounded-[40px] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-2xl border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-lg">
                  <ShieldCheck className="text-white w-5 h-5" />
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tighter mb-1">
                {isInfluencer ? user.name : (user.brandName || user.name)}
              </h1>
              <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] mb-8">{user.category} • {user.city}</p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{isInfluencer ? 'Reach' : 'Budget'}</p>
                  <p className="text-lg font-black text-slate-950 dark:text-white">
                    {isInfluencer 
                      ? (user.followers > 1000 ? `${(user.followers/1000).toFixed(1)}K` : user.followers)
                      : `₹${(user.avgCampaignBudget/1000).toFixed(0)}K+`
                    }
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</p>
                  <p className="text-lg font-black text-slate-950 dark:text-white truncate">{user.city || 'India'}</p>
                </div>
              </div>

              <div className="space-y-3">
                {requestStatus === 'Accepted' ? (
                  <button 
                    onClick={() => navigate('/chat')}
                    className="w-full py-5 bg-green-600 text-white rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg active-scale"
                  >
                    <MessageCircle size={18} /> Open Chat
                  </button>
                ) : (
                  <button 
                    onClick={handleAction}
                    className="w-full py-5 bg-gradient-premium text-white rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl active-scale"
                  >
                    {currentUser?.role === 'Brand' ? <><MessageCircle size={18} /> Connect Now</> : <><Send size={18} /> Pitch Brand</>}
                  </button>
                )}
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Typical response time: 2-4 hours</p>
              </div>
            </motion.div>

            {/* Social & Links Sidebar Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[44px] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
               <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                 <LinkIcon size={14} className="text-purple-600" /> Digital Presence
               </h3>
               <div className="space-y-4">
                 {isInfluencer ? (
                   <>
                    <SocialLink icon={<Instagram size={18} />} label="Instagram" value={user.instagramHandle} href={`https://instagram.com/${user.instagramHandle?.replace('@', '')}`} color="text-pink-500" />
                    <SocialLink icon={<Twitter size={18} />} label="X / Twitter" value="@Handle" href={user.twitterUrl} color="text-slate-900 dark:text-white" />
                    <SocialLink icon={<Linkedin size={18} />} label="LinkedIn" value="Professional" href={user.linkedinUrl} color="text-blue-600" />
                   </>
                 ) : (
                   <>
                    <SocialLink icon={<Globe size={18} />} label="Official Website" value="Visit Site" href={user.website} color="text-indigo-600" />
                    <SocialLink icon={<Instagram size={18} />} label="Brand Instagram" value="View Feed" href={user.instagramUrl} color="text-pink-500" />
                    <SocialLink icon={<Linkedin size={18} />} label="Company Page" value="LinkedIn" href={user.linkedinUrl} color="text-blue-600" />
                   </>
                 )}
               </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[44px] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-10 bg-gradient-premium rounded-full" />
                <h2 className="text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">The Vision</h2>
              </div>
              <p className="text-lg text-slate-700 dark:text-slate-300 font-bold leading-relaxed whitespace-pre-wrap">
                {user.bio || "This visionary hasn't shared their story yet. Connect with them to learn more about their creative journey and collaborative potential."}
              </p>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-slate-50 dark:border-slate-800">
                <DetailStat icon={<Zap className="text-amber-500" />} label="Category" value={user.category} />
                <DetailStat icon={<MapPin className="text-red-500" />} label="Base" value={user.city} />
                <DetailStat icon={<ShieldCheck className="text-green-500" />} label="Status" value="Verified" />
              </div>
            </motion.div>

            {/* Performance/Insight Section */}
            <div className="bg-slate-950 rounded-[44px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                 <Globe2 size={200} />
               </div>
               
               <h3 className="text-xl font-black uppercase tracking-widest mb-10 flex items-center gap-3">
                 <Zap className="text-amber-400 fill-amber-400" /> Market Insights
               </h3>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                 <div className="space-y-6">
                    <p className="text-sm text-slate-400 font-bold leading-relaxed">
                      {isInfluencer 
                        ? `${user.name} maintains a steady engagement rate in the ${user.category} sector, making them a high-value partner for conversion-focused campaigns.`
                        : `${user.brandName} is actively scaling their influencer network within the ${user.category} niche, prioritizing long-term relationships.`
                      }
                    </p>
                    <div className="flex items-center gap-4">
                       <div className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">Brand Safe</div>
                       <div className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">Verified Metrics</div>
                    </div>
                 </div>
                 <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-4">Investment Potential</p>
                    <div className="flex items-end gap-2 mb-2">
                       <span className="text-4xl font-black">₹{isInfluencer ? (user.pricePerPost > 1000 ? `${(user.pricePerPost/1000).toFixed(0)}K` : user.pricePerPost) : (user.avgCampaignBudget > 1000 ? `${(user.avgCampaignBudget/1000).toFixed(0)}K` : user.avgCampaignBudget)}</span>
                       <span className="text-slate-400 text-xs font-bold mb-1.5">{isInfluencer ? '/ per asset' : '/ per campaign'}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Estimated Commercial Value</p>
                 </div>
               </div>
            </div>

            {/* Verification Footer */}
            <div className="flex items-center justify-center gap-6 py-12">
               <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
               <div className="flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                 <CheckCircle size={14} className="text-green-500" /> Secure Collaboration Powered by COLLABSET
               </div>
               <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialLink = ({ icon, label, value, href, color }: any) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className={`flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 group hover:scale-[1.02] transition-all ${href ? '' : 'pointer-events-none opacity-50'}`}
  >
    <div className="flex items-center gap-4">
      <div className={color}>{icon}</div>
      <div className="text-left">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-xs font-bold text-slate-950 dark:text-slate-200 truncate max-w-[120px]">{value || 'Not Linked'}</p>
      </div>
    </div>
    <ChevronRight size={14} className="text-slate-300 group-hover:text-purple-600 transition-colors" />
  </a>
);

const DetailStat = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-sm font-black text-slate-950 dark:text-white truncate">{value || 'Global'}</p>
    </div>
  </div>
);
