import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Award, Tv, Users } from 'lucide-react';
import { Achievement } from '../types';

const achievementsData: Achievement[] = [
  {
    id: 'ach-1',
    label: 'Events Covered',
    value: 350,
    suffix: '+',
    iconName: 'Tv'
  },
  {
    id: 'ach-2',
    label: 'Creative Members',
    value: 27,
    suffix: '',
    iconName: 'Users'
  },
  {
    id: 'ach-3',
    label: 'Awards',
    value: 10,
    suffix: '+',
    iconName: 'Award'
  }
];

// High-Performance Smooth Count-Up Subcomponent
function Counter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Ease out cubic function
      const easeProgress = 1 - Math.pow(1 - percentage, 3);
      setCount(Math.floor(easeProgress * value));

      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function Achievements() {
  const getIconComponent = (name: string) => {
    switch (name) {
      case 'Tv': return <Tv className="w-5 h-5 text-blue-400" />;
      case 'Users': return <Users className="w-5 h-5 text-blue-500" />;
      default: return <Award className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <section className="relative py-28 bg-[#030303] overflow-hidden">
      {/* Background visual graphics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[350px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle bottom separator line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <div className="glass-panel-heavy p-12 rounded-3xl relative overflow-hidden">
          {/* Top gloss */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          {/* Liquid Glass geometric decorations */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {achievementsData.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center p-4 group"
              >
                {/* Floating Icon Base */}
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-blue-500/30 transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.4)]">
                  {getIconComponent(item.iconName)}
                </div>

                {/* Big Number Display */}
                <div className="font-display font-black text-5xl md:text-6xl text-white tracking-tighter mb-2 flex items-center gap-0.5 select-none text-glow">
                  <Counter value={item.value} />
                  <span className="text-blue-500 text-3xl font-extrabold">{item.suffix}</span>
                </div>

                {/* Stats label */}
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-semibold group-hover:text-neutral-200 transition-colors duration-200">
                  {item.label}
                </div>

                {/* Vertical Separators in large viewports */}
                {idx < 2 && (
                  <div className="hidden md:block absolute right-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" style={{ left: `${(idx + 1) * 33.33}%` }} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
