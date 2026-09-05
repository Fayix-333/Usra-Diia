import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles, 
  Tag, 
  X, 
  Download, 
  ExternalLink, 
  ChevronRight, 
  Flame, 
  Award, 
  Maximize2,
  Share2,
  CheckCircle2,
  PlusCircle,
  Upload,
  FileCode
} from 'lucide-react';
import { EventItem } from '../types';
import PosterUploadModal from './PosterUploadModal';

// ============================================================================
// MODEL UNION EVENT POSTERS
// Replace these sample posters with your actual USRA union event posters!
// You can also add more items following the same structure.
// ============================================================================
export const initialEventsData: EventItem[] = [
  {
    id: 'event-1',
    title: 'ENNAHADA',
    subtitle: '4th Anniversary Campaign',
    date: 'MAY - 23, 2026',
    time: '09:00 AM - 08:00 PM',
    venue: 'Irfan Square',
    status: 'completed',
    category: 'Cultural',
    description: 'The monumental annual festival bringing together talent across literature, stage arts, elocution, and multimedia production under USRA.',
    imageUrl: 'https://res.cloudinary.com/ml3haxvw/image/upload/f_auto,q_auto/PhotoshopExtension_Image',
    highlights: [
      '5+ Non-Stage Programs',
      'Special Anniversary Campaign',
      'Different Types Of Program',
      'Exclusive awards'
    ],
    organizer: 'USRA',
    tags: ['Anniversary', 'Literature', 'Presentation', 'Special']
  },
 {
  id: 'event-2',
  title: 'Exigency',
  subtitle: 'A New Era Begins',
  date: 'Weekly',
  time: 'Weekly Quiz',
  venue: 'In Class Room',
  status: 'completed',
  category: 'Academic',
  description: 'A battle of minds, speed, and knowledge — where every question sparks curiosity. Step in, challenge yourself, and rise through the ultimate quiz series.',
  imageUrl: 'https://res.cloudinary.com/ml3haxvw/image/upload/f_auto,q_auto/mail.google',
  highlights: [
    'Weekly Quiz Program',
    'Test Your Knowledge',
    'Challenge Your Speed',
    'A New Era of Quizzing'
  ],
  organizer: 'USRA',
  tags: ['Quiz', 'Weekly', 'Exigency', 'USRA']
 },
  {
  id: 'event-3',
  title: 'Viviology',
  subtitle: 'Usra Presents',
  date: 'Everyday',
  time: 'Morning',
  venue: 'Usra-Square',
  status: 'completed',
  category: 'Workshops',
  description: 'An interactive orientation program where confidence meets knowledge. Step forward, answer, and sharpen your spirit of learning.',
  imageUrl: 'https://res.cloudinary.com/ml3haxvw/image/upload/v1788483267/0.jpg',
  highlights: [
    'Interactive Orientation',
    'Build Confidence',
    'Expand Knowledge',
    'Sharpen Your Learning'
  ],
  organizer: 'USRA',
  tags: ['Viviology', 'Orientation', 'Educational', 'USRA']
},
    {
    id: "event-4",
    title: "Ushara",
    subtitle: "Union Inaugural Campaign",
    date: "MAY-3, 2026",
    time: "08:15 PM - 08:45 PM",
    venue: "Usra Square",
    status: "completed",
    category: "Cultural",
    description: "The inaugural campaign of USRA, created to inspire students to level up their lives through meaningful activities, engagement, and personal growth.",
    imageUrl: "https://res.cloudinary.com/ml3haxvw/image/upload/v1788484684/PhotoshopExtension_Image1.png",
    highlights: [
      "Special Union Program",
      "Special Talks",
      "Campaign"
    ],
    organizer: "USRA",
    tags: ["USRA", "Special", "Union", "Ushara"]
  },
  {
    id: 'event-5',
    title: 'KASHMAKSH: The National Viva Examination',
    subtitle: 'Rigorous oral defense and symposium',
    date: 'JAN 14, 2026',
    time: '08:30 AM - 05:00 PM',
    venue: 'Executive Boardroom',
    status: 'completed',
    category: 'Academic',
    description: 'Comprehensive academic viva voce examining theological, linguistic, and contemporary literature disciplines with external jury members.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=900&auto=format&fit=crop',
    highlights: [
      '1st Place won by USRA candidate team',
      'Evaluated by renowned scholars and faculty',
      'Published research documentation'
    ],
    organizer: 'Academic Committee',
    tags: ['Viva', 'Kashmaksh', 'Research', 'Excellence']
  },
  {
    id: 'event-6',
    title: 'ECHOES OF IRFAN: Union Inaugural Eve',
    subtitle: 'Official launch of USRA 9th Batch Union',
    date: 'AUG 15, 2025',
    time: '07:00 PM - 10:30 PM',
    venue: 'Auditorium Main Stage',
    status: 'completed',
    category: 'Cultural',
    description: 'The landmark evening launching our union logo, executive board oath-taking ceremony, and keynote lectures by academy mentors.',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=900&auto=format&fit=crop',
    highlights: [
      'Official USRA logo reveal ceremony',
      'Keynote addresses by founding faculty',
      'Batch anthem release and celebration'
    ],
    organizer: 'USRA Central Executive',
    tags: ['Inauguration', 'Celebration', 'Union', 'Milestone']
  }
];

const categories = ['All', 'Upcoming', 'Cultural', 'Academic', 'Sports', 'Workshops'];

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('usra_custom_events');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const existingIds = new Set(initialEventsData.map((e) => e.id));
            const newItems = parsed.filter((item) => !existingIds.has(item.id));
            return [...newItems, ...initialEventsData];
          }
        }
      } catch (e) {
        console.warn('Could not read custom events from localStorage:', e);
      }
    }
    return initialEventsData;
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [showAddPosterTip, setShowAddPosterTip] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleEventAdded = (newEvent: EventItem) => {
    setEvents((prev) => {
      const filtered = prev.filter((e) => e.id !== newEvent.id);
      const updated = [newEvent, ...filtered];
      try {
        const customOnly = updated.filter(
          (item) => !initialEventsData.some((init) => init.id === item.id)
        );
        localStorage.setItem('usra_custom_events', JSON.stringify(customOnly));
      } catch (e) {
        console.warn('Could not persist to localStorage:', e);
      }
      return updated;
    });
  };

  const filteredEvents = events.filter((event) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Upcoming') return event.status === 'upcoming';
    return event.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const handleShare = (event: EventItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}#events - ${event.title}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section id="events" className="relative py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-indigo-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-mono tracking-widest uppercase mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>UNION PROGRAMS & POSTERS</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-white mb-5"
        >
          Signature <span className="text-glow bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Events & Posters</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-neutral-400 text-sm sm:text-base leading-relaxed"
        >
          Explore official posters and key announcements from our grand cultural fests, academic summits, sports leagues, and signature batch gatherings.
        </motion.p>
      </div>

      {/* Controls Bar: Category Filters & Add Poster Hint */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap cursor-pointer transition-all duration-300 border ${
                  isActive
                    ? 'text-white border-transparent'
                    : 'text-neutral-400 border-white/5 bg-white/[0.02] hover:text-white hover:border-white/10'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeEventCategoryBg"
                    className="absolute inset-0 bg-blue-500/15 border border-blue-500/30 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {cat === 'Upcoming' && <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
                  {cat}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Controls: Upload Poster & Code Tip */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-blue-500/40 bg-gradient-to-r from-blue-600/25 via-cyan-600/20 to-blue-600/25 hover:from-blue-600/40 hover:via-cyan-600/30 hover:to-blue-600/40 text-white text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_25px_rgba(59,130,246,0.45)] hover:border-blue-400/60"
          >
            <Upload className="w-4 h-4 text-cyan-400 transition-transform group-hover:-translate-y-0.5" />
            <span>Upload Poster to Code</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </button>

          <button
            onClick={() => setShowAddPosterTip(true)}
            title="View Model Poster Guide"
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-neutral-400 hover:text-white text-xs font-medium transition-all duration-300 cursor-pointer"
          >
            <FileCode className="w-4 h-4 text-neutral-400" />
            <span className="hidden md:inline">Code Guide</span>
          </button>
        </div>
      </div>

      {/* Event Posters Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        <AnimatePresence>
          {filteredEvents.map((event, index) => {
            const isUpcoming = event.status === 'upcoming';

            return (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 24,
                  mass: 0.8,
                  delay: index * 0.05
                }}
                onClick={() => setSelectedEvent(event)}
                className="group relative rounded-[28px] overflow-hidden border border-white/10 bg-neutral-950/60 backdrop-blur-xl cursor-pointer flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-blue-500/40 hover:shadow-[0_20px_45px_rgba(59,130,246,0.15)] transition-all duration-300"
              >
                {/* Poster Visual Container (Aspect 3:4 Proportions) */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  
                  {/* Subtle Gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-black/40 pointer-events-none" />

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border backdrop-blur-md ${
                      isUpcoming
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        : 'bg-white/10 text-neutral-300 border-white/15'
                    }`}>
                      {isUpcoming && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                      {isUpcoming ? 'Upcoming Event' : 'Archived'}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/15 text-white/90">
                      {event.category}
                    </span>
                  </div>

                  {/* Quick Expand Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                    <span className="px-4 py-2 rounded-full bg-blue-600/90 text-white font-medium text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.6)] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <Maximize2 className="w-3.5 h-3.5" />
                      View Full Poster
                    </span>
                  </div>

                  {/* Date Capsule Bottom-Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-neutral-300">
                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-cyan-300">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="font-mono text-[11px] font-semibold">{event.date}</span>
                    </div>

                    {event.venue && (
                      <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-neutral-300 truncate max-w-[140px]">
                        <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate text-[11px]">{event.venue}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Poster Card Details */}
                <div className="p-5 flex-grow flex flex-col justify-between bg-neutral-950">
                  <div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-blue-400 transition-colors duration-200 line-clamp-1 mb-1">
                      {event.title}
                    </h3>
                    <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed mb-4">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
                    <span className="text-[11px] font-mono text-neutral-500">
                      {event.organizer || 'USRA Union'}
                    </span>
                    <span className="text-blue-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform duration-200">
                      Details <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Poster Lightbox Modal (Apple iOS 27 Fluid Spring Motion) */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-2xl"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 30 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-950/95 border border-white/10 rounded-[32px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-10 flex flex-col md:flex-row overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Poster Image Area */}
              <div className="w-full md:w-1/2 relative bg-black flex items-center justify-center min-h-[380px] md:min-h-[550px] p-4">
                <img
                  src={selectedEvent.imageUrl}
                  alt={selectedEvent.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/5"
                />
                
                {/* Status pill overlay */}
                <div className="absolute bottom-6 left-6">
                  <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase font-semibold border backdrop-blur-md ${
                    selectedEvent.status === 'upcoming'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-white/10 text-neutral-300 border-white/15'
                  }`}>
                    {selectedEvent.status === 'upcoming' && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                    {selectedEvent.status === 'upcoming' ? 'Upcoming Event' : 'Archived Event'}
                  </span>
                </div>
              </div>

              {/* Event Details Content */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/5">
                <div>
                  {/* Category & Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 border border-blue-500/30 text-blue-400">
                      {selectedEvent.category}
                    </span>
                    {selectedEvent.tags?.map((t) => (
                      <span key={t} className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-neutral-400 bg-white/5 border border-white/5">
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-2 leading-snug">
                    {selectedEvent.title}
                  </h3>
                  {selectedEvent.subtitle && (
                    <p className="text-cyan-300 text-xs sm:text-sm mb-4 font-medium">
                      {selectedEvent.subtitle}
                    </p>
                  )}

                  {/* Key Info Meta Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5 p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono text-neutral-500 block">Date</span>
                        <span className="text-neutral-200 font-semibold">{selectedEvent.date}</span>
                      </div>
                    </div>

                    {selectedEvent.time && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-mono text-neutral-500 block">Time</span>
                          <span className="text-neutral-200 font-semibold">{selectedEvent.time}</span>
                        </div>
                      </div>
                    )}

                    {selectedEvent.venue && (
                      <div className="flex items-center gap-3 sm:col-span-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-mono text-neutral-500 block">Venue</span>
                          <span className="text-neutral-200 font-semibold">{selectedEvent.venue}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-5">
                    {selectedEvent.description}
                  </p>

                  {/* Event Highlights */}
                  {selectedEvent.highlights && selectedEvent.highlights.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-blue-400" />
                        Key Highlights
                      </h4>
                      <ul className="space-y-1.5">
                        {selectedEvent.highlights.map((h, i) => (
                          <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-3">
                  <a
                    href={selectedEvent.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-200 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Open High-Res Poster</span>
                  </a>

                  <button
                    onClick={() => handleShare(selectedEvent)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-medium transition-all duration-200 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Copied!' : 'Share'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Guide Modal on Adding Union Posters */}
      <AnimatePresence>
        {showAddPosterTip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddPosterTip(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-neutral-950 border border-white/10 rounded-[28px] p-6 sm:p-8 shadow-2xl z-10"
            >
              <button
                onClick={() => setShowAddPosterTip(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">How to Add Union Posters</h3>
                  <p className="text-xs text-neutral-400">Quick template guide for adding your batch event posters</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-neutral-300 mb-6">
                <p className="leading-relaxed">
                  You can easily add your union posters by updating the <code className="text-cyan-300 bg-white/5 px-1.5 py-0.5 rounded font-mono">initialEventsData</code> list in <code className="text-cyan-300 bg-white/5 px-1.5 py-0.5 rounded font-mono">src/components/Events.tsx</code>:
                </p>

                <div className="p-3 rounded-xl bg-black/70 border border-white/5 font-mono text-[11px] text-neutral-300 overflow-x-auto">
                  <pre>{`{
  id: 'event-7',
  title: 'Your Event Name',
  date: 'OCT 2026',
  venue: 'Main Campus Stage',
  status: 'upcoming', // or 'completed'
  category: 'Cultural', // Sports, Academic...
  imageUrl: 'https://i.ibb.co/your-poster.png',
  description: 'Your event description here...'
}`}</pre>
                </div>

                <p className="text-neutral-400 leading-relaxed">
                  Upload your poster image or use any image link (e.g. ImgBB, Unsplash, or local assets) and set it in <code className="text-cyan-300">imageUrl</code>!
                </p>
              </div>

              <button
                onClick={() => setShowAddPosterTip(false)}
                className="w-full py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Got It, Ready to Add Posters
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Poster Uploading Modal Studio */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <PosterUploadModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            onEventAdded={handleEventAdded}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
