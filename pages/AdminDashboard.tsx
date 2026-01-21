
import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Users, Briefcase, Database, Activity, ShieldCheck, 
  Trash2, TrendingUp, UserCheck, ShieldAlert
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { allUsers, requests, adminVerifyUser, adminDeleteUser, user: currentUser } = useAuth();

  const stats = useMemo(() => {
    const influencers = allUsers.filter(u => u.role === 'Influencer').length;
    const brands = allUsers.filter(u => u.role === 'Brand').length;
    const pendingRequests = requests.filter(r => r.status === 'Pending').length;
    const activeCollabs = requests.filter(r => r.status === 'Accepted').length;
    
    return {
      influencers,
      brands,
      pendingRequests,
      activeCollabs,
      totalUsers: allUsers.length
    };
  }, [allUsers, requests]);

  if (currentUser?.role !== 'Admin') {
    return (
      <div className="p-20 flex flex-col items-center justify-center text-center">
        <ShieldAlert className="w-20 h-20 text-red-500 mb-6" />
        <h2 className="text-3xl font-black text-red-500">Access Denied</h2>
        <p className="text-slate-500 mt-2">Only system administrators can access this control center.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black dark:text-white flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-cyan-500" /> Control Center
          </h1>
          <p className="text-slate-500 font-medium">Real-time platform oversight</p>
        </div>
        <div className="hidden md:flex items-center gap-4">
           <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs text-slate-500 flex items-center">
              <Activity className="w-3 h-3 mr-2 text-green-500" /> System Operational
           </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
        <StatCard title="Influencers" value={stats.influencers} icon={<Users />} color="bg-blue-500" />
        <StatCard title="Brands" value={stats.brands} icon={<Briefcase />} color="bg-amber-500" />
        <StatCard title="Active Collabs" value={stats.activeCollabs} icon={<TrendingUp />} color="bg-green-500" />
        <StatCard title="Verifications" value={allUsers.filter(u => !u.isVerified).length} icon={<UserCheck />} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* User Management List */}
        <div className="xl:col-span-2 space-y-6 overflow-hidden">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
               <h2 className="text-xl md:text-2xl font-black dark:text-white flex items-center gap-3">
                  <Database className="w-6 h-6 text-slate-400" /> User Database
               </h2>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full w-fit">
                {stats.totalUsers} Records
               </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-6 md:px-8 py-4">User Details</th>
                    <th className="px-6 md:px-8 py-4">Role</th>
                    <th className="px-6 md:px-8 py-4">Status</th>
                    <th className="px-6 md:px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {allUsers.filter(u => u.role !== 'Admin').map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 md:px-8 py-5 md:py-6">
                        <div className="min-w-[150px]">
                          <p className="font-bold dark:text-white truncate">{u.name}</p>
                          <p className="text-[10px] md:text-xs text-slate-400 font-medium truncate">{u.email}</p>
                        </div>
                      </td>
                      <td className="px-6 md:px-8 py-5 md:py-6">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          u.role === 'Influencer' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 md:px-8 py-5 md:py-6">
                        {u.isVerified ? (
                          <div className="flex items-center text-green-500 text-[10px] font-bold">
                            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified
                          </div>
                        ) : (
                          <div className="flex items-center text-slate-400 text-[10px] font-bold">
                            Pending
                          </div>
                        )}
                      </td>
                      <td className="px-6 md:px-8 py-5 md:py-6 text-right">
                        <div className="flex justify-end gap-2 md:gap-3">
                          {!u.isVerified && (
                            <button 
                              onClick={() => adminVerifyUser(u.id)}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                              title="Verify User"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => adminDeleteUser(u.id)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Actions & Logs */}
        <div className="space-y-6">
           <div className="p-6 md:p-8 bg-slate-900 rounded-[32px] text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <TrendingUp size={100} />
              </div>
              <h3 className="text-xl font-black mb-1">Revenue</h3>
              <p className="text-slate-400 text-xs mb-6 font-medium">Platform Economics</p>
              
              <div className="space-y-5">
                 <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total Marketplace Value</p>
                    <p className="text-2xl font-black text-amber-500">₹14.2M</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Commission (10%)</p>
                    <p className="text-xl font-black text-green-500">₹1.42M</p>
                 </div>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold dark:text-white mb-6">Recent Events</h3>
              <div className="space-y-4">
                 {requests.slice(0, 4).map((req, i) => (
                   <div key={i} className="flex gap-4 pb-4 border-b border-slate-50 dark:border-slate-800 last:border-0">
                      <div className="w-1 h-10 bg-purple-500 rounded-full flex-shrink-0" />
                      <div className="min-w-0">
                         <p className="text-xs font-bold dark:text-white truncate">New Request Interaction</p>
                         <p className="text-[10px] text-slate-400">{new Date(req.timestamp).toLocaleTimeString()}</p>
                      </div>
                   </div>
                 ))}
                 {requests.length === 0 && <p className="text-xs text-slate-400 italic">No recent activity logged.</p>}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <motion.div 
    whileHover={{ y: -3 }}
    className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 md:gap-5"
  >
    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p>
      <p className="text-xl md:text-2xl font-black dark:text-white">{value}</p>
    </div>
  </motion.div>
);
