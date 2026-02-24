'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { ChevronRightIcon } from '@ff/ui';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';

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
  const router = useRouter();
  const genderParam = (params.gender as string).toLowerCase();

  /**
   * 1. DERIVED STATE
   * Instead of using useEffect to sync a local state with the URL,
   * we calculate the active gender directly from the params.
   */
  const getIndexFromParam = (param: string | undefined) => {
    const idx = GENDERS.indexOf(param as Gender);
    return idx !== -1 ? idx : 0;
  };

  const genderIndex = getIndexFromParam(genderParam);
  const activeGender = GENDERS[genderIndex];

  /**
   * 2. NAVIGATION HANDLER
   * Updates the URL via the router. Next.js will detect the param change
   * and re-render this component with the new derived index.
   */
  const handleGenderChange = (idx: number) => {
    router.replace(`/${GENDERS[idx]}`, { scroll: false });
  };

  /**
   * 3. GESTURE HANDLER
   * Typed 'info' as PanInfo to resolve @typescript-eslint/no-unsafe-member-access
   */
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold && genderIndex > 0) {
      handleGenderChange(0);
    } else if (info.offset.x < -swipeThreshold && genderIndex < GENDERS.length - 1) {
      handleGenderChange(1);
    }
  };

  const currentData = Object.prototype.hasOwnProperty.call(CATEGORIES_DATA, activeGender)
    ? CATEGORIES_DATA[activeGender]
    : CATEGORIES_DATA.men;

  return (
    <div className="bg-background min-h-screen select-none overflow-x-hidden lg:h-screen lg:overflow-hidden">
      {/* --- MOBILE HEADER --- */}
      <header className="bg-background border-border fixed left-0 right-0 top-14 z-50 w-full border-b backdrop-blur-md lg:hidden">
        <div className="mx-auto flex h-14 max-w-md items-center justify-around px-4">
          {GENDERS.map((gender, idx) => (
            <button
              key={gender}
              onClick={() => {
                handleGenderChange(idx);
              }}
              className={`relative h-full flex-1 text-[10px] font-black uppercase tracking-[0.25em] outline-none transition-colors ${
                activeGender === gender ? 'text-foreground' : 'text-foreground-subtle/40'
              }`}
            >
              {gender}
              {activeGender === gender && (
                <motion.div
                  layoutId="navUnderline"
                  className="bg-brand absolute bottom-0 left-4 right-4 h-0.5"
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
            className="mx-auto flex h-full max-w-screen-2xl flex-col px-4 pb-20 pt-20 lg:flex-row lg:px-12 lg:pb-0 lg:pt-28"
          >
            {/* 1. HERO SECTION */}
            <div className="flex w-full items-start justify-center lg:h-full lg:w-1/2 lg:pr-8">
              <div className="border-border/50 aspect-5/4 rounded-4xl lg:max-w-150 group relative w-full overflow-hidden border shadow-2xl lg:fixed lg:aspect-auto lg:h-[80%] lg:w-[95%] lg:rounded-[3.5rem]">
                <motion.div
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                  style={{ backgroundImage: `url(${currentData.hero})` }}
                />
                <div className="bg-linear-to-t absolute inset-0 from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 lg:bottom-16 lg:left-16">
                  <p className="mb-2 text-[8px] font-black uppercase tracking-[0.4em] text-white/50 lg:text-[10px]">
                    Exclusive Collection
                  </p>
                  <h1 className="text-3xl font-black uppercase italic leading-[0.85] tracking-tighter text-white lg:text-7xl">
                    {currentData.label}&apos;s
                    <br />
                    Essentials
                  </h1>
                </div>
              </div>
            </div>

            {/* 2. CATEGORY LIST */}
            <div className="no-scrollbar flex w-full flex-col gap-4 pt-8 lg:h-full lg:w-1/2 lg:gap-6 lg:overflow-y-auto lg:pb-10 lg:pt-0">
              <div className="w-full max-w-2xl space-y-3 lg:space-y-6">
                {currentData.list.map((cat) => (
                  <Link
                    key={`${activeGender}-${cat.slug}`}
                    href={`/${activeGender}/${cat.slug}`}
                    className="group block"
                  >
                    <div className="bg-background-muted/40 group-hover:border-border/40 flex items-center gap-4 rounded-3xl border border-transparent p-2 transition-all duration-300 group-active:scale-[0.98] lg:gap-6 lg:rounded-[2.5rem] lg:p-4">
                      <div className="border-border/50 bg-background rounded-4xl lg:rounded-4xl relative h-28 w-28 shrink-0 overflow-hidden border shadow-md lg:h-32 lg:w-32">
                        <Image
                          src={cat.img}
                          alt={cat.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(min-width: 1024px) 128px, 112px"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-foreground group-hover:text-brand text-[20px] font-bold uppercase italic tracking-tighter transition-colors lg:text-3xl">
                          {cat.name}
                        </h3>
                        <p className="text-foreground-muted mt-0.5 text-[12px] font-bold uppercase tracking-tight">
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
