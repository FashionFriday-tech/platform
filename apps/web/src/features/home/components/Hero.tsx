'use client';

import { type JSX, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { SearchIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { useHeroCarousel } from '../hooks/use-hero-carousel';

export default function Hero({ initialCampaigns }: { initialCampaigns?: any[] }): JSX.Element {
  const {
    cards,
    currentIndex,
    nextCard,
    prevCard,
    containerRef,
    isInView,
    pauseTimer,
    resumeTimer,
  } = useHeroCarousel(initialCampaigns);

  const repeatedCards = [...cards, ...cards, ...cards];

  const placeholders = [
    'Search for linen shirts',
    'Search by category',
    'Search by brands',
    'Search for street wear',
    'Search for accessories',
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2500);
    return () => {
      clearInterval(timer);
    };
  }, [placeholders.length]);

  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent('open-search'));
  };

  // Touch & Pointer Gesture Tracking
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);
  const isPointerDownRef = useRef(false);

  const onDragStart = (clientX: number, clientY: number) => {
    touchStartXRef.current = clientX;
    touchStartYRef.current = clientY;
    touchStartTimeRef.current = Date.now();
    isHorizontalSwipeRef.current = null;
    isPointerDownRef.current = true;
    pauseTimer();
  };

  const onDragMove = (clientX: number, clientY: number) => {
    if (
      !isPointerDownRef.current ||
      touchStartXRef.current === null ||
      touchStartYRef.current === null
    ) {
      return;
    }
    const diffX = clientX - touchStartXRef.current;
    const diffY = clientY - touchStartYRef.current;

    // Detect direction on initial motion to avoid hijacking vertical scrolling
    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(diffX) > 6 || Math.abs(diffY) > 6) {
        isHorizontalSwipeRef.current = Math.abs(diffX) > Math.abs(diffY);
      }
    }

    if (isHorizontalSwipeRef.current) {
      setIsDragging(true);
      setDragX(diffX);
    }
  };

  const onDragEnd = () => {
    if (!isPointerDownRef.current || touchStartXRef.current === null) {
      return;
    }
    isPointerDownRef.current = false;
    const distance = dragX;
    const elapsed = Date.now() - touchStartTimeRef.current;
    const velocity = Math.abs(distance) / Math.max(elapsed, 1);

    const isLeftSwipe = distance < -35 || (distance < -15 && velocity > 0.35);
    const isRightSwipe = distance > 35 || (distance > 15 && velocity > 0.35);

    if (isLeftSwipe) {
      nextCard();
    } else if (isRightSwipe) {
      prevCard();
    }

    setDragX(0);
    setIsDragging(false);
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    isHorizontalSwipeRef.current = null;
    resumeTimer();
  };

  const visibleOffsets = [-2, -1, 0, 1, 2];

  return (
    <section
      ref={containerRef}
      className="relative min-h-[60vh] w-full overflow-hidden px-0 py-2 pb-4 lg:mt-28 lg:min-h-[85vh] lg:p-6"
    >
      {/* Mobile Search input at the top of Hero section */}
      <div className="mt-2 mb-3 px-4 lg:hidden">
        <div
          onClick={handleOpenSearch}
          className="flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-full border border-zinc-300 bg-transparent px-4 py-3.5 transition-all duration-200 active:scale-98 dark:border-zinc-600"
        >
          <SearchIcon className="h-5 w-5 shrink-0 text-zinc-600 dark:text-zinc-400" />
          <div className="relative flex h-5 w-full items-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={placeholderIndex}
                initial={{ opacity: 0, y: 10, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute truncate text-sm font-semibold text-zinc-700 select-none dark:text-zinc-300"
              >
                {placeholders[placeholderIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          @keyframes auto-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-100% / 3)); }
          }
          .carousel-track {
            display: flex;
            width: max-content;
            animation: auto-scroll 45s linear infinite;
          }
          .carousel-track:hover {
            animation-play-state: paused;
          }
        }
      `}</style>

      {/* Mobile/Tablet View (Single Card or Circular Carousel) */}
      {cards.length === 1 && (
        <div className="relative flex w-full items-center justify-center py-2 lg:hidden">
          <div className="relative aspect-[3/5] w-[74vw] sm:w-[50vw] sm:max-w-[380px] overflow-hidden rounded-[34px] shadow-2xl">
            <Link
              href={cards[0].linkUrl || '/products'}
              className="relative block h-full w-full overflow-hidden rounded-[34px]"
            >
              <Image
                src={cards[0].src}
                alt={cards[0].title || 'Hero banner'}
                fill
                priority
                sizes="(max-width: 1024px) 75vw, 400px"
                className="object-cover"
              />
            </Link>
          </div>
        </div>
      )}

      {cards.length >= 2 && (
        <div className="relative w-full overflow-hidden select-none touch-pan-y lg:hidden">
          <div
            onTouchStart={(e) => onDragStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => onDragMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={onDragEnd}
            onTouchCancel={onDragEnd}
            onMouseDown={(e) => onDragStart(e.clientX, e.clientY)}
            onMouseMove={(e) => onDragMove(e.clientX, e.clientY)}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
            className="relative flex w-full items-center justify-center py-2"
          >
            {/* Sizing Spacer ensuring natural height for 3:5 aspect ratio on all mobile widths */}
            <div className="pointer-events-none mx-auto aspect-[3/5] w-[74vw] sm:w-[50vw] sm:max-w-[380px] opacity-0" />

            {/* Cards Track with Circular Relative Positioning & Peek Previews */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {visibleOffsets.map((offset) => {
                const virtualIndex = currentIndex + offset;
                const cardIndex =
                  cards.length > 0
                    ? ((virtualIndex % cards.length) + cards.length) % cards.length
                    : 0;
                const card = cards[cardIndex];
                if (!card) return null;

                const isActive = offset === 0;
                const isPeek = Math.abs(offset) === 1;

                const translateX = `calc(-50% + ${offset * 103}% + ${dragX}px)`;

                return (
                  <motion.div
                    key={virtualIndex}
                    animate={{
                      x: translateX,
                      y: '-50%',
                      scale: isActive ? 1 : isPeek ? 0.92 : 0.82,
                      opacity: isActive ? 1 : isPeek ? 0.92 : 0,
                    }}
                    initial={false}
                    transition={
                      isDragging
                        ? { duration: 0 }
                        : {
                          duration: 0.6,
                          ease: [0.16, 1, 0.3, 1],
                        }
                    }
                    onClick={() => {
                      if (Math.abs(dragX) > 8) return;
                      if (offset === -1) prevCard();
                      else if (offset === 1) nextCard();
                    }}
                    style={{
                      zIndex: isActive ? 20 : isPeek ? 10 : 0,
                      transformStyle: 'preserve-3d',
                    }}
                    className={`pointer-events-auto absolute top-1/2 left-1/2 aspect-[3/5] w-[74vw] sm:w-[50vw] sm:max-w-[380px] overflow-hidden rounded-[34px] shadow-2xl transition-shadow ${isPeek ? 'cursor-pointer hover:opacity-100' : ''
                      }`}
                  >
                    {/* Pure Image Card - No Overlays or Text */}
                    <Link
                      href={card.linkUrl || '/products'}
                      onClick={(e) => {
                        if (!isActive || Math.abs(dragX) > 8) {
                          e.preventDefault();
                        }
                      }}
                      className={`relative block h-full w-full overflow-hidden rounded-[34px] ${!isActive ? 'pointer-events-none' : ''
                        }`}
                    >
                      <Image
                        src={card.src}
                        alt={card.title || 'Hero banner'}
                        fill
                        priority={isActive}
                        sizes="(max-width: 1024px) 80vw, 400px"
                        className="object-cover"
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Large screen scrolling marquee carousel (hidden on small devices, flex on lg) */}
      {cards.length > 0 && (
        <div
          className="carousel-track hidden h-[80vh] items-stretch gap-6 px-2 lg:flex"
          style={{ animationPlayState: isInView ? 'running' : 'paused' }}
        >
          {repeatedCards.map((card, idx) => (
            <Link
              key={`${card.id}-${idx}`}
              href={card.linkUrl || '/products'}
              className="group relative aspect-[2/3] h-full shrink-0 overflow-hidden rounded-4xl bg-black/5 dark:bg-white/5"
            >
              <Image
                src={card.src}
                alt={card.title || 'Hero image'}
                fill
                sizes="(max-width: 1024px) 60vw, 40vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority={idx < 2}
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

