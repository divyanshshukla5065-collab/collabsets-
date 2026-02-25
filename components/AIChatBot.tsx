import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Volume2, Loader2, Bot, ScrollText, Zap, Lightbulb, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

const SYSTEM_INSTRUCTION = `You are UMAIMA, the sophisticated AI assistant for COLLABSET, India's elite influencer marketplace. Tone: Concise, professional, and efficient. Avoid technical jargon. You specialize in creator strategy, scriptwriting, and brand collaborations.`;

interface Message { role: 'user' | 'assistant'; content: string; id: string; }

const RobotTrigger: React.FC<{ onClick: () => void; isOpen: boolean }> = ({ onClick, isOpen }) => (
  <motion.button
    initial={{ scale: 0 }} animate={{ scale: 1 }} whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="fixed bottom-24 md:bottom-8 right-8 z-[200] w-12 h-12 bg-slate-950 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-xl flex items-center justify-center border border-white/10"
  >
    <AnimatePresence mode="wait">{isOpen ? <X size={18} key="c" /> : <Bot size={22} key="b" />}</AnimatePresence>
    <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/20 animate-ping pointer-events-none" />
  </motion.button>
);

const QuickTool: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-purple-500 transition-all group active:scale-95 shadow-sm"
  >
    <span className="text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">{icon}</span>
    <span className="text-[8px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">{label}</span>
  </button>
);

export const AIChatBot: React.FC = () => {
  const { isAriaOpen: isOpen, setIsAriaOpen: setIsOpen, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([{ id: '1', role: 'assistant', content: "Welcome back. I'm UMAIMA. How can I assist your network growth today?" }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isLoadingVoice, setIsLoadingVoice] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [pendingToolAction, setPendingToolAction] = useState<'script' | 'caption' | 'ideas' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const isCompleted = user?.onboardingStatus === 'COMPLETED';

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const handleSpeak = async (messageId: string, text: string) => {
    if (speakingId === messageId) return setSpeakingId(null);
    setIsLoadingVoice(messageId);
    try {
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } },
      });
      const b64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (b64) {
        const buf = await decodeAudioData(decodeBase64(b64), audioContextRef.current, 24000, 1);
        setIsLoadingVoice(null); setSpeakingId(messageId);
        const src = audioContextRef.current.createBufferSource();
        src.buffer = buf; src.connect(audioContextRef.current.destination);
        src.onended = () => setSpeakingId(null); src.start(0);
      }
    } catch { setIsLoadingVoice(null); setSpeakingId(null); }
  };

  const initiateToolAction = (action: 'script' | 'caption' | 'ideas') => {
    setPendingToolAction(action);
    let question = "";
    if (action === 'script') question = "I'd love to help you with an AI script. What's the rough idea or topic of the reel you're planning?";
    if (action === 'caption') question = "Certainly! What topic should this caption be about?";
    if (action === 'ideas') question = "Great! What is your niche or the general theme you want reel ideas for?";
    
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: question }]);
  };

  const handleSend = async (customText?: string) => {
    const txt = customText || input.trim();
    if (!txt || isTyping) return;

    // Track the final prompt to send to Gemini
    let finalPrompt = txt;

    // If we were waiting for a topic for a specific tool, wrap the user's response in a task-specific prompt
    if (pendingToolAction) {
      if (pendingToolAction === 'script') {
        finalPrompt = `Based on this idea: "${txt}", generate a professional high-engagement script for my next brand collaboration reel. Include scene directions and hook suggestions.`;
      } else if (pendingToolAction === 'caption') {
        finalPrompt = `Write 3 viral, engaging Instagram captions for a post about: "${txt}". Include trending hashtags and a strong Call to Action (CTA).`;
      } else if (pendingToolAction === 'ideas') {
        finalPrompt = `Give me 5 unique trending reel ideas for the niche: "${txt}" to boost my engagement rate. Focus on what's currently working in the Indian market.`;
      }
      setPendingToolAction(null);
    }

    const userMsg = { id: Date.now().toString(), role: 'user', content: txt } as Message;
    const currentMsgs = [...messages, userMsg];
    setMessages(currentMsgs); 
    setInput(''); 
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const history = currentMsgs.filter(m => m.id !== '1').map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));
      
      // Replace the last message text in history with the "finalPrompt" for context richness
      if (history.length > 0) {
        history[history.length - 1].parts[0].text = finalPrompt;
      } else {
        history.push({ role: 'user', parts: [{ text: finalPrompt }] });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: history,
        config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.7 },
      });
      setMessages(p => [...p, { id: Date.now().toString(), role: 'assistant', content: response.text || "Synchronizing..." }]);
    } catch (e) {
      setMessages(p => [...p, { id: Date.now().toString(), role: 'assistant', content: "Protocol interruption. My systems are resyncing." }]);
    } finally { 
      setIsTyping(false); 
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.98 }}
            className="fixed bottom-24 md:bottom-24 right-4 md:right-8 z-[200] w-[85vw] md:w-[350px] h-[65vh] md:h-[500px] bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg"><Sparkles size={16} /></div>
                <div><h3 className="font-black text-[10px] uppercase tracking-widest leading-none">UMAIMA</h3><p className="text-[7px] font-black uppercase text-purple-400">Advanced Engine</p></div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setVoiceEnabled(!voiceEnabled)} className={`p-1.5 rounded-lg transition-colors ${voiceEnabled ? 'bg-purple-600 text-white' : 'bg-white/10 text-slate-400 hover:text-white'}`}><Volume2 size={14} /></button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"><X size={14} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950 no-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] p-3.5 rounded-[20px] text-[11px] font-bold shadow-sm leading-relaxed ${msg.role === 'user' ? 'bg-slate-950 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'}`}>
                    {msg.content}
                    {msg.role === 'assistant' && (
                      <div className="mt-2.5 flex justify-end">
                        <button onClick={() => handleSpeak(msg.id, msg.content)} className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 transition-colors">
                          {isLoadingVoice === msg.id ? <Loader2 size={10} className="animate-spin" /> : <Volume2 size={10} />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && <div className="flex justify-start"><div className="bg-white dark:bg-slate-800 p-3 rounded-2xl flex gap-1 shadow-sm"><div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" /><div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce [animation-delay:0.2s]" /><div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce [animation-delay:0.4s]" /></div></div>}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              {isCompleted ? (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  <QuickTool icon={<ScrollText size={12} />} label="AI Script" onClick={() => initiateToolAction('script')} />
                  <QuickTool icon={<Zap size={12} />} label="Caption" onClick={() => initiateToolAction('caption')} />
                  <QuickTool icon={<Lightbulb size={12} />} label="Reel Ideas" onClick={() => initiateToolAction('ideas')} />
                </div>
              ) : (
                <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-2 border border-slate-100 dark:border-slate-700">
                  <Bot size={12} className="text-slate-400" />
                  <p className="text-[7px] font-black uppercase text-slate-400 tracking-widest">Complete profile to unlock elite AI tools</p>
                </div>
              )}
              
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <input 
                  type="text" 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  placeholder={pendingToolAction ? "Provide topic/idea here..." : "Inquire UMAIMA..."} 
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-purple-600/20 text-[10px] font-bold dark:text-white" 
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isTyping} 
                  className="p-2.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl active:scale-95 disabled:opacity-50 shadow-lg hover:shadow-purple-500/20 transition-all"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <RobotTrigger onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
    </>
  );
};