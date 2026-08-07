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
 * Robust, buttery-smooth interactive marquee.
 *
 * Fixes for mobile:
 * 1. Both top and bottom rows auto-scroll continuously in their respective directions
 *    using sub-pixel floating accumulator so neither direction gets locked or quantized.
 * 2. Instant wrap boundary: With 4 sets, one cycle is scrollWidth / 4. When scrollLeft
 *    exceeds 2 * cycle, it wraps back by 1 cycle. When scrollLeft goes below 0.2 * cycle,
 *    it advances by 1 cycle.
 * 3. Fluid, non-stuck touch and mouse dragging:
 *    - On touch devices, native drag allows effortless swiping.
 *    - Uses pointer capture so gestures don't get stuck or lost when fingers slide fast.
 *    - Momentum gliding with smooth exponential decay.
 *    - Auto-resumes cleanly after release.
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

  // Floating point accumulator for sub-pixel accuracy
  const posRef = useRef<number>(0);
  const isPosInitializedRef = useRef<boolean>(false);

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

  // Seamless boundary wrap helper
  const checkWrap = () => {
    const el = containerRef.current;
    if (!el) return;
    const cycle = el.scrollWidth / 4;
    if (cycle <= 0) return;

    if (posRef.current >= cycle * 2) {
      posRef.current -= cycle;
      el.scrollLeft = posRef.current;
    } else if (posRef.current <= cycle * 0.2) {
      posRef.current += cycle;
      el.scrollLeft = posRef.current;
    }
  };

  // Initialize starting position in the middle cycle
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const setInitialPos = () => {
      const cycle = el.scrollWidth / 4;
      if (cycle > 0 && !isPosInitializedRef.current) {
        posRef.current = cycle;
        el.scrollLeft = cycle;
        isPosInitializedRef.current = true;
      }
    };

    const timer = setTimeout(setInitialPos, 50);
    return () => clearTimeout(timer);
  }, []);

  // Continuous auto-run loop via requestAnimationFrame
  useEffect(() => {
    let animId: number;
    let prevTime: number | null = null;

    const step = (time: number) => {
      if (prevTime === null) {
        prevTime = time;
      }
      const delta = (time - prevTime) / 1000;
      prevTime = time;

      const el = containerRef.current;
      if (el && !isPaused && !userInteractingRef.current) {
        // Guarantee initialized
        if (!isPosInitializedRef.current) {
          const cycle = el.scrollWidth / 4;
          if (cycle > 0) {
            posRef.current = cycle;
            el.scrollLeft = cycle;
            isPosInitializedRef.current = true;
          }
        }

        const move = speed * delta;
        if (direction === 'left') {
          posRef.current += move;
        } else {
          posRef.current -= move;
        }

        el.scrollLeft = posRef.current;
        checkWrap();
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animId);
  }, [direction, speed, isPaused]);

  // Pointer drag handling with pointer capture
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
      // Ignore if pointer capture unavailable
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
      el.scrollLeft = posRef.current;
      checkWrap();
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
          el.scrollLeft = posRef.current;
          checkWrap();
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
      onScroll={() => {
        // Sync ref on external or native scroll
        if (containerRef.current) {
          posRef.current = containerRef.current.scrollLeft;
          checkWrap();
        }
      }}
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
