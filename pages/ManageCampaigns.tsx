import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, ChevronLeft, Power, CheckCircle2, 
  Trash2, Plus, ArrowRight, Briefcase, Filter,
  Clock, CheckCircle, AlertCircle, LayoutList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ManageCampaigns: React.FC = () => {
  const { user, campaigns, updateCampaign, deleteCampaign } = useAuth();
  const navigate = useNavigate();

  const myCampaigns = useMemo(() => {
    if (user?.role !== 'Brand') return [];
    return campaigns.filter(c => c.brandId === user?.id);
  }, [campaigns, user?.id, user?.role]);

  const stats = useMemo(() => {
    return {
      total: myCampaigns.length,
      active: myCampaigns.filter(c => c.status === 'Active').length,
      completed: myCampaigns.filter(c => c.status === 'Completed').length,
    };
  }, [myCampaigns]);

  const handleToggle = async (c: any) => {
    const newStatus = c.status === 'Active' ? 'Inactive' : 'Active';
    await updateCampaign(c.id, { status: newStatus });
  };

  const handleComplete = async (campaignId: string) => {
    if (window.confirm("Archive this campaign as completed? No new applications will be allowed.")) {
      await updateCampaign(campaignId, { status: 'Completed' });
    }
  };

  const handleDelete = async (campaignId: string) => {
    if (window.confirm("Permanently purge this campaign protocol? This action is irreversible.")) {
      await deleteCampaign(campaignId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] transition-colors pb-32">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-black text-[10px] uppercase tracking-widest mb-6 transition-colors group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
            <h1 className="text-4xl md:text-6xl font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-2">Campaign Hub</h1>
            <p className="text-slate-500 font-bold">Protocol management for your active market engagements.</p>
          </div>
          <button 
            onClick={() => navigate('/brand/create-campaign')}
            className="px-8 py-4 bg-gradient-premium text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 shadow-xl active-scale"
          >
            <Plus size={20} /> New Campaign
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard label="Total Protocols" value={stats.total} icon={<LayoutList className="text-slate-400" />} />
          <StatCard label="Active Sync" value={stats.active} icon={<Rocket className="text-purple-500" />} glow />
          <StatCard label="Archived Success" value={stats.completed} icon={<CheckCircle className="text-green-500" />} />
        </div>

        {/* List Control Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-[44px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-950 dark:text-white uppercase tracking-tight">Transmission Registry</h3>
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
               <Filter size={14} className="text-slate-400" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing All</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <AnimatePresence mode="popLayout">
              {myCampaigns.length > 0 ? (
                myCampaigns.map((c) => (
                  <motion.div 
                    key={c.id} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0, x: -20 }}
                    className="p-8 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-8 group"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center flex-shrink-0 transition-all ${
                        c.status === 'Active' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}>
                        <Rocket size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight">{c.name}</h4>
                          <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                            c.status === 'Active' ? 'bg-green-100 text-green-600' : 
                            c.status === 'Completed' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'
                          }`}>
                            {c.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <span className="flex items-center gap-1.5"><Briefcase size={12} /> {c.type}</span>
                           <span className="flex items-center gap-1.5"><Clock size={12} /> Manifested {new Date(c.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button 
                        onClick={() => handleToggle(c)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          c.status === 'Active' 
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600' 
                          : 'bg-green-600 text-white shadow-lg shadow-green-500/20 hover:scale-105'
                        }`}
                      >
                        <Power size={14} /> {c.status === 'Active' ? 'Turn Off' : 'Turn On'}
                      </button>

                      <button 
                        onClick={() => handleComplete(c.id)}
                        disabled={c.status === 'Completed'}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active-scale disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105"
                      >
                        <CheckCircle2 size={14} /> Mark Success
                      </button>

                      <button 
                        onClick={() => handleDelete(c.id)}
                        className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl hover:bg-red-100 transition-all active:scale-90"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-32 text-center flex flex-col items-center">
                  <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[40px] flex items-center justify-center mb-8 shadow-inner">
                    <AlertCircle className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tighter mb-4">No Protocols Found</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-bold max-w-sm text-base leading-relaxed">You haven't manifested any campaign protocols yet. Start your first engagement today.</p>
                  <button 
                    onClick={() => navigate('/brand/create-campaign')}
                    className="mt-10 px-10 py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest active-scale shadow-2xl"
                  >
                    Manifest Protocol
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, glow }: any) => (
  <div className={`bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-6 relative overflow-hidden group ${glow ? 'ring-2 ring-purple-500/20' : ''}`}>
    {glow && <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />}
    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500 shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-4xl font-black dark:text-white tracking-tighter">{value}</p>
    </div>
  </div>
);