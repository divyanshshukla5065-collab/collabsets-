import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { 
  ref, push, set, onValue, update, 
  remove, query, orderByKey, limitToLast 
} from 'firebase/database';
import { 
  Send, CheckCheck, Lock, ChevronLeft, Trash2, 
  MessageCircle, Search, Inbox, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Chat: React.FC = () => {
  const { user, allUsers, requests } = useAuth();
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

  const pendingRequests = useMemo(() => {
    if (!user?.id || !requests || !isBrand) return [];
    return requests.filter((req: any) => req.toId === user.id && req.status === 'Pending');
  }, [user?.id, requests, isBrand]);

  const getConversationId = (uid1: string, uid2: string) => [uid1, uid2].sort().join('_');

  const conversationId = useMemo(() => {
    if (!user?.id || !activePartnerId) return null;
    return getConversationId(user.id, activePartnerId);
  }, [user?.id, activePartnerId]);

  useEffect(() => {
    if (!user?.id || allUsers.length === 0 || acceptedConnections.size === 0) return;
    const unsubscribers: (() => void)[] = [];
    allUsers.forEach(partner => {
      if (!acceptedConnections.has(partner.id)) return;
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
      return chatPartners.filter(p => (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
    } else {
      return pendingRequests.map(req => {
        const sender = allUsers.find(u => u.id === req.fromId);
        return sender ? { ...sender, requestId: req.id } : null;
      }).filter(Boolean);
    }
  }, [allUsers, acceptedConnections, pendingRequests, searchTerm, activeTab]);

  const activePartner = useMemo(() => allUsers.find(p => p.id === activePartnerId), [allUsers, activePartnerId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !conversationId || !user?.id) return;
    const msgRef = ref(db, `chats/${conversationId}/messages`);
    await set(push(msgRef), { text: inputText.trim(), senderId: user.id, timestamp: Date.now(), status: 'sent' });
    setInputText('');
  };

  return (
    <div className="w-full h-[calc(100dvh-80px)] flex bg-white dark:bg-[#030712] overflow-hidden border-t border-slate-100 dark:border-slate-800">
      <aside className={`${activePartnerId ? 'hidden md:flex' : 'flex'} w-full md:w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-col shrink-0 transition-all`}>
        <div className="p-5 border-b border-slate-50 dark:border-slate-800">
          <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2 mb-4 uppercase tracking-tighter">
            <MessageCircle size={18} className="text-purple-600" /> Chats
          </h2>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-purple-600 outline-none text-slate-950 dark:text-white font-bold text-[10px]"
            />
          </div>
          {isBrand && (
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
              <button onClick={() => setActiveTab('active')} className={`flex-1 py-1 text-[8px] font-black uppercase rounded-md transition-all ${activeTab === 'active' ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-sm' : 'text-slate-500'}`}>Active</button>
              <button onClick={() => setActiveTab('requests')} className={`flex-1 py-1 text-[8px] font-black uppercase rounded-md transition-all relative ${activeTab === 'requests' ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-sm' : 'text-slate-500'}`}>
                Inbox {pendingRequests.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-600 text-white flex items-center justify-center rounded-full text-[7px] font-black">{pendingRequests.length}</span>}
              </button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filteredPartners.map((partner: any) => (
            <button key={partner.id} onClick={() => setActivePartnerId(partner.id)} className={`w-full px-4 py-3 text-left transition-all border-b border-slate-50 dark:border-slate-800/50 ${activePartnerId === partner.id ? 'bg-purple-50/50 dark:bg-purple-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/20'}`}>
              <div className="flex items-center gap-3">
                 <img src={partner.avatar} className="w-8 h-8 rounded-lg object-cover shadow-sm" />
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className="font-black dark:text-white truncate text-[10px] uppercase tracking-tighter">{partner.name}</p>
                      {lastMessages[partner.id] && <span className="text-[8px] font-bold text-slate-400">{new Date(lastMessages[partner.id].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                    </div>
                    <p className="text-[9px] text-slate-500 truncate font-medium">{lastMessages[partner.id]?.text || partner.category}</p>
                 </div>
              </div>
            </button>
          ))}
          {filteredPartners.length === 0 && <div className="p-10 text-center opacity-30 flex flex-col items-center gap-2"><Inbox size={24} /><p className="text-[8px] font-black uppercase tracking-widest">No Threads</p></div>}
        </div>
      </aside>

      <main className={`flex-1 bg-white dark:bg-[#030712] flex flex-col overflow-hidden relative ${activePartnerId ? 'flex' : 'hidden md:flex'}`}>
        {!activePartnerId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-6 text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-800 shadow-sm"><MessageCircle size={24} className="text-purple-600" /></div>
            <h3 className="text-lg font-black text-slate-950 dark:text-white mb-1 uppercase tracking-tighter">Workspace</h3>
            <p className="text-[10px] font-bold text-slate-500">Select a partner to start collaboration protocol.</p>
          </div>
        ) : (
          <>
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-20">
               <div className="flex items-center gap-3">
                 <button onClick={() => setActivePartnerId(null)} className="md:hidden p-1 text-slate-500"><ChevronLeft size={20} /></button>
                 <img src={activePartner?.avatar} className="w-8 h-8 rounded-lg object-cover shadow-sm" />
                 <div><h3 className="font-black text-slate-950 dark:text-white text-xs uppercase tracking-tighter leading-none">{activePartner?.name}</h3><p className="text-[8px] text-green-500 font-black uppercase tracking-widest mt-0.5">Active</p></div>
               </div>
               <div className="hidden lg:flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700"><Lock size={10} /> Secure</div>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50/20 dark:bg-[#030712]/5 no-scrollbar">
               {messages.map((msg, i) => {
                 const isMine = msg.senderId === user?.id;
                 return (
                   <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                     <div className="max-w-[75%] lg:max-w-[55%]">
                        <div className={`px-3.5 py-2.5 rounded-xl shadow-sm ${isMine ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-slate-200 rounded-tl-none'}`}>
                          <p className="text-[10px] font-bold leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          <div className="mt-1.5 flex items-center justify-end gap-1 opacity-50"><span className="text-[7px] font-black uppercase">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>{isMine && <CheckCheck size={9} className={msg.status === 'seen' ? 'text-amber-400' : 'text-white'} />}</div>
                        </div>
                     </div>
                   </div>
                 );
               })}
            </div>
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <form onSubmit={handleSend} className="flex items-center gap-2.5 max-w-4xl mx-auto">
                 <textarea rows={1} placeholder="Protocol input..." value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); }}} className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none focus:ring-1 focus:ring-purple-600 text-slate-950 dark:text-white font-bold text-[10px] resize-none max-h-24" />
                 <button type="submit" disabled={!inputText.trim()} className="w-9 h-9 bg-purple-600 text-white rounded-xl flex items-center justify-center shadow-md active:scale-90 transition-all disabled:opacity-50 shrink-0"><Send size={14} /></button>
              </form>
              <div className="mt-2 flex justify-center items-center gap-1.5 opacity-20 text-[7px] font-black text-slate-400 uppercase tracking-widest"><ShieldAlert size={8} /> Transmission Encrypted</div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};