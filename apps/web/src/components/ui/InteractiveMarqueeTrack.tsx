'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

interface CircularCarouselProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number; // pixels per second
  className?: string;
  isPaused?: boolean;
}

/**
 * Never-ending Circular Carousel without duplicating the children list.
 *
 * It operates conceptually like a circular doubly linked list in the DOM:
 * There is only ONE single list of card elements.
 * As items scroll out of view on one edge, they are dynamically moved/recycled
 * to the opposite end (appendChild / prepend) while adjusting scrollLeft by
 * the exact element width, resulting in zero flicker, zero visual jumps,
 * and genuine O(1) circular recycling with no DOM duplication.
 */
export function InteractiveMarqueeTrack({
  children,
  direction = 'left',
  speed = 30,
  className = '',
  isPaused = false,
}: CircularCarouselProps) {
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

  // Keep interaction state ref updated
  useEffect(() => {
    isInteractingRef.current = isDragging || isHovered;
  }, [isDragging, isHovered]);

  /**
   * Circular recycling check (Doubly Linked List node recycling):
   * Inspects firstChild and lastChild relative to container viewport.
   * If the first item has scrolled completely past the left edge,
   * move it to the end and offset scrollLeft by its width + gap.
   * Conversely, if the user scrolls right and the first item is fully visible
   * with extra room on the left, move the last item to the front.
   */
  const recycleItems = useCallback(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const childrenList = track.children;
    if (childrenList.length < 2) return;

    // Check front element moving left (out of view on left)
    let first = childrenList[0] as HTMLElement;
    if (first) {
      const firstRect = first.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      // If the entire card is past the left boundary of the container
      if (firstRect.right < containerRect.left) {
        const itemWidthWithGap =
          first.offsetWidth +
          (parseInt(window.getComputedStyle(track).columnGap || '0', 10) || 16);
        track.appendChild(first);
        container.scrollLeft -= itemWidthWithGap;
      }
    }

    // Check back element moving right (out of view on right)
    let last = childrenList[childrenList.length - 1] as HTMLElement;
    first = childrenList[0] as HTMLElement;
    if (last && first) {
      // If container scrolled near the start (left side room opened up)
      if (container.scrollLeft <= 5) {
        const itemWidthWithGap =
          last.offsetWidth +
          (parseInt(window.getComputedStyle(track).columnGap || '0', 10) || 16);
        track.insertBefore(last, first);
        container.scrollLeft += itemWidthWithGap;
      }
    }
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

      const container = containerRef.current;
      if (container && !isPaused && !isInteractingRef.current) {
        const move = speed * delta;
        if (direction === 'left') {
          container.scrollLeft += move;
        } else {
          container.scrollLeft -= move;
        }
        recycleItems();
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [direction, speed, isPaused, recycleItems]);

  // Initial buffer placement so scrolling right has immediate preceding items
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // Small delay to ensure layout rendered
    const timer = setTimeout(() => {
      if (container.scrollLeft === 0 && track.children.length > 2) {
        // Move the last element to the front and offset scrollLeft so user can drag in either direction immediately
        const last = track.children[track.children.length - 1] as HTMLElement;
        const first = track.children[0] as HTMLElement;
        if (last && first) {
          const itemWidthWithGap =
            last.offsetWidth +
            (parseInt(window.getComputedStyle(track).columnGap || '0', 10) || 16);
          track.insertBefore(last, first);
          container.scrollLeft = itemWidthWithGap;
        }
      }
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Pointer drag handlers
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }

    const container = containerRef.current;
    if (!container) return;

    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = container.scrollLeft;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const container = containerRef.current;
    if (!container) return;

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

      container.scrollLeft = startScrollLeftRef.current - diff;
      recycleItems();
    }
  };

  const onPointerUpOrCancel = () => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    const container = containerRef.current;
    if (container && hasDraggedRef.current && Math.abs(velocityRef.current) > 0.2) {
      let currentVelocity = velocityRef.current * 14;
      const decay = 0.93;

      const glide = () => {
        if (!container || isPointerDownRef.current) return;
        if (Math.abs(currentVelocity) > 0.4) {
          container.scrollLeft -= currentVelocity;
          recycleItems();
          currentVelocity *= decay;
          requestAnimationFrame(glide);
        } else {
          resumeTimerRef.current = setTimeout(() => {
            setIsDragging(false);
          }, 700);
        }
      };
      requestAnimationFrame(glide);
    } else {
      resumeTimerRef.current = setTimeout(() => {
        setIsDragging(false);
      }, 700);
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={recycleItems}
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
      {/* Exactly ONE list of cards: elements are dynamically recycled circularly as they cross boundaries */}
      <div
        ref={trackRef}
        className="flex w-max shrink-0 items-center gap-4 sm:gap-6 px-6"
      >
        {children}
      </div>
    </div>
  );
}
