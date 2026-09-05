import { motion } from 'motion/react';
import { Instagram, Linkedin, Twitter, Sparkles, Github, Code, Shield } from 'lucide-react';
import { TeamMember } from '../types';

const coreCommittee: TeamMember[] = [
  {
    id: 'core-1',
    name: 'Hanan Karakkunnu',
    role: 'President',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    socials: {
      instagram: '#',
      linkedin: '#'
    }
  },
  {
    id: 'core-2',
    name: 'Noufan Izumbuzhi',
    role: 'Vice President',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    socials: {
      instagram: '#',
      linkedin: '#'
    }
  },
  {
    id: 'core-3',
    name: 'Thoyyib Karakkunnu',
    role: 'General Secretary',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    socials: {
      instagram: '#',
      linkedin: '#'
    }
  },
  {
    id: 'core-4',
    name: 'Ashabal Chokkad',
    role: 'Working Secretary',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    socials: {
      instagram: '#',
      linkedin: '#'
    }
  },
  {
    id: 'core-5',
    name: 'Ajsal Thuvvur',
    role: 'Treasurer',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    socials: {
      instagram: '#',
      linkedin: '#'
    }
  },
  {
    id: 'core-6',
    name: 'Muhammed Jasim Kappu',
    role: 'P.R.O.',
    imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
    socials: {
      instagram: '#',
      linkedin: '#'
    }
  }
];

const webCreator: TeamMember[] = [
  {
    id: 'web-1',
    name: 'Unknown',
    role: 'Web Creator',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    socials: {
      instagram: '#',
      github: '#'
    }
  }
];

const webCreators = webCreator;

export default function Team() {
  return (
    <section id="team" className="relative py-28 bg-[#050505] overflow-hidden">
      {/* Background radial spotlight flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[800px] bg-gradient-to-tr from-blue-600/5 via-indigo-600/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blue-500 font-bold mb-3">Union Leadership</p>
          <h2 className="font-display font-black text-4xl md:text-6xl text-white tracking-tight uppercase">CORE COMMITTEE</h2>
          <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest mt-2">Academic Session 2026-27</p>
          <div className="h-1 bg-gradient-to-r from-blue-600 to-cyan-400 w-20 mx-auto mt-6 rounded-full" />
        </div>

        {/* Core Committee Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {coreCommittee.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              whileHover={{ y: -8, scale: 1.025 }}
              whileTap={{ scale: 0.97 }}
              transition={{ 
                type: 'spring',
                stiffness: 260,
                damping: 24,
                mass: 0.8,
                delay: idx * 0.08
              }}
              className="glass-card p-6 rounded-3xl relative overflow-hidden group flex flex-col items-center text-center border border-white/5 bg-white/[0.01] hover:border-blue-500/30 cursor-pointer select-none"
            >
              {/* Top glass reflection light sweep */}
              <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

              {/* Dynamic Aura background highlight behind profile */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-500/5 group-hover:bg-blue-500/10 rounded-full blur-2xl transition-colors duration-500 pointer-events-none" />

              {/* Profile Circular Image with glowing border */}
              <div className="relative w-28 h-28 mb-6 z-10">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 p-[2px] shadow-[0_0_20px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all duration-500" />
                <div className="absolute inset-[2px] rounded-full bg-[#030303]" />
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-[4px] w-[calc(100%-8px)] h-[calc(100%-8px)] object-cover rounded-full filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                />

                {/* Shield badge indicating official role tier */}
                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#090909] border border-blue-500/40 flex items-center justify-center shadow-lg">
                  <Shield className="w-3 h-3 text-blue-400" />
                </div>
              </div>

              {/* Identity & Title */}
              <div className="relative z-10 mb-6">
                <h3 className="font-display font-bold text-lg text-white group-hover:text-blue-400 transition-colors duration-200">
                  {member.name}
                </h3>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400 font-semibold mt-1">
                  {member.role}
                </p>
              </div>

              {/* Divider */}
              <div className="w-12 h-px bg-white/5 group-hover:bg-blue-500/20 group-hover:w-20 transition-all duration-500 mb-6" />

              {/* Social links */}
              <div className="flex items-center gap-3 relative z-10">
                {member.socials.instagram && (
                  <a
                    href={member.socials.instagram}
                    className="p-2 rounded-xl bg-white/5 border border-white/5 text-neutral-400 hover:text-white hover:border-white/10 hover:bg-blue-500/5 hover:text-glow transition-all duration-300"
                    aria-label={`${member.name} Instagram`}
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {member.socials.linkedin && (
                  <a
                    href={member.socials.linkedin}
                    className="p-2 rounded-xl bg-white/5 border border-white/5 text-neutral-400 hover:text-white hover:border-white/10 hover:bg-blue-500/5 hover:text-glow transition-all duration-300"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Hover highlight bottom indicator */}
              <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Web Creators Subheading */}
        <div className="text-center mb-16 pt-8 border-t border-white/5">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-bold mb-3">Technical Force</p>
          <h3 id="web-creator-heading" className="font-display font-black text-3xl md:text-5xl text-white tracking-tight uppercase">WEB CREATOR</h3>
          <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500 w-16 mx-auto mt-4 rounded-full" />
        </div>

        {/* Web Creators Grid */}
        <div className={webCreators.length === 1 ? "flex justify-center" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"}>
          {webCreators.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              whileHover={{ y: -8, scale: 1.025 }}
              whileTap={{ scale: 0.97 }}
              transition={{ 
                type: 'spring',
                stiffness: 260,
                damping: 24,
                mass: 0.8,
                delay: idx * 0.08
              }}
              className="glass-card p-6 rounded-3xl relative overflow-hidden group flex flex-col items-center text-center border border-white/5 bg-white/[0.01] hover:border-cyan-500/30 cursor-pointer select-none w-full max-w-xs"
            >
              {/* Top glass reflection light sweep */}
              <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

              {/* Dynamic Aura background highlight behind profile */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-cyan-500/5 group-hover:bg-cyan-500/10 rounded-full blur-2xl transition-colors duration-500 pointer-events-none" />

              {/* Profile Circular Image with glowing border */}
              <div className="relative w-28 h-28 mb-6 z-10">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 p-[2px] shadow-[0_0_20px_rgba(6,182,212,0.15)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all duration-500" />
                <div className="absolute inset-[2px] rounded-full bg-[#030303]" />
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-[4px] w-[calc(100%-8px)] h-[calc(100%-8px)] object-cover rounded-full filter grayscale saturate-50 group-hover:grayscale-0 transition-all duration-700 ease-out"
                />

                {/* Code badge indicating tech role */}
                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#090909] border border-cyan-500/40 flex items-center justify-center shadow-lg">
                  <Code className="w-3 h-3 text-cyan-400" />
                </div>
              </div>

              {/* Identity & Title */}
              <div className="relative z-10 mb-6">
                <h3 className="font-display font-bold text-lg text-white group-hover:text-cyan-400 transition-colors duration-200">
                  {member.name}
                </h3>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400 mt-1">
                  {member.role}
                </p>
              </div>

              {/* Divider */}
              <div className="w-12 h-px bg-white/5 group-hover:bg-cyan-500/20 group-hover:w-20 transition-all duration-500 mb-6" />

              {/* Social links */}
              <div className="flex items-center gap-3 relative z-10">
                {member.socials.instagram && (
                  <a
                    href={member.socials.instagram}
                    className="p-2 rounded-xl bg-white/5 border border-white/5 text-neutral-400 hover:text-white hover:border-white/10 hover:bg-cyan-500/5 hover:text-glow transition-all duration-300"
                    aria-label={`${member.name} Instagram`}
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {member.socials.github && (
                  <a
                    href={member.socials.github}
                    className="p-2 rounded-xl bg-white/5 border border-white/5 text-neutral-400 hover:text-white hover:border-white/10 hover:bg-cyan-500/5 hover:text-glow transition-all duration-300"
                    aria-label={`${member.name} GitHub`}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Hover highlight bottom indicator */}
              <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

