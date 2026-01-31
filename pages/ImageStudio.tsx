
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, Sparkles, Wand2, Settings, Download, 
  RefreshCw, AlertCircle, ExternalLink, Key, Loader2,
  Maximize2, Share2, ChevronLeft
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useAuth } from '../context/AuthContext';
// Fix: Verified named exports from react-router-dom
import { useNavigate } from 'react-router-dom';

const SIZE_OPTIONS = ['1K', '2K', '4K'] as const;
type ImageSize = typeof SIZE_OPTIONS[number];

const ASPECT_RATIOS = [
  { label: '1:1', value: '1:1', icon: <div className="w-3 h-3 border-2 border-current" /> },
  { label: '16:9', value: '16:9', icon: <div className="w-5 h-3 border-2 border-current" /> },
  { label: '9:16', value: '9:16', icon: <div className="w-3 h-5 border-2 border-current" /> },
  { label: '4:3', value: '4:3', icon: <div className="w-4 h-3 border-2 border-current" /> },
  { label: '3:4', value: '3:4', icon: <div className="w-3 h-4 border-2 border-current" /> },
];

const REASSURING_MESSAGES = [
  "Manifesting your creative prompt...",
  "Applying professional lighting and textures...",
  "Rendering fine details in the selected resolution...",
  "UMAIMA is finalizing the visual composition...",
  "Almost there, sharpening the masterpiece...",
];

export const ImageStudio: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [prompt, setPrompt] = useState('');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMessageIndex, setProgressMessageIndex] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<{url: string, prompt: string, size: string}[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  useEffect(() => {
    checkKeyStatus();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setProgressMessageIndex((prev) => (prev + 1) % REASSURING_MESSAGES.length);
      }, 3000);
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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
            imageSize: imageSize
          }
        },
      });

      let foundImage = false;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          setGeneratedImages(prev => [{url: imageUrl, prompt, size: imageSize}, ...prev]);
          setActiveImageIndex(0);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        throw new Error("Generation completed but no image data was found in the response.");
      }

    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        setError("API Key session expired or invalid. Please re-select a paid project key.");
      } else {
        setError(err.message || "Something went wrong during image generation.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `collabset-ai-gen-${index}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (hasKey === false) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
          <Key className="w-10 h-10 text-purple-600" />
        </div>
        <h1 className="text-4xl font-black text-slate-950 dark:text-white mb-6 uppercase tracking-tighter">Enter the Visionary Studio</h1>
        <p className="text-slate-600 dark:text-slate-400 font-bold mb-10 text-lg leading-relaxed">
          To generate ultra-high fidelity images (up to 4K) using UMAIMA's advanced engine, you must select a paid Google AI Studio API key.
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
            Billing Setup Guide <ExternalLink size={14} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <header className="mb-12">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-black text-[10px] uppercase tracking-widest mb-6 transition-colors group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-full text-purple-600 text-[10px] font-black uppercase tracking-widest mb-4">
              <Sparkles size={12} /> Powered by Gemini 3 Pro
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-950 dark:text-white tracking-tighter uppercase">AI Image Studio</h1>
            <p className="text-slate-600 dark:text-slate-400 font-bold mt-2">Create elite campaign assets in ultra-high resolution.</p>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
             <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Vision Engine Online</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Controls Panel */}
        <div className="lg:col-span-5 space-y-8">
          <form onSubmit={handleGenerate} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-700 dark:text-slate-400 uppercase tracking-widest">UMAIMA's Canvas Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your vision: 'A hyper-realistic close-up of a premium tech gadget on a marble surface, cinematic mood lighting, bokeh background, 8k resolution, elegant aesthetics...'"
                className="w-full p-6 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl focus:ring-2 focus:ring-purple-600 outline-none text-slate-950 dark:text-white font-bold text-sm h-48 resize-none shadow-inner"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-700 dark:text-slate-400 uppercase tracking-widest">Target Size</label>
              <div className="grid grid-cols-3 gap-3 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                {SIZE_OPTIONS.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setImageSize(size)}
                    className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${imageSize === size ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-700 dark:text-slate-400 uppercase tracking-widest">Aspect Ratio</label>
              <div className="flex flex-wrap gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.value}
                    type="button"
                    onClick={() => setAspectRatio(ratio.value)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border ${aspectRatio === ratio.value ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700 hover:border-purple-600'}`}
                  >
                    {ratio.icon}
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className={`w-full py-6 rounded-3xl bg-gradient-premium text-white font-black text-xl flex items-center justify-center gap-3 shadow-2xl transition-all ${isGenerating || !prompt.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin w-6 h-6" /> Manifesting...
                </>
              ) : (
                <>
                  <Wand2 size={24} /> Generate Asset
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
          <div className="bg-slate-100 dark:bg-slate-800/50 rounded-[48px] border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center p-12 text-center"
                >
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-20 animate-pulse" />
                    <RefreshCw size={80} className="text-purple-600 animate-spin" />
                  </div>
                  <motion.p
                    key={progressMessageIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter"
                  >
                    {REASSURING_MESSAGES[progressMessageIndex]}
                  </motion.p>
                  <div className="h-1.5 w-48 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-8">
                    <motion.div 
                      animate={{ x: [-200, 200] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="h-full w-24 bg-gradient-premium rounded-full"
                    />
                  </div>
                </motion.div>
              ) : generatedImages.length > 0 ? (
                <motion.div
                  key="gallery"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col p-8"
                >
                  <div className="flex-1 flex items-center justify-center mb-8">
                    <div className={`relative shadow-2xl rounded-2xl overflow-hidden bg-slate-950 max-w-full max-h-[500px] ${aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-auto'}`}>
                       <img 
                        src={generatedImages[activeImageIndex || 0].url} 
                        className="w-full h-full object-contain"
                        alt="Generated"
                       />
                       <div className="absolute top-4 right-4 flex gap-2">
                         <button 
                          onClick={() => downloadImage(generatedImages[activeImageIndex || 0].url, activeImageIndex || 0)}
                          className="p-3 bg-white/90 backdrop-blur-md rounded-xl text-slate-900 shadow-xl hover:scale-110 transition-transform"
                         >
                           <Download size={20} />
                         </button>
                         <button className="p-3 bg-white/90 backdrop-blur-md rounded-xl text-slate-900 shadow-xl hover:scale-110 transition-transform">
                           <Share2 size={20} />
                         </button>
                       </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-2">
                    {generatedImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-purple-600 scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
                      >
                        <img src={img.url} className="w-full h-full object-cover" alt={`History ${idx}`} />
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center p-12 text-center"
                >
                  <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
                    <ImageIcon className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-400 dark:text-slate-600 mb-2 uppercase tracking-tighter">Studio Idle</h3>
                  <p className="text-slate-400 dark:text-slate-600 font-bold max-w-xs">Manifest your creative vision using the prompt panel on the left.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
