import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, Compass, Key, Users, GraduationCap, Shield, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
}

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Wings', href: '#wings' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Our Journey', href: '#journey' },
  { label: 'Events', href: '#events' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ activeSection, setActiveSection, onOpenAuth, onOpenDashboard }: NavbarProps) {
  const { currentUser } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLogoExpanded, setIsLogoExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetSection = href.substring(1);
    setActiveSection(targetSection);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out flex justify-center px-4 pt-4 md:pt-6">
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full max-w-5xl rounded-full transition-all duration-500 ease-out ${
            scrolled
              ? 'bg-neutral-950/40 backdrop-blur-xl py-3 px-6 shadow-[0_10px_30px_rgba(0,0,0,0.6)] border border-white/5 scale-[0.98]'
              : 'bg-transparent py-5 px-6 border border-transparent'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo Group */}
            <div 
              onClick={() => setIsLogoExpanded(true)}
              className="flex items-center gap-3 group cursor-pointer select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px] shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-transform duration-300 group-hover:scale-105 active:scale-95">
                <div className="w-full h-full rounded-xl bg-[#090909] flex items-center justify-center relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/vector-1783664928814-1393e632b0c4?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="USRA Logo" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain p-1.5"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/20 to-transparent pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm tracking-widest text-white transition-colors duration-300 group-hover:text-blue-400">USRA</span>
                <span className="text-[8px] font-mono tracking-widest uppercase text-neutral-400 -mt-1">MEDIA</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`relative px-4 py-2 text-xs font-medium tracking-wide uppercase transition-all duration-300 rounded-full ${
                      isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavBackground"
                        className="absolute inset-0 bg-white/5 border border-white/10 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </a>
                );
              })}
            </div>

            {/* Desktop Action Buttons (Login / Portal + Join Us) */}
            <div className="hidden md:flex items-center gap-2.5">
              {currentUser ? (
                <button
                  onClick={onOpenDashboard}
                  className={`group relative overflow-hidden rounded-full py-1.5 px-4 text-xs font-mono border transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer ${
                    currentUser.role === 'usthad_fsl'
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:border-amber-400 hover:bg-amber-500/20 shadow-amber-500/10'
                      : currentUser.role === 'student_27'
                      ? 'border-blue-500/40 bg-blue-500/10 text-blue-300 hover:border-blue-400 hover:bg-blue-500/20 shadow-blue-500/10'
                      : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/20 shadow-cyan-500/10'
                  }`}
                  title="Open Your Portal Dashboard"
                >
                  <span className={`w-2 h-2 rounded-full animate-pulse ${
                    currentUser.role === 'usthad_fsl' ? 'bg-amber-400' : currentUser.role === 'student_27' ? 'bg-blue-400' : 'bg-cyan-400'
                  }`} />
                  <span className="font-semibold">
                    {currentUser.role === 'usthad_fsl'
                      ? 'Usthad Fazlu Rehman'
                      : currentUser.role === 'student_27'
                      ? `Ad: ${currentUser.adNo}`
                      : currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] uppercase opacity-75 font-mono">Portal</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="relative group overflow-hidden rounded-full py-2 px-4 text-xs font-semibold tracking-wider uppercase text-white border border-blue-500/30 bg-blue-500/10 hover:border-blue-400/80 transition-all duration-300 flex items-center gap-1.5 shadow-lg shadow-blue-500/5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-400" />
                  <span className="relative z-10">Portal Login</span>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-20 transition-transform duration-500 ease-out" />
                </button>
              )}

              <button
                onClick={() => {
                  setActiveSection('contact');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                className="relative group overflow-hidden rounded-full py-2 px-4 text-xs font-semibold tracking-wider uppercase text-neutral-300 hover:text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-1">
                  Contact <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </button>
            </div>

            {/* Mobile Toggle */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-neutral-400 hover:text-white transition-colors duration-200"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </motion.nav>
      </header>

      {/* Mobile Drawer Navigation (Liquid blur backdrop) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-35 bg-black/60 backdrop-blur-xl flex flex-col justify-center px-8"
          >
            {/* Subtle aesthetic lines */}
            <div className="absolute inset-x-0 top-0 h-px bg-white/5" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/5" />

            <div className="flex flex-col gap-6 max-w-xs mx-auto w-full">
              {navLinks.map((link, idx) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ delay: idx * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`text-2xl font-display font-semibold uppercase tracking-wider ${
                      isActive
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </motion.a>
                );
              })}

              {currentUser ? (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: navLinks.length * 0.05 + 0.05, duration: 0.4 }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDashboard();
                  }}
                  className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest text-center shadow-lg border transition-all duration-300 flex items-center justify-center gap-2 ${
                    currentUser.role === 'usthad_fsl'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : currentUser.role === 'student_27'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    Open {currentUser.role === 'usthad_fsl' ? 'Class Teacher Portal' : currentUser.role === 'student_27' ? `Student Portal (${currentUser.adNo})` : 'Campus Portal'}
                  </span>
                </motion.button>
              ) : (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: navLinks.length * 0.05 + 0.05, duration: 0.4 }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-mono text-xs font-bold uppercase tracking-widest text-center shadow-lg border border-blue-400/30 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Portal Login (Students & Usthad)</span>
                </motion.button>
              )}

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: navLinks.length * 0.05 + 0.1, duration: 0.4 }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveSection('contact');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                className="mt-2 w-full py-3 rounded-xl bg-white/5 border border-white/10 font-semibold uppercase text-xs tracking-widest text-neutral-300 hover:text-white text-center transition-all duration-300"
              >
                Contact Union
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS 27 Fluid Zoom Logo Pop-up Modal */}
      <AnimatePresence>
        {isLogoExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setIsLogoExpanded(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 350, damping: 26, mass: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-[32px] bg-gradient-to-b from-neutral-900/90 to-neutral-950/95 border border-white/10 p-8 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden cursor-default group"
            >
              {/* Premium iOS glossy top light */}
              <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              
              {/* Interactive background ambient neon glows */}
              <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700" />
              <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-700" />

              {/* Close Button */}
              <button
                onClick={() => setIsLogoExpanded(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-all duration-300 active:scale-90 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center text-center mt-4">
                {/* Massive Animated Logo Container */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1.5px] shadow-[0_15px_40px_rgba(59,130,246,0.3)] flex items-center justify-center relative overflow-hidden cursor-pointer select-none"
                >
                  <div className="w-full h-full rounded-3xl bg-[#070707] flex items-center justify-center relative overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/vector-1783664928814-1393e632b0c4?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                      alt="USRA Crest Logo" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain p-4"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/30 to-transparent pointer-events-none" />
                  </div>
                </motion.div>

                {/* Crest Identity */}
                <h3 className="font-display font-bold text-2xl text-white tracking-widest mt-6 uppercase">USRA CREST</h3>
                <p className="text-[9px] font-mono tracking-[0.3em] uppercase text-blue-400 font-semibold mt-1">Foundational Emblem</p>
                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-5" />

                {/* Symbolism Cards - Staggered */}
                <div className="w-full space-y-3 text-left">
                  <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex items-start gap-3.5 hover:border-blue-500/20 hover:bg-white/[0.04] transition-all duration-300">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs text-neutral-200 uppercase tracking-wider">The Mihrab Arch</h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">Representing a digital sanctuary, rooted in moral foundations and Islamic values of authenticity, ethics, and purpose.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex items-start gap-3.5 hover:border-cyan-500/20 hover:bg-white/[0.04] transition-all duration-300">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs text-neutral-200 uppercase tracking-wider">The Key of Expression</h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">Unlocking students' creative media voices and storytelling potential to drive positive social impact.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex items-start gap-3.5 hover:border-indigo-500/20 hover:bg-white/[0.04] transition-all duration-300">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs text-neutral-200 uppercase tracking-wider">Usra (Union &amp; Family)</h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">Building a supportive family of storytellers, designers, and innovators united in creative media excellence.</p>
                    </div>
                  </div>
                </div>

                {/* Dismiss Hint */}
                <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 mt-6 block select-none">
                  Tap anywhere outside to close
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
