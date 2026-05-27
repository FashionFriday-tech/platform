'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link

import { ArrowLeftIcon, ArrowRightIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

// --- TYPES ---
export interface Product {
  id: number;
  title: string;
  slug: string;
  image: string;
}

const transitionSpec = {
  type: 'spring' as const,
  stiffness: 75,
  damping: 20,
  mass: 1.2,
};

export default function CoverflowCarousel({ products }: { products: Product[] }) {
  const [activeIndex, setActiveIndex] = useState(Math.floor(products.length / 2));

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % products.length);
    resetTimer();
  };
  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
    resetTimer();
  };

  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, 3000);
  };

  const resetTimer = () => {
    startTimer();
  };

  React.useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [products.length]);

  const getVariant = (index: number) => {
    const total = products.length;
    let offset = index - activeIndex;
    if (offset > total / 2) {
      offset -= total;
    }
    if (offset < -total / 2) {
      offset += total;
    }

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
    if (Math.abs(offset) === 1) {
      const dir = Math.sign(offset);
      return {
        x: `${dir * 60}%`,
        scale: 0.82,
        rotateY: `${dir * -40}deg`,
        zIndex: 40,
        opacity: 0.8,
        filter: 'brightness(0.8) blur(1px)',
      };
    }
    if (Math.abs(offset) === 2) {
      const dir = Math.sign(offset);
      return {
        x: `${dir * 110}%`,
        scale: 0.65,
        rotateY: `${dir * -55}deg`,
        zIndex: 30,
        opacity: 0.6,
        filter: 'brightness(0.35) blur(3px)',
      };
    }
    const dir = Math.sign(offset);
    return {
      x: `${dir * 160}%`,
      scale: 0.5,
      rotateY: `${dir * -65}deg`,
      zIndex: 10,
      opacity: 0,
      filter: 'brightness(0.2) blur(6px)',
    };
  };

  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      {/* 3D STAGE CONTAINER */}
      <div className="relative flex h-112 w-full max-w-6xl items-center justify-center perspective-distant">
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => {
            const variant = getVariant(index);
            const isActive = index === activeIndex;

            return (
              <motion.div
                key={product.id}
                animate={variant}
                initial={variant}
                transition={transitionSpec}
                className="absolute aspect-3/4 w-70 overflow-hidden rounded-4xl shadow-xl md:w-[320px]"
                style={{ transformStyle: 'preserve-3d' }}
                onClick={() => {
                  if (!isActive) {
                    setActiveIndex(index);
                    resetTimer();
                  }
                }}
              >
                {isActive ? (
                  <Link
                    href={`/product/${product.slug}`}
                    className="block h-full w-full cursor-pointer"
                  >
                    <CardContent product={product} isActive={isActive} />
                  </Link>
                ) : (
                  <div className="h-full w-full cursor-pointer">
                    <CardContent product={product} isActive={isActive} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div className="absolute inset-y-0 left-0 flex items-center">
          <button onClick={handlePrev} className="p-2 bg-white/30 rounded-full hover:bg-white/50">
            <ArrowLeftIcon className="h-6 w-6 text-black" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button onClick={handleNext} className="p-2 bg-white/30 rounded-full hover:bg-white/50">
            <ArrowRightIcon className="h-6 w-6 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-component for cleaner code
function CardContent({ product, isActive }: { product: Product; isActive: boolean }) {
  return (
    <div className="relative h-full w-full">
      <Image
        src={product.image}
        alt={product.title}
        fill
        sizes="(max-width: 768px) 300px, 400px"
        className="object-cover"
        priority={isActive}
      />
      {/* Optional Title Overlay on Hover */}
      <div className="absolute inset-0 flex items-end bg-black/20 p-6 opacity-0 transition-opacity hover:opacity-100">
        <p className="text-xs font-bold tracking-widest text-white uppercase">{product.title}</p>
      </div>
    </div>
  );
}
