"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRightIcon } from "@ff/ui";

const GENDERS = ["men", "women"] as const;
type Gender = typeof GENDERS[number];

const CATEGORIES_DATA = {
  men: {
    label: "Men",
    hero: "/images/categories/men.png",
    list: [
      { name: "Sneakers", slug: "sneakers", img: "/images/categories/men/sneaker.png", items: "124 Items" },
      { name: "Watches", slug: "watches", img: "/images/categories/men/watches.png", items: "86 Items" },
      { name: "Clothing", slug: "clothing", img: "/images/categories/men/cloths.png", items: "210 Items" },
      { name: "Slippers", slug: "slippers", img: "/images/categories/men/slippers.png", items: "45 Items" },
      { name: "Accessories", slug: "accessories", img: "/images/categories/men/accessories.png", items: "92 Items" },
    ],
  },
  women: {
    label: "Women",
    hero: "/images/categories/womens.png",
    list: [
      { name: "Sneakers", slug: "sneakers", img: "/images/categories/women/sneaker.png", items: "110 Items" },
      { name: "Watches", slug: "watches", img: "/images/categories/women/watches.png", items: "95 Items" },
      { name: "Clothing", slug: "clothing", img: "/images/categories/women/cloth.png", items: "340 Items" },
      { name: "Slippers", slug: "slippers", img: "/images/categories/women/slippers.png", items: "52 Items" },
      { name: "Accessories", slug: "accessories", img: "/images/categories/women/accessories.png", items: "120 Items" },
    ],
  },
};

export default function StoreLandingPage() {
  const params = useParams();
  const genderParam = (params?.gender as string)?.toLowerCase();

  const initialIndex = GENDERS.indexOf(genderParam as Gender) !== -1 ? GENDERS.indexOf(genderParam as Gender) : 0;
  const [genderIndex, setGenderIndex] = useState(initialIndex);
  const activeGender = GENDERS[genderIndex];

  useEffect(() => {
    const newIndex = GENDERS.indexOf(genderParam as Gender);
    if (newIndex !== -1) setGenderIndex(newIndex);
  }, [genderParam]);

  const handleGenderChange = (idx: number) => {
    setGenderIndex(idx);
    window.history.replaceState(null, "", `/${GENDERS[idx]}`);
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
    <div className="min-h-screen lg:h-screen bg-background select-none lg:overflow-hidden overflow-x-hidden">
      
      {/* --- MOBILE HEADER: UNCHANGED --- */}
      <header className="fixed top-14 z-50 w-full left-0 right-0 bg-background backdrop-blur-md border-b border-border lg:hidden">
        <div className="max-w-md mx-auto flex justify-around items-center h-14 px-4">
          {GENDERS.map((gender, idx) => (
            <button
              key={gender}
              onClick={() => handleGenderChange(idx)}
              className={`relative flex-1 h-full text-[10px] font-black uppercase tracking-[0.25em] transition-colors outline-none ${
                activeGender === gender ? "text-foreground" : "text-foreground-subtle/40"
              }`}
            >
              {gender}
              {activeGender === gender && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
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
        className="h-full w-full touch-pan-y relative z-10"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeGender}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col lg:flex-row h-full max-w-screen-2xl mx-auto px-4 lg:px-12 pt-20 lg:pt-28 pb-20 lg:pb-0"
          >
            
            {/* 1. HERO SECTION: Fixed on Desktop, Flows on Mobile */}
            <div className="w-full lg:w-1/2 flex justify-center items-start lg:h-full lg:pr-8">
              <div className="relative w-full aspect-5/4 lg:aspect-auto lg:h-[80%] lg:w-[95%] lg:fixed lg:max-w-[600px] rounded-[2rem] lg:rounded-[3.5rem] overflow-hidden group shadow-2xl border border-border/50">
                <motion.div
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                  style={{ backgroundImage: `url(${currentData.hero})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 lg:bottom-16 lg:left-16">
                  <p className="text-white/50 text-[8px] lg:text-[10px] font-black uppercase tracking-[0.4em] mb-2">
                    Exclusive Collection
                  </p>
                  <h1 className="text-white text-3xl lg:text-7xl font-black uppercase italic tracking-tighter leading-[0.85]">
                    {currentData.label}&apos;s<br />Essentials
                  </h1>
                </div>
              </div>
            </div>

            {/* 2. CATEGORY LIST: Scrollable on Desktop, Natural on Mobile */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4 lg:gap-6 lg:h-full lg:overflow-y-auto no-scrollbar lg:pb-10 pt-8 lg:pt-0">
              <div className="space-y-3 lg:space-y-6 max-w-2xl w-full">
                {currentData.list.map((cat) => (
                  <Link
                    key={`${activeGender}-${cat.slug}`}
                    href={`/${activeGender}/${cat.slug}`}
                    className="block group"
                  >
                    <div className="flex items-center gap-4 lg:gap-6 p-2 lg:p-4 rounded-[1.5rem] lg:rounded-[2.5rem] bg-background-muted/40 border border-transparent group-hover:border-border/40 group-active:scale-[0.98] transition-all duration-300">
                      <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-4xl lg:rounded-[2rem] overflow-hidden shrink-0 border border-border/50 bg-background shadow-md">
                        <img
                          src={cat.img}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-[20px] lg:text-3xl font-bold uppercase tracking-tighter italic text-foreground group-hover:text-brand transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-[12px] font-bold text-foreground-muted uppercase tracking-tight mt-0.5">
                          {cat.items}
                        </p>
                      </div>

                      <div className="pr-3">
                        <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-full border border-border/60 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-300">
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
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}