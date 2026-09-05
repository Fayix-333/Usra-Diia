import { MouseEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowUp, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

interface FooterProps {
  onNavClick?: (section: string) => void;
}

export default function Footer({ onNavClick }: FooterProps) {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, section: string) => {
    e.preventDefault();
    if (onNavClick) {
      onNavClick(section);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <footer className="relative bg-[#030303] overflow-hidden">
      {/* Upper Glass border separator */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Decorative ambient gradient backdrop */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-blue-600/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="container mx-auto px-6 py-16 relative z-10 max-w-6xl">
        {/* Top level grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 items-start">
          
          {/* Logo Brand Descriptor */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px] shadow-[0_0_15px_rgba(59,130,246,0.2)]">
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
                <span className="font-display font-bold text-sm tracking-widest text-white">USRA</span>
                <span className="text-[8px] font-mono tracking-widest uppercase text-neutral-400 -mt-1">MEDIA</span>
              </div>
            </div>
            
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              The official media and creative cohort of the student union. Blending cutting-edge visual technologies, journalism, and artistic film direction to record outstanding campus milestones.
            </p>
          </div>

          {/* Quick Sitemap Directory */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-bold">Directory Navigation</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <a href="#home" onClick={(e) => handleLinkClick(e, 'home')} className="text-xs text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer">Home</a>
              <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="text-xs text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer">About USRA</a>
              <a href="#wings" onClick={(e) => handleLinkClick(e, 'wings')} className="text-xs text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer">Wings</a>
              <a href="#gallery" onClick={(e) => handleLinkClick(e, 'gallery')} className="text-xs text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer">Gallery</a>
              <a href="#journey" onClick={(e) => handleLinkClick(e, 'journey')} className="text-xs text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer">Our Journey</a>
              <a href="#events" onClick={(e) => handleLinkClick(e, 'events')} className="text-xs text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer">Events & Posters</a>
              <a href="#team" onClick={(e) => handleLinkClick(e, 'team')} className="text-xs text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer">The Team</a>
              <a href="#contact" onClick={(e) => handleLinkClick(e, 'contact')} className="text-xs text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer">Contact Desk</a>
            </div>
          </div>

          {/* Back to Top Interactive Anchor */}
          <div className="md:col-span-3 flex md:justify-end">
            <button
              onClick={handleScrollToTop}
              className="group flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-all duration-300 cursor-pointer shadow-lg"
            >
              Back to Top
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="p-1 rounded-lg bg-white/5 group-hover:bg-blue-500/10 text-neutral-400 group-hover:text-blue-400 transition-colors duration-300"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </motion.div>
            </button>
          </div>
        </div>

        {/* Divider line */}
        <div className="h-px bg-white/5 mb-8" />

        {/* Bottom Socials & copyright credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-neutral-500 text-[11px] font-mono">
            &copy; {new Date().getFullYear()} USRA MEDIA. Engineered under Student Union Jurisdiction. All Rights Reserved.
          </div>

          {/* Social icons capsule group */}
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/usra_media/" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-neutral-400 hover:text-white hover:border-blue-500/25 hover:bg-blue-500/5 hover:text-glow transition-all duration-300" aria-label="USRA Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-neutral-400 hover:text-white hover:border-blue-500/25 hover:bg-blue-500/5 hover:text-glow transition-all duration-300" aria-label="USRA LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-neutral-400 hover:text-white hover:border-blue-500/25 hover:bg-blue-500/5 hover:text-glow transition-all duration-300" aria-label="USRA Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-neutral-400 hover:text-white hover:border-blue-500/25 hover:bg-blue-500/5 hover:text-glow transition-all duration-300" aria-label="USRA YouTube Channel">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
