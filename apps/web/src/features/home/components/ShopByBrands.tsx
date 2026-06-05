'use client';

import React, { useCallback, useRef, useState } from 'react';
import Link from 'next/link';

import { ArrowUpRightIcon } from '@ff/ui';

import { BrandCard, useBrands } from '@/features/brand';

const FEATURED_BRAND_NAMES = ['nike', 'adidas', 'zara', 'crocs', 'new balance', 'asics'];

export default function ShopByBrands({ initialBrands }: { initialBrands?: any[] }) {
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
  const displayList = featuredBrands.length > 0 ? featuredBrands : brands.slice(0, 6);

  if (isLoading && displayList.length === 0) {
    return null;
  }

  return (
    <section className="relative w-screen overflow-hidden py-16 transition-colors duration-300 lg:py-24">
      <div className="relative z-10">
        {/* HEADER (No background color) */}
        <div className="container mx-auto mb-8 flex justify-center px-4 text-center">
          <h2 className="section-header">Shop by brands</h2>
        </div>

        {/* Cards container with cream-light background */}
        <div className="relative w-full overflow-hidden py-10 transition-colors">
          <style>{`
            @keyframes brand-marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-brand-marquee {
              display: flex;
              width: max-content;
              animation: brand-marquee 25s linear infinite;
              gap: 1rem; /* Compact spacing on small devices */
            }
            @media (min-width: 640px) {
              .animate-brand-marquee {
                gap: 3.5rem; /* Restored spacious gap on larger devices */
              }
            }
            .animate-brand-marquee:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div
            ref={containerRef}
            className="animate-brand-marquee relative z-10 px-6"
            style={{ animationPlayState: isInView ? 'running' : 'paused' }}
          >
            {[...displayList, ...displayList].map((brand, idx) => (
              <div key={`${brand.slug}-${idx}`} className="w-[180px] shrink-0 sm:w-[220px]">
                <BrandCard brand={brand} />
              </div>
            ))}
          </div>
        </div>

        {/* View All Brands Button moved underneath the marquee for all devices */}
        <div className="mt-10 flex w-full justify-center px-4">
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
