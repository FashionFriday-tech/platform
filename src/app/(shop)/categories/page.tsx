"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

const GENDERS = ["Men", "Women"] as const;
type Gender = (typeof GENDERS)[number];

const CATEGORIES_DATA = {
  Men: {
    hero: "/images/categories/men.png",
    list: [
      { name: "Sneakers", slug: "sneakers", img: "/images/categories/men/sneaker.png", items: "124 Items" },
      { name: "Watches", slug: "watches", img: "/images/categories/men/watches.png", items: "86 Items" },
      { name: "Clothes", slug: "cloths", img: "/images/categories/men/cloths.png", items: "210 Items" },
      { name: "Slippers", slug: "slippers", img: "/images/categories/men/slippers.png", items: "45 Items" },
      { name: "Accessories", slug: "accessories", img: "/images/categories/men/accessories.png", items: "92 Items" },
    ]
  },
  Women: {
    hero: "/images/categories/womens.png", 
    list: [
      { name: "Sneakers", slug: "sneakers", img: "/images/categories/women/sneaker.png", items: "110 Items" },
      { name: "Watches", slug: "watches", img: "/images/categories/women/watches.png", items: "95 Items" },
      { name: "Clothes", slug: "cloths", img: "/images/categories/women/cloth.png", items: "340 Items" },
      { name: "Slippers", slug: "slippers", img: "/images/categories/women/slippers.png", items: "52 Items" },
      { name: "Accessories", slug: "accessories", img: "/images/categories/women/accessories.png", items: "120 Items" },
    ]
  },
};

export default function StoreLandingPage() {
  const [genderIndex, setGenderIndex] = useState(0);
  const activeGender = GENDERS[genderIndex];

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold && genderIndex > 0) {
      setGenderIndex(0);
    } else if (info.offset.x < -swipeThreshold && genderIndex < GENDERS.length - 1) {
      setGenderIndex(1);
    }
  };

  return (
    <div className="h-screen bg-background select-none pb-14">
      
      {/* --- HEADER: Fixed width constraints --- */}
      <header className="fixed top-14 z-100 w-full left-0 right-0 bg-background backdrop-blur-md border-b border-border">
        <div className="max-w-md mx-auto flex justify-around items-center h-14 px-4">
          {GENDERS.map((gender, idx) => (
            <button
              key={gender}
              onClick={() => setGenderIndex(idx)}
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

      {/* --- SWIPEABLE CONTENT --- */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        className="touch-pan-y relative z-10 pt-10 pb-20"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeGender}
            initial={{ opacity: 0, x: genderIndex === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: genderIndex === 0 ? 20 : -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="max-w-2xl mx-auto px-4 pt-6"
          >
            {/* 1. HERO SECTION */}
            <div className="relative w-full aspect-15/10 rounded-[2rem] overflow-hidden bg-background-muted border border-border/50 mb-8 shadow-sm">
              <motion.div
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${CATEGORIES_DATA[activeGender].hero})` }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <p className="text-white/50 text-[8px] font-black uppercase tracking-[0.3em] mb-1">New Season</p>
                <h1 className="text-white text-3xl font-black uppercase italic tracking-tighter leading-none">
                  {activeGender}&apos;s <br /> Essentials
                </h1>
              </div>
            </div>

            {/* 2. CATEGORY ROWS */}
            <div className="space-y-3">
              {CATEGORIES_DATA[activeGender].list.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}?gender=${activeGender.toLowerCase()}`}
                  className="block group"
                >
                  <div className="flex items-center gap-4 p-2 rounded-[1.5rem] bg-background-muted/40 border border-transparent group-hover:border-border/40 group-active:scale-[0.98] group-active:bg-background-muted transition-all duration-300">
                    <div className="w-25 h-25 rounded-4xl overflow-hidden shrink-0 border border-border/50 bg-background">
                      <img 
                        src={cat.img} 
                        alt={cat.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-[20px] font-bold uppercase tracking-tighter italic text-foreground">
                        {cat.name}
                      </h3>
                      <p className="text-[12px] font-bold text-foreground-muted uppercase tracking-tight mt-0.5">
                        {cat.items}
                      </p>
                    </div>

                    <div className="pr-3">
                      <div className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                        <ChevronRight size={14} />
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