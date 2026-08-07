'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

interface MarqueeTrackProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number; // pixels per second
  className?: string;
  isPaused?: boolean;
}

/**
 * High-performance, seamless infinite marquee with smooth manual drag/swipe.
 *
 * How it works:
 * - Duplicates children 3 times so the viewport is ALWAYS completely filled,
 *   even on small devices with only 2-3 unique cards.
 * - Auto-scrolls smoothly via requestAnimationFrame.
 * - As the container scrolls past 1 full set (1/3 of total scrollWidth),
 *   it seamlessly wraps the scroll position by exactly one set width.
 *   Because the 3 sets are identical, the wrap is 100% invisible with zero flicker or jumps.
 * - Supports touch and mouse dragging with velocity inertia flick and auto-resume.
 */
export function InteractiveMarqueeTrack({
  children,
  direction = 'left',
  speed = 28,
  className = '',
  isPaused = false,
}: MarqueeTrackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Interaction & gesture tracking
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const lastXRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInteractingRef = useRef(false);
  const hasDraggedRef = useRef(false);

  useEffect(() => {
    isInteractingRef.current = isDragging || isHovered;
  }, [isDragging, isHovered]);

  // Handle seamless infinite looping across the 3 repeated sets
  const wrapScrollPosition = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    // A single cycle is exactly 1/3 of the scrollWidth (since we have 3 identical sets)
    const cycleWidth = el.scrollWidth / 3;
    if (cycleWidth <= 0) return;

    if (el.scrollLeft >= cycleWidth * 2) {
      el.scrollLeft -= cycleWidth;
    } else if (el.scrollLeft <= 5) {
      el.scrollLeft += cycleWidth;
    }
  }, []);

  // Set initial scroll position to the middle cycle so scrolling in either direction has room
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const initPos = () => {
      const cycleWidth = el.scrollWidth / 3;
      if (cycleWidth > 0) {
        el.scrollLeft = cycleWidth;
      }
    };

    // Run after mount/render
    const timer = setTimeout(initPos, 60);
    return () => clearTimeout(timer);
  }, []);

  // Continuous auto-run loop using requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;
    let prevTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (prevTimestamp === null) {
        prevTimestamp = timestamp;
      }
      const delta = (timestamp - prevTimestamp) / 1000;
      prevTimestamp = timestamp;

      const el = containerRef.current;
      if (el && !isPaused && !isInteractingRef.current) {
        const move = speed * delta;
        if (direction === 'left') {
          el.scrollLeft += move;
        } else {
          el.scrollLeft -= move;
        }
        wrapScrollPosition();
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [direction, speed, isPaused, wrapScrollPosition]);

  // Pointer drag handlers
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;

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
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const el = containerRef.current;
    if (!el) return;

    const diff = e.clientX - startXRef.current;
    if (Math.abs(diff) > 4) {
      hasDraggedRef.current = true;
      if (!isDragging) {
        setIsDragging(true);
      }
    }

    if (hasDraggedRef.current) {
      const currentX = e.clientX;
      const now = performance.now();
      if (lastTimeRef.current) {
        const timeDiff = now - lastTimeRef.current;
        if (timeDiff > 0) {
          velocityRef.current = (currentX - lastXRef.current) / timeDiff;
        }
      }
      lastXRef.current = currentX;
      lastTimeRef.current = now;

      el.scrollLeft = startScrollLeftRef.current - diff;
      wrapScrollPosition();
    }
  };

  const onPointerUpOrCancel = () => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    const el = containerRef.current;
    if (el && hasDraggedRef.current && Math.abs(velocityRef.current) > 0.15) {
      let currentVelocity = velocityRef.current * 14;
      const decay = 0.93;

      const glide = () => {
        if (!el || isPointerDownRef.current) return;
        if (Math.abs(currentVelocity) > 0.4) {
          el.scrollLeft -= currentVelocity;
          wrapScrollPosition();
          currentVelocity *= decay;
          requestAnimationFrame(glide);
        } else {
          resumeTimerRef.current = setTimeout(() => {
            setIsDragging(false);
          }, 800);
        }
      };
      requestAnimationFrame(glide);
    } else {
      resumeTimerRef.current = setTimeout(() => {
        setIsDragging(false);
      }, 800);
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={wrapScrollPosition}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUpOrCancel}
      onPointerCancel={onPointerUpOrCancel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (isPointerDownRef.current) {
          onPointerUpOrCancel();
        }
      }}
      onClickCapture={(e) => {
        if (hasDraggedRef.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      className={`no-scrollbar flex w-full overflow-x-auto select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      } ${className}`}
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        touchAction: 'pan-y',
      }}
    >
      <div
        ref={trackRef}
        className="flex w-max shrink-0 items-center gap-4 sm:gap-6 px-6"
      >
        {/* Set 1 */}
        {children}
        {/* Set 2 */}
        {children}
        {/* Set 3 */}
        {children}
      </div>
    </div>
  );
}
