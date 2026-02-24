'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { ChevronRightIcon } from '@ff/ui';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';

const GENDERS = ['Men', 'Women'] as const;

const CATEGORIES_DATA = {
  Men: {
    hero: '/images/categories/men.png',
    list: [
      {
        name: 'Sneakers',
        slug: 'sneakers',
        img: '/images/categories/men/sneaker.png',
        items: '124 Items',
      },
      {
        name: 'Watches',
        slug: 'watches',
        img: '/images/categories/men/watches.png',
        items: '86 Items',
      },
      {
        name: 'Clothing',
        slug: 'clothing',
        img: '/images/categories/men/cloths.png',
        items: '210 Items',
      },
      {
        name: 'Slippers',
        slug: 'slippers',
        img: '/images/categories/men/slippers.png',
        items: '45 Items',
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        img: '/images/categories/men/accessories.png',
        items: '92 Items',
      },
    ],
  },
  Women: {
    hero: '/images/categories/womens.png',
    list: [
      {
        name: 'Sneakers',
        slug: 'sneakers',
        img: '/images/categories/women/sneaker.png',
        items: '110 Items',
      },
      {
        name: 'Watches',
        slug: 'watches',
        img: '/images/categories/women/watches.png',
        items: '95 Items',
      },
      {
        name: 'Clothing',
        slug: 'clothing',
        img: '/images/categories/women/cloth.png',
        items: '340 Items',
      },
      {
        name: 'Slippers',
        slug: 'slippers',
        img: '/images/categories/women/slippers.png',
        items: '52 Items',
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        img: '/images/categories/women/accessories.png',
        items: '120 Items',
      },
    ],
  },
};

export default function StoreLandingPage() {
  const [genderIndex, setGenderIndex] = useState(0);
  const activeGender = GENDERS[genderIndex];

  /**
   * FIX: Replaced 'any' with proper types to resolve @typescript-eslint/no-unsafe-member-access
   */
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold && genderIndex > 0) {
      setGenderIndex(0);
    } else if (info.offset.x < -swipeThreshold && genderIndex < GENDERS.length - 1) {
      setGenderIndex(1);
    }
  };

  return (
    <div className="bg-background h-screen pb-14 select-none">
      {/* --- HEADER: Fixed width constraints --- */}
      <header className="bg-background border-border fixed top-14 right-0 left-0 z-50 w-full border-b backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-md items-center justify-around px-4">
          {GENDERS.map((gender, idx) => (
            <button
              key={gender}
              onClick={() => {
                setGenderIndex(idx);
              }}
              className={`relative h-full flex-1 text-[10px] font-black tracking-[0.25em] uppercase transition-colors outline-none ${
                activeGender === gender ? 'text-foreground' : 'text-foreground-subtle/40'
              }`}
            >
              {gender}
              {activeGender === gender && (
                <motion.div
                  layoutId="navUnderline"
                  className="bg-brand absolute right-4 bottom-0 left-4 h-0.5"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* --- SWIPEABLE CONTENT --- */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        className="relative z-10 touch-pan-y pt-10 pb-20"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeGender}
            initial={{ opacity: 0, x: genderIndex === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: genderIndex === 0 ? 20 : -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="mx-auto max-w-2xl px-4 pt-6"
          >
            {/* 1. HERO SECTION */}
            {/* FIX: Changed rounded-[2rem] to rounded-4xl */}
            <div className="bg-background-muted border-border/50 relative mb-8 aspect-15/10 w-full overflow-hidden rounded-4xl border shadow-sm">
              <motion.div
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${
                    Object.prototype.hasOwnProperty.call(CATEGORIES_DATA, activeGender)
                      ? CATEGORIES_DATA[activeGender].hero
                      : CATEGORIES_DATA.Men.hero
                  })`,
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <p className="mb-1 text-[8px] font-black tracking-[0.3em] text-white/50 uppercase">
                  New Season
                </p>
                <h1 className="text-3xl leading-none font-black tracking-tighter text-white uppercase italic">
                  {activeGender}&apos;s <br /> Essentials
                </h1>
              </div>
            </div>

            {/* 2. CATEGORY ROWS */}
            <div className="space-y-3">
              {(Object.prototype.hasOwnProperty.call(CATEGORIES_DATA, activeGender)
                ? CATEGORIES_DATA[activeGender].list
                : CATEGORIES_DATA.Men.list
              ).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}?gender=${activeGender.toLowerCase()}`}
                  className="group block"
                >
                  {/* FIX: Changed rounded-[1.5rem] to rounded-3xl */}
                  <div className="bg-background-muted/40 group-hover:border-border/40 group-active:bg-background-muted flex items-center gap-4 rounded-3xl border border-transparent p-2 transition-all duration-300 group-active:scale-[0.98]">
                    <div className="border-border/50 bg-background relative h-25 w-25 shrink-0 overflow-hidden rounded-4xl border">
                      <Image
                        src={cat.img}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="100px"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-foreground text-[20px] font-bold tracking-tighter uppercase italic">
                        {cat.name}
                      </h3>
                      <p className="text-foreground-muted mt-0.5 text-[12px] font-bold tracking-tight uppercase">
                        {cat.items}
                      </p>
                    </div>

                    <div className="pr-3">
                      <div className="border-border/60 group-hover:bg-foreground group-hover:text-background flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300">
                        <ChevronRightIcon size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
