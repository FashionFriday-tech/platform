'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { ChevronRightIcon } from '@ff/ui';
import { AnimatePresence, motion, type PanInfo } from 'motion/react';

import { fetcher } from '@/lib/api-client';

import { type CategoryHeroImages, extractCategoryHeroImages } from '../utils/category-images';

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
  initialCampaigns?: any[];
  heroImages?: CategoryHeroImages;
}

export function CategoriesLanding({
  categories,
  initialCampaigns,
  heroImages: propHeroImages,
}: CategoriesLandingProps) {
  const [genderIndex, setGenderIndex] = useState(0);
  const activeGender = GENDERS[genderIndex];

  const [heroes, setHeroes] = useState<CategoryHeroImages>(() => {
    return propHeroImages ?? extractCategoryHeroImages(initialCampaigns);
  });

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const data = await fetcher<any[]>('/campaigns');
        if (Array.isArray(data) && data.length > 0) {
          const imgs = extractCategoryHeroImages(data);
          setHeroes((prev) => ({
            men: imgs.men ?? prev.men,
            women: imgs.women ?? prev.women,
          }));
        }
      } catch (err) {
        console.error('Failed to load category hero campaigns:', err);
      }
    };
    void loadCampaigns();
  }, []);

  const menCategories = categories.filter(
    (c) => c.gender.toUpperCase() === 'MEN' || c.gender.toUpperCase() === 'UNISEX',
  );
  const womenCategories = categories.filter(
    (c) => c.gender.toUpperCase() === 'WOMEN' || c.gender.toUpperCase() === 'UNISEX',
  );

  const categoriesByGender = {
    Men: {
      hero: heroes.men || '/images/categories/men.png',
      list: menCategories,
    },
    Women: {
      hero: heroes.women || '/images/categories/womens.png',
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
      <header className="bg-background/95 fixed top-14 right-0 left-0 z-50 w-full backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-around gap-2.5 px-4 pt-0 pb-3">
          {GENDERS.map((gender, idx) => (
            <button
              key={gender}
              onClick={() => {
                setGenderIndex(idx);
              }}
              className={`relative flex h-9 flex-1 -skew-x-[12deg] items-center justify-center overflow-hidden rounded-lg border text-[10px] font-black tracking-[0.25em] uppercase transition-all duration-200 outline-none active:scale-95 ${
                activeGender === gender
                  ? 'border-zinc-900 bg-black text-white shadow-sm dark:border-zinc-100 dark:bg-white dark:text-black'
                  : 'text-foreground/70 hover:text-foreground border-zinc-300/80 bg-zinc-100/50 hover:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40'
              }`}
            >
              <span className="skew-x-[12deg]">{gender}</span>
              {activeGender === gender && (
                <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
                  <div className="category-card-shine absolute -top-1/2 -bottom-1/2 -left-1/2 h-[200%] w-[200%]" />
                </div>
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
            <div className="border-border/50 bg-background-muted relative mb-8 aspect-square w-full overflow-hidden rounded-3xl border shadow-2xl">
              <motion.div
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${categoriesByGender[activeGender].hero})`,
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

              {/* Luxury shining sweep animation across hero image card */}
              <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
                <div className="category-card-shine absolute -top-1/2 -bottom-1/2 -left-1/2 h-[200%] w-[200%]" />
              </div>

              <div className="absolute bottom-8 left-8 z-20">
                <p className="mb-1 text-[8px] font-black tracking-[0.3em] text-white/50 uppercase">
                  New Season
                </p>
                <h1 className="text-3xl leading-none font-black tracking-tighter text-white uppercase italic sm:text-4xl">
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
                  <div className="border-border/50 hover:border-border/80 group-hover:bg-background-muted/60 bg-background-muted/30 relative -skew-x-[12deg] overflow-hidden rounded-2xl border p-2 shadow-xs transition-all duration-300 group-active:scale-[0.98] lg:p-3">
                    {/* Luminous Shining Light Sweep across crossed box */}
                    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
                      <div className="category-card-shine absolute -top-1/2 -bottom-1/2 -left-1/2 h-[200%] w-[200%]" />
                    </div>

                    <div className="flex skew-x-[12deg] items-center gap-4">
                      <div className="border-border/60 bg-background relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border shadow-sm lg:h-24 lg:w-24">
                        <Image
                          src={cat.image || '/images/placeholder.jpg'}
                          alt={cat.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="100px"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-foreground group-hover:text-brand text-lg font-black tracking-tighter uppercase italic transition-colors lg:text-2xl">
                          {cat.name}
                        </h3>
                      </div>

                      <div className="pr-2 lg:pr-3">
                        <div className="border-border/60 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background flex h-8 w-8 -skew-x-[12deg] items-center justify-center rounded-lg border transition-all duration-300 lg:h-10 lg:w-10">
                          <span className="skew-x-[12deg]">
                            <ChevronRightIcon size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <style jsx global>{`
        @keyframes category-card-shine {
          0% {
            transform: translateX(-150%) skewX(-20deg);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          45% {
            transform: translateX(150%) skewX(-20deg);
            opacity: 1;
          }
          46%,
          100% {
            transform: translateX(150%) skewX(-20deg);
            opacity: 0;
          }
        }
        .category-card-shine {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.04) 20%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0.04) 75%,
            transparent 100%
          );
          animation: category-card-shine 4.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
