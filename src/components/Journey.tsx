import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronRight, Trophy, Sparkles, Star, TrendingUp, Award, Zap, Shield, Facebook, Video, ExternalLink } from 'lucide-react';

interface JourneyYear {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  source: string;
  icon: ReactNode;
  imageUrl: string;
  color: string;
  glowColor: string;
}

const journeyData: JourneyYear[] = [
  {
    id: 's1',
    year: '2022–23',
    title: 'Foundation Year',
    subtitle: 'Academic Session S1',
    description: "The beginning of USRA's journey. Our class laid the foundation for a culture of excellence, teamwork, and creative participation.",
    highlights: [
      'Secured 5th Place in SIBAQ 2022.',
      'Fayiz K.K. was honored with the Kalapradibha title.',
      'Established the first leadership team and began building a strong class identity.'
    ],
    source: 'Source: Achievements section for S1.',
    icon: <Shield className="w-5 h-5 text-blue-400" />,
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
    color: 'from-blue-600 via-blue-500 to-cyan-400',
    glowColor: 'rgba(59, 130, 246, 0.15)'
  },
  {
    id: 's2',
    year: '2023–24',
    title: 'Rising Excellence',
    subtitle: 'Academic Session S2',
    description: 'This year marked a significant leap in both academic and extracurricular performance.',
    highlights: [
      '1st Place in KASHMAKSH (The Viva Examination).',
      'Champions of the ISL (Irfan Premier League).',
      'Thoyyib won Sectional Kalapradibha at the Irfan Arts Fest.'
    ],
    source: 'Source: Achievements section for S2.',
    icon: <TrendingUp className="w-5 h-5 text-cyan-400" />,
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600',
    color: 'from-cyan-500 via-blue-500 to-indigo-600',
    glowColor: 'rgba(6, 182, 212, 0.15)'
  },
  {
    id: 's3',
    year: '2024–25',
    title: 'Consistency & Growth',
    subtitle: 'Academic Session S3',
    description: 'USRA continued to maintain its competitive spirit while strengthening its presence across academy events.',
    highlights: [
      'Achieved 6th Place in the Sectional SIBAQ 2024.',
      'Thoyyib once again earned the Sectional Kalapradibha title, demonstrating remarkable consistency.'
    ],
    source: 'Source: Achievements section for S3.',
    icon: <Star className="w-5 h-5 text-purple-400" />,
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=600',
    color: 'from-indigo-600 via-purple-500 to-blue-500',
    glowColor: 'rgba(79, 70, 229, 0.15)'
  },
  {
    id: 's4',
    year: '2025–26',
    title: 'The Golden Year',
    subtitle: 'Academic Session S4',
    description: 'One of the most successful years in our class history, marked by exceptional achievements across academics, arts, media, and competitions.',
    highlights: [
      'Best Class Awards – 5/5 (Won every category).',
      'Recorded the highest score in Irfan Best Class Awards history (89%+).',
      'Champions of AL-FANNAN Arts Fest, securing 1st Place without losing a single event position.',
      '1st Place in the LISAN Campus Magazine Competition.',
      '2nd Place in the Mega Talent Show Quiz Competition organized by SAKSHI Magazine.',
      'Both Arabic and Urdu Debate Teams qualified for the DH Debate Championship Grand Finale.',
      'Thoyyib secured 2nd Place (Sectional Kalapradibha) in the Irfan Arts Fest.'
    ],
    source: 'Source: Achievements section for S4.',
    icon: <Trophy className="w-5 h-5 text-amber-400 animate-pulse" />,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
    color: 'from-amber-500 via-orange-500 to-yellow-400',
    glowColor: 'rgba(245, 158, 11, 0.2)'
  },
  {
    id: 's5',
    year: '2026–27',
    title: 'Continuing the Legacy',
    subtitle: 'Academic Session S5',
    description: 'Our journey continues with renewed leadership and the same commitment to excellence. New milestones will be added as the academic year progresses.',
    highlights: [
      'S5 Academic Session currently active.',
      'Integrating advanced collaborative tools and creative operations.',
      'More milestones are being written as the legacy unfolds.'
    ],
    source: 'Source: Achievements section for S5.',
    icon: <Zap className="w-5 h-5 text-blue-400" />,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    color: 'from-blue-500 via-indigo-500 to-cyan-500',
    glowColor: 'rgba(59, 130, 246, 0.15)'
  }
];

export default function Journey() {
  return (
    <section id="journey" className="relative py-28 bg-[#030303] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-0 w-[450px] h-[450px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[450px] h-[450px] bg-cyan-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        
        {/* Section Heading */}
        <div className="text-center mb-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blue-500 font-bold mb-3">Historical Chronicles</p>
          <h2 className="font-display font-black text-4xl md:text-6xl text-white tracking-tight uppercase">OUR JOURNEY</h2>
          <div className="h-1 bg-gradient-to-r from-blue-600 to-cyan-400 w-20 mx-auto mt-6 rounded-full" />
        </div>

        {/* Timeline Line */}
        <div className="relative space-y-16 before:absolute before:top-0 before:bottom-0 before:left-4 md:before:left-1/2 before:-translate-x-1/2 before:w-[2px] before:bg-gradient-to-b before:from-blue-600/20 before:via-white/5 before:to-cyan-400/20">
          
          {journeyData.map((item, idx) => {
            const isLeft = idx % 2 === 0;

            return (
              <div 
                key={item.id}
                className={`relative flex flex-col md:flex-row items-stretch ${
                  isLeft ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Center Node Bullet with active year glow */}
                <div className="absolute top-6 left-4 md:left-1/2 w-4 h-4 rounded-full bg-neutral-950 border-2 border-blue-400 -translate-x-[7px] md:-translate-x-[7px] shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10" />

                {/* Left/Right space filler for desktop spacing alignment */}
                <div className="hidden md:block w-1/2" />

                {/* Timeline Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full md:w-1/2 pl-12 md:pl-0 md:px-12"
                >
                  <div className="glass-card rounded-[32px] overflow-hidden group hover:border-blue-500/25 hover:shadow-[0_12px_40px_rgba(59,130,246,0.06)] transition-all duration-500 relative">
                    {/* Media Image Container with Zoom effect */}
                    <div className="relative h-48 overflow-hidden bg-neutral-900">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0 saturate-75"
                      />
                      {/* Ambient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      
                      {/* Top floating badge */}
                      <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest text-white bg-black/40 border border-white/10 backdrop-blur-md">
                        {item.icon}
                        <span className="text-neutral-200">{item.subtitle}</span>
                      </div>

                      {/* Year badge on the image bottom right */}
                      <div className="absolute bottom-4 right-4 bg-blue-600/80 backdrop-blur-md text-white font-mono text-[10px] font-bold px-3 py-1 rounded-full border border-blue-400/30">
                        {item.year}
                      </div>
                    </div>

                    {/* Info Body */}
                    <div className="p-8 relative">
                      {/* Card top shine */}
                      <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                      {/* Session Name & Title */}
                      <h3 className="font-display font-extrabold text-2xl text-white group-hover:text-blue-400 transition-colors duration-300 mb-2">
                        {item.title}
                      </h3>
                      <div className="font-mono text-[9px] text-blue-400 tracking-widest uppercase font-semibold mb-4">
                        Session {item.year}
                      </div>

                      {/* Description text */}
                      <p className="text-neutral-300 text-xs leading-relaxed mb-6 font-sans">
                        {item.description}
                      </p>

                      {/* Expandable Bullet Highlights */}
                      <div className="space-y-3 border-t border-white/5 pt-4">
                        <span className="text-[9px] font-mono tracking-widest uppercase text-neutral-400 font-bold block">
                          Key Highlights
                        </span>
                        <ul className="space-y-2">
                          {item.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-start gap-2.5 text-xs text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300">
                              <ChevronRight className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Source Citation */}
                      <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">
                          {item.source}
                        </span>
                      </div>
                    </div>

                    {/* Subtle bottom gradient accent matching the active item */}
                    <div className={`absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r ${item.color} opacity-20`} />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Facebook Videos Integration Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-24 max-w-3xl mx-auto"
        >
          <div className="glass-panel-heavy rounded-[32px] p-8 md:p-12 relative overflow-hidden group border border-white/10 hover:border-blue-500/30 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            {/* Ambient glows inside the card */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-500" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              {/* Left Side: Visual Representation of a Playable Video Reel */}
              <div className="w-full md:w-2/5 aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 relative group-hover:border-blue-500/20 transition-colors duration-300 flex items-center justify-center shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=400" 
                  alt="USRA Video Archive" 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700 filter grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-80" />
                
                {/* Visual Play Icon */}
                <div className="relative w-14 h-14 rounded-full bg-blue-500/20 border border-blue-400/40 backdrop-blur-md flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover:scale-110 group-hover:bg-blue-500/30 group-hover:border-blue-400/60 transition-all duration-300 cursor-pointer">
                  <Video className="w-6 h-6 text-blue-400" />
                </div>
                
                {/* Floating Badge */}
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-neutral-950/80 border border-white/5 text-[9px] font-mono tracking-wider text-neutral-400 uppercase">
                  Facebook Archive
                </div>
              </div>

              {/* Right Side: Text details & Action link */}
              <div className="flex-grow text-center md:text-left">
                <span className="font-mono text-[9px] tracking-[0.2em] text-cyan-400 uppercase font-bold block mb-2">
                  USRA Media Archives
                </span>
                <h3 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight uppercase mb-3">
                  Watch Our Legacy In Motion
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed mb-6 font-sans">
                  Experience our journey firsthand through our official video archives. Access live documentations of academic sessions, Irfan arts fests, debate championships, and milestone events on Facebook.
                </p>
                
                <a 
                  href="https://www.facebook.com/61552263635010/videos/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-mono text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_25px_rgba(59,130,246,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  <Facebook className="w-4 h-4 fill-current" />
                  <span>Explore Video Hub</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/75" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
