'use client';

import { type JSX, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useHeroCarousel } from '../hooks/use-hero-carousel';
import { SearchIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

export default function Hero(): JSX.Element {
  const {
    cards,
    activeIndex,
    isPlaying,
    goToCard,
    nextCard,
    prevCard,
  } = useHeroCarousel();

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
    return () => clearInterval(timer);
  }, []);

  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent('open-search'));
  };

  // Touch Swipe Gesture State & Handlers
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextCard();
    } else if (isRightSwipe) {
      prevCard();
    }
  };

  return (
    <section className="relative min-h-[60vh] w-full overflow-hidden p-2 pb-2 lg:mt-28 lg:min-h-[85vh] lg:p-6">
      {/* Mobile Search input at the top of Hero section */}
      <div className="px-2 mt-4 mb-4 lg:hidden">
        <div
          onClick={handleOpenSearch}
          className="flex items-center gap-3 w-full bg-transparent border border-zinc-300 dark:border-zinc-700/80 rounded-full px-4 py-3.5 cursor-pointer active:scale-98 transition-all duration-200 overflow-hidden"
        >
          <SearchIcon className="text-zinc-600 dark:text-zinc-400 w-5 h-5 shrink-0" />
          <div className="relative h-5 w-full overflow-hidden flex items-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={placeholderIndex}
                initial={{ opacity: 0, y: 10, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute text-zinc-700 dark:text-zinc-300 text-sm font-semibold select-none truncate"
              >
                {placeholders[placeholderIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress-fill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress-bar {
          animation: progress-fill 3s linear forwards;
        }
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

      {/* Mobile/Tablet Single Card Carousel (shown on small devices, hidden on lg) */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative h-[60vh] w-full overflow-hidden rounded-4xl bg-black/5 dark:bg-white/5 lg:hidden"
      >
        {cards.map((card, idx) => {
          const isActive = idx === activeIndex;
          return (
            <Link
              key={card.id}
              href={card.linkUrl || '/products'}
              className={`absolute inset-0 h-full w-full transition-all duration-1000 ease-in-out ${
                isActive 
                  ? 'opacity-100 z-10 scale-100 pointer-events-auto' 
                  : 'opacity-0 z-0 scale-95 pointer-events-none'
              }`}
            >
              <Image
                src={card.src}
                alt={card.title || 'Hero image'}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover transition-transform duration-[10000ms] ease-out hover:scale-110"
              />
            </Link>
          );
        })}

        {/* Apple-style Carousel Indicators overlay at the bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/35 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10 shadow-lg">
          {cards.map((card, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={card.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToCard(idx);
                }}
                className={`relative transition-all duration-300 rounded-full overflow-hidden ${
                  isActive 
                    ? 'w-6 h-1.5 bg-white/20' 
                    : 'w-1.5 h-1.5 bg-white/35 hover:bg-white/55'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              >
                {isActive && isPlaying && (
                  <span
                    key={`${activeIndex}-active-${isPlaying}`}
                    className="absolute inset-y-0 left-0 bg-white rounded-full animate-progress-bar"
                  />
                )}
                {isActive && !isPlaying && (
                  <span className="absolute inset-0 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Large screen scrolling marquee carousel (hidden on small devices, flex on lg) */}
      <div className="carousel-track hidden h-[80vh] items-stretch gap-6 px-2 lg:flex">
        {repeatedCards.map((card, idx) => (
          <Link
            key={`${card.id}-${idx}`}
            href={card.linkUrl || '/products'}
            className="group relative h-full aspect-[2/3] shrink-0 overflow-hidden rounded-4xl bg-black/5 dark:bg-white/5"
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
    </section>
  );
}
