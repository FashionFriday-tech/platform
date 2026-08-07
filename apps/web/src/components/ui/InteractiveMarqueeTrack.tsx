'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MarqueeTrackProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number; // pixels per second
  className?: string;
  isPaused?: boolean;
}

/**
 * Synchronized, high-precision interactive marquee track.
 *
 * Guarantees:
 * 1. Both top and bottom rows move at the EXACT same pixel speed (e.g. exactly 28px/s).
 * 2. Direction-aware boundary wrapping keeps the position cleanly inside the middle
 *    cycles without truncating or fighting against onScroll events.
 * 3. Fluid manual dragging with direct touch delta translation and inertia gliding.
 */
export function InteractiveMarqueeTrack({
  children,
  direction = 'left',
  speed = 28,
  className = '',
  isPaused = false,
}: MarqueeTrackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Floating point subpixel position
  const posRef = useRef<number>(0);
  const isInitializedRef = useRef<boolean>(false);

  // Interaction & gesture tracking
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const startPosRef = useRef(0);
  const lastXRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTimeRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractingRef = useRef(false);

  useEffect(() => {
    userInteractingRef.current = isInteracting;
  }, [isInteracting]);

  // Wrap position when passing cycle boundaries
  const wrap = () => {
    const el = containerRef.current;
    if (!el) return;
    const cycle = el.scrollWidth / 4;
    if (cycle <= 0) return;

    if (direction === 'left') {
      // Moving left: pos increases
      if (posRef.current >= cycle * 2.5) {
        posRef.current -= cycle;
        el.scrollLeft = Math.round(posRef.current);
      }
    } else {
      // Moving right: pos decreases
      if (posRef.current <= cycle * 0.5) {
        posRef.current += cycle;
        el.scrollLeft = Math.round(posRef.current);
      }
    }
  };

  // Center the scroll inside the buffer on mount
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const setup = () => {
      const cycle = el.scrollWidth / 4;
      if (cycle > 0 && !isInitializedRef.current) {
        // Start precisely at 1.5 * cycle to give symmetrical headroom in both directions
        const initial = cycle * 1.5;
        posRef.current = initial;
        el.scrollLeft = Math.round(initial);
        isInitializedRef.current = true;
      }
    };

    const timer = setTimeout(setup, 60);
    return () => clearTimeout(timer);
  }, []);

  // Frame-by-frame exact velocity tick
  useEffect(() => {
    let animId: number;
    let prevTime: number | null = null;

    const step = (time: number) => {
      if (prevTime === null) {
        prevTime = time;
      }
      // Cap delta at 0.1s to prevent giant jumps if tab switches
      const delta = Math.min((time - prevTime) / 1000, 0.1);
      prevTime = time;

      const el = containerRef.current;
      if (el && !isPaused && !userInteractingRef.current) {
        if (!isInitializedRef.current) {
          const cycle = el.scrollWidth / 4;
          if (cycle > 0) {
            const initial = cycle * 1.5;
            posRef.current = initial;
            el.scrollLeft = Math.round(initial);
            isInitializedRef.current = true;
          }
        }

        const move = speed * delta;
        if (direction === 'left') {
          posRef.current += move;
        } else {
          posRef.current -= move;
        }

        el.scrollLeft = Math.round(posRef.current);
        wrap();
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animId);
  }, [direction, speed, isPaused]);

  // Pointer drag handling
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }

    const el = containerRef.current;
    if (!el) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    startPosRef.current = el.scrollLeft;
    posRef.current = el.scrollLeft;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    setIsInteracting(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    const el = containerRef.current;
    if (!el) return;

    const diff = e.clientX - startXRef.current;
    if (Math.abs(diff) > 4) {
      hasDraggedRef.current = true;
    }

    if (hasDraggedRef.current) {
      const now = performance.now();
      const currentX = e.clientX;
      const timeDiff = now - lastTimeRef.current;
      if (timeDiff > 0) {
        velocityRef.current = (currentX - lastXRef.current) / timeDiff;
      }
      lastXRef.current = currentX;
      lastTimeRef.current = now;

      posRef.current = startPosRef.current - diff;
      el.scrollLeft = Math.round(posRef.current);

      // Handle wrapping during drag
      const cycle = el.scrollWidth / 4;
      if (cycle > 0) {
        if (posRef.current >= cycle * 3) {
          posRef.current -= cycle;
          startPosRef.current -= cycle;
          el.scrollLeft = Math.round(posRef.current);
        } else if (posRef.current <= cycle * 0.2) {
          posRef.current += cycle;
          startPosRef.current += cycle;
          el.scrollLeft = Math.round(posRef.current);
        }
      }
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    const el = containerRef.current;
    if (el && hasDraggedRef.current && Math.abs(velocityRef.current) > 0.15) {
      let v = velocityRef.current * 14;
      const decay = 0.93;

      const glide = () => {
        if (!el || isPointerDownRef.current) return;
        if (Math.abs(v) > 0.4) {
          posRef.current -= v;
          el.scrollLeft = Math.round(posRef.current);
          wrap();
          v *= decay;
          requestAnimationFrame(glide);
        } else {
          resumeTimerRef.current = setTimeout(() => {
            setIsInteracting(false);
          }, 500);
        }
      };
      requestAnimationFrame(glide);
    } else {
      resumeTimerRef.current = setTimeout(() => {
        setIsInteracting(false);
      }, 500);
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => {
        if (!isPointerDownRef.current) {
          setIsInteracting(false);
        }
      }}
      onClickCapture={(e) => {
        if (hasDraggedRef.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      className={`no-scrollbar relative flex w-full overflow-x-hidden touch-pan-y select-none ${
        isInteracting ? 'cursor-grabbing' : 'cursor-grab'
      } ${className}`}
      style={{
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
      }}
    >
      <div className="flex w-max shrink-0 items-center gap-4 px-4 sm:gap-6 sm:px-6">
        {/* Set 1 */}
        {children}
        {/* Set 2 */}
        {children}
        {/* Set 3 */}
        {children}
        {/* Set 4 */}
        {children}
      </div>
    </div>
  );
}
