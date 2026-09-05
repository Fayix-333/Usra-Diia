import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Heart, Database, Laptop, Palette, GraduationCap,
  Users, CheckCircle2, ShieldAlert, Compass, Sparkles
} from 'lucide-react';

export interface WingMember {
  name: string;
  role: string;
  imageUrl: string;
}

export interface WingData {
  id: string;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  color: string;
  glowColor: string;
  details: string[];
  vision: string;
  members: WingMember[];
}

const wingsData: WingData[] = [
  {
    id: 'english-arabic',
    name: 'English & Arabic Wing',
    shortName: 'English & Arabic',
    description: 'Promoting literary excellence, public speech, and language proficiency through global discourse and deep cultural expressions.',
    iconName: 'BookOpen',
    color: 'from-blue-600 via-blue-500 to-cyan-400',
    glowColor: 'rgba(59, 130, 246, 0.15)',
    details: [
      'Oratory & Debates: Enhancing public speech capabilities',
      'Literary Magazines: Editorial content in English & Arabic',
      'Translation Circles: Cross-cultural translation workshops'
    ],
    vision: 'Amplifying student voices globally through linguistic mastery and creative articulation.',
    members: [
      {
        name: 'Sinan Parambil',
        role: 'Wing Coordinator',
        imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'Anas',
        role: 'Co-Lead',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'Iyas',
        role: 'Associate Member',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
      }
    ]
  },
  {
    id: 'malayalam-urdu',
    name: 'Malayalam & Urdu Wing',
    shortName: 'Malayalam & Urdu',
    description: 'Cultivating regional literature, poetic expressions, and preserving the rich heritage of Malayalam and Urdu creative writing.',
    iconName: 'Palette',
    color: 'from-cyan-500 via-blue-500 to-indigo-600',
    glowColor: 'rgba(6, 182, 212, 0.15)',
    details: [
      'Poetry Slams & Mushairas: Organizing expressive recitation events',
      'Regional Heritage: Preserving local art forms & linguistic scripts',
      'Writing Circles: Guiding budding authors in regional prose'
    ],
    vision: 'Nurturing the beauty of native languages to foster deep cultural roots.',
    members: [
      {
        name: 'Afnan T.',
        role: 'Wing Coordinator',
        imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'Ashfin',
        role: 'Co-Lead',
        imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'Farhan',
        role: 'Associate Member',
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'
      }
    ]
  },
  {
    id: 'academics',
    name: 'Academics Wing',
    shortName: 'Academics',
    description: 'Driving academic excellence, research initiatives, educational support systems, and student peer mentoring channels.',
    iconName: 'GraduationCap',
    color: 'from-indigo-600 via-purple-500 to-blue-500',
    glowColor: 'rgba(79, 70, 229, 0.15)',
    details: [
      'Tutorial Sessions: Structured peer-to-peer mentoring groups',
      'Research Databases: Organizing study resources and journals',
      'Educational Seminars: Curating guest lectures on career prospects'
    ],
    vision: 'Empowering scholastic pursuits with structured mentorship and modern resources.',
    members: [
      {
        name: 'Sinan K.',
        role: 'Wing Coordinator',
        imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'Swafvan P.',
        role: 'Co-Lead',
        imageUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'As\'ad',
        role: 'Associate Member',
        imageUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400'
      }
    ]
  },
  {
    id: 'thazkiya',
    name: 'Thazkiya Wing',
    shortName: 'Thazkiya',
    description: 'Focusing on spiritual purification, moral rejuvenation, self-discipline sessions, and character alignment.',
    iconName: 'Heart',
    color: 'from-blue-500 via-cyan-400 to-teal-400',
    glowColor: 'rgba(59, 130, 246, 0.15)',
    details: [
      'Spiritual Circles: Regular moral discourse & guidance sessions',
      'Self-Discipline Campaigns: Activities targeting ethical self-betterment',
      'Ethical Mentoring: Personal support for character development'
    ],
    vision: 'Purifying minds and perfecting character to serve the society with sincerity.',
    members: [
      {
        name: 'Ayyoobi',
        role: 'Wing Coordinator',
        imageUrl: 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'Shahin',
        role: 'Co-Lead',
        imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400'
      }
    ]
  },
  {
    id: 'srdb',
    name: 'SRDB Wing',
    shortName: 'SRDB',
    description: 'Student Resource Database & Welfare management, optimizing technical coordinates, data structures, and community records.',
    iconName: 'Database',
    color: 'from-blue-600 via-cyan-500 to-blue-400',
    glowColor: 'rgba(37, 99, 235, 0.15)',
    details: [
      'Resource Curation: Streamlining academic materials and books',
      'Database Security: Safe maintenance of internal union records',
      'Welfare Statistics: Analyzing community requirements efficiently'
    ],
    vision: 'Establishing a secure, smart database foundation for student resource allocation.',
    members: [
      {
        name: 'Sinan A.',
        role: 'Wing Coordinator',
        imageUrl: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'Nihad',
        role: 'Co-Lead',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
      }
    ]
  },
  {
    id: 'it-art',
    name: 'IT & Art Wing',
    shortName: 'IT & Art',
    description: 'Synergizing high-end technology, web architectures, digital design assets, branding layouts, and fine arts.',
    iconName: 'Laptop',
    color: 'from-cyan-400 via-blue-600 to-indigo-500',
    glowColor: 'rgba(34, 211, 238, 0.15)',
    details: [
      'Web Development: Crafting premium and secure digital portals',
      'Artistic Graphics: Dynamic digital paintings and vectors',
      'Tech Innovation: Integrating AI platforms and interactive tools'
    ],
    vision: 'Blending absolute logic of digital tech with the soul of aesthetic fine arts.',
    members: [
      {
        name: 'Ansil',
        role: 'Wing Coordinator',
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'Fayiz',
        role: 'Co-Lead',
        imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400'
      }
    ]
  }
];

const bureauMembers = [
  {
    name: 'Shihan',
    role: 'Bureau Member',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Sajin',
    role: 'Bureau Member',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Hamdan',
    role: 'Bureau Member',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Shadi',
    role: 'Bureau Member',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Swafvan C.',
    role: 'Bureau Member',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400'
  }
];

export default function Wings() {
  const [activeWingId, setActiveWingId] = useState('english-arabic');

  const activeWing = wingsData.find(w => w.id === activeWingId) || wingsData[0];

  const getIconComponent = (name: string, className: string = "w-5 h-5") => {
    switch (name) {
      case 'BookOpen': return <BookOpen className={className} />;
      case 'Palette': return <Palette className={className} />;
      case 'GraduationCap': return <GraduationCap className={className} />;
      case 'Heart': return <Heart className={className} />;
      case 'Database': return <Database className={className} />;
      case 'Laptop': return <Laptop className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  return (
    <section id="wings" className="relative py-28 bg-[#050505]">
      {/* Background radial highlight matches active wing colors dynamically */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[600px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, ${activeWing.glowColor} 0%, transparent 70%)`
        }}
      />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blue-500 font-bold mb-3">Creative Structure</p>
          <h2 className="font-display font-black text-4xl md:text-6xl text-white tracking-tight uppercase">OUR WINGS</h2>
          <div className="h-1 bg-gradient-to-r from-blue-600 to-cyan-400 w-20 mx-auto mt-6 rounded-full" />
        </div>

        {/* Wings Interactive Tab Selector Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12">
          {wingsData.map((wing) => {
            const isActive = activeWingId === wing.id;
            return (
              <button
                key={wing.id}
                onClick={() => setActiveWingId(wing.id)}
                className={`relative px-4 py-3 rounded-2xl text-xs font-semibold tracking-wider uppercase border flex items-center gap-2 cursor-pointer transition-all duration-300 ${
                  isActive
                    ? 'text-white border-transparent'
                    : 'text-neutral-400 border-white/5 bg-white/[0.01] hover:text-white hover:border-white/10'
                } active:scale-95`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeWingBg"
                    className="absolute inset-0 bg-blue-500/10 border border-blue-500/30 rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                {getIconComponent(wing.iconName, `w-4 h-4 relative z-10 ${isActive ? 'text-blue-400 animate-pulse' : 'text-neutral-500'}`)}
                <span className="relative z-10">{wing.shortName}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeWingIndicator"
                    className="absolute -bottom-[1px] inset-x-6 h-[2px] bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full relative z-20"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Wing Content Showcase Panel */}
        <div className="w-full mb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeWing.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.9 }}
              className="glass-panel p-8 md:p-12 rounded-[36px] border border-white/5 relative overflow-hidden group min-h-[440px]"
            >
              {/* Premium top glossy reflection */}
              <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10 items-start">
                
                {/* Left Side: Brand, Core Vision, & Description */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-4">
                    {/* Glowing Emblem Icon Container */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${activeWing.color} p-[1px] shadow-[0_10px_30px_rgba(59,130,246,0.2)] flex items-center justify-center`}>
                      <div className="w-full h-full rounded-2xl bg-neutral-950/90 flex items-center justify-center">
                        {getIconComponent(activeWing.iconName, "w-6 h-6 text-white")}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight uppercase leading-none">
                        {activeWing.name}
                      </h3>
                      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400 font-semibold mt-1">
                        Active Specialization Wing
                      </p>
                    </div>
                  </div>

                  {/* Core Vision Banner */}
                  <div className="p-4 rounded-2xl border border-blue-500/10 bg-blue-500/[0.02] relative overflow-hidden">
                    <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-blue-400/5 blur-xl pointer-events-none" />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 block">Wing Mission Statement</span>
                    <p className="text-xs text-neutral-300 italic font-sans mt-1 leading-relaxed">
                      "{activeWing.vision}"
                    </p>
                  </div>

                  {/* Main Description */}
                  <p className="text-neutral-300 text-sm md:text-base leading-relaxed font-sans">
                    {activeWing.description}
                  </p>

                  {/* Core Scope list */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5 font-bold">
                      <Compass className="w-3.5 h-3.5 text-blue-400" />
                      SCOPE &amp; OBJECTIVES
                    </h4>
                    <div className="space-y-2">
                      {activeWing.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                          <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                            {detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side: Responsible officers / Heads with dummy images */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="p-6 rounded-[28px] border border-white/5 bg-neutral-950/60 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-blue-500/5 blur-2xl pointer-events-none" />
                    
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5 font-bold mb-6">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      RESPONSIBLE HEADS
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeWing.members.map((member, idx) => (
                        <div 
                          key={idx} 
                          className="flex flex-col items-center text-center p-4 rounded-2xl border border-white/5 bg-white/[0.01] hover:border-blue-500/20 hover:bg-white/[0.02] transition-all duration-300 group/item"
                        >
                          <div className="relative w-16 h-16 mb-3">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-[1.5px] shadow-[0_0_10px_rgba(59,130,246,0.1)] group-hover/item:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300" />
                            <img
                              src={member.imageUrl}
                              alt={member.name}
                              referrerPolicy="no-referrer"
                              className="absolute inset-[2.5px] w-[calc(100%-5px)] h-[calc(100%-5px)] object-cover rounded-full filter grayscale group-hover/item:grayscale-0 transition-all duration-500"
                            />
                          </div>
                          <h5 className="text-xs font-semibold text-white group-hover/item:text-blue-400 transition-colors duration-200">
                            {member.name}
                          </h5>
                          <p className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest mt-1">
                            {member.role}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Subtle accent hover trace line at bottom */}
              <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 opacity-30" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bureau for Rejuvenated Activities Segment */}
        <div className="text-center mb-16 pt-16 border-t border-white/5">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-bold mb-3">REJUVENATED ACTIVIST NETWORK</p>
          <h3 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight uppercase">BUREAU FOR REJUVENATED ACTIVITIES</h3>
          <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest mt-2">USRA Social Reformation Association Bureau</p>
          <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500 w-16 mx-auto mt-4 rounded-full" />
        </div>

        {/* Bureau Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {bureauMembers.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-5 rounded-3xl relative overflow-hidden group flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:border-cyan-500/20"
            >
              {/* Top reflection sweep */}
              <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

              {/* Glowing Aura backdrop */}
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-cyan-500/5 group-hover:bg-cyan-500/10 rounded-full blur-xl transition-all duration-500 pointer-events-none" />

              {/* Profile Image with subtle cyan ring */}
              <div className="relative w-20 h-20 mb-4 z-10">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 p-[1.5px] shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all duration-500" />
                <div className="absolute inset-[1.5px] rounded-full bg-[#030303]" />
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] object-cover rounded-full filter grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                
                {/* Shield Icon badge for Bureau validation */}
                <div className="absolute bottom-0.5 right-0.5 w-5 h-5 rounded-full bg-[#090909] border border-cyan-500/40 flex items-center justify-center shadow-lg">
                  <ShieldAlert className="w-2.5 h-2.5 text-cyan-400" />
                </div>
              </div>

              {/* Member detail */}
              <div className="relative z-10">
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors duration-200">
                  {member.name}
                </h4>
                <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-neutral-400 mt-1">
                  {member.role}
                </p>
              </div>

              {/* Bottom highlight line */}
              <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
