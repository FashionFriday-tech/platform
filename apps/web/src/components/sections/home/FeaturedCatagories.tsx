"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { id: 1, title: "Outerwear", image: "/images/categories/outfit.png", count: "42 Products", href: "/shop/outerwear" },
  { id: 2, title: "Footwear", image: "/images/categories/footwear.png", count: "18 Products", href: "/shop/footwear" },
  { id: 3, title: "Accessories", image: "/images/categories/accesories.png", count: "64 Products", href: "/shop/accessories" },
  { id: 4, title: "Sportswear", image: "/images/categories/sportswear.png", count: "35 Products", href: "/shop/sportswear" },
  { id: 5, title: "New Drops", image: "/images/categories/newdrop.png", count: "12 Products", href: "/shop/new" },
  { id: 6, title: "Accessories", image: "/images/categories/accesories.png", count: "64 Products", href: "/shop/accessories" },
  { id: 7, title: "Outerwear", image: "/images/categories/outfit.png", count: "42 Products", href: "/shop/outerwear" },
  { id: 8, title: "Footwear", image: "/images/categories/footwear.png", count: "18 Products", href: "/shop/footwear" },
];

export default function CategoryCarousel() {
  const targetRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const [dynamicHeight, setDynamicHeight] = useState<number | null>(null);

  useEffect(() => {
    const calculateHeight = () => {
      if (scrollContentRef.current && window.innerWidth >= 768) {
        const contentWidth = scrollContentRef.current.scrollWidth;
        const windowWidth = window.innerWidth;
        // Total scroll distance needed + one viewport height to keep it sticky
        setDynamicHeight(contentWidth - windowWidth + window.innerHeight);
      } else {
        // Reset for mobile
        setDynamicHeight(null);
      }
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Transform for desktop horizontal movement
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-98%"]);

  return (
    <section
      ref={targetRef}
      className="relative"
      // Only apply dynamic height on desktop (md: 768px+)
      style={{ height: dynamicHeight ? `${dynamicHeight}px` : "auto" }}
    >
      <div className="md:sticky md:top-0 md:h-screen md:flex md:flex-col md:justify-center md:overflow-hidden py-12">
        {/* Header */}
        <div className="container mx-auto px-4 lg:px-6 md:mt-20 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest mb-2 block">
            Collections
          </span>
          <h2 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter">
            Shop by Category
          </h2>
        </div>

        {/* MOBILE: grid grid-cols-2 (Calculates height automatically)
            DESKTOP: flex (Horizontal)
        */}
        <motion.div
          ref={scrollContentRef}
          // Only animate 'x' if we are on desktop
          style={{ x: dynamicHeight ? x : 0 }}
          className="grid grid-cols-2 gap-4 px-4 md:flex md:flex-nowrap md:gap-6 md:px-6"
        >
          {categories.map((cat, index) => (
            <div
              key={`${cat.id}-${index}`}
              className="relative shrink-0 w-full md:w-80 aspect-3/4 rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer"
            >
              <Link href={cat.href} className="block w-full h-full">
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-90" />
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 md:p-8">
                  <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                    <p className="text-gray-300 text-[10px] md:text-sm font-medium mb-1 md:mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {cat.count}
                    </p>
                    <h3 className="text-xl md:text-4xl font-black text-white uppercase tracking-tighter">
                      {cat.title}
                    </h3>
                  </div>
                </div>

                
              </Link>
            </div>
          ))}

          {/* 'View All' Card */}
          {/* <div className="shrink-0 w-full md:w-60 aspect-[3/4] flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 rounded-3xl md:bg-transparent">
            <Link
              href="/shop"
              className="w-24 h-24 rounded-full border-2 border-zinc-300 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all group"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-center">
                View
                <br />
                All
              </span>
            </Link>
          </div> */}
        </motion.div>

        {/* PROGRESS BAR - Desktop Only */}
        <div className="hidden md:block container mx-auto px-4 lg:px-6 mt-8">
          <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-black dark:bg-white"
              style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}