'use client';

import { type JSX, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { Brand } from '@ff/schemas';
import { SearchIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { useHeroCarousel } from '../hooks/use-hero-carousel';
import BrandScroll from './BrandScroll';

export default function Hero({
  initialCampaigns,
  initialBrands,
  children,
}: {
  initialCampaigns?: any[];
  initialBrands?: Brand[];
  children?: React.ReactNode;
}): JSX.Element {

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

  // Dynamic mobile card sizing keeping strict 3:5 aspect ratio and balancing container height:
  // (100dvh - 138px) is the available space between top header (82px) and bottom nav (56px).
  // Scaled up to ~68% of container height while preserving at least 160px of balance for Search Box and Brand Logos.
  const mobileCardStyle = {
    width: 'min(calc(((100dvh - 138px) - 160px) * 0.6), calc((100dvh - 138px) * 0.41), 79vw, 340px)',
    aspectRatio: '3 / 5',
    height: 'auto',
  };

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col justify-evenly items-center w-full h-[calc(100dvh-82px)] max-h-[calc(100dvh-82px)] pb-14 px-0 overflow-hidden lg:h-auto lg:max-h-none lg:pb-0 lg:mt-28 lg:min-h-0 lg:block lg:p-6"
    >
      {/* 1. Mobile Search input */}
      <div className="shrink-0 w-full px-4 lg:hidden">
        <div
          onClick={handleOpenSearch}
          className="flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-full border border-zinc-300/80 bg-zinc-50/50 px-4 py-2.5 transition-all duration-200 active:scale-98 dark:border-zinc-700/80 dark:bg-zinc-900/50"
        >
          <SearchIcon className="h-4.5 w-4.5 shrink-0 text-zinc-500 dark:text-zinc-400" />
          <div className="relative flex h-5 w-full items-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={placeholderIndex}
                initial={{ opacity: 0, y: 8, filter: 'blur(2px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute truncate text-xs font-medium text-zinc-600 select-none dark:text-zinc-300 sm:text-sm"
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

      {/* 2. Mobile/Tablet View (Single Card or Circular Carousel with Strict 3:5 Aspect Ratio) */}
      {cards.length === 1 && (
        <div className="relative flex shrink-0 w-full items-center justify-center overflow-hidden py-0 lg:hidden">
          <div
            style={mobileCardStyle}
            className="relative overflow-hidden rounded-[38px] sm:rounded-[44px] shadow-2xl"
          >
            <Link
              href={cards[0].linkUrl || '/products'}
              className="relative block h-full w-full overflow-hidden rounded-[38px] sm:rounded-[44px]"
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
        <div className="relative flex shrink-0 w-full items-center justify-center overflow-hidden select-none touch-pan-y py-0 lg:hidden">
          <div
            onTouchStart={(e) => onDragStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => onDragMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={onDragEnd}
            onTouchCancel={onDragEnd}
            onMouseDown={(e) => onDragStart(e.clientX, e.clientY)}
            onMouseMove={(e) => onDragMove(e.clientX, e.clientY)}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
            className="relative flex w-full items-center justify-center"
          >
            {/* Dynamic sizing spacer ensuring strict 3:5 aspect ratio without vertical overflow */}
            <div
              style={mobileCardStyle}
              className="pointer-events-none mx-auto opacity-0"
            />

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
                      ...mobileCardStyle,
                      zIndex: isActive ? 20 : isPeek ? 10 : 0,
                      transformStyle: 'preserve-3d',
                    }}
                    className={`pointer-events-auto absolute top-1/2 left-1/2 overflow-hidden rounded-[38px] sm:rounded-[44px] shadow-2xl transition-shadow ${
                      isPeek ? 'cursor-pointer hover:opacity-100' : ''
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
                      className={`relative block h-full w-full overflow-hidden rounded-[38px] sm:rounded-[44px] ${
                        !isActive ? 'pointer-events-none' : ''
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

      {/* 3. Large screen scrolling marquee carousel (hidden on small devices, flex on lg) */}
      {cards.length > 0 && (
        <div
          className="carousel-track hidden h-[75vh] items-stretch gap-6 px-2 lg:flex"
          style={{ animationPlayState: isInView ? 'running' : 'paused' }}
        >
          {repeatedCards.map((card, idx) => (
            <Link
              key={`${card.id}-${idx}`}
              href={card.linkUrl || '/products'}
              className="group relative aspect-[3/5] h-full shrink-0 overflow-hidden rounded-4xl bg-black/5 dark:bg-white/5"
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

      {/* 3. Brand Logo Marquee: identical gap to card */}
      {children ? (
        <div className="shrink-0 w-full lg:flex-none lg:block">{children}</div>
      ) : (
        <div className="shrink-0 w-full lg:mt-6 lg:flex-none lg:block">
          <BrandScroll initialBrands={initialBrands} />
        </div>
      )}
    </section>
  );
}

