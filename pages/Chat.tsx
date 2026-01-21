
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, fetchMessagesFromSupabase, getOrCreateConversation, sendMessageToSupabase } from '../lib/supabase';
import { Send, CheckCheck, Lock, ChevronLeft, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Chat: React.FC = () => {
  const { user, requests } = useAuth();
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get users we have an accepted collab with
  const chatPartners = useMemo(() => {
    return requests
      .filter(r => r.status === 'Accepted')
      .map(r => (r.fromId === user?.id ? r.toId : r.fromId));
  }, [requests, user]);

  // Handle active conversation selection
  useEffect(() => {
    const initChat = async () => {
      if (!user || !activePartnerId) return;
      
      const convId = await getOrCreateConversation(user.id, activePartnerId);
      setConversationId(convId);
      
      const initialMessages = await fetchMessagesFromSupabase(convId);
      setMessages(initialMessages);

      // Subscribe to Realtime
      const channel = supabase
        .channel(`chat_${convId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${convId}` },
          (payload) => {
            setMessages(prev => [...prev, payload.new]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    initChat();
  }, [activePartnerId, user]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !conversationId || !user || !activePartnerId) return;
    
    await sendMessageToSupabase(conversationId, user.id, activePartnerId, inputText);
    setInputText('');
  };

  if (chatPartners.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8">
          <Lock className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-3xl font-black dark:text-white mb-4">Chat is Locked</h2>
        <p className="text-slate-500 font-medium max-w-sm mx-auto">
          Start a collaboration and wait for acceptance to unlock real-time messaging.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-0 md:px-4 py-0 md:py-8 h-[calc(100vh-80px)] md:h-[calc(100vh-160px)] flex overflow-hidden">
      {/* Sidebar - Hidden on mobile when chat is active */}
      <aside className={`
        ${activePartnerId ? 'hidden md:flex' : 'flex'} 
        w-full md:w-80 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-col overflow-hidden
        md:rounded-[32px] md:border md:shadow-sm md:mr-6
      `}>
        <div className="p-6 border-b border-slate-50 dark:border-slate-800">
           <h2 className="text-2xl font-black dark:text-white">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chatPartners.map(partnerId => (
            <button 
              key={partnerId} 
              onClick={() => setActivePartnerId(partnerId)}
              className={`w-full p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800 ${activePartnerId === partnerId ? 'bg-purple-50 dark:bg-purple-900/10' : ''}`}
            >
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 rounded-2xl bg-gradient-premium flex items-center justify-center text-white font-black flex-shrink-0">
                    {partnerId.charAt(0).toUpperCase()}
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="font-bold dark:text-white truncate">{partnerId}</p>
                    <p className="text-xs text-slate-400 font-medium truncate">Tap to open session</p>
                 </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat Area - Hidden on mobile when no chat is active */}
      <main className={`
        ${activePartnerId ? 'flex' : 'hidden md:flex'} 
        flex-1 bg-white dark:bg-slate-900 flex-col overflow-hidden relative
        md:rounded-[32px] md:border md:border-slate-100 md:dark:border-slate-800 md:shadow-sm
      `}>
        {!activePartnerId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Info className="w-8 h-8 opacity-20" />
            </div>
            <p className="font-medium max-w-xs">Select a conversation from the sidebar to start chatting</p>
          </div>
        ) : (
          <>
            <div className="p-4 md:p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
               <div className="flex items-center gap-3">
                 <button 
                  onClick={() => setActivePartnerId(null)}
                  className="md:hidden p-2 -ml-2 text-slate-500"
                 >
                   <ChevronLeft className="w-6 h-6" />
                 </button>
                 <div>
                  <h3 className="font-bold dark:text-white text-base md:text-lg leading-tight">{activePartnerId}</h3>
                  <div className="flex items-center text-[10px] text-green-500 font-bold">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse" /> Live
                  </div>
                 </div>
               </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
               {messages.map(msg => (
                 <motion.div 
                   key={msg.id} 
                   initial={{ opacity: 0, y: 10 }} 
                   animate={{ opacity: 1, y: 0 }}
                   className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                 >
                   <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm ${
                     msg.sender_id === user?.id 
                     ? 'bg-purple-600 text-white rounded-tr-none' 
                     : 'bg-slate-100 dark:bg-slate-800 dark:text-white rounded-tl-none'
                   }`}>
                      <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                      <div className="mt-2 flex items-center justify-end gap-1.5">
                         <span className="text-[10px] opacity-60 font-bold">
                           {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </span>
                         {msg.sender_id === user?.id && <CheckCheck className="w-3 h-3 opacity-60" />}
                      </div>
                   </div>
                 </motion.div>
               ))}
            </div>

            <form onSubmit={handleSend} className="p-4 md:p-6 border-t border-slate-50 dark:border-slate-800 flex gap-2 md:gap-4 bg-white dark:bg-slate-900 pb-safe">
               <input 
                 type="text" 
                 placeholder="Message..."
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 className="flex-1 px-5 py-3.5 md:py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 dark:text-white text-sm"
               />
               <button type="submit" className="w-12 h-12 md:w-14 md:h-14 bg-gradient-premium rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-all flex-shrink-0">
                  <Send className="w-5 h-5 md:w-6 md:h-6" />
               </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
};
