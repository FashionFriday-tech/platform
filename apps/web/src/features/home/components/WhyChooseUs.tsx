'use client';

import { type CSSProperties, useState, useEffect } from 'react';
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

// --- Interfaces ---

interface InfiniteColumnProps {
  images: string[];
  duration: number;
  reverse?: boolean;
}

// --- Components ---

const InfiniteColumn = ({ images, duration, reverse = false }: InfiniteColumnProps) => {
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
          } as CSSProperties
        }
      >
        {loopImages.map((src, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 opacity-80 transition-all duration-300 hover:scale-[1.02] hover:border-white/30 hover:opacity-100 hover:shadow-2xl w-full"
          >
            <img
              src={src}
              alt={`Customer Review ${i}`}
              className="block h-auto w-full object-contain"
            />
          </div>
        ))}
      </div>
    </>
  );
};

// --- Main Section ---
export default function SplitFeatureSection() {
  const [reviews, setReviews] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const loadReviews = async () => {
      try {
        const data = await fetcher<any[]>('/whatsapp-reviews');
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data.map((r) => r.imageUrl));
          return;
        }
        setReviews(FALLBACK_REVIEWS);
      } catch (err) {
        console.error('Failed to load dynamic reviews:', err);
        setReviews(FALLBACK_REVIEWS);
      }
    };
    loadReviews();
  }, []);

  // Split reviews (max 20) evenly into 3 columns
  const getColumnImages = (colIndex: number) => {
    const limitedReviews = reviews.slice(0, 20);
    if (limitedReviews.length === 0) return [];
    
    // Chunk reviews dynamically
    const chunks: string[][] = [[], [], []];
    limitedReviews.forEach((src, idx) => {
      chunks[idx % 3].push(src);
    });
    
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
                <a
                  href="/whatsapp-reviews"
                  className="inline-flex items-center justify-center rounded-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 px-8 py-3.5 text-sm font-bold tracking-wide uppercase transition-all active:scale-95 shadow-md"
                >
                  See More Reviews
                </a>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="relative flex flex-col items-center border-white/5 lg:border-l w-full">
            {isMounted ? (
              <div className="relative h-150 w-full overflow-hidden lg:h-[calc(100vh-120px)]">
                <div className="from-background via-blackground pointer-events-none absolute top-0 right-0 left-0 z-20 h-24 bg-linear-to-b to-transparent" />
                <div className="from-blackground via-background pointer-events-none absolute right-0 -bottom-6 left-0 z-20 h-24 bg-linear-to-t to-transparent" />

                <div className="grid h-full grid-cols-3 gap-3 p-4 lg:p-6 w-full">
                  <div className="relative h-full overflow-hidden">
                    {col1.length > 0 && <InfiniteColumn images={col1} duration={25} />}
                  </div>
                  <div className="relative h-full overflow-hidden pt-24">
                    {col2.length > 0 && <InfiniteColumn images={col2} duration={35} reverse={true} />}
                  </div>
                  <div className="relative h-full overflow-hidden pt-12">
                    {col3.length > 0 && <InfiniteColumn images={col3} duration={28} />}
                  </div>
                </div>
              </div>
            ) : (
              /* Skeleton Placeholder layout to prevent jumping/layout shifts during SSR/Hydration */
              <div className="relative h-150 w-full overflow-hidden lg:h-[calc(100vh-120px)] w-full">
                <div className="grid h-full grid-cols-3 gap-3 p-4 lg:p-6 w-full">
                  {/* Column 1 Placeholder */}
                  <div className="flex flex-col gap-4">
                    <div className="h-64 bg-black/5 dark:bg-white/5 rounded-2xl animate-pulse" />
                    <div className="h-80 bg-black/5 dark:bg-white/5 rounded-2xl animate-pulse" />
                  </div>
                  {/* Column 2 Placeholder */}
                  <div className="flex flex-col gap-4 pt-24">
                    <div className="h-80 bg-black/5 dark:bg-white/5 rounded-2xl animate-pulse" />
                    <div className="h-64 bg-black/5 dark:bg-white/5 rounded-2xl animate-pulse" />
                  </div>
                  {/* Column 3 Placeholder */}
                  <div className="flex flex-col gap-4 pt-12">
                    <div className="h-64 bg-black/5 dark:bg-white/5 rounded-2xl animate-pulse" />
                    <div className="h-80 bg-black/5 dark:bg-white/5 rounded-2xl animate-pulse" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
