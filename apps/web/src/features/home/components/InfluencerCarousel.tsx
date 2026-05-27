'use client';

// Force rebuild comment

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Link from 'next/link';
import { ArrowLeftIcon, ArrowRightIcon, PlayIcon, ArrowUpRightIcon } from '@ff/ui';
import { motion } from 'motion/react';
import { fetcher } from '@/lib/api-client';

/* ---------------- TYPES ---------------- */
interface Product {
  id: number;
  title: string;
  tag: string;
  image: string;
  link: string;
}

/* ---------------- DATA ---------------- */
// Purely dynamic - no static fallback

/* ---------------- HELPER ---------------- */
// Handles negative modulo correctly (e.g. -1 % 6 = 5)
const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function TrendingCoverflowPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000);
  };

  const resetTimer = () => {
    startTimer();
  };

  useEffect(() => {
    if (products.length > 0) {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [products.length]);

  useEffect(() => {
    const loadContentPartners = async () => {
      try {
        const data = await fetcher<any[]>('/campaigns');
        if (Array.isArray(data) && data.length > 0) {
          const filtered = data.filter((b) => b.placement === 'content-partners' && b.isActive);
          if (filtered.length > 0) {
            const mapped = filtered.map((b, index) => ({
              id: index + 1,
              title: b.title,
              tag: '',
              image: b.mediaUrl,
              link: b.linkUrl,
            }));
            setProducts(mapped);
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic content partners:', err);
      }
    };
    loadContentPartners();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    resetTimer();
  };
  const handlePrev = () => {
    setCurrentIndex((prev) => prev - 1);
    resetTimer();
  };

  const handleCardClick = (virtualIndex: number) => {
    setCurrentIndex(virtualIndex);
    resetTimer();
  };

  // Determines the style based on how far the card is from the center (offset)
  const getVariant = (offset: number) => {
    // Active (Center)
    if (offset === 0) {
      return {
        x: '0%',
        scale: 1,
        rotateY: 0,
        zIndex: 50,
        opacity: 1,
        filter: 'brightness(1) blur(0px)',
      };
    }

    // Neighbors (+1 or -1)
    if (Math.abs(offset) === 1) {
      const dir = Math.sign(offset);
      return {
        x: `${dir * 65}%`,
        scale: 0.82,
        rotateY: `${dir * -20}deg`,
        zIndex: 40,
        opacity: 1,
        filter: 'brightness(0.8) blur(0px)',
      };
    }

    // Far Neighbors (+2 or -2)
    if (Math.abs(offset) === 2) {
      const dir = Math.sign(offset);
      return {
        x: `${dir * 120}%`,
        scale: 0.65,
        rotateY: `${dir * -45}deg`,
        zIndex: 30,
        opacity: 0.6,
        filter: 'brightness(0.5) blur(1px)',
      };
    }

    // Hidden / Offscreen (+3 or -3)
    const dir = Math.sign(offset);
    return {
      x: `${dir * 180}%`,
      scale: 0.5,
      rotateY: `${dir * -60}deg`,
      zIndex: 10,
      opacity: 0,
      filter: 'brightness(0.2) blur(3px)',
    };
  };

  // We render a fixed window of cards around the current index
  // e.g., if current is 10, we render 7, 8, 9, 10, 11, 12, 13
  const visibleRange = [-3, -2, -1, 0, 1, 2, 3];

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg w-full overflow-hidden sm:py-24 py-12">
      <div className="container mx-auto px-6 flex flex-col items-center md:flex-row md:items-end justify-center gap-4 sm:mb-16 mb-6">
        <h2 className="section-header">
          Content Partners
        </h2>
        
        
      </div>

      <div className="relative flex h-96 w-full items-center justify-center sm:my-10 sm:h-125">
        <div
          className="relative flex h-full w-full max-w-7xl items-center justify-center"
          style={{ perspective: '1000px' }}
        >
          {/* We map the OFFSETS, not the products directly */}
          {visibleRange.map((offset) => {
            const virtualIndex = currentIndex + offset;
            // Map the virtual index (infinite) to the actual data index (0 to 5)
            const productIndex = mod(virtualIndex, products.length);
            const product = products[productIndex];
            const variant = getVariant(offset);
            const isActive = offset === 0;

            return (
              <motion.div
                // KEY CHANGE: Using virtualIndex as key ensures Framer treats
                // the card moving from right to left as the SAME card,
                // preventing the "fly back" glitch.
                key={virtualIndex}
                animate={variant}
                initial={variant}
                transition={{ type: 'spring', stiffness: 60, damping: 24, mass: 1.2 }}
                onClick={() => {
                  handleCardClick(virtualIndex);
                }}
                className="group absolute aspect-3/5 w-[220px] cursor-pointer overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl md:w-[280px]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 280px, 360px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={isActive}
                  />

                  {/* Play Button (Centered on ALL cards) */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(product.link);
                      }}
                      className={`flex h-16 w-16 scale-110 items-center justify-center rounded-full border-2 border-white text-white opacity-100 shadow-lg backdrop-blur-xs transition-all duration-500 ease-out group-hover:bg-white group-hover:text-black hover:scale-125`}
                    >
                      <PlayIcon className="ml-1 h-6 w-6 fill-current" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      
    </section>
  );
}
