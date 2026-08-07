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
 * Native-feeling, ultra-smooth interactive marquee with native touch physics.
 *
 * Architecture:
 * 1. Uses a 4x repeated track so that even with only 2-3 cards, the scrollable width
 *    is wide enough to allow continuous, fluid movement in both directions.
 * 2. When the user is NOT dragging, requestAnimationFrame continuously auto-scrolls
 *    the container in the specified direction at a consistent speed.
 * 3. When the user touches / drags, pointer events capture the gesture naturally.
 *    CSS `touchAction: 'pan-y'` and `-webkit-overflow-scrolling: touch` allow the user
 *    to flick and swipe with zero tightness or resistance.
 * 4. Infinite wrapping: Whenever scroll reaches 2 cycles, it subtracts 1 cycle;
 *    whenever it reaches near 0, it adds 1 cycle. The wrap is completely invisible.
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

  // Drag & pointer tracking
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const lastXRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTimeRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractingRef = useRef(false);

  // Keep interaction ref in sync for RAF loop
  useEffect(() => {
    userInteractingRef.current = isInteracting;
  }, [isInteracting]);

  // Seamless boundary wrap helper
  const wrapScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    // 4 identical sets rendered, so 1 cycle is 1/4 of total scrollWidth
    const cycle = el.scrollWidth / 4;
    if (cycle <= 0) return;

    if (el.scrollLeft >= cycle * 2.5) {
      el.scrollLeft -= cycle;
    } else if (el.scrollLeft <= cycle * 0.5) {
      el.scrollLeft += cycle;
    }
  };

  // Center scroll position on mount so both left & right have plenty of room
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const setInitialPos = () => {
      const cycle = el.scrollWidth / 4;
      if (cycle > 0) {
        el.scrollLeft = cycle;
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
        const move = speed * delta;
        if (direction === 'left') {
          el.scrollLeft += move;
        } else {
          el.scrollLeft -= move;
        }
        wrapScroll();
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animId);
  }, [direction, speed, isPaused]);

  // Native Pointer/Touch handling with fluid momentum
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only left click or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }

    const el = containerRef.current;
    if (!el) return;

    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = el.scrollLeft;
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
    if (Math.abs(diff) > 3) {
      hasDraggedRef.current = true;
    }

    if (hasDraggedRef.current) {
      const now = performance.now();
      const currentX = e.clientX;
      const timeDiff = now - lastTimeRef.current;
      if (timeDiff > 0) {
        // Direct responsive 1:1 pixel tracking
        velocityRef.current = (currentX - lastXRef.current) / timeDiff;
      }
      lastXRef.current = currentX;
      lastTimeRef.current = now;

      el.scrollLeft = startScrollLeftRef.current - diff;
      wrapScroll();
    }
  };

  const onPointerUp = () => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    const el = containerRef.current;
    if (el && hasDraggedRef.current && Math.abs(velocityRef.current) > 0.1) {
      // Natural momentum inertia decay
      let v = velocityRef.current * 16;
      const decay = 0.94;

      const glide = () => {
        if (!el || isPointerDownRef.current) return;
        if (Math.abs(v) > 0.3) {
          el.scrollLeft -= v;
          wrapScroll();
          v *= decay;
          requestAnimationFrame(glide);
        } else {
          // Resume auto-scroll after momentum settles
          resumeTimerRef.current = setTimeout(() => {
            setIsInteracting(false);
          }, 600);
        }
      };
      requestAnimationFrame(glide);
    } else {
      resumeTimerRef.current = setTimeout(() => {
        setIsInteracting(false);
      }, 600);
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={wrapScroll}
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
        // Prevent accidental card opening if the user was swiping/dragging
        if (hasDraggedRef.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      className={`no-scrollbar relative flex w-full overflow-x-auto select-none ${
        isInteracting ? 'cursor-grabbing' : 'cursor-grab'
      } ${className}`}
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        touchAction: 'pan-y', // Free natural vertical scrolling while horizontally draggable
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
