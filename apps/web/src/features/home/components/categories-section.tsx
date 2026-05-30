'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { motion, useScroll, useTransform } from 'framer-motion';

import { categories } from '@/features/home/data/categories';

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
    window.addEventListener('resize', calculateHeight);
    return () => {
      window.removeEventListener('resize', calculateHeight);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-95%']);

  return (
    <section
      ref={targetRef}
      aria-labelledby="category-heading"
      className="relative"
      style={{ height: dynamicHeight ? `${dynamicHeight}px` : 'auto' }}
    >
      <div className="py-12 md:sticky md:top-0 md:flex md:h-screen md:flex-col md:justify-center md:overflow-hidden">
        {/* Header Section */}
        <header className="container mx-auto mb-10 px-4 md:mt-20 lg:px-6">
          <p className="text-muted-foreground mb-2 block text-xs font-bold tracking-widest uppercase">
            Curated Collections
          </p>
          <h2
            id="category-heading"
            className="text-4xl font-black tracking-tighter uppercase lg:text-7xl"
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
              className="group relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-2xl md:w-80 md:rounded-3xl"
            >
              <Link href={cat.href} className="block h-full w-full" title={`Browse ${cat.title}`}>
                <figure className="absolute inset-0 m-0 h-full w-full">
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

                <div className="absolute bottom-0 left-0 z-10 w-full p-4 md:p-8">
                  <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                    <p className="mb-1 text-[10px] font-medium text-zinc-300 opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:mb-2 md:text-sm">
                      {cat.count}
                    </p>
                    <h3 className="text-xl font-black tracking-tighter text-white uppercase md:text-4xl">
                      {cat.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </motion.div>

        {/* Visual Progress Indicator */}
        <nav aria-hidden="true" className="container mx-auto mt-12 hidden px-4 md:block lg:px-6">
          <div className="h-px w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <motion.div
              className="bg-primary h-full"
              style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
            />
          </div>
        </nav>
      </div>
    </section>
  );
}
