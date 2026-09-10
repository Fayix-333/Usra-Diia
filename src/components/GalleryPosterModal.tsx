import { useState, useRef, ChangeEvent, DragEvent, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Upload, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Sparkles, 
  X, 
  Check, 
  Copy, 
  FileCode,
  Tag,
  AlertCircle
} from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPosterAdded: (newPoster: GalleryItem) => void;
}

export default function GalleryPosterModal({ isOpen, onClose, onPosterAdded }: GalleryPosterModalProps) {
  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Design');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedItem, setSubmittedItem] = useState<GalleryItem | null>(null);
  const [codeSnippet, setCodeSnippet] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const availableCategories = ['Design', 'Photography', 'Cinema', 'Events'];

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

  const currentPosterImage = imageMode === 'file' ? filePreview : imageUrl;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const finalImage = currentPosterImage?.trim();
    if (!title.trim()) {
      setErrorMessage('Please provide a Poster Title.');
      return;
    }
    if (!finalImage) {
      setErrorMessage('Please upload an image file or enter an image URL.');
      return;
    }

    setIsSubmitting(true);

    const newPoster: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: title.trim(),
      category: category,
      imageUrl: finalImage
    };

    try {
      // 1. Post to server to write directly into src/components/Gallery.tsx
      const response = await fetch('/api/gallery/add-to-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPoster)
      });

      const data = await response.json();
      const confirmedItem: GalleryItem = data.item || newPoster;

      // 2. Generate clean TypeScript code representation
      const formattedSnippet = `  {
    id: ${JSON.stringify(confirmedItem.id)},
    title: ${JSON.stringify(confirmedItem.title)},
    category: ${JSON.stringify(confirmedItem.category)},
    imageUrl: ${JSON.stringify(confirmedItem.imageUrl)}
  },`;

      setCodeSnippet(formattedSnippet);
      setSubmittedItem(confirmedItem);
      setSuccessMessage(
        data.codeUpdated
          ? 'Poster successfully written directly into src/components/Gallery.tsx!'
          : 'Poster successfully added to the gallery!'
      );

      // 3. Immediately inform parent to update live UI
      onPosterAdded(confirmedItem);
    } catch (err: any) {
      console.warn('Could not write via server, adding to client state and localStorage:', err);
      onPosterAdded(newPoster);
      setSubmittedItem(newPoster);
      const fallbackSnippet = `  {
    id: ${JSON.stringify(newPoster.id)},
    title: ${JSON.stringify(newPoster.title)},
    category: ${JSON.stringify(newPoster.category)},
    imageUrl: ${JSON.stringify(newPoster.imageUrl)}
  },`;
      setCodeSnippet(fallbackSnippet);
      setSuccessMessage('Poster added to current session and local storage!');
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
    setImageUrl('');
    setFilePreview(null);
    setSubmittedItem(null);
    setCodeSnippet('');
    setErrorMessage('');
    setSuccessMessage('');
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
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-neutral-950 border border-white/10 rounded-[32px] shadow-[0_25px_70px_rgba(0,0,0,0.8)] z-10 overflow-hidden"
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-blue-950/30 via-cyan-950/20 to-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Upload className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                <span>Add Image Directly to Code</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Direct Inject
                </span>
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                Appends image directly into Gallery source code & live view
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Success State with Code Preview */}
          {submittedItem && (
            <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white text-sm">
                      Image Injected Successfully!
                    </h4>
                    <p className="text-emerald-300 text-xs font-mono">
                      {successMessage || 'Written to src/components/Gallery.tsx'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono transition-colors cursor-pointer"
                >
                  Add Another Image
                </button>
              </div>

              {/* Code Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    <span>TypeScript Code Added to src/components/Gallery.tsx:</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy Snippet'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-black/80 border border-white/10 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                  <code>{codeSnippet}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Form */}
          {!submittedItem && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Image Input Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300">
                  Image (File Upload or Direct URL) <span className="text-red-400">*</span>
                </label>

                {/* Tabs: URL vs File */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-white/[0.03] border border-white/10">
                  <button
                    type="button"
                    onClick={() => setImageMode('file')}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      imageMode === 'file'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      imageMode === 'url'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Image URL / Cloudinary</span>
                  </button>
                </div>

                {imageMode === 'url' ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... or Cloudinary link"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer ${
                      dragOver
                        ? 'border-cyan-400 bg-cyan-500/10'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <ImageIcon className="w-8 h-8 text-cyan-400 mx-auto mb-2 opacity-80" />
                    <p className="text-xs text-white font-medium mb-1">
                      Drag & drop image, or <span className="text-cyan-400 underline">browse files</span>
                    </p>
                    <p className="text-[10px] text-neutral-500 font-mono">
                      PNG, JPG, WebP supported
                    </p>
                  </div>
                )}

                {/* Preview if image present */}
                {currentPosterImage && (
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center gap-4">
                    <img
                      src={currentPosterImage}
                      alt="Image Preview"
                      className="w-20 h-20 object-cover rounded-xl border border-white/10"
                    />
                    <div className="text-xs space-y-1">
                      <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Image Ready</span>
                      </span>
                      <p className="text-neutral-400 text-[11px] truncate max-w-xs font-mono">
                        {imageMode === 'url' ? imageUrl : 'Local file loaded'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                    Image Title / Caption <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Ramadan Expo Feature Visual"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                  >
                    {availableCategories.map((c) => (
                      <option key={c} value={c} className="bg-neutral-900 text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !currentPosterImage}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:opacity-90 disabled:opacity-50 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                  <span>{isSubmitting ? 'Injecting into Code...' : 'Add Image Directly to Code'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
