import { motion } from 'motion/react';
import { ArrowDown, Play, Sparkles, Key, GraduationCap } from 'lucide-react';
import { staggerContainerVariants, staggerItemVariants } from '../animations';
import VisitorCounter from './VisitorCounter';

interface HeroProps {
  onExploreClick: () => void;
  onJoinClick: () => void;
  onLoginClick?: () => void;
}

export default function Hero({ onExploreClick, onJoinClick, onLoginClick }: HeroProps) {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Matte black background with absolute mesh glow layers */}
      <div className="absolute inset-0 bg-[#030303]/80 z-0" />

      {/* Floating Animated Aurora Mesh */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <motion.div
          animate={{
            scale: [1, 1.15, 0.95, 1],
            x: [0, 40, -30, 0],
            y: [0, -30, 50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[70%] rounded-full bg-gradient-to-tr from-blue-600/15 via-indigo-600/5 to-transparent blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 0.9, 1.1, 1],
            x: [0, -50, 30, 0],
            y: [0, 40, -40, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[80%] rounded-full bg-gradient-to-bl from-cyan-500/10 via-blue-500/5 to-transparent blur-[130px]"
        />
      </div>

      {/* Premium grid texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:24px_24px] opacity-35 z-0 pointer-events-none" />

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/40 via-transparent to-[#030303] pointer-events-none z-10" />

      {/* Content Container */}
      <motion.div 
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
        className="container mx-auto px-6 relative z-20 text-center max-w-4xl"
      >
        {/* Soft tag accent */}
        <motion.div
          variants={staggerItemVariants}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-md mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blue-400 font-semibold">
            Student Union Media &amp; Creative Wing
          </span>
        </motion.div>

        {/* Master Branding Heading */}
        <motion.div variants={staggerItemVariants} className="relative mb-6">
          <h1 className="font-display font-black text-8xl md:text-[11rem] leading-none tracking-tighter select-none text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-600 relative z-10">
            USRA
          </h1>
          
          {/* Subtle logo reflection blur */}
          <div className="absolute -inset-2 bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl rounded-full opacity-30 select-none pointer-events-none" />
        </motion.div>

        {/* High-fidelity Subtitle */}
        <motion.p
          variants={staggerItemVariants}
          className="font-display text-xl md:text-3xl text-neutral-300 font-light tracking-wide max-w-2xl mx-auto mb-12"
        >
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-glow">U</span>nion for <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-glow">S</span>incere &amp; <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-glow">R</span>ejuvenated <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-glow">A</span>ctivies
        </motion.p>

        {/* Live Visitor Counter Community Metric */}
        <motion.div 
          variants={staggerItemVariants}
          className="mb-12 flex justify-center"
        >
          <VisitorCounter />
        </motion.div>

        {/* Apple-style CTAs (Liquid Glass Buttons) */}
        <motion.div
          variants={staggerItemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-7 py-4 rounded-full font-semibold text-sm tracking-wide text-white bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-white/5 active:scale-[0.98]"
          >
            Explore Showcase
          </button>

          {onLoginClick && (
            <button
              onClick={onLoginClick}
              className="w-full sm:w-auto px-7 py-4 rounded-full font-semibold text-sm tracking-wide text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Key className="w-4 h-4 text-cyan-400" />
              <span>Portal Login</span>
            </button>
          )}
          
          <button
            onClick={onJoinClick}
            className="w-full sm:w-auto px-7 py-4 rounded-full font-semibold text-sm tracking-wide text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_30px_rgba(59,130,246,0.55)] active:scale-[0.98]"
          >
            Join Us
          </button>
        </motion.div>

        {/* Ambient indicator footer for the Hero */}
        <motion.div
          variants={staggerItemVariants}
          className="flex flex-col items-center gap-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
          onClick={onExploreClick}
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-400">
            Scroll to Navigate
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Glass gradient separator line at the bottom */}
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
