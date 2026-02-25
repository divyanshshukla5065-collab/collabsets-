import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { 
  ref, push, set, onValue, update, 
  remove, query, orderByKey, limitToLast 
} from 'firebase/database';
import { 
  Send, CheckCheck, Lock, ChevronLeft, Trash2, 
  MessageCircle, Search, Inbox, ShieldAlert, BadgeCheck, Code,
  Ban
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Constant for Tech Management Contact
const TECH_MGMT_CONTACT = {
  id: 'arpit_tech_mgmt',
  name: 'Arpit',
  role: 'Tech Management',
  category: 'Web Developer & Tech Management',
  avatar: 'https://i.postimg.cc/gj2LSpjj/Whats-App-Image-2026-02-03-at-11-54-53-PM.jpg',
  isVerified: true,
  isTech: true
};

export const Chat: React.FC = () => {
  const { user, allUsers, requests, campaigns } = useAuth();
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [lastMessages, setLastMessages] = useState<Record<string, any>>({});
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'requests'>('active');
  const scrollRef = useRef<HTMLDivElement>(null);

  const isBrand = user?.role === 'Brand';

  const acceptedConnections = useMemo(() => {
    if (!user?.id || !requests) return new Set<string>();
    const ids = new Set<string>();
    requests.forEach(req => {
      if (req.status === 'Accepted') {
        if (req.fromId === user.id) ids.add(req.toId);
        if (req.toId === user.id) ids.add(req.fromId);
      }
    });
    return ids;
  }, [user?.id, requests]);

  const activeRequest = useMemo(() => {
    if (!activePartnerId || !user?.id) return null;
    return requests.find(r => 
      (r.fromId === user.id && r.toId === activePartnerId) || 
      (r.toId === user.id && r.fromId === activePartnerId)
    );
  }, [activePartnerId, user?.id, requests]);

  const isChatBlocked = useMemo(() => {
    if (activePartnerId === TECH_MGMT_CONTACT.id) return false;
    if (!activeRequest?.campaignId) return false;
    const campaign = campaigns.find(c => c.id === activeRequest.campaignId);
    return campaign?.status === 'Blocked';
  }, [activeRequest, campaigns, activePartnerId]);

  const pendingRequests = useMemo(() => {
    if (!user?.id || !requests || !isBrand) return [];
    return requests.filter((req: any) => req.toId === user.id && req.status === 'Pending');
  }, [user?.id, requests, isBrand]);

  const getConversationId = (uid1: string, uid2: string) => [uid1, uid2].sort().join('_');

  const conversationId = useMemo(() => {
    if (!user?.id || !activePartnerId) return null;
    return getConversationId(user.id, activePartnerId);
  }, [user?.id, activePartnerId]);

  // Listen for last messages including Tech Management
  useEffect(() => {
    if (!user?.id) return;
    
    const partnersToTrack = [
      ...allUsers.filter(u => acceptedConnections.has(u.id)),
      TECH_MGMT_CONTACT
    ];

    const unsubscribers: (() => void)[] = [];
    partnersToTrack.forEach(partner => {
      if (partner.id === user.id) return;
      const convId = getConversationId(user.id, partner.id);
      const lastMsgQuery = query(ref(db, `chats/${convId}/messages`), orderByKey(), limitToLast(1));
      const unsub = onValue(lastMsgQuery, (snapshot) => {
        const data = snapshot.val();
        if (data) setLastMessages(prev => ({ ...prev, [partner.id]: Object.values(data)[0] }));
      });
      unsubscribers.push(unsub);
    });
    return () => unsubscribers.forEach(u => u());
  }, [user?.id, allUsers, acceptedConnections]);

  useEffect(() => {
    if (!conversationId || !user?.id) return;
    const messagesQuery = query(ref(db, `chats/${conversationId}/messages`), orderByKey(), limitToLast(100));
    const unsub = onValue(messagesQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const msgs = Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val }));
        setMessages(msgs);
        msgs.forEach(m => {
          if (m.senderId !== user.id && m.status !== 'seen') 
            update(ref(db, `chats/${conversationId}/messages/${m.id}`), { status: 'seen' });
        });
      } else setMessages([]);
    });
    return () => unsub();
  }, [conversationId, user?.id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const filteredPartners = useMemo(() => {
    if (activeTab === 'active') {
      const chatPartners = allUsers.filter(u => acceptedConnections.has(u.id));
      const list = user?.id !== TECH_MGMT_CONTACT.id ? [TECH_MGMT_CONTACT, ...chatPartners] : chatPartners;
      return list.filter(p => (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
    } else {
      return pendingRequests.map(req => {
        const sender = allUsers.find(u => u.id === req.fromId);
        return sender ? { ...sender, requestId: req.id } : null;
      }).filter(Boolean);
    }
  }, [allUsers, acceptedConnections, pendingRequests, searchTerm, activeTab, user?.id]);

  const activePartner = useMemo(() => {
    if (activePartnerId === TECH_MGMT_CONTACT.id) return TECH_MGMT_CONTACT;
    return allUsers.find(p => p.id === activePartnerId);
  }, [allUsers, activePartnerId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !conversationId || !user?.id || isChatBlocked) return;
    const msgRef = ref(db, `chats/${conversationId}/messages`);
    await set(push(msgRef), { text: inputText.trim(), senderId: user.id, timestamp: Date.now(), status: 'sent' });
    setInputText('');
  };

  return (
    <div className="w-full h-[calc(100dvh-80px)] flex bg-white dark:bg-[#030712] overflow-hidden border-t border-slate-100 dark:border-slate-800">
      <aside className={`${activePartnerId ? 'hidden md:flex' : 'flex'} w-full md:w-80 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-col shrink-0 transition-all`}>
        <div className="p-5 border-b border-slate-50 dark:border-slate-800">
          <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2 mb-4 uppercase tracking-tighter">
            <MessageCircle size={18} className="text-purple-600" /> Communications
          </h2>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text" placeholder="Search registry..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-purple-600 outline-none text-slate-950 dark:text-white font-bold text-[10px]"
            />
          </div>
          {isBrand && (
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
              <button onClick={() => setActiveTab('active')} className={`flex-1 py-1.5 text-[8px] font-black uppercase rounded-md transition-all ${activeTab === 'active' ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-sm' : 'text-slate-500'}`}>Network</button>
              <button onClick={() => setActiveTab('requests')} className={`flex-1 py-1.5 text-[8px] font-black uppercase rounded-md transition-all relative ${activeTab === 'requests' ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-sm' : 'text-slate-500'}`}>
                Proposals {pendingRequests.length > 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-purple-600 text-white flex items-center justify-center rounded-full text-[7px] font-black shadow-lg">{pendingRequests.length}</span>}
              </button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filteredPartners.map((partner: any) => (
            <button 
              key={partner.id} 
              onClick={() => setActivePartnerId(partner.id)} 
              className={`w-full px-5 py-4 text-left transition-all border-b border-slate-50 dark:border-slate-800/50 relative group ${activePartnerId === partner.id ? 'bg-purple-50/50 dark:bg-purple-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/20'}`}
            >
              <div className="flex items-center gap-4">
                 <div className="relative">
                   <img src={partner.avatar} className="w-10 h-10 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform" />
                   {partner.isTech && (
                     <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-lg flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
                       <Code size={8} className="text-white" />
                     </div>
                   )}
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <p className={`font-black dark:text-white truncate text-[10px] uppercase tracking-tighter ${partner.isTech ? 'text-blue-600' : ''}`}>
                          {partner.name}
                        </p>
                        {partner.isVerified && <BadgeCheck size={10} className="text-green-500 shrink-0" />}
                      </div>
                    </div>
                    <p className={`text-[9px] truncate font-bold ${partner.isTech ? 'text-slate-400' : 'text-slate-500'}`}>
                      {lastMessages[partner.id]?.text || partner.category}
                    </p>
                 </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <main className={`flex-1 bg-white dark:bg-[#030712] flex flex-col overflow-hidden relative ${activePartnerId ? 'flex' : 'hidden md:flex'}`}>
        {!activePartnerId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-6 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-[32px] flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-800 shadow-inner"><MessageCircle size={32} className="text-purple-600 opacity-20" /></div>
            <h3 className="text-xl font-black text-slate-950 dark:text-white mb-2 uppercase tracking-tighter">Encrypted Workspace</h3>
            <p className="text-xs font-bold text-slate-500 max-w-[240px] leading-relaxed">Select a verified connection to initialize the collaboration protocol.</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-20">
               <div className="flex items-center gap-4">
                 <button onClick={() => setActivePartnerId(null)} className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-all"><ChevronLeft size={20} /></button>
                 <img src={activePartner?.avatar} className="w-10 h-10 rounded-2xl object-cover shadow-lg border-2 border-white dark:border-slate-800" />
                 <div>
                   <h3 className="font-black text-slate-950 dark:text-white text-sm uppercase tracking-tighter leading-none flex items-center gap-2">
                     {activePartner?.name}
                     {isChatBlocked && <span className="text-[7px] bg-red-100 dark:bg-red-900/30 text-red-600 px-1.5 py-0.5 rounded uppercase tracking-widest">Protocol Terminated</span>}
                   </h3>
                   <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-1">{activePartner?.category}</p>
                 </div>
               </div>
               <div className="hidden lg:flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm">
                 <Lock size={10} className={isChatBlocked ? "text-red-500" : "text-green-500"} /> {isChatBlocked ? 'Access Denied' : 'Secure Transmission'}
               </div>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20 dark:bg-[#030712]/5 no-scrollbar">
               {isChatBlocked && (
                 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-8 bg-red-50 dark:bg-red-950/40 rounded-[32px] border border-red-100 dark:border-red-900/30 text-center max-w-md mx-auto my-10">
                    <Ban size={40} className="text-red-500 mx-auto mb-4" />
                    <h4 className="text-red-600 font-black uppercase tracking-widest text-xs mb-2">Protocol Suspended</h4>
                    <p className="text-slate-500 text-[10px] font-bold">This campaign has been blocked by Administrator security controls. Communication is disabled.</p>
                 </motion.div>
               )}
               {messages.map((msg, i) => {
                 const isMine = msg.senderId === user?.id;
                 return (
                   <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                     <div className="max-w-[80%] lg:max-w-[60%]">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className={`px-4 py-3 rounded-2xl shadow-sm ${isMine ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-slate-200 rounded-tl-none shadow-md'}`}
                        >
                          <p className="text-xs font-bold leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          <div className="mt-2 flex items-center justify-end gap-1.5 opacity-60">
                            <span className="text-[7px] font-black uppercase tracking-widest">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {isMine && <CheckCheck size={10} className={msg.status === 'seen' ? 'text-amber-400' : 'text-white'} />}
                          </div>
                        </motion.div>
                     </div>
                   </div>
                 );
               })}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
              <form onSubmit={handleSend} className="flex items-center gap-3 max-w-5xl mx-auto">
                 <div className="flex-1 relative">
                   <textarea 
                    rows={1} 
                    disabled={isChatBlocked}
                    placeholder={isChatBlocked ? "Transmission locked by Admin..." : "Enter collaborative input..."} 
                    value={inputText} 
                    onChange={e => setInputText(e.target.value)} 
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); }}} 
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-purple-500/30 rounded-2xl outline-none text-slate-950 dark:text-white font-bold text-xs resize-none max-h-32 shadow-inner transition-all disabled:opacity-30" 
                   />
                 </div>
                 <button 
                  type="submit" 
                  disabled={!inputText.trim() || isChatBlocked} 
                  className="w-12 h-12 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all disabled:opacity-30 shrink-0 group"
                 >
                   <Send size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                 </button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
};