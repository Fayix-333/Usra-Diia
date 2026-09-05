import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Play, Sparkles, Key, GraduationCap } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onJoinClick: () => void;
  onLoginClick?: () => void;
}

export default function Hero({ onExploreClick, onJoinClick, onLoginClick }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }> = [];

    const numParticles = 65;
    let mouse = { x: -1000, y: -1000 };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const colors = ['#3b82f6', '#06b6d4', '#60a5fa', '#ffffff'];
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.4 + 0.1,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    resizeCanvas();
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particle nodes
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Mouse repelling physics
        if (mouse.x !== -1000) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            p.x += (dx / dist) * force * 1.5;
            p.y += (dy / dist) * force * 1.5;
          }
        }

        // Render particle
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw elegant connections
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.04)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Matte black background with absolute mesh glow layers */}
      <div className="absolute inset-0 bg-[#030303] z-0" />

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

      {/* Interactive Particle Field Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/40 via-transparent to-[#030303] pointer-events-none z-10" />

      {/* Content Container */}
      <div className="container mx-auto px-6 relative z-20 text-center max-w-4xl">
        {/* Soft tag accent */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-md mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blue-400 font-semibold">
            Student Union Media &amp; Creative Wing
          </span>
        </motion.div>

        {/* Master Branding Heading */}
        <div className="relative mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-display font-black text-8xl md:text-[11rem] leading-none tracking-tighter select-none text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-600 relative z-10"
          >
            USRA
          </motion.h1>
          
          {/* Subtle logo reflection blur */}
          <div className="absolute -inset-2 bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl rounded-full opacity-30 select-none pointer-events-none" />
        </div>

        {/* High-fidelity Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="font-display text-xl md:text-3xl text-neutral-300 font-light tracking-wide max-w-2xl mx-auto mb-12"
        >
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-glow">U</span>nion for <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-glow">S</span>incere &amp; <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-glow">R</span>ejuvenated <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-glow">A</span>ctivies
        </motion.p>

        {/* Apple-style CTAs (Liquid Glass Buttons) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="flex flex-col items-center gap-2 cursor-pointer"
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
      </div>

      {/* Glass gradient separator line at the bottom */}
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
