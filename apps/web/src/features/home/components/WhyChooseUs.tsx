'use client';

import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { ShieldCheckIcon, TruckIcon, UsersIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { fetcher } from '@/lib/api-client';

// --- Data ---

const features = [
  {
    id: '01',
    icon: ShieldCheckIcon,
    title: '100% Verified Sellers',
    desc: 'Zero tolerance for fakes. We only onboard top-rated, authentic sellers to ensure legitimacy.',
  },
  {
    id: '02',
    icon: UsersIcon,
    title: '1000+ Happy Customers',
    desc: 'Join the movement. Thousands of satisfied customers across India trusting us for their daily fits.',
  },
  {
    id: '03',
    icon: TruckIcon,
    title: 'Pan-India Shipping',
    desc: 'From Mumbai to Manipur, we deliver everywhere. Fast, trackable shipping to every pin code.',
  },
];

const FALLBACK_REVIEWS = [
  '/images/reviews/1.jpg',
  '/images/reviews/2.jpg',
  '/images/reviews/3.jpg',
  '/images/reviews/4.jpg',
  '/images/reviews/5.jpg',
  '/images/reviews/6.jpg',
  '/images/reviews/7.jpg',
  '/images/reviews/8.jpg',
  '/images/reviews/9.jpg',
  '/images/reviews/10.jpg',
];

interface InfiniteColumnProps {
  images: string[];
  duration: number;
  reverse?: boolean;
  active?: boolean;
  onSelectImage?: (src: string) => void;
}

// --- Components ---

const InfiniteColumn = ({
  images,
  duration = 75,
  reverse = false,
  active = false,
  onSelectImage,
}: InfiniteColumnProps) => {
  // Ensure we have enough items to scroll nicely
  const loopImages = [...images, ...images, ...images];

  return (
    <>
      <style jsx global>{`
        @keyframes scrollUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        @keyframes scrollDown {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }

        .animate-scroll-up {
          animation: scrollUp var(--duration) linear infinite;
        }

        .animate-scroll-down {
          animation: scrollDown var(--duration) linear infinite;
        }

        /* Force pause on hover */
        .pause-on-hover:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      <div
        className={`pause-on-hover flex cursor-pointer flex-col gap-4 ${
          reverse ? 'animate-scroll-down' : 'animate-scroll-up'
        }`}
        style={
          {
            '--duration': `${duration}s`,
            animationPlayState: active ? 'running' : 'paused',
          } as CSSProperties
        }
      >
        {loopImages.map((src, i) => (
          <div
            key={i}
            onClick={() => onSelectImage?.(src)}
            className="group relative aspect-[9/19] w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 opacity-80 transition-all duration-300 hover:border-white/30 hover:opacity-100 hover:shadow-2xl"
          >
            <img
              src={src}
              alt={`Customer Review ${i}`}
              className="h-full w-full object-cover object-top"
              loading="lazy"
            />
            {/* Hover overlay with action indicator */}
            <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 p-3">
              <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-black shadow-md backdrop-blur-xs uppercase tracking-wider dark:bg-black/95 dark:text-white">
                View Chat
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

// --- Main Section ---
export default function SplitFeatureSection({ initialReviews }: { initialReviews?: any[] }) {
  const [reviews, setReviews] = useState<string[]>(
    initialReviews && initialReviews.length > 0
      ? initialReviews.slice(0, 20).map((r) => r.imageUrl)
      : [],
  );
  const [isMounted, setIsMounted] = useState(!!initialReviews && initialReviews.length > 0);
  const [isInView, setIsInView] = useState(true);
  const [activeReviewIndex, setActiveReviewIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const columnsRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node) {
      observerRef.current = new IntersectionObserver(([entry]) => {
        setIsInView(entry.isIntersecting);
      });
      observerRef.current.observe(node);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    if (initialReviews && initialReviews.length > 0) {
      setReviews(initialReviews.slice(0, 20).map((r) => r.imageUrl));
      return;
    }
    const loadReviews = async () => {
      try {
        const data = await fetcher<any[]>('/whatsapp-reviews?limit=20');
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data.slice(0, 20).map((r) => r.imageUrl));
          return;
        }
        setReviews(FALLBACK_REVIEWS.slice(0, 20));
      } catch (err: unknown) {
        console.error('Failed to load dynamic reviews:', err);
        setReviews(FALLBACK_REVIEWS.slice(0, 20));
      }
    };
    void loadReviews();
  }, [initialReviews]);

  const handleSelectImage = useCallback((src: string) => {
    const idx = reviews.indexOf(src);
    if (idx !== -1) {
      setActiveReviewIndex(idx);
    }
  }, [reviews]);

  const navigateNext = useCallback(() => {
    setActiveReviewIndex((prev) => {
      if (prev === null) return null;
      return prev < reviews.length - 1 ? prev + 1 : 0;
    });
  }, [reviews.length]);

  const navigatePrev = useCallback(() => {
    setActiveReviewIndex((prev) => {
      if (prev === null) return null;
      return prev > 0 ? prev - 1 : reviews.length - 1;
    });
  }, [reviews.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeReviewIndex === null) return;
      if (e.key === 'Escape') {
        setActiveReviewIndex(null);
      } else if (e.key === 'ArrowRight') {
        navigateNext();
      } else if (e.key === 'ArrowLeft') {
        navigatePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeReviewIndex, navigateNext, navigatePrev]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50;
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        navigateNext();
      } else {
        navigatePrev();
      }
    }
    touchStartX.current = null;
  };

  // Split reviews (max 20) evenly into 3 columns
  const getColumnImages = (colIndex: number) => {
    const limitedReviews = reviews.slice(0, 20);
    if (limitedReviews.length === 0) {
      return [];
    }

    // Chunk reviews dynamically
    const chunks: string[][] = [[], [], []];
    for (const [idx, src] of limitedReviews.entries()) {
      chunks[idx % 3].push(src);
    }

    return chunks[colIndex];
  };

  const col1 = getColumnImages(0);
  const col2 = getColumnImages(1);
  const col3 = getColumnImages(2);

  return (
    <section className="relative overflow-hidden font-sans">
      <div className="container mx-auto px-4 py-10 md:px-6 lg:px-8">
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="relative z-10 flex flex-col justify-center py-20 lg:sticky lg:top-0 lg:h-screen lg:py-32">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="mb-6 text-5xl leading-[0.9] font-bold tracking-tighter uppercase md:text-7xl">
                Defined by <br />
                <span className="text-foreground-muted">Trust.</span>
              </h2>
              <p className="text-foreground-muted max-w-md text-lg leading-relaxed">
                Join over 1000+ happy customers across India. We don't just ship products; we
                deliver verified quality to every pin code in the country.
              </p>
            </motion.div>

            <div className="space-y-8">
              {features.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group flex cursor-default gap-6"
                >
                  <div className="border-forground relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border transition-colors duration-300">
                    <item.icon className="text-forground z-10 h-6 w-6 transition-colors duration-300" />
                    <div className="absolute inset-0 bg-white opacity-0 blur-xl transition-opacity duration-300" />
                  </div>
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-xl font-bold tracking-wide uppercase">
                      {item.title}
                    </h3>
                    <p className="text-foreground-muted max-w-sm text-sm leading-relaxed transition-colors duration-300">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* See More Reviews Button */}
            {isMounted && (
              <div className="mt-12">
                <Link
                  href="/whatsapp-reviews"
                  className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3.5 text-sm font-bold tracking-wide text-white uppercase shadow-md transition-all hover:bg-black/90 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/90"
                >
                  See More Reviews
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="relative flex w-full flex-col items-center border-white/5 lg:border-l">
            {isMounted ? (
              <div
                ref={columnsRef}
                className="relative h-150 w-full overflow-hidden lg:h-[calc(100vh-120px)]"
              >
                <div className="from-background via-blackground pointer-events-none absolute top-0 right-0 left-0 z-20 h-24 bg-linear-to-b to-transparent" />
                <div className="from-blackground via-background pointer-events-none absolute right-0 -bottom-6 left-0 z-20 h-24 bg-linear-to-t to-transparent" />

                <div className="grid h-full w-full grid-cols-3 gap-3 p-4 lg:p-6">
                  <div className="relative h-full overflow-hidden">
                    {col1.length > 0 && (
                      <InfiniteColumn
                        images={col1}
                        duration={65}
                        active={isInView}
                        onSelectImage={handleSelectImage}
                      />
                    )}
                  </div>
                  <div className="relative h-full overflow-hidden pt-24">
                    {col2.length > 0 && (
                      <InfiniteColumn
                        images={col2}
                        duration={85}
                        reverse={true}
                        active={isInView}
                        onSelectImage={handleSelectImage}
                      />
                    )}
                  </div>
                  <div className="relative h-full overflow-hidden pt-12">
                    {col3.length > 0 && (
                      <InfiniteColumn
                        images={col3}
                        duration={72}
                        active={isInView}
                        onSelectImage={handleSelectImage}
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Skeleton Placeholder layout to prevent jumping/layout shifts during SSR/Hydration */
              <div className="relative h-150 w-full overflow-hidden lg:h-[calc(100vh-120px)]">
                <div className="grid h-full w-full grid-cols-3 gap-3 p-4 lg:p-6">
                  {/* Column 1 Placeholder */}
                  <div className="flex flex-col gap-4">
                    <div className="aspect-[9/19] animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
                    <div className="aspect-[9/19] animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
                  </div>
                  {/* Column 2 Placeholder */}
                  <div className="flex flex-col gap-4 pt-24">
                    <div className="aspect-[9/19] animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
                    <div className="aspect-[9/19] animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
                  </div>
                  {/* Column 3 Placeholder */}
                  <div className="flex flex-col gap-4 pt-12">
                    <div className="aspect-[9/19] animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
                    <div className="aspect-[9/19] animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-screen Lightbox Modal for detailed image view */}
      {activeReviewIndex !== null && reviews[activeReviewIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button */}
          <button
            onClick={() => setActiveReviewIndex(null)}
            className="absolute top-6 right-6 z-50 p-2 text-white/60 transition-colors hover:text-white"
            aria-label="Close"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Desktop Left Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigatePrev();
            }}
            className="absolute left-8 z-50 hidden rounded-full p-4 text-white/60 transition-all hover:bg-white/10 hover:text-white md:flex"
            aria-label="Previous Review"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Review Image Wrapper */}
          <div
            className="relative flex max-h-screen max-w-full flex-col items-center justify-center p-4"
            onClick={() => setActiveReviewIndex(null)}
          >
            <img
              src={reviews[activeReviewIndex]}
              alt="WhatsApp Review Fullscreen"
              className="pointer-events-none max-h-[85vh] max-w-[95vw] rounded-lg object-contain shadow-2xl md:max-w-[85vw]"
            />
            <div className="mt-4 flex items-center gap-4">
              <Link
                href="/whatsapp-reviews"
                onClick={(e) => e.stopPropagation()}
                className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-xs transition-colors hover:bg-white/20 hover:text-white"
              >
                View all reviews &rarr;
              </Link>
            </div>
          </div>

          {/* Desktop Right Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateNext();
            }}
            className="absolute right-8 z-50 hidden rounded-full p-4 text-white/60 transition-all hover:bg-white/10 hover:text-white md:flex"
            aria-label="Next Review"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
