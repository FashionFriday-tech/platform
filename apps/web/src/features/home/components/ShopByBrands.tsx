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
    <section className="relative w-full overflow-hidden py-12 transition-colors duration-300 md:py-20 lg:py-24">
      <div className="relative z-10">
        {/* HEADER */}
        <header className="container mx-auto mb-8 flex justify-center px-4 text-center">
          <h2 className="section-header">Shop by brands</h2>
        </header>

        {/* Marquee tracks: single row on desktop (sm:block), two rows on mobile (sm:hidden) */}
        <div ref={containerRef} className="relative w-full overflow-hidden py-6">
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
              gap: 1.5rem;
            }
            .animate-brand-marquee-right {
              display: flex;
              width: max-content;
              animation-name: brand-marquee-right;
              animation-timing-function: linear;
              animation-iteration-count: infinite;
              gap: 1.5rem;
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
                  className="group relative aspect-[3/4] h-[400px] w-[310px] shrink-0 overflow-hidden rounded-3xl md:h-[480px] md:w-[360px] md:rounded-4xl"
                >
                  <BrandCard brand={brand} />
                </div>
              ))}
            </div>
          </div>

          {/* SMALL MOBILE DEVICES ONLY: Two Opposing Direction Rows (Hidden on screens >= 640px) */}
          <div className="flex flex-col gap-6 sm:hidden">
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
                  className="group relative aspect-[3/4] h-[260px] w-[200px] shrink-0 overflow-hidden rounded-3xl"
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
                  className="group relative aspect-[3/4] h-[260px] w-[200px] shrink-0 overflow-hidden rounded-3xl"
                >
                  <BrandCard brand={brand} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View All Brands Button underneath the marquee for all devices */}
        <div className="mt-8 flex w-full justify-center px-4">
          <Link
            href="/brands"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-black/20 px-8 py-3 text-sm font-bold tracking-widest text-black uppercase transition-all hover:bg-black hover:text-white active:scale-95 dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:text-black"
          >
            View All Brands <ArrowUpRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
