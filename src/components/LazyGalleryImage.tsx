import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Sparkles } from 'lucide-react';

interface LazyGalleryImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export default function LazyGalleryImage({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-[4/3]'
}: LazyGalleryImageProps) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If IntersectionObserver is not supported, load immediately
    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '250px 0px', // Preload when 250px before entering viewport
        threshold: 0.01
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full bg-neutral-950 ${aspectRatio}`}
    >
      {/* Shimmer skeleton placeholder shown while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-0 bg-neutral-900/90 flex flex-col items-center justify-center overflow-hidden">
          {/* Subtle animated shimmer streak */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          
          <div className="relative z-10 flex flex-col items-center gap-2 text-neutral-600">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 opacity-40 animate-pulse text-cyan-400" />
            </div>
            <span className="text-[10px] font-mono tracking-widest uppercase opacity-40">Loading</span>
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 z-10 bg-neutral-900 flex flex-col items-center justify-center p-6 text-center text-neutral-500">
          <ImageIcon className="w-8 h-8 mb-2 opacity-30 text-neutral-400" />
          <span className="text-xs font-mono">Media asset unavailable</span>
        </div>
      )}

      {/* Actual Image, loaded only when within viewport distance */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          } ${className}`}
        />
      )}
    </div>
  );
}
