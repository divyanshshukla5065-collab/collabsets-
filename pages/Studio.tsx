
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Sparkles, Wand2, Settings, Download, Play, 
  RefreshCw, AlertCircle, ExternalLink, Key, Loader2,
  Clock, CheckCircle2, Monitor, Smartphone, Layout,
  Tag, Zap, Camera, Globe, PartyPopper
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useAuth } from '../context/AuthContext';

const REASSURING_MESSAGES = [
  "UMAIMA is sketching the initial frames...",
  "Applying cinematic lighting to your vision...",
  "Rendering textures and fine details...",
  "Almost there, finalizing the motion paths...",
  "Encoding your masterpiece...",
  "Preparing the high-definition preview..."
];

const PROMPT_TEMPLATES = [
  {
    id: 'brand',
    title: 'Brand Promotion',
    icon: <Zap size={14} />,
    prompt: "A high-energy, cinematic brand promotion video featuring [Your Product/Brand]. Shot in 4k, professional studio lighting, modern urban setting, fast cuts, vibrant colors, premium aesthetic."
  },
  {
    id: 'product',
    title: 'Product Demo',
    icon: <Camera size={14} />,
    prompt: "A clean, minimalist product demonstration video in a high-end studio setting. Focus on sleek design and key features of [Your Product], soft diffused lighting, 60fps slow-motion shots, shallow depth of field."
  },
  {
    id: 'travel',
    title: 'Travel Vlog Intro',
    icon: <Globe size={14} />,
    prompt: "An epic travel vlog introduction. Breathtaking landscape shots of [Destination Name] at golden hour, sweeping drone movements, high dynamic range, cinematic transitions, immersive atmosphere."
  },
  {
    id: 'event',
    title: 'Event Highlight',
    icon: <PartyPopper size={14} />,
    prompt: "A vibrant event highlight snippet. Energetic crowd shots, sparkling stage lights, focused on key moments of [Event Name], professional photography style, lively atmosphere, motion blur."
  }
];

export const Studio: React.FC = () => {
  const { user } = useAuth();
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMessageIndex, setProgressMessageIndex] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkKeyStatus();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setProgressMessageIndex((prev) => (prev + 1) % REASSURING_MESSAGES.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const checkKeyStatus = async () => {
    try {
      if (typeof (window as any).aistudio?.hasSelectedApiKey === 'function') {
        const selected = await (window as any).aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        setHasKey(false);
      }
    } catch (err) {
      setHasKey(false);
    }
  };

  const handleOpenKeySelector = async () => {
    try {
      await (window as any).aistudio.openSelectKey();
      setHasKey(true);
    } catch (err) {
      console.error("Failed to open key selector", err);
    }
  };

  const applyTemplate = (templatePrompt: string) => {
    setPrompt(templatePrompt);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setVideoUrl(null);
    setError(null);

    try {
      // Initialize GoogleGenAI strictly using process.env.API_KEY as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: resolution,
          aspectRatio: aspectRatio
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        try {
          operation = await ai.operations.getVideosOperation({ operation: operation });
        } catch (pollErr: any) {
          if (pollErr.message?.includes("Requested entity was not found")) {
            setHasKey(false);
            throw new Error("API Key session expired. Please re-select your key.");
          }
          throw pollErr;
        }
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      } else {
        throw new Error("Video generation completed but no download link was found.");
      }

    } catch (err: any) {
      setError(err.message || "Something went wrong during video generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (hasKey === false) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
          <Key className="w-10 h-10 text-purple-600" />
        </div>
        <h1 className="text-4xl font-black text-slate-950 dark:text-white mb-6">Connect Your Creator Studio</h1>
        <p className="text-slate-600 dark:text-slate-400 font-bold mb-10 text-lg leading-relaxed">
          To access the elite AI Video generation tools, you must connect a paid Google AI Studio API key. This ensures high-priority processing for your campaigns.
        </p>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleOpenKeySelector}
            className="px-10 py-5 bg-gradient-premium text-white font-black text-xl rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            <Settings size={24} /> Select Paid API Key
          </button>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-black text-slate-500 hover:text-purple-600 flex items-center gap-2"
          >
            How to setup billing <ExternalLink size={14} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <header className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-full text-amber-600 text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles size={12} /> Powered by Veo 3.1
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-950 dark:text-white tracking-tighter">AI VIDEO STUDIO</h1>
          <p className="text-slate-600 dark:text-slate-400 font-bold mt-2">Transform your scripts into high-impact visual stories.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
           <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Creator Engine Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Controls Panel */}
        <div className="lg:col-span-5 space-y-8">
          <form onSubmit={handleGenerate} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-slate-700 dark:text-slate-400 uppercase tracking-widest">Video Prompt</label>
                <div className="flex items-center gap-1 text-[10px] font-black text-purple-600 uppercase">
                  <Tag size={12} /> Suggestions
                </div>
              </div>

              {/* Template Chips */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {PROMPT_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => applyTemplate(template.prompt)}
                    className="flex-shrink-0 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:border-purple-500 hover:text-purple-600 transition-all text-slate-700 dark:text-slate-300"
                  >
                    {template.icon}
                    {template.title}
                  </button>
                ))}
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your scene: 'A cinematic drone shot of a futuristic Mumbai skyline at sunset, cyberpunk aesthetic, neon lights reflecting in the ocean...'"
                className="w-full p-6 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl focus:ring-2 focus:ring-purple-600 outline-none text-slate-950 dark:text-white font-bold text-sm h-48 resize-none shadow-inner"
              />
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => setPrompt('')}
                  className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                >
                  Clear Prompt
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-700 dark:text-slate-400 uppercase tracking-widest">Aspect Ratio</label>
                <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('16:9')}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${aspectRatio === '16:9' ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    <Monitor size={14} /> 16:9
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('9:16')}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${aspectRatio === '9:16' ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    <Smartphone size={14} /> 9:16
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-700 dark:text-slate-400 uppercase tracking-widest">Resolution</label>
                <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setResolution('720p')}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${resolution === '720p' ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    720p
                  </button>
                  <button
                    type="button"
                    onClick={() => setResolution('1080p')}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${resolution === '1080p' ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    1080p
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className={`w-full py-6 rounded-3xl bg-gradient-premium text-white font-black text-xl flex items-center justify-center gap-3 shadow-2xl transition-all ${isGenerating || !prompt.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin w-6 h-6" /> Generating...
                </>
              ) : (
                <>
                  <Wand2 size={24} /> Create Magic
                </>
              )}
            </button>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-3xl flex items-center gap-4 text-red-600 dark:text-red-400"
            >
              <AlertCircle size={24} />
              <div className="flex-1">
                <p className="font-black text-sm uppercase tracking-widest mb-1">Error Occurred</p>
                <p className="text-xs font-bold leading-relaxed">{error}</p>
              </div>
              <button 
                onClick={() => handleOpenKeySelector()}
                className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase"
              >
                Reset Key
              </button>
            </motion.div>
          )}
        </div>

        {/* Display Panel */}
        <div className="lg:col-span-7 flex flex-col">
          <div className={`relative flex-1 bg-slate-100 dark:bg-slate-800 rounded-[48px] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl transition-all min-h-[500px] flex flex-col items-center justify-center ${aspectRatio === '9:16' ? 'max-w-md mx-auto aspect-[9/16]' : 'aspect-video w-full'}`}>
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center p-12 text-center"
                >
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-20 animate-pulse" />
                    <Loader2 size={80} className="text-purple-600 animate-spin" />
                  </div>
                  <motion.p
                    key={progressMessageIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-black text-slate-900 dark:text-white mb-4"
                  >
                    {REASSURING_MESSAGES[progressMessageIndex]}
                  </motion.p>
                  <p className="text-slate-500 dark:text-slate-400 font-bold max-w-sm">
                    High-quality video generation typically takes 2-4 minutes. Grab a coffee while UMAIMA works her magic.
                  </p>
                  <div className="mt-12 flex items-center gap-4">
                    <div className="h-1.5 w-48 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ x: [-200, 200] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="h-full w-24 bg-gradient-premium rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              ) : videoUrl ? (
                <motion.div
                  key="video"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-full flex flex-col"
                >
                  <video 
                    src={videoUrl} 
                    controls 
                    autoPlay 
                    loop 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-8 right-8 flex gap-4">
                    <a 
                      href={videoUrl} 
                      download="collabset-ai-video.mp4"
                      className="p-5 bg-white text-slate-900 rounded-2xl shadow-xl hover:scale-110 transition-transform flex items-center gap-3 font-black"
                    >
                      <Download size={24} /> Download
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center p-12"
                >
                  <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <Play className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-400 dark:text-slate-600 mb-2 uppercase tracking-tighter">Your Masterpiece awaits</h3>
                  <p className="text-slate-400 dark:text-slate-600 font-bold">Input a prompt and click "Create Magic" to start.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
              <Clock className="w-6 h-6 text-purple-600 mb-3" />
              <h4 className="text-sm font-black dark:text-white uppercase mb-1">Fast Preview</h4>
              <p className="text-xs text-slate-500 font-bold">Optimized for speed and initial feedback.</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="w-6 h-6 text-green-500 mb-3" />
              <h4 className="text-sm font-black dark:text-white uppercase mb-1">High Fidelity</h4>
              <p className="text-xs text-slate-500 font-bold">Cinematic rendering using Veo models.</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
              <Layout className="w-6 h-6 text-amber-500 mb-3" />
              <h4 className="text-sm font-black dark:text-white uppercase mb-1">Campaign Ready</h4>
              <p className="text-xs text-slate-500 font-bold">Perfect for Reels, Shorts, and Feed ads.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
