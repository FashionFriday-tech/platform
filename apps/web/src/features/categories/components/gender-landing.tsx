'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { ChevronRightIcon } from '@ff/ui';
import { AnimatePresence, motion, type PanInfo } from 'motion/react';

import { fetcher } from '@/lib/api-client';

import {
  type CategoryHeroImages,
  DEFAULT_CATEGORY_HEROES,
  extractCategoryHeroImages,
} from '../utils/category-images';

const GENDERS = ['men', 'women'] as const;
type Gender = (typeof GENDERS)[number];

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  image: string;
  gender: string;
}

interface GenderLandingProps {
  initialCategories: CategoryRecord[];
  initialCampaigns?: any[];
  heroImages?: CategoryHeroImages;
}

export function GenderLanding({
  initialCategories,
  initialCampaigns,
  heroImages: propHeroImages,
}: GenderLandingProps) {
  const params = useParams();
  const router = useRouter();
  const genderParam = (params.gender as string).toLowerCase();
  const rightListRef = useRef<HTMLDivElement>(null);

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

  const getIndexFromParam = (param: string | undefined) => {
    const idx = GENDERS.indexOf(param as Gender);
    return idx !== -1 ? idx : 0;
  };

  const genderIndex = getIndexFromParam(genderParam);
  const activeGender = GENDERS[genderIndex];

  // Reset scroll position on active gender switch
  useEffect(() => {
    if (rightListRef.current) {
      rightListRef.current.scrollTop = 0;
    }
  }, [activeGender]);

  const handleGenderChange = (idx: number) => {
    router.replace(`/category/${GENDERS[idx]}`, { scroll: false });
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold && genderIndex > 0) {
      handleGenderChange(0);
    } else if (info.offset.x < -swipeThreshold && genderIndex < GENDERS.length - 1) {
      handleGenderChange(1);
    }
  };

  // Forward scroll wheel event from the fixed left section to right items list
  const handleLeftWheel = (e: React.WheelEvent) => {
    if (rightListRef.current) {
      rightListRef.current.scrollTop += e.deltaY;
    }
  };

  const genderTarget = activeGender.toUpperCase();
  const categoryListMap = new Map<string, { name: string; slug: string; img: string }>();

  for (const c of initialCategories.filter(
    (c) => c.gender === genderTarget || c.gender === 'UNISEX',
  )) {
    const slug = c.slug.replace(/^(men-|women-|unisex-)/i, '').toLowerCase();
    if (!categoryListMap.has(slug)) {
      categoryListMap.set(slug, {
        name: c.name,
        slug,
        img: c.image,
      });
    }
  }

  const categoryList = Array.from(categoryListMap.values());

  const currentData = {
    label: activeGender.charAt(0).toUpperCase() + activeGender.slice(1),
    hero: heroes[activeGender] || DEFAULT_CATEGORY_HEROES[activeGender],
    list: categoryList,
  };

  return (
    <div className="bg-background min-h-screen overflow-x-hidden select-none lg:mt-20 lg:h-[calc(100vh-5rem)] lg:min-h-0 lg:overflow-hidden">
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
            className="mx-auto flex h-full max-w-screen-2xl flex-col px-4 pt-20 pb-20 lg:h-full lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-8 lg:pt-0 lg:pb-0 xl:gap-14 xl:px-14"
          >
            {/* 1. HERO SECTION (STATIONARY / FIXED IN PLACE ON DESKTOP, 1:1 ASPECT RATIO) */}
            <div
              onWheel={handleLeftWheel}
              className="flex w-full items-center justify-center lg:h-full lg:w-1/2 lg:shrink-0 lg:overflow-hidden"
            >
              <div className="border-border/50 group relative aspect-square w-full overflow-hidden rounded-4xl border shadow-2xl lg:h-auto lg:w-full lg:max-w-[min(480px,calc(100vh-8.5rem))] lg:rounded-[3rem] xl:max-w-[min(540px,calc(100vh-8.5rem))]">
                <motion.div
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                  style={{ backgroundImage: `url(${currentData.hero})` }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12 xl:bottom-14 xl:left-14">
                  <p className="mb-2 text-[8px] font-black tracking-[0.4em] text-white/50 uppercase lg:text-[10px]">
                    Exclusive Collection
                  </p>
                  <h1 className="text-3xl leading-[0.85] font-black tracking-tighter text-white uppercase italic lg:text-5xl xl:text-6xl">
                    {currentData.label}&apos;s
                    <br />
                    Essentials
                  </h1>
                </div>
              </div>
            </div>

            {/* 2. CATEGORY LIST (ONLY THIS RIGHT-SIDE SECTION SCROLLS ON DESKTOP) */}
            <div
              ref={rightListRef}
              className="no-scrollbar flex w-full flex-col gap-4 pt-8 lg:h-full lg:w-1/2 lg:overflow-y-auto lg:overscroll-contain lg:pt-8 lg:pr-2 lg:pb-12"
            >
              <div className="mx-auto w-full max-w-xl space-y-3 lg:space-y-4">
                {currentData.list.map((cat) => (
                  <Link
                    key={`${activeGender}-${cat.slug}`}
                    href={`/category/${activeGender}/${cat.slug}`}
                    className="group block"
                  >
                    <div className="bg-background-muted/40 hover:bg-background-muted/70 group-hover:border-border/40 flex items-center gap-4 rounded-3xl border border-transparent p-2 transition-all duration-300 group-active:scale-[0.98] lg:gap-5 lg:rounded-[2rem] lg:p-3.5">
                      <div className="border-border/50 bg-background relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl border shadow-md lg:h-28 lg:w-28 lg:rounded-3xl">
                        <Image
                          src={cat.img}
                          alt={cat.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(min-width: 1024px) 112px, 96px"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-foreground group-hover:text-brand text-[20px] font-bold tracking-tighter uppercase italic transition-colors lg:text-2xl">
                          {cat.name}
                        </h3>
                      </div>

                      <div className="pr-3">
                        <div className="border-border/60 group-hover:bg-foreground group-hover:text-background flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 lg:h-10 lg:w-10">
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
