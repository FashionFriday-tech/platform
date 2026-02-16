'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon } from '@ff/ui';
import Image from 'next/image';

const GENDERS = ['men', 'women'] as const;
type Gender = (typeof GENDERS)[number];

const CATEGORIES_DATA = {
  men: {
    label: 'Men',
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
  women: {
    label: 'Women',
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
  const params = useParams();
  const genderParam = (params?.gender as string)?.toLowerCase();

  const initialIndex =
    GENDERS.indexOf(genderParam as Gender) !== -1 ? GENDERS.indexOf(genderParam as Gender) : 0;
  const [genderIndex, setGenderIndex] = useState(initialIndex);
  const activeGender = GENDERS[genderIndex];

  useEffect(() => {
    const newIndex = GENDERS.indexOf(genderParam as Gender);
    if (newIndex !== -1) {
      setGenderIndex(newIndex);
    }
  }, [genderParam]);

  const handleGenderChange = (idx: number) => {
    setGenderIndex(idx);
    window.history.replaceState(null, '', `/${GENDERS[idx]}`);
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold && genderIndex > 0) {
      handleGenderChange(0);
    } else if (info.offset.x < -swipeThreshold && genderIndex < GENDERS.length - 1) {
      handleGenderChange(1);
    }
  };

  const currentData = CATEGORIES_DATA[activeGender];

  return (
    /* lg:h-screen + overflow-hidden only on desktop to lock the frame */
    <div className="bg-background min-h-screen overflow-x-hidden select-none lg:h-screen lg:overflow-hidden">
      {/* --- MOBILE HEADER: UNCHANGED --- */}
      <header className="bg-background border-border fixed top-14 right-0 left-0 z-50 w-full border-b backdrop-blur-md lg:hidden">
        <div className="mx-auto flex h-14 max-w-md items-center justify-around px-4">
          {GENDERS.map((gender, idx) => (
            <button
              key={gender}
              onClick={() => handleGenderChange(idx)}
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

      {/* --- CONTENT WRAPPER --- */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        className="relative z-10 h-full w-full touch-pan-y"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeGender}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto flex h-full max-w-screen-2xl flex-col px-4 pt-20 pb-20 lg:flex-row lg:px-12 lg:pt-28 lg:pb-0"
          >
            {/* 1. HERO SECTION: Fixed on Desktop, Flows on Mobile */}
            <div className="flex w-full items-start justify-center lg:h-full lg:w-1/2 lg:pr-8">
              <div className="group border-border/50 relative aspect-5/4 w-full overflow-hidden rounded-[2rem] border shadow-2xl lg:fixed lg:aspect-auto lg:h-[80%] lg:w-[95%] lg:max-w-[600px] lg:rounded-[3.5rem]">
                <motion.div
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                  style={{ backgroundImage: `url(${currentData.hero})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 lg:bottom-16 lg:left-16">
                  <p className="mb-2 text-[8px] font-black tracking-[0.4em] text-white/50 uppercase lg:text-[10px]">
                    Exclusive Collection
                  </p>
                  <h1 className="text-3xl leading-[0.85] font-black tracking-tighter text-white uppercase italic lg:text-7xl">
                    {currentData.label}&apos;s
                    <br />
                    Essentials
                  </h1>
                </div>
              </div>
            </div>

            {/* 2. CATEGORY LIST: Scrollable on Desktop, Natural on Mobile */}
            <div className="no-scrollbar flex w-full flex-col gap-4 pt-8 lg:h-full lg:w-1/2 lg:gap-6 lg:overflow-y-auto lg:pt-0 lg:pb-10">
              <div className="w-full max-w-2xl space-y-3 lg:space-y-6">
                {currentData.list.map((cat) => (
                  <Link
                    key={`${activeGender}-${cat.slug}`}
                    href={`/${activeGender}/${cat.slug}`}
                    className="group block"
                  >
                    <div className="bg-background-muted/40 group-hover:border-border/40 flex items-center gap-4 rounded-[1.5rem] border border-transparent p-2 transition-all duration-300 group-active:scale-[0.98] lg:gap-6 lg:rounded-[2.5rem] lg:p-4">
                      <div className="border-border/50 bg-background relative h-28 w-28 shrink-0 overflow-hidden rounded-4xl border shadow-md lg:h-32 lg:w-32 lg:rounded-[2rem]">
                        <Image
                          src={cat.img}
                          alt={cat.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(min-width: 1024px) 128px, 112px"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-foreground group-hover:text-brand text-[20px] font-bold tracking-tighter uppercase italic transition-colors lg:text-3xl">
                          {cat.name}
                        </h3>
                        <p className="text-foreground-muted mt-0.5 text-[12px] font-bold tracking-tight uppercase">
                          {cat.items}
                        </p>
                      </div>

                      <div className="pr-3">
                        <div className="border-border/60 group-hover:bg-foreground group-hover:text-background flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 lg:h-12 lg:w-12">
                          <ChevronRightIcon size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
