import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorWrapperRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isHoveredRef = useRef(false);
  const isVisibleRef = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Disable on touch / mobile devices for battery and scroll speed
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const checkInteractive = (target: HTMLElement | null): boolean => {
      if (!target) return false;
      return Boolean(
        target.closest(
          'button, a, input, textarea, select, [role="button"], .cursor-pointer, .interactive, [data-cursor-hover], [onClick]'
        )
      );
    };

    let latestX = -100;
    let latestY = -100;

    const renderCursor = () => {
      if (cursorWrapperRef.current) {
        cursorWrapperRef.current.style.transform = `translate3d(${latestX}px, ${latestY}px, 0)`;
      }
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--mouse-x', `${latestX}px`);
        spotlightRef.current.style.setProperty('--mouse-y', `${latestY}px`);
      }
      rafId.current = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      latestX = e.clientX;
      latestY = e.clientY;

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }

      if (!rafId.current) {
        rafId.current = requestAnimationFrame(renderCursor);
      }

      const target = e.target as HTMLElement | null;
      const hovered = checkInteractive(target);
      if (hovered !== isHoveredRef.current) {
        isHoveredRef.current = hovered;
        setIsHovered(hovered);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const hovered = checkInteractive(target);
      if (hovered !== isHoveredRef.current) {
        isHoveredRef.current = hovered;
        setIsHovered(hovered);
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseLeaveWindow = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };
    const handleMouseEnterWindow = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
    };
  }, []);

  return (
    <>
      {/* Dynamic Background Spotlight Tracker */}
      <div 
        ref={spotlightRef}
        className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-700"
        style={{
          opacity: isVisible ? 1 : 0,
          background: `radial-gradient(550px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), rgba(59, 130, 246, 0.06), rgba(6, 182, 212, 0.02) 40%, transparent 80%)`
        }}
      />

      {/* Global styles hiding standard OS cursor on desktop pointer devices */}
      <style>{`
        @media (min-width: 768px) {
          *, *::before, *::after {
            cursor: none;
          }
        }
        @media (pointer: coarse) {
          *, *::before, *::after {
            cursor: auto;
          }
        }
      `}</style>

      {/* Unified Cursor Container: Ring and Core dot are mathematically locked together permanently */}
      <div
        ref={cursorWrapperRef}
        className={`hidden md:flex items-center justify-center fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform transition-opacity duration-200 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: 0,
          height: 0,
          transform: 'translate3d(-100px, -100px, 0)'
        }}
      >
        {/* 
          Follower Ring:
          - Sits centered at (0, 0)
          - On hover: smoothly expands slightly (+8px) without displacing or moving too far
          - Easing: smooth cubic-bezier
        */}
        <div 
          className={`absolute rounded-full border pointer-events-none transition-[transform,background-color,border-color,box-shadow] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isHovered
              ? 'border-blue-400/90 bg-blue-500/15 shadow-[0_0_15px_rgba(59,130,246,0.35)]'
              : 'border-white/30 bg-transparent'
          }`}
          style={{
            width: '30px',
            height: '30px',
            backdropFilter: 'blur(1px)',
            transform: `scale(${
              isMouseDown 
                ? (isHovered ? 1.08 : 0.85) 
                : (isHovered ? 1.28 : 1)
            })`
          }}
        />

        {/* 
          Core Dot:
          - Centered right at the exact pointer locus (0, 0)
          - Never drifts or separates from the ring
        */}
        <div
          className="absolute w-2 h-2 rounded-full bg-blue-500 pointer-events-none transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            boxShadow: '0 0 10px #3b82f6, 0 0 20px #06b6d4',
            transform: `scale(${
              isMouseDown ? 0.75 : (isHovered ? 1.15 : 1)
            })`
          }}
        />
      </div>
    </>
  );
}
