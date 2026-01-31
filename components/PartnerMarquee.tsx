
import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const PARTNERS = [
  { name: "SHAURYA GAIKWAD", image: "https://i.postimg.cc/sgvjhJFp/shaurya-leap.jpg" },
  { name: "RAUL JOHN AJU", image: "https://i.postimg.cc/Sx7rccWk/raul-john.jpg" },
  { name: "AYUSH", image: "https://i.postimg.cc/kgKnsg4M/ayush-leap.jpg" },
  { name: "ANMOL", image: "https://i.postimg.cc/QCFDTXPw/agentic-anmol.jpg" },
  { name: "ANISH", image: "https://i.postimg.cc/FKGXCdQ4/anish-insayyy.jpg" },
  { name: "PARITOSH", image: "https://i.postimg.cc/sfM1Sypf/paritosh-anand.jpg" },
  { name: "RAJ SHAMANI", image: "https://i.postimg.cc/qvx707d9/raj-shamami.jpg" },
  { name: "PARINEETI", image: "https://i.postimg.cc/xTKfydqY/pareeneti.jpg" },
  { name: "RUTHVIK", image: "https://i.postimg.cc/br1hT6y4/edunetic-india-ruthvik.jpg" },
  { name: "SANJAY KUMAR", image: "https://i.postimg.cc/mD7XJ9yB/sanjay.jpg" }
];

// Duplicate for seamless loop
const DUPLICATED_PARTNERS = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS];

export const PartnerMarquee: React.FC = () => {
  return (
    <div className="w-full py-6 overflow-hidden bg-white/30 dark:bg-slate-900/10 border-b border-slate-200/50 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 mb-4">
        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
          <Zap size={10} className="text-amber-500 fill-amber-500" /> Strategic Top Partners
        </p>
      </div>

      <div className="relative flex">
        <motion.div
          animate={{
            x: [-1500, 0], // Moving from left to right
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-4 whitespace-nowrap"
        >
          {DUPLICATED_PARTNERS.map((partner, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 flex items-center gap-3 px-5 py-3 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-sm"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 flex-shrink-0">
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(partner.name) + "&background=7c3aed&color=fff";
                  }}
                />
              </div>
              <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                {partner.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
