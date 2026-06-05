'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { ChevronRightIcon } from '@ff/ui';
import { AnimatePresence, motion, type PanInfo } from 'motion/react';

const GENDERS = ['Men', 'Women'] as const;

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  image: string;
  gender: string;
}

interface CategoriesLandingProps {
  categories: CategoryRecord[];
}

export function CategoriesLanding({ categories }: CategoriesLandingProps) {
  const [genderIndex, setGenderIndex] = useState(0);
  const activeGender = GENDERS[genderIndex];

  const menCategories = categories.filter(
    (c) => c.gender.toUpperCase() === 'MEN' || c.gender.toUpperCase() === 'UNISEX',
  );
  const womenCategories = categories.filter(
    (c) => c.gender.toUpperCase() === 'WOMEN' || c.gender.toUpperCase() === 'UNISEX',
  );

  const categoriesByGender = {
    Men: {
      hero: '/images/categories/men.png',
      list: menCategories,
    },
    Women: {
      hero: '/images/categories/womens.png',
      list: womenCategories,
    },
  };

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
            <div className="bg-background-muted border-border/50 relative mb-8 aspect-15/10 w-full overflow-hidden rounded-4xl border shadow-sm">
              <motion.div
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${categoriesByGender[activeGender].hero})`,
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
              {categoriesByGender[activeGender].list.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}?gender=${activeGender.toLowerCase()}`}
                  className="group block"
                >
                  <div className="bg-background-muted/40 group-hover:border-border/40 group-active:bg-background-muted flex items-center gap-4 rounded-3xl border border-transparent p-2 transition-all duration-300 group-active:scale-[0.98]">
                    <div className="border-border/50 bg-background relative h-25 w-25 shrink-0 overflow-hidden rounded-4xl border">
                      <Image
                        src={cat.image || '/images/placeholder.jpg'}
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
