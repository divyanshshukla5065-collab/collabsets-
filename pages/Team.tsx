
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Linkedin, Twitter, Quote, Heart, ShieldCheck, UserCheck } from 'lucide-react';

export const Team: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-24 text-center"
        >
          <h1 className="text-4xl md:text-7xl font-black text-slate-950 dark:text-white mb-4 tracking-tighter uppercase">
            THE <span className="text-gradient-premium">LEADERSHIP</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">
            The Visionaries Driving Collabset
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 mb-32 items-start">
          {/* Proprietor Section */}
          <LeaderCard 
            name="Shalini Shukla"
            title="Proprietor & Director"
            image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1000&fit=crop"
            roleColor="text-amber-500"
            icon={<ShieldCheck className="text-amber-500" />}
            bio="The cornerstone of Collabset's legal and strategic foundation. As Proprietor, Shalini oversees the platform's overarching governance, ensuring excellence in every transaction and partnership."
            insta="https://instagram.com"
            linkedin="https://linkedin.com"
          />

          {/* CEO Section */}
          <LeaderCard 
            name="DIVYANSH SHUKLA"
            title="Founder & CEO"
            image="https://i.postimg.cc/k4p9QZNn/Whats-App-Image-2026-01-24-at-11-02-06-PM.jpg"
            roleColor="text-purple-600"
            icon={<UserCheck className="text-purple-600" />}
            bio="The creative architect behind the Collabset vision. Divyansh's expertise in engineering high-speed digital networks has redefined how creators and brands connect in the Indian market."
            insta="https://www.instagram.com/divyansh_builds?igsh=NDVhb3ZraTZxZ2Z5"
            linkedin="https://www.linkedin.com/in/collabset-startup-764210397?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
          />
        </div>

        {/* Global Mission Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center space-y-8"
        >
          <div className="relative max-w-3xl mx-auto py-12">
            <Quote className="absolute -top-4 -left-4 w-12 h-12 text-slate-100 dark:text-slate-800 -z-10" />
            <p className="text-2xl md:text-4xl text-slate-800 dark:text-slate-300 font-black leading-tight italic tracking-tighter uppercase">
              "We are building more than a network; we are engineering a legacy of transparency."
            </p>
          </div>

          <div className="flex justify-center">
            <div className="h-1.5 w-32 bg-gradient-premium rounded-full" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const LeaderCard = ({ name, title, image, bio, roleColor, icon, insta, linkedin }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="space-y-8">
      <motion.div
        className="relative rounded-[48px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] cursor-pointer aspect-[3/4] bg-slate-200 dark:bg-slate-800 group border border-slate-100 dark:border-slate-800"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-cover select-none pointer-events-none transition-all duration-700 ease-in-out"
          style={{ 
            filter: isHovered ? 'grayscale(0%) brightness(1.05) contrast(1.1)' : 'grayscale(100%) brightness(0.9) contrast(1.2)',
            imageRendering: '-webkit-optimize-contrast' as any
          }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
        />
        
        {/* Premium HD Overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-30 pointer-events-none" />
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-50' : 'opacity-80'}`} />
        
        {/* Accent Light Border */}
        <div className="absolute inset-6 rounded-[32px] border border-white/5 pointer-events-none" />

        {!isHovered && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 shadow-xl">
              <Heart className="w-8 h-8 text-white fill-white/80" />
            </div>
            <p className="font-black uppercase tracking-[0.4em] text-[10px] text-white/60">Unlock Vision</p>
          </div>
        )}

        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-10 left-0 right-0 flex justify-center gap-6 z-20 px-8"
            >
              <a href={insta} target="_blank" rel="noreferrer" className="p-4 bg-white/90 backdrop-blur-md rounded-2xl text-slate-900 hover:scale-110 shadow-2xl transition-transform border border-white"><Instagram size={20} /></a>
              <a href={linkedin} target="_blank" rel="noreferrer" className="p-4 bg-white/90 backdrop-blur-md rounded-2xl text-slate-900 hover:scale-110 shadow-2xl transition-transform border border-white"><Linkedin size={20} /></a>
              <a href="#" className="p-4 bg-white/90 backdrop-blur-md rounded-2xl text-slate-900 hover:scale-110 shadow-2xl transition-transform border border-white"><Twitter size={20} /></a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="text-center md:text-left space-y-4 px-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tighter uppercase">{name}</h2>
          <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
            {icon}
            <p className={`${roleColor} font-black text-sm uppercase tracking-[0.2em]`}>{title}</p>
          </div>
        </div>
        <p className="text-base text-slate-600 dark:text-slate-400 font-bold leading-relaxed">{bio}</p>
      </div>
    </div>
  );
};
