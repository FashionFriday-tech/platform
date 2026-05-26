'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { ChevronRightIcon } from '@ff/ui';
import { AnimatePresence, motion, type PanInfo } from 'motion/react';

const GENDERS = ['men', 'women'] as const;
type Gender = (typeof GENDERS)[number];

interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  image: string;
  gender: string;
  _count?: { products: number };
}

export function GenderLanding() {
  const params = useParams();
  const router = useRouter();
  const genderParam = (params.gender as string).toLowerCase();

  const [categories, setCategories] = useState<CategoryRecord[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  const getIndexFromParam = (param: string | undefined) => {
    const idx = GENDERS.indexOf(param as Gender);
    return idx !== -1 ? idx : 0;
  };

  const genderIndex = getIndexFromParam(genderParam);
  const activeGender = GENDERS[genderIndex];

  const handleGenderChange = (idx: number) => {
    router.replace(`/${GENDERS[idx]}`, { scroll: false });
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold && genderIndex > 0) {
      handleGenderChange(0);
    } else if (info.offset.x < -swipeThreshold && genderIndex < GENDERS.length - 1) {
      handleGenderChange(1);
    }
  };

  const genderTarget = activeGender.toUpperCase();
  const categoryList = categories
    .filter((c) => c.gender === genderTarget || c.gender === 'UNISEX')
    .map((c) => ({
      name: c.name,
      slug: c.slug.replace(/^(men-|women-|unisex-)/i, ''),
      img: c.image,
      items: `${c._count?.products || 0} Items`,
    }));

  const currentData = {
    label: activeGender.charAt(0).toUpperCase() + activeGender.slice(1),
    hero: activeGender === 'women' ? 'https://pub-e317eed21d2a444d893320e08f2a283d.r2.dev/categories/women-clothing.webp' : 'https://pub-e317eed21d2a444d893320e08f2a283d.r2.dev/categories/men-clothing.webp',
    list: categoryList,
  };


  return (
    <div className="bg-background min-h-screen overflow-x-hidden select-none lg:h-screen lg:overflow-hidden">
      {/* --- MOBILE HEADER --- */}
      <header className="bg-background border-border fixed top-14 right-0 left-0 z-50 w-full border-b backdrop-blur-md lg:hidden">
        <div className="mx-auto flex h-14 max-w-md items-center justify-around px-4">
          {GENDERS.map((gender, idx) => (
            <button
              key={gender}
              onClick={() => {
                handleGenderChange(idx);
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
            {/* 1. HERO SECTION */}
            <div className="flex w-full items-start justify-center lg:h-full lg:w-1/2 lg:pr-8">
              <div className="border-border/50 group relative aspect-5/4 w-full overflow-hidden rounded-4xl border shadow-2xl lg:fixed lg:aspect-auto lg:h-[80%] lg:w-[95%] lg:max-w-150 lg:rounded-[3.5rem]">
                <motion.div
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                  style={{ backgroundImage: `url(${currentData.hero})` }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
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

            {/* 2. CATEGORY LIST */}
            <div className="no-scrollbar flex w-full flex-col gap-4 pt-8 lg:h-full lg:w-1/2 lg:gap-6 lg:overflow-y-auto lg:pt-0 lg:pb-10">
              <div className="w-full max-w-2xl space-y-3 lg:space-y-6">
                {currentData.list.map((cat) => (
                  <Link
                    key={`${activeGender}-${cat.slug}`}
                    href={`/${activeGender}/${cat.slug}`}
                    className="group block"
                  >
                    <div className="bg-background-muted/40 group-hover:border-border/40 flex items-center gap-4 rounded-3xl border border-transparent p-2 transition-all duration-300 group-active:scale-[0.98] lg:gap-6 lg:rounded-[2.5rem] lg:p-4">
                      <div className="border-border/50 bg-background relative h-28 w-28 shrink-0 overflow-hidden rounded-4xl border shadow-md lg:h-32 lg:w-32 lg:rounded-4xl">
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
