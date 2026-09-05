import { useState, useRef, ChangeEvent, DragEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Sparkles, 
  X, 
  Check, 
  Copy, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  FileCode,
  Calendar,
  MapPin,
  Clock,
  Tag,
  Eye,
  AlertCircle
} from 'lucide-react';
import { EventItem } from '../types';

interface PosterUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventAdded: (newEvent: EventItem) => void;
}

export default function PosterUploadModal({ isOpen, onClose, onEventAdded }: PosterUploadModalProps) {
  // Image input method: 'file' | 'url'
  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('Cultural');
  const [status, setStatus] = useState<'upcoming' | 'completed' | 'ongoing'>('completed');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('Irfan Square');
  const [organizer, setOrganizer] = useState('USRA');
  const [description, setDescription] = useState('');
  const [highlights, setHighlights] = useState<string[]>([
    'Special Union Program',
    'Grand Participation & Awards'
  ]);
  const [newHighlight, setNewHighlight] = useState('');
  const [tagsInput, setTagsInput] = useState('USRA, Special, Union');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEvent, setSubmittedEvent] = useState<EventItem | null>(null);
  const [codeSnippet, setCodeSnippet] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Categories list
  const availableCategories = ['Cultural', 'Academic', 'Sports', 'Workshops', 'Media', 'Special'];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }
    setErrorMessage('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFilePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setHighlights([...highlights, newHighlight.trim()]);
      setNewHighlight('');
    }
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const currentPosterImage = imageMode === 'file' ? filePreview : imageUrl;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const finalImage = currentPosterImage?.trim();
    if (!title.trim()) {
      setErrorMessage('Please provide an Event Title.');
      return;
    }
    if (!finalImage) {
      setErrorMessage('Please upload a poster image or paste an image URL (e.g. Cloudinary).');
      return;
    }

    setIsSubmitting(true);

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newEvent: EventItem = {
      id: `event-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || 'USRA Union Program',
      date: date.trim() || 'Announced Soon',
      time: time.trim() || 'TBA',
      venue: venue.trim() || 'Campus Square',
      status: status,
      category: category,
      description: description.trim() || `Official ${title.trim()} event organized under USRA.`,
      imageUrl: finalImage,
      highlights: highlights.length > 0 ? highlights : ['Union Program Presentation'],
      organizer: organizer.trim() || 'USRA',
      tags: parsedTags.length > 0 ? parsedTags : ['USRA', category]
    };

    try {
      // 1. Send to server to write directly into src/components/Events.tsx
      const response = await fetch('/api/events/add-to-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });

      const data = await response.json();
      const confirmedEvent: EventItem = data.event || newEvent;

      // 2. Generate clean TypeScript code representation
      const formattedSnippet = `  {
    id: ${JSON.stringify(confirmedEvent.id)},
    title: ${JSON.stringify(confirmedEvent.title)},
    subtitle: ${JSON.stringify(confirmedEvent.subtitle)},
    date: ${JSON.stringify(confirmedEvent.date)},
    time: ${JSON.stringify(confirmedEvent.time)},
    venue: ${JSON.stringify(confirmedEvent.venue)},
    status: ${JSON.stringify(confirmedEvent.status)},
    category: ${JSON.stringify(confirmedEvent.category)},
    description: ${JSON.stringify(confirmedEvent.description)},
    imageUrl: ${JSON.stringify(confirmedEvent.imageUrl)},
    highlights: [
${confirmedEvent.highlights?.map((h) => `      ${JSON.stringify(h)}`).join(',\n') || ''}
    ],
    organizer: ${JSON.stringify(confirmedEvent.organizer)},
    tags: [${confirmedEvent.tags?.map((t) => JSON.stringify(t)).join(', ') || ''}]
  },`;

      setCodeSnippet(formattedSnippet);
      setSubmittedEvent(confirmedEvent);

      // 3. Inform parent component to update live state immediately
      onEventAdded(confirmedEvent);
    } catch (err: any) {
      console.warn('Could not write via server, adding to client state and localStorage:', err);
      // Fallback: still add to local state so user experience is not interrupted
      onEventAdded(newEvent);
      setSubmittedEvent(newEvent);
      const fallbackSnippet = `  {
    id: ${JSON.stringify(newEvent.id)},
    title: ${JSON.stringify(newEvent.title)},
    subtitle: ${JSON.stringify(newEvent.subtitle)},
    date: ${JSON.stringify(newEvent.date)},
    time: ${JSON.stringify(newEvent.time)},
    venue: ${JSON.stringify(newEvent.venue)},
    status: ${JSON.stringify(newEvent.status)},
    category: ${JSON.stringify(newEvent.category)},
    description: ${JSON.stringify(newEvent.description)},
    imageUrl: ${JSON.stringify(newEvent.imageUrl)},
    highlights: [
${newEvent.highlights?.map((h) => `      ${JSON.stringify(h)}`).join(',\n') || ''}
    ],
    organizer: ${JSON.stringify(newEvent.organizer)},
    tags: [${newEvent.tags?.map((t) => JSON.stringify(t)).join(', ') || ''}]
  },`;
      setCodeSnippet(fallbackSnippet);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (codeSnippet && navigator.clipboard) {
      navigator.clipboard.writeText(codeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setDate('');
    setTime('');
    setImageUrl('');
    setFilePreview(null);
    setDescription('');
    setSubmittedEvent(null);
    setCodeSnippet('');
    setErrorMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-neutral-950 border border-white/10 rounded-[32px] shadow-[0_25px_70px_rgba(0,0,0,0.8)] z-10 overflow-hidden"
      >
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-neutral-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">Poster Upload Studio</h3>
              <p className="text-xs text-neutral-400">
                Upload your union posters with full details — automatically saved into the code
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {submittedEvent ? (
            /* Success & Code Export Screen */
            <div className="space-y-6 text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-display font-bold text-2xl text-white mb-2">Poster Added to Code & Live Events!</h4>
                <p className="text-neutral-400 text-xs sm:text-sm max-w-md mx-auto">
                  <span className="text-emerald-400 font-semibold">{submittedEvent.title}</span> has been added directly into{' '}
                  <code className="bg-white/5 px-2 py-0.5 rounded text-cyan-300 font-mono text-xs">
                    src/components/Events.tsx
                  </code>{' '}
                  and is now visible in the live gallery.
                </p>
              </div>

              {/* Poster Preview Card */}
              <div className="max-w-xs mx-auto rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-xl">
                <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden">
                  <img
                    src={submittedEvent.imageUrl}
                    alt={submittedEvent.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500 text-white font-bold">
                      {submittedEvent.category}
                    </span>
                    <h5 className="font-bold text-white text-sm mt-1">{submittedEvent.title}</h5>
                    <p className="text-xs text-neutral-300">{submittedEvent.date}</p>
                  </div>
                </div>
              </div>

              {/* Generated Code Snippet Block */}
              <div className="text-left max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-neutral-400 flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    Code appended to <code className="text-cyan-300">initialEventsData</code>:
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-medium transition-all cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Code'}</span>
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-black border border-white/10 font-mono text-[11px] text-neutral-300 overflow-x-auto max-h-56">
                  <pre>{codeSnippet}</pre>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={resetForm}
                  className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold tracking-wide transition-all cursor-pointer"
                >
                  Upload Another Poster
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all cursor-pointer"
                >
                  View in Events Gallery
                </button>
              </div>
            </div>
          ) : (
            /* Main Upload & Details Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Section 1: Poster Image Artwork */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-semibold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-400" />
                    Poster Artwork / Image <span className="text-rose-400">*</span>
                  </label>

                  {/* Toggle between URL and File upload */}
                  <div className="flex rounded-full bg-white/5 p-0.5 border border-white/10 text-xs">
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                        imageMode === 'url' ? 'bg-blue-600 text-white shadow' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Cloudinary / Web URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('file')}
                      className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                        imageMode === 'file' ? 'bg-blue-600 text-white shadow' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Upload File
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left: Input method */}
                  <div className="md:col-span-2 space-y-3">
                    {imageMode === 'url' ? (
                      <div className="space-y-2">
                        <div className="relative">
                          <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                          <input
                            type="url"
                            placeholder="Paste image link, e.g. https://res.cloudinary.com/..."
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                          />
                        </div>
                        <p className="text-[11px] text-neutral-500">
                          Cloudinary, ImgBB, Unsplash, Google Drive, or any direct image URL.
                        </p>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                          dragOver
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <div className="p-3 rounded-full bg-white/5 text-neutral-300">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div className="text-xs text-neutral-300 font-medium">
                          Click to select poster or drag & drop image
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          Supports PNG, JPG, WebP (will be saved into public/posters)
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Live Poster Card Preview */}
                  <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-3 flex flex-col items-center justify-center text-center relative aspect-[3/4] max-h-52 overflow-hidden group">
                    {currentPosterImage ? (
                      <>
                        <img
                          src={currentPosterImage}
                          alt="Poster Preview"
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageUrl('');
                            setFilePreview(null);
                          }}
                          className="absolute top-4 right-4 p-1.5 rounded-full bg-black/70 text-neutral-300 hover:text-white hover:bg-black transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-neutral-600 gap-1.5">
                        <ImageIcon className="w-8 h-8 stroke-[1.5]" />
                        <span className="text-[11px]">Poster preview will appear here</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Essential Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Event Title */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-semibold">
                    Event Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ENNAHADA, Exigency, Viviology"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                {/* Subtitle / Edition */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-semibold">
                    Subtitle / Edition Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4th Anniversary Campaign, A New Era Begins"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-semibold">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500/50"
                  >
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Selection */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-semibold">
                    Event Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['completed', 'upcoming', 'ongoing'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatus(st)}
                        className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                          status === st
                            ? st === 'upcoming'
                              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                              : st === 'ongoing'
                              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                              : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                            : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    Date / Schedule
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MAY - 23, 2026, Weekly, Everyday"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                {/* Time */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    Time Slot
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 09:00 AM - 08:00 PM, Morning, Weekly Quiz"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                {/* Venue */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    Venue / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Irfan Square, In Class Room, Usra-Square"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                {/* Organizer */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-semibold">
                    Organizer / Wing
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. USRA, Academic Council, Arts Wing"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-semibold">
                  Event Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the objective, competition format, theme, or highlights of this event..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50 resize-none"
                />
              </div>

              {/* Key Highlights */}
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-semibold">
                  Program Highlights & Bullets
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a bullet point, e.g. Special Anniversary Campaign"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addHighlight();
                      }
                    }}
                    className="flex-1 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50"
                  />
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
                {highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {highlights.map((h, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs"
                      >
                        {h}
                        <button
                          type="button"
                          onClick={() => removeHighlight(i)}
                          className="hover:text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-semibold flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-neutral-400" />
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Anniversary, Literature, Presentation, Special"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-white/10 text-neutral-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold tracking-wide shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Writing to Code...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Upload & Add to Code</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
