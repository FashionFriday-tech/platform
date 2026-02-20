'use client';

import { ArrowLeftIcon, ArrowRightIcon, PlayIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

/* ---------------- TYPES ---------------- */
type Product = {
  id: number;
  title: string;
  tag: string;
  image: string;
  link: string;
};

/* ---------------- DATA ---------------- */
const products: Product[] = [
  {
    id: 1,
    title: 'The Roseline Ring',
    tag: 'Rings',
    image: '/images/influencers/1.png',
    link: '/shop/rings/roseline',
  },
  {
    id: 2,
    title: 'Zoe Link Earrings',
    tag: 'Earrings',
    image: '/images/influencers/2.png',
    link: '/shop/earrings/zoe',
  },
  {
    id: 3,
    title: 'The Hibiscus Ring II',
    tag: 'Best Seller',
    image: '/images/influencers/3.png',
    link: '/shop/rings/hibiscus',
  },
  {
    id: 4,
    title: 'Chubby Gold Hoops',
    tag: 'Hoops',
    image: '/images/influencers/4.png',
    link: '/shop/earrings/hoops',
  },
  {
    id: 5,
    title: 'Serpent Chain',
    tag: 'Necklaces',
    image: '/images/influencers/5.png',
    link: '/shop/necklaces/serpent',
  },
  {
    id: 6,
    title: 'Serpent Chain',
    tag: 'Necklaces',
    image: '/images/influencers/6.png',
    link: '/shop/necklaces/serpent',
  },
];

/* ---------------- HELPER ---------------- */
// Handles negative modulo correctly (e.g. -1 % 6 = 5)
const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function TrendingCoverflowPage() {
  const router = useRouter();
  // We allow this index to go infinite (e.g., 100, 101, 102...)
  // This prevents the "rewind" animation when looping.
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => setCurrentIndex((prev) => prev + 1);
  const handlePrev = () => setCurrentIndex((prev) => prev - 1);

  const handleCardClick = (virtualIndex: number, link: string) => {
    if (virtualIndex === currentIndex) {
      router.push(link);
    } else {
      setCurrentIndex(virtualIndex);
    }
  };

  // Determines the style based on how far the card is from the center (offset)
  const getVariant = (offset: number) => {
    // Active (Center)
    if (offset === 0) {
      return {
        x: '0%',
        scale: 0.6,
        rotateY: 0,
        zIndex: 10,
        opacity: 1,
        filter: 'brightness(1) blur(0px)',
      };
    }

    // Neighbors (+1 or -1)
    if (Math.abs(offset) === 1) {
      const dir = Math.sign(offset);
      return {
        x: `${dir * 65}%`,
        scale: 0.65,
        rotateY: `${dir * -20}deg`,
        zIndex: 40,
        opacity: 1,
        filter: 'brightness(1) blur(0px)',
      };
    }

    // Far Neighbors (+2 or -2)
    if (Math.abs(offset) === 2) {
      const dir = Math.sign(offset);
      return {
        x: `${dir * 140}%`,
        scale: 0.8,
        rotateY: `${dir * -60}deg`,
        zIndex: 30,
        opacity: 1,
        filter: 'brightness(1) blur(0px)',
      };
    }

    // Hidden / Offscreen (+3 or -3)
    const dir = Math.sign(offset);
    return {
      x: `${dir * 300}%`,
      scale: 1,
      rotateY: `${dir * -80}deg`,
      zIndex: 10,
      opacity: 0,
      filter: 'brightness(0) blur(0)',
    };
  };

  // We render a fixed window of cards around the current index
  // e.g., if current is 10, we render 7, 8, 9, 10, 11, 12, 13
  const visibleRange = [-3, -2, -1, 0, 1, 2, 3];

  return (
    <section className="bg w-full overflow-hidden sm:py-24">
      <div className="container mx-auto px-4 text-center sm:mb-16">
        <h2 className="text-4xl font-extrabold tracking-tight uppercase md:text-7xl">
          Content Partners
        </h2>
        <p className="text-foreground-muted mx-auto mt-4 max-w-md">
          Creators and pages who promote our products across social media.
        </p>
      </div>

      <div className="relative flex h-96 w-full items-center justify-center sm:my-10 sm:h-125">
        <div
          className="relative flex h-full w-full max-w-6xl items-center justify-center"
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
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                onClick={() => handleCardClick(virtualIndex, product.link)}
                className="group absolute aspect-3/5 w-70 cursor-pointer overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl md:w-87"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={isActive}
                  />

                  {/* Play Button (Centered on ALL cards) */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div
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

      <div className="flex justify-center gap-10 sm:mt-4">
        <button
          onClick={handlePrev}
          className="border-forground-muted flex h-12 w-12 items-center justify-center rounded-full border transition hover:scale-95 active:scale-95"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <button
          onClick={handleNext}
          className="border-forground-muted flex h-12 w-12 items-center justify-center rounded-full border transition hover:scale-95 active:scale-95"
        >
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
