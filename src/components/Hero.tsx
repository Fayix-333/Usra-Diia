import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Play, Sparkles, Key, GraduationCap } from 'lucide-react';
import { staggerContainerVariants, staggerItemVariants } from '../animations';

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

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    interface Particle {
      x: number;
      y: number;
      originX: number;
      originY: number;
      vx: number;
      vy: number;
      radius: number;
      baseRadius: number;
      color: string;
      alpha: number;
      baseAlpha: number;
      pulseSpeed: number;
      pulseAngle: number;
    }

    let particles: Particle[] = [];
    const isMobile = window.innerWidth < 768;
    const numParticles = isMobile ? 42 : 80;
    const connectionDistance = isMobile ? 85 : 125;
    const mouseRadius = isMobile ? 120 : 170;

    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, isHovering: false };

    const colors = [
      { r: 59, g: 130, b: 246 },   // Blue-500
      { r: 6, g: 182, b: 212 },    // Cyan-500
      { r: 96, g: 165, b: 250 },   // Blue-400
      { r: 34, g: 211, b: 238 },   // Cyan-400
      { r: 129, g: 140, b: 248 },  // Indigo-400
      { r: 248, g: 250, b: 252 },  // Slate-50
    ];

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const colorObj = colors[Math.floor(Math.random() * colors.length)];
        const color = `${colorObj.r}, ${colorObj.g}, ${colorObj.b}`;
        const baseRadius = Math.random() * 1.6 + 0.6;
        const baseAlpha = Math.random() * 0.45 + 0.15;

        particles.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: baseRadius,
          baseRadius,
          color,
          alpha: baseAlpha,
          baseAlpha,
          pulseSpeed: Math.random() * 0.02 + 0.008,
          pulseAngle: Math.random() * Math.PI * 2,
        });
      }
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = clientX - rect.left;
      mouse.targetY = clientY - rect.top;
      mouse.isHovering = true;
    };

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onPointerLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.isHovering = false;
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    resizeCanvas();
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
    window.addEventListener('touchend', onPointerLeave);

    let lastTime = performance.now();

    const draw = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth mouse interpolation
      if (mouse.targetX !== -1000) {
        mouse.x += (mouse.targetX - mouse.x) * 0.12;
        mouse.y += (mouse.targetY - mouse.y) * 0.12;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      ctx.clearRect(0, 0, width, height);

      // Subtle interactive mouse ambient aura
      if (mouse.x !== -1000 && mouse.y !== -1000) {
        const mouseGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouseRadius * 1.2
        );
        mouseGlow.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
        mouseGlow.addColorStop(0.5, 'rgba(59, 130, 246, 0.03)');
        mouseGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = mouseGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouseRadius * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Organic harmonic drifting
        p.pulseAngle += p.pulseSpeed;
        const pulse = Math.sin(p.pulseAngle);
        p.alpha = p.baseAlpha + pulse * 0.12;
        p.radius = p.baseRadius + pulse * 0.3;

        // Position update
        p.x += p.vx * (1 + pulse * 0.2);
        p.y += p.vy * (1 + pulse * 0.2);

        // Gentle boundary loop
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        // Interactive mouse physics (subtle fluid attraction & repelling)
        if (mouse.x !== -1000 && mouse.y !== -1000) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSq = dx * dx + dy * dy;
          const mouseRadiusSq = mouseRadius * mouseRadius;

          if (distSq < mouseRadiusSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const factor = (mouseRadius - dist) / mouseRadius;
            
            // Light deflection force
            const force = factor * 2.2;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;

            // Extra brightness near cursor
            p.alpha = Math.min(1, p.alpha + factor * 0.5);
            p.radius = p.baseRadius + factor * 1.2;
          }
        }

        // Draw particle dot with soft glow
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${Math.max(0.05, Math.min(1, p.alpha))})`;
        ctx.fill();

        // Optional tiny glow for larger particles
        if (p.baseRadius > 1.4) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, p.alpha * 0.2)})`;
          ctx.fill();
        }
        ctx.restore();
      }

      // Draw dynamic constellation connection lines
      const connSq = connectionDistance * connectionDistance;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connSq) {
            const dist = Math.sqrt(distSq);
            const opacity = (1 - dist / connectionDistance) * 0.16;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }

        // Connect particle to mouse if in range
        if (mouse.x !== -1000 && mouse.y !== -1000) {
          const dx = mouse.x - p1.x;
          const dy = mouse.y - p1.y;
          const distSq = dx * dx + dy * dy;
          const mouseConnSq = (mouseRadius * 0.85) * (mouseRadius * 0.85);

          if (distSq < mouseConnSq) {
            const dist = Math.sqrt(distSq);
            const opacity = (1 - dist / (mouseRadius * 0.85)) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('touchend', onPointerLeave);
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
