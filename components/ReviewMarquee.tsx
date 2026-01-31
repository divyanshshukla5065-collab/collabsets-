
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const REVIEWS = [
  {
    name: "Shaurya Gaikwad",
    image: "https://i.postimg.cc/sgvjhJFp/shaurya-leap.jpg",
    review: "Collabset transformed how I handle brand deals. The speed and transparency is unmatched in India.",
    role: "Top Creator"
  },
  {
    name: "Raul John Aju",
    image: "https://i.postimg.cc/Sx7rccWk/raul-john.jpg",
    review: "The most professional platform I've used. UMAIMA makes matching with elite brands effortless.",
    role: "Elite Talent"
  }
];

// Duplicate the reviews to create a seamless loop
const DUPLICATED_REVIEWS = [...REVIEWS, ...REVIEWS, ...REVIEWS, ...REVIEWS, ...REVIEWS];

export const ReviewMarquee: React.FC = () => {
  return (
    <div className="w-full py-16 overflow-hidden bg-white/50 dark:bg-slate-950/20 border-y border-slate-200/50 dark:border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <p className="text-[11px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-[0.4em] flex items-center gap-2.5 opacity-80">
          <Star size={14} fill="currentColor" /> Elite Network Testimonials
        </p>
      </div>
      
      <div className="relative flex">
        <motion.div
          animate={{
            x: [0, -1120], // Adjusted for new card width + gap
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-12 whitespace-nowrap px-6"
        >
          {DUPLICATED_REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[350px] md:w-[450px] p-8 bg-white dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/60 dark:border-white/5 rounded-[40px] shadow-xl shadow-slate-200/30 dark:shadow-none flex items-center gap-6"
            >
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-[24px] p-0.5 bg-gradient-premium">
                  <div className="w-full h-full rounded-[22px] overflow-hidden bg-white dark:bg-slate-900 p-0.5">
                    <img
                      src={rev.image}
                      alt={rev.name}
                      className="w-full h-full rounded-[20px] object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 mb-2">
                  <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-tight truncate">
                    {rev.name}
                  </h4>
                  <span className="w-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{rev.role}</span>
                </div>
                <p className="text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic whitespace-normal line-clamp-2">
                  "{rev.review}"
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
