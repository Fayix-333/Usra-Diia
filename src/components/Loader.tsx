import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 600); // Small pause for dramatic effect
          return 100;
        }
        // Smooth random progression
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030303]"
        initial={{ opacity: 1 }}
        exit={{ 
          opacity: 0,
          scale: 1.05,
          filter: 'blur(10px)',
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }}
      >
        {/* Subtle grid pattern backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        {/* Ambient glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center text-center px-4 max-w-md w-full">
          {/* Animated Logo Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 relative"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 p-[1px] shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <div className="w-full h-full rounded-2xl bg-[#090909] flex items-center justify-center relative overflow-hidden group">
                {/* Liquid Glass shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
                <span className="font-display font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400 select-none">
                  U
                </span>
                {/* Micro reflection */}
                <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/20 to-transparent" />
              </div>
            </div>
          </motion.div>

          {/* Core Branding Reveal */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: 60 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="font-display font-extrabold text-5xl tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500"
            >
              USRA
            </motion.h1>
          </div>

          <div className="overflow-hidden mb-12">
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-400/80 font-medium"
            >
              Creative &amp; Media Wing
            </motion.p>
          </div>

          {/* Premium Progress Bar (Apple Style) */}
          <div className="w-48 h-[2px] bg-neutral-900 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_8px_#3b82f6]"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeInOut' }}
            />
          </div>

          {/* Progress Percentage */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="mt-3 font-mono text-[10px] tracking-wider text-neutral-400"
          >
            {progress}%
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
