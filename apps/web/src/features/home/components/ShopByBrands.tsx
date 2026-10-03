'use client';

import React, { useCallback, useRef, useState } from 'react';
import Link from 'next/link';

import type { Brand } from '@ff/schemas';
import { ArrowUpRightIcon } from '@ff/ui';

import { BrandCard, useBrands } from '@/features/brand';

const FEATURED_BRAND_NAMES = ['nike', 'adidas', 'zara', 'crocs', 'new balance', 'asics'];

export default function ShopByBrands({ initialBrands }: { initialBrands?: Brand[] }) {
  const { brands, isLoading } = useBrands(initialBrands);
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

  const featuredBrands = brands.filter((brand) =>
    FEATURED_BRAND_NAMES.includes(brand.name.toLowerCase()),
  );
  // Limit to 6-8 brands so the section stays curated and high-impact
  const displayList = (featuredBrands.length > 0 ? featuredBrands : brands).slice(0, 6);

  // Split into two mobile rows (3 items each if 6 brands)
  const midpoint = Math.ceil(displayList.length / 2);
  const firstHalf = displayList.slice(0, midpoint);
  const secondHalf = displayList.slice(midpoint);

  // Repeat sufficiently to guarantee continuous seamless scrolling on any mobile screen width
  const row1Items = [...firstHalf, ...firstHalf, ...firstHalf, ...firstHalf];
  const row2Items = [...secondHalf, ...secondHalf, ...secondHalf, ...secondHalf];

  // Desktop single-row marquee items
  const desktopItems = [...displayList, ...displayList];

  // Constant speed logic: calculate duration from distance (pixels) so speed doesn't increase with more cards
  // Constant speed logic: calculate duration from distance (pixels) so speed doesn't increase with more cards
  // 25px per second provides a calm, premium, easy-to-read scroll
  const SPEED_PX_PER_SEC = 25;
  const MOBILE_CARD_PX = 200 + 24; // 200px width + 24px gap (1.5rem)
  const DESKTOP_CARD_PX = 310 + 24; // 310px width + 24px gap (1.5rem)

  // Distance of 50% track (one full cycle of the repeated items)
  const row1Distance = (row1Items.length / 2) * MOBILE_CARD_PX;
  const row2Distance = (row2Items.length / 2) * MOBILE_CARD_PX;
  const desktopDistance = (desktopItems.length / 2) * DESKTOP_CARD_PX;

  const row1Duration = Math.round(row1Distance / SPEED_PX_PER_SEC);
  const row2Duration = Math.round(row2Distance / SPEED_PX_PER_SEC);
  const desktopDuration = Math.round(desktopDistance / SPEED_PX_PER_SEC);

  if (isLoading && displayList.length === 0) {
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
          <style>{`
            @keyframes brand-marquee-left {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes brand-marquee-right {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
            .animate-brand-marquee-left {
              display: flex;
              width: max-content;
              animation-name: brand-marquee-left;
              animation-timing-function: linear;
              animation-iteration-count: infinite;
              gap: 1rem;
            }
            .animate-brand-marquee-right {
              display: flex;
              width: max-content;
              animation-name: brand-marquee-right;
              animation-timing-function: linear;
              animation-iteration-count: infinite;
              gap: 1rem;
            }
            @media (min-width: 640px) {
              .animate-brand-marquee-left,
              .animate-brand-marquee-right {
                gap: 1.5rem;
              }
            }
            .animate-brand-marquee-left:hover,
            .animate-brand-marquee-right:hover {
              animation-play-state: paused;
            }
          `}</style>

          {/* LARGE SCREENS ONLY: Single Row (Hidden on mobile under 640px) */}
          <div className="hidden sm:block">
            <div
              className="animate-brand-marquee-left relative z-10 px-6"
              style={{
                animationDuration: `${desktopDuration}s`,
                animationPlayState: isInView ? 'running' : 'paused',
              }}
            >
              {desktopItems.map((brand, idx) => (
                <div
                  key={`desktop-${brand.slug}-${idx}`}
                  className="group relative aspect-[3/4] h-[400px] w-[310px] shrink-0 -skew-x-[6deg] overflow-hidden rounded-2xl sm:rounded-3xl md:h-[480px] md:w-[360px] md:rounded-4xl"
                >
                  <BrandCard brand={brand} />
                </div>
              ))}
            </div>
          </div>

          {/* SMALL MOBILE DEVICES ONLY: Two Opposing Direction Rows (Hidden on screens >= 640px) */}
          <div className="flex flex-col gap-4 sm:hidden">
            {/* ROW 1: Moves Left */}
            <div
              className="animate-brand-marquee-left relative z-10 px-6"
              style={{
                animationDuration: `${row1Duration}s`,
                animationPlayState: isInView ? 'running' : 'paused',
              }}
            >
              {row1Items.map((brand, idx) => (
                <div
                  key={`r1-mobile-${brand.slug}-${idx}`}
                  className="group relative aspect-[3/4] h-[260px] w-[200px] shrink-0 -skew-x-[6deg] overflow-hidden rounded-2xl"
                >
                  <BrandCard brand={brand} />
                </div>
              ))}
            </div>

            {/* ROW 2: Moves Right */}
            <div
              className="animate-brand-marquee-right relative z-10 px-6"
              style={{
                animationDuration: `${row2Duration}s`,
                animationPlayState: isInView ? 'running' : 'paused',
              }}
            >
              {row2Items.map((brand, idx) => (
                <div
                  key={`r2-mobile-${brand.slug}-${idx}`}
                  className="group relative aspect-[3/4] h-[260px] w-[200px] shrink-0 -skew-x-[6deg] overflow-hidden rounded-2xl"
                >
                  <BrandCard brand={brand} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View All Brands Button underneath the marquee for all devices */}
        <div className="mt-6 flex w-full justify-center px-4 sm:mt-8 md:mt-10">
          <Link
            href="/brands"
            className="group inline-flex items-center -skew-x-[12deg] overflow-hidden rounded-xl border border-zinc-800 bg-black shadow-lg transition-all hover:border-zinc-600 hover:shadow-xl active:scale-95 dark:border-zinc-300 dark:bg-white dark:hover:border-zinc-100"
          >
            <span className="skew-x-[12deg] px-6 py-3 text-xs sm:text-sm font-black tracking-widest text-white uppercase transition-colors dark:text-black">
              View All Brands
            </span>
            <span className="flex shrink-0 items-center justify-center bg-white px-4 py-3 sm:px-5 sm:py-3 text-black transition-all group-hover:bg-zinc-200 dark:bg-black dark:text-white dark:group-hover:bg-zinc-800">
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
