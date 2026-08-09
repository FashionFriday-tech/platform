'use client';

import React, { useCallback, useRef, useState } from 'react';
import Link from 'next/link';

import { type Brand } from '@ff/schemas';
import { ArrowUpRightIcon } from '@ff/ui';

import { InteractiveMarqueeTrack } from '@/components/ui/InteractiveMarqueeTrack';
import { BrandCard, useBrands } from '@/features/brand';

const FEATURED_BRAND_NAMES = ['nike', 'adidas', 'zara', 'crocs', 'new balance', 'asics'];

export default function ShopByBrands({ initialBrands }: { initialBrands?: Brand[] }) {
  const { brands } = useBrands(initialBrands);
  const [isInView, setIsInView] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node) {
      observerRef.current = new IntersectionObserver(([entry]) => {
        setIsInView(entry.isIntersecting);
      });
      observerRef.current.observe(node);
    }
  }, []);

  const activeBrands = brands.filter((brand) => brand.isActive !== false);
  const featuredBrands = activeBrands.filter((brand) =>
    FEATURED_BRAND_NAMES.includes(brand.name.toLowerCase()),
  );
  // Limit to 8 brands so the section stays curated and high-impact
  const displayList = (featuredBrands.length > 0 ? featuredBrands : activeBrands).slice(0, 8);

  // Split into two mobile rows with alternating brands
  const firstHalf = displayList.filter((_, i) => i % 2 === 0);
  const secondHalf = displayList.filter((_, i) => i % 2 !== 0);

  if (displayList.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden pt-6 pb-10 transition-colors duration-300 sm:pt-10 sm:pb-14 md:pt-14 md:pb-18">
      <div className="relative z-10">
        {/* HEADER */}
        <header className="container mx-auto mb-6 flex justify-center px-4 text-center sm:mb-8 lg:mb-10">
          <h2 className="section-header">Shop by brands</h2>
        </header>

        {/* Marquee tracks: single row on desktop (sm:block), two rows on mobile (sm:hidden) */}
        <div ref={containerRef} className="relative w-full overflow-hidden py-1 sm:py-3">
          {/* LARGE SCREENS ONLY: Single Row (Hidden on mobile under 640px) */}
          <div className="hidden sm:block">
            <InteractiveMarqueeTrack
              direction="left"
              speed={30}
              isPaused={!isInView}
            >
              {displayList.map((brand, idx) => (
                <div
                  key={`desktop-${brand.slug}-${idx}`}
                  className="relative aspect-[3/4] h-[400px] w-[300px] shrink-0 md:h-[480px] md:w-[360px]"
                >
                  <BrandCard brand={brand} skewed />
                </div>
              ))}
            </InteractiveMarqueeTrack>
          </div>

          {/* SMALL MOBILE DEVICES ONLY: Two Opposing Direction Rows (Hidden on screens >= 640px) */}
          <div className="flex flex-col gap-4 sm:hidden">
            {/* ROW 1: Moves Left */}
            <InteractiveMarqueeTrack
              direction="left"
              speed={28}
              isPaused={!isInView}
            >
              {firstHalf.map((brand, idx) => (
                <div
                  key={`r1-mobile-${brand.slug}-${idx}`}
                  className="relative aspect-[3/4] h-[260px] w-[195px] shrink-0"
                >
                  <BrandCard brand={brand} skewed />
                </div>
              ))}
            </InteractiveMarqueeTrack>

            {/* ROW 2: Moves Right */}
            <InteractiveMarqueeTrack
              direction="right"
              speed={28}
              isPaused={!isInView}
            >
              {secondHalf.map((brand, idx) => (
                <div
                  key={`r2-mobile-${brand.slug}-${idx}`}
                  className="relative aspect-[3/4] h-[260px] w-[195px] shrink-0"
                >
                  <BrandCard brand={brand} skewed />
                </div>
              ))}
            </InteractiveMarqueeTrack>
          </div>
        </div>

        {/* View All Brands Button underneath the marquee for all devices */}
        <div className="mt-6 flex w-full justify-center px-4 sm:mt-8 md:mt-10">
          <Link
            href="/brands"
            className="group inline-flex -skew-x-[12deg] items-stretch overflow-hidden rounded-xl border border-zinc-800 bg-black shadow-lg transition-all hover:border-zinc-600 hover:shadow-xl active:scale-95 sm:rounded-2xl dark:border-zinc-300 dark:bg-white dark:hover:border-zinc-100"
          >
            <span className="flex skew-x-[12deg] items-center px-6 py-3 text-xs font-black tracking-widest text-white uppercase transition-colors sm:px-7 sm:py-3.5 sm:text-sm dark:text-black">
              View All Brands
            </span>
            <span className="flex shrink-0 items-center justify-center self-stretch rounded-r-xl bg-white px-4 text-black transition-all group-hover:bg-zinc-200 sm:rounded-r-2xl sm:px-5 dark:bg-black dark:text-white dark:group-hover:bg-zinc-800">
              <span className="skew-x-[12deg]">
                <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
