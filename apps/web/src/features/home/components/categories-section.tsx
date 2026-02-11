"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {categories} from "@/data/categories" 



export default function CategoryCarousel() {
  const targetRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const [dynamicHeight, setDynamicHeight] = useState<number | null>(null);

  useEffect(() => {
    const calculateHeight = () => {
      if (scrollContentRef.current && window.innerWidth >= 768) {
        const contentWidth = scrollContentRef.current.scrollWidth;
        const windowWidth = window.innerWidth;
        setDynamicHeight(contentWidth - windowWidth + window.innerHeight);
      } else {
        setDynamicHeight(null);
      }
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, []);

  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-95%"]);

  return (
    <section
      ref={targetRef}
      aria-labelledby="category-heading"
      className="relative"
      style={{ height: dynamicHeight ? `${dynamicHeight}px` : "auto" }}
    >
      <div className="md:sticky md:top-0 md:h-screen md:flex md:flex-col md:justify-center md:overflow-hidden py-12">
        {/* Header Section */}
        <header className="container mx-auto px-4 lg:px-6 md:mt-20 mb-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-2 block text-muted-foreground">
            Curated Collections
          </p>
          <h2
            id="category-heading"
            className="text-4xl lg:text-7xl font-black uppercase tracking-tighter"
          >
            Shop by Category
          </h2>
        </header>

        {/* Categories Grid/Carousel */}
        <motion.div
          ref={scrollContentRef}
          style={{ x: dynamicHeight ? x : 0 }}
          className="grid grid-cols-2 gap-4 px-4 md:flex md:flex-nowrap md:gap-6 md:px-6"
        >
          {categories.map((cat, index) => (
            <article
              key={`${cat.id}-${index}`}
              className="relative shrink-0 w-full md:w-80 aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden group"
            >
              <Link
                href={cat.href}
                className="block w-full h-full"
                title={`Browse ${cat.title}`}
              >
                <figure className="absolute inset-0 w-full h-full m-0">
                  <Image
                    src={cat.image}
                    alt={`Model featuring ${cat.title} collection`}
                    fill
                    sizes="(max-width: 768px) 50vw, 320px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority={index < 2} // Optimization: Priority for first two items
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity group-hover:opacity-80" />
                </figure>

                <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 z-10">
                  <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                    <p className="text-zinc-300 text-[10px] md:text-sm font-medium mb-1 md:mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {cat.count}
                    </p>
                    <h3 className="text-xl md:text-4xl font-black text-white uppercase tracking-tighter">
                      {cat.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </motion.div>

        {/* Visual Progress Indicator */}
        <nav
          aria-hidden="true"
          className="hidden md:block container mx-auto px-4 lg:px-6 mt-12"
        >
          <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
            />
          </div>
        </nav>
      </div>
    </section>
  );
}
