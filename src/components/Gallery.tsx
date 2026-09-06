import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, Image as ImageIcon, Film, Palette, Zap, Loader2, Upload } from 'lucide-react';
import { GalleryItem } from '../types';
import LazyGalleryImage from './LazyGalleryImage';
import GalleryPosterModal from './GalleryPosterModal';

export const initialGalleryItems: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'The Electric Prism Project',
    category: 'Photography',
    imageUrl: 'https://cdn.britannica.com/54/187354-050-BE0530AF/Facebook-Founder-CEO-Mark-Zuckerberg-email-messaging-system-St-Regis.jpg'
  },
  {
    id: 'gal-2',
    title: 'Futuristic Union Identity Board',
    category: 'Design',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'gal-3',
    title: 'Starlight Concert Aftermovie Frame',
    category: 'Cinema',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'gal-4',
    title: 'The Vanguard Editorial Series',
    category: 'Photography',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'gal-5',
    title: 'Union Elections Live Campaign',
    category: 'Events',
    imageUrl: 'https://i.ibb.co/gLvhGmyH/1c82e0e3-1266-4813-867c-c95dca5a4470.png'
  },
  {
    id: 'gal-6',
    title: 'Abstract Organic Brand Poster',
    category: 'Design',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'gal-7',
    title: 'Cinematography Field Rig Capture',
    category: 'Cinema',
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'gal-8',
    title: 'Ignite Winter Fest Main Stage',
    category: 'Events',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800'
  }
];

const categories = ['All', 'Photography', 'Design', 'Cinema', 'Events'];

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('usra_custom_gallery');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const existingIds = new Set(initialGalleryItems.map(i => i.id));
            const newItems = parsed.filter(i => !existingIds.has(i.id));
            return [...newItems, ...initialGalleryItems];
          }
        }
      } catch (e) {
        console.warn('Could not read custom gallery items from localStorage:', e);
      }
    }
    return initialGalleryItems;
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [lightboxLoaded, setLightboxLoaded] = useState(false);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

  const handlePosterAdded = (newPoster: GalleryItem) => {
    setItems((prev) => {
      const filtered = prev.filter((i) => i.id !== newPoster.id);
      const updated = [newPoster, ...filtered];
      try {
        const customOnly = updated.filter(
          (item) => !initialGalleryItems.some((init) => init.id === item.id)
        );
        localStorage.setItem('usra_custom_gallery', JSON.stringify(customOnly));
      } catch (e) {
        console.warn('Could not persist gallery to localStorage:', e);
      }
      return updated;
    });
  };

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(item => item.category === activeCategory);

  const handleOpenLightbox = (item: GalleryItem) => {
    setLightboxLoaded(false);
    setSelectedItem(item);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Photography': return <ImageIcon className="w-3.5 h-3.5" />;
      case 'Cinema': return <Film className="w-3.5 h-3.5" />;
      case 'Design': return <Palette className="w-3.5 h-3.5" />;
      default: return <Zap className="w-3.5 h-3.5" />;
    }
  };

  return (
    <section id="gallery" className="relative py-28 bg-[#030303] overflow-hidden">
      {/* Background neon elements */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blue-500 font-bold mb-3">Portfolio Showpiece</p>
          <h2 className="font-display font-black text-4xl md:text-6xl text-white tracking-tight">The Creative Vault</h2>
          <div className="h-1 bg-gradient-to-r from-blue-600 to-cyan-400 w-20 mx-auto mt-6 rounded-full" />
        </div>

        {/* Filter Capsule Group & Direct Code Injection Button */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-16">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 border ${
                  isActive
                    ? 'text-white border-transparent'
                    : 'text-neutral-400 border-white/5 bg-white/[0.02] hover:text-white hover:border-white/10'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeCategoryBg"
                    className="absolute inset-0 bg-blue-500/15 border border-blue-500/25 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="flex items-center gap-1.5 relative z-10">
                  {cat !== 'All' && getCategoryIcon(cat)}
                  {cat}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setIsPosterModalOpen(true)}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-blue-500/40 bg-gradient-to-r from-blue-600/25 via-cyan-600/20 to-blue-600/25 hover:from-blue-600/40 hover:via-cyan-600/30 hover:to-blue-600/40 text-white text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_25px_rgba(59,130,246,0.45)] hover:border-blue-400/60"
          >
            <Upload className="w-4 h-4 text-cyan-400 transition-transform group-hover:-translate-y-0.5" />
            <span>Add Image to Code</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </button>
        </div>

        {/* Masonry-Style Grid */}
        <motion.div 
          layout 
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:balance]"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                whileHover={{ y: -6, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 260,
                  damping: 24,
                  mass: 0.7,
                  delay: index * 0.03
                }}
                className="break-inside-avoid relative rounded-3xl overflow-hidden border border-white/5 bg-neutral-950/40 group cursor-pointer"
                onClick={() => handleOpenLightbox(item)}
              >
                {/* Lazy-Loaded Gallery Image */}
                <LazyGalleryImage
                  src={item.imageUrl}
                  alt={item.title}
                  aspectRatio={
                    item.category === 'Cinema'
                      ? 'aspect-[16/9]'
                      : item.category === 'Design'
                      ? 'aspect-[4/5]'
                      : 'aspect-[4/3]'
                  }
                />

                {/* Dark Vignette Overlay on Base */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

                {/* Glassmorphism Slide-up Info Panel */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="glass-panel p-5 rounded-2xl border-white/10 relative overflow-hidden shadow-2xl translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    
                    {/* Top glass reflection light streak */}
                    <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 border border-blue-400/20">
                        {getCategoryIcon(item.category)}
                        {item.category}
                      </span>
                      <Maximize2 className="w-3.5 h-3.5 text-neutral-400" />
                    </div>

                    <h3 className="font-display font-bold text-sm text-white tracking-wide">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Modal (Apple Cinematic Experience) */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.93, opacity: 0, filter: 'blur(10px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                exit={{ scale: 0.93, opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative max-w-4xl w-full rounded-3xl overflow-hidden border border-white/10 bg-neutral-950 shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Lightbox Image with Lazy & Progressive Loading */}
                <div className="relative aspect-video max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                  {!lightboxLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 gap-3">
                      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                      <span className="text-[11px] font-mono text-neutral-400 tracking-wider uppercase">Loading Full Frame</span>
                    </div>
                  )}
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onLoad={() => setLightboxLoaded(true)}
                    className={`w-full h-full object-contain transition-opacity duration-500 ease-out ${
                      lightboxLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  {/* Subtle radial center highlight */}
                  <div className="absolute inset-0 bg-radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%) pointer-events-none" />
                </div>

                {/* Lightbox Glass Info Strip */}
                <div className="glass-panel p-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative">
                  {/* Top gloss */}
                  <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 border border-blue-400/20 mb-2">
                      {getCategoryIcon(selectedItem.category)}
                      {selectedItem.category}
                    </span>
                    <h3 className="font-display font-extrabold text-xl text-white tracking-wide">
                      {selectedItem.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => setSelectedItem(null)}
                    className="self-start sm:self-center p-3 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 transition-all duration-200"
                    aria-label="Close lightbox"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Direct Poster Code Injection Modal */}
      <GalleryPosterModal
        isOpen={isPosterModalOpen}
        onClose={() => setIsPosterModalOpen(false)}
        onPosterAdded={handlePosterAdded}
      />
    </section>
  );
}
