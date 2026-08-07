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
 * GPU-accelerated, silky-smooth marquee with effortless touch & mouse drag.
 *
 * Why this feels like continuous liquid flow:
 * 1. Uses CSS hardware-accelerated 3D transforms (`transform: translate3d(-Xpx, 0, 0)`).
 *    Browser scrollLeft is quantized to integer pixels which causes visible step-by-step
 *    micro-stuttering. 3D transform allows sub-pixel sub-60/120Hz interpolation.
 * 2. Perfect continuous wrapping: When offset exceeds exactly 1 cycle (half of the 2-set width),
 *    offset wraps cleanly by 1 cycle with zero visual seam or stutter.
 * 3. Fluid manual dragging: Dragging directly adjusts the transform offset with 1:1 precision,
 *    and smoothly transitions into inertia momentum glide.
 */
export function InteractiveMarqueeTrack({
  children,
  direction = 'left',
  speed = 30,
  className = '',
  isPaused = false,
}: MarqueeTrackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [isInteracting, setIsInteracting] = useState(false);

  // Exact sub-pixel transform position
  const offsetRef = useRef<number>(0);
  const cycleWidthRef = useRef<number>(0);

  // Drag tracking
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);
  const lastXRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTimeRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractingRef = useRef(false);

  useEffect(() => {
    userInteractingRef.current = isInteracting;
  }, [isInteracting]);

  // Measure cycle width (one set of children width)
  const measure = () => {
    const track = trackRef.current;
    if (!track) return;
    // We render 2 identical sets inside the track, so 1 cycle is exactly half the track width
    const totalWidth = track.scrollWidth;
    if (totalWidth > 0) {
      cycleWidthRef.current = totalWidth / 2;
    }
  };

  useEffect(() => {
    measure();
    const handleResize = () => measure();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [children]);

  // Apply smooth 3D transform
  const applyTransform = (val: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translate3d(${-val}px, 0, 0)`;
  };

  // Continuous auto-run loop via requestAnimationFrame
  useEffect(() => {
    let animId: number;
    let prevTime: number | null = null;

    const step = (time: number) => {
      if (prevTime === null) {
        prevTime = time;
      }
      const delta = Math.min((time - prevTime) / 1000, 0.1);
      prevTime = time;

      if (!isPaused && !userInteractingRef.current) {
        if (cycleWidthRef.current <= 0) {
          measure();
        }

        const cycle = cycleWidthRef.current;
        if (cycle > 0) {
          const move = speed * delta;
          if (direction === 'left') {
            offsetRef.current += move;
            if (offsetRef.current >= cycle) {
              offsetRef.current -= cycle;
            }
          } else {
            offsetRef.current -= move;
            if (offsetRef.current <= 0) {
              offsetRef.current += cycle;
            }
          }
          applyTransform(offsetRef.current);
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animId);
  }, [direction, speed, isPaused]);

  // Pointer drag handlers
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    startOffsetRef.current = offsetRef.current;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    setIsInteracting(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;

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

      const cycle = cycleWidthRef.current;
      let nextOffset = startOffsetRef.current - diff;
      if (cycle > 0) {
        while (nextOffset >= cycle) {
          nextOffset -= cycle;
          startOffsetRef.current -= cycle;
        }
        while (nextOffset < 0) {
          nextOffset += cycle;
          startOffsetRef.current += cycle;
        }
      }

      offsetRef.current = nextOffset;
      applyTransform(nextOffset);
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

    if (hasDraggedRef.current && Math.abs(velocityRef.current) > 0.15) {
      let v = velocityRef.current * 14;
      const decay = 0.93;

      const glide = () => {
        if (isPointerDownRef.current) return;
        if (Math.abs(v) > 0.4) {
          const cycle = cycleWidthRef.current;
          offsetRef.current -= v;
          if (cycle > 0) {
            while (offsetRef.current >= cycle) offsetRef.current -= cycle;
            while (offsetRef.current < 0) offsetRef.current += cycle;
          }
          applyTransform(offsetRef.current);
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
      className={`no-scrollbar relative flex w-full overflow-hidden touch-pan-y select-none ${
        isInteracting ? 'cursor-grabbing' : 'cursor-grab'
      } ${className}`}
      style={{
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
      }}
    >
      <div
        ref={trackRef}
        className="flex shrink-0 items-center will-change-transform"
        style={{
          transform: 'translate3d(0, 0, 0)',
        }}
      >
        {/* Set 1 */}
        <div className="flex shrink-0 items-center gap-4 px-2 sm:gap-6 sm:px-3">
          {children}
        </div>
        {/* Set 2 (Identical mirror for infinite 3D wrap) */}
        <div className="flex shrink-0 items-center gap-4 px-2 sm:gap-6 sm:px-3" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
