import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  glowColor: string;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulseAngle: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let particles: Particle[] = [];

    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1200;

    // Responsive density and interaction metrics
    const getDensity = () => {
      if (width < 640) return 45;
      if (width < 1024) return 75;
      if (width < 1600) return 110;
      return 140;
    };

    const connectionDistance = isMobile ? 95 : isTablet ? 120 : 145;
    const mouseRadius = isMobile ? 130 : 180;

    let mouse = {
      x: -2000,
      y: -2000,
      targetX: -2000,
      targetY: -2000,
      isHovering: false,
      speed: 0,
      lastX: -2000,
      lastY: -2000,
    };

    const colorPalette = [
      { rgb: '59, 130, 246', glow: 'rgba(59, 130, 246, 0.4)' },  // Electric Blue
      { rgb: '6, 182, 212', glow: 'rgba(6, 182, 212, 0.45)' },   // Cyan
      { rgb: '96, 165, 250', glow: 'rgba(96, 165, 250, 0.35)' }, // Sky
      { rgb: '34, 211, 238', glow: 'rgba(34, 211, 238, 0.45)' }, // Bright Cyan
      { rgb: '129, 140, 248', glow: 'rgba(129, 140, 248, 0.35)' },// Indigo
      { rgb: '241, 245, 249', glow: 'rgba(255, 255, 255, 0.3)' }, // Star White
    ];

    const initParticles = () => {
      particles = [];
      const count = getDensity();

      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const colorItem = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        const baseRadius = Math.random() * 1.6 + 0.6;
        const baseAlpha = Math.random() * 0.4 + 0.15;

        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: baseRadius,
          baseRadius,
          color: colorItem.rgb,
          glowColor: colorItem.glow,
          alpha: baseAlpha,
          baseAlpha,
          pulseSpeed: Math.random() * 0.02 + 0.008,
          pulseAngle: Math.random() * Math.PI * 2,
        });
      }
    };

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initParticles();
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      mouse.targetX = clientX;
      mouse.targetY = clientY;
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
      mouse.targetX = -2000;
      mouse.targetY = -2000;
      mouse.isHovering = false;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
    window.addEventListener('touchend', onPointerLeave);

    const draw = () => {
      // Smooth lerp mouse tracking
      if (mouse.targetX !== -2000) {
        if (mouse.x === -2000) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          const dx = mouse.targetX - mouse.x;
          const dy = mouse.targetY - mouse.y;
          mouse.speed = Math.min(Math.hypot(dx, dy), 50);
          mouse.x += dx * 0.14;
          mouse.y += dy * 0.14;
        }
      } else {
        mouse.x = -2000;
        mouse.y = -2000;
        mouse.speed = 0;
      }

      ctx.clearRect(0, 0, width, height);

      // Subtle ambient cursor beacon & radial illumination
      if (mouse.x > -100 && mouse.x < width + 100 && mouse.y > -100 && mouse.y < height + 100) {
        // Outer soft radiant field
        const outerGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouseRadius * 1.2
        );
        outerGlow.addColorStop(0, 'rgba(6, 182, 212, 0.07)');
        outerGlow.addColorStop(0.4, 'rgba(59, 130, 246, 0.03)');
        outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouseRadius * 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Focused cursor center nexus star
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 211, 238, 0.85)';
        ctx.shadowColor = 'rgba(6, 182, 212, 0.9)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // Update & render particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Harmonic organic breathing cycle
        p.pulseAngle += p.pulseSpeed;
        const pulse = Math.sin(p.pulseAngle);
        p.alpha = p.baseAlpha + pulse * 0.12;
        p.radius = p.baseRadius + pulse * 0.25;

        // Position drift
        p.x += p.vx * (1 + pulse * 0.15);
        p.y += p.vy * (1 + pulse * 0.15);

        // Continuous toroidal screen looping
        if (p.x < -15) p.x = width + 15;
        else if (p.x > width + 15) p.x = -15;
        if (p.y < -15) p.y = height + 15;
        else if (p.y > height + 15) p.y = -15;

        // Interactive cursor repulsion & energizing effect
        if (mouse.x !== -2000 && mouse.y !== -2000) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSq = dx * dx + dy * dy;
          const mouseRadiusSq = mouseRadius * mouseRadius;

          if (distSq < mouseRadiusSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const factor = (mouseRadius - dist) / mouseRadius;

            // Elastic deflection physics
            const force = factor * 2.4;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;

            // Heightened illumination & size near cursor
            p.alpha = Math.min(1, p.alpha + factor * 0.55);
            p.radius = p.baseRadius + factor * 1.5;
          }
        }

        // Draw particle node
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.6, p.radius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${Math.max(0.05, Math.min(1, p.alpha))})`;
        ctx.fill();

        // Subtle glow halo on larger particles
        if (p.baseRadius > 1.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, p.alpha * 0.2)})`;
          ctx.fill();
        }
        ctx.restore();
      }

      // Draw constellation network lines between adjacent particles
      const connDistSq = connectionDistance * connectionDistance;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connDistSq) {
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

        // Dynamic starburst filament links directly to cursor
        if (mouse.x !== -2000 && mouse.y !== -2000) {
          const dx = mouse.x - p1.x;
          const dy = mouse.y - p1.y;
          const distSq = dx * dx + dy * dy;
          const cursorConnDist = mouseRadius * 0.95;
          const cursorConnDistSq = cursorConnDist * cursorConnDist;

          if (distSq < cursorConnDistSq) {
            const dist = Math.sqrt(distSq);
            const opacity = (1 - dist / cursorConnDist) * 0.28;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('touchend', onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[1] w-full h-full"
    />
  );
}
