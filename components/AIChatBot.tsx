import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Volume2, Loader2, Headphones, Bot } from 'lucide-react';
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

const SYSTEM_INSTRUCTION = `You are UMAIMA, the sophisticated AI assistant for COLLABSET, India's elite influencer marketplace. Tone: Concise, professional, and efficient. Avoid technical jargon.`;

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

export const AIChatBot: React.FC = () => {
  const { isAriaOpen: isOpen, setIsAriaOpen: setIsOpen } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [messages, setMessages] = useState<Message[]>([{ id: '1', role: 'assistant', content: "Welcome to COLLABSET. I'm UMAIMA. How can I assist your network growth today?" }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isLoadingVoice, setIsLoadingVoice] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const txt = input.trim();
    if (!txt || isTyping) return;
    const userMsg = { id: Date.now().toString(), role: 'user', content: txt } as Message;
    const currentMsgs = [...messages, userMsg];
    setMessages(currentMsgs); setInput(''); setIsTyping(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // CRITICAL FIX: The conversation history MUST start with 'user' turn.
      const history = currentMsgs.filter(m => m.id !== '1').map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));
      if (history.length === 0) history.push({ role: 'user', parts: [{ text: txt }] });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', contents: history,
        config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.7 },
      });
      setMessages(p => [...p, { id: Date.now().toString(), role: 'assistant', content: response.text || "Synchronizing..." }]);
    } catch (e) {
      setMessages(p => [...p, { id: Date.now().toString(), role: 'assistant', content: "Protocol interruption. My systems are resyncing." }]);
    } finally { setIsTyping(false); }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.98 }}
            className="fixed bottom-24 md:bottom-24 right-4 md:right-8 z-[200] w-[85vw] md:w-[320px] h-[60vh] md:h-[450px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden"
          >
            <div className="p-3.5 bg-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center"><Sparkles size={14} /></div>
                <div><h3 className="font-black text-[9px] uppercase tracking-widest leading-none">UMAIMA</h3><p className="text-[6px] font-black uppercase text-purple-400">Elite Sync Active</p></div>
              </div>
              <button onClick={() => setVoiceEnabled(!voiceEnabled)} className={`p-1.5 rounded-md ${voiceEnabled ? 'bg-purple-600' : 'bg-white/10'}`}><Volume2 size={12} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950 no-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-2.5 rounded-xl text-[10px] font-bold shadow-sm ${msg.role === 'user' ? 'bg-slate-950 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'}`}>
                    {msg.content}
                    {msg.role === 'assistant' && (
                      <div className="mt-1.5 flex justify-end">
                        <button onClick={() => handleSpeak(msg.id, msg.content)} className="p-1 rounded-md bg-slate-50 dark:bg-slate-700">
                          {isLoadingVoice === msg.id ? <Loader2 size={8} className="animate-spin" /> : <Volume2 size={8} />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && <div className="flex justify-start"><div className="bg-white dark:bg-slate-800 p-2 rounded-lg flex gap-1 shadow-sm"><div className="w-1 h-1 bg-purple-600 rounded-full animate-bounce" /><div className="w-1 h-1 bg-purple-600 rounded-full animate-bounce [animation-delay:0.2s]" /></div></div>}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <form onSubmit={handleSend} className="flex gap-1.5">
                <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask anything..." className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg outline-none focus:ring-1 focus:ring-purple-600 text-[9px] font-bold dark:text-white" />
                <button type="submit" disabled={!input.trim() || isTyping} className="p-1.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-lg active:scale-95 disabled:opacity-50"><Send size={14} /></button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <RobotTrigger onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
    </>
  );
};