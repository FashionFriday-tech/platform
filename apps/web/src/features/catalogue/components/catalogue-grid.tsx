'use client';

import React from 'react';

import { type Product } from '@ff/schemas';
import { motion } from 'motion/react';

import { CatalogueProductCard } from '@/components/ui/cards/catlogue-product-card';
import Request from '@/components/ui/sections/Request';

import { PromoVideo } from './promo-video';

interface GridProps {
  products: Product[];
  activeFilters?: Record<string, string[]>;
  onRemoveFilter?: (key: string, value: string) => void;
  onClearFilters?: () => void;
  sortBy?: string;
  onSortChange?: (value: string) => void;
  sortOptions?: { label: string; value: string }[];
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
}

export const CatalogueGrid = ({
  products,
  onClearFilters,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
}: GridProps) => {
  const ITEMS_PER_PROMO = 6;
  const observerRef = React.useRef<HTMLDivElement | null>(null);

  // Infinite Scroll Trigger
  React.useEffect(() => {
    if (!hasMore || isLoadingMore || !onLoadMore) return;
    const target = observerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: '400px' },
    );

    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, onLoadMore]);

  return (
    <div className="w-full">
      {/* --- PRODUCT GRID --- */}
      {products.length > 0 && (
        <div className="4xl:grid-cols-5 grid grid-cols-2 gap-4 gap-y-8 pt-2 sm:pt-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => {
            const isPromoPosition = (index + 1) % ITEMS_PER_PROMO === 0;

            return (
              <React.Fragment key={product.id}>
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CatalogueProductCard product={product} />
                </motion.div>

                {/* PROMO BANNER: 2 product cards wide */}
                {isPromoPosition && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-background-muted relative col-span-2 aspect-[8/5] w-full overflow-hidden rounded-4xl sm:aspect-auto sm:h-full lg:rounded-[2.5rem]"
                  >
                    <PromoVideo src="/gif/ad.gif" />
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Empty State Logic */}
      {products.length === 0 && (
        <div className="py-6 text-center sm:py-12">
          <p className="text-base font-black tracking-widest uppercase opacity-70">
            No Gear Matches Your Current Refinement
          </p>
          <p className="text-foreground-subtle mt-2 text-xs">
            Try adjusting or resetting your budget range, brand, or quality filters.
          </p>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="bg-foreground text-background mt-4 rounded-full px-6 py-2.5 text-[10px] font-black tracking-widest uppercase transition-transform hover:scale-105 active:scale-95"
            >
              Reset All Filters
            </button>
          )}
        </div>
      )}

      {/* Dynamic Pagination & Infinite Scroll Loader */}
      {products.length > 0 && (
        <div className="mt-10 flex flex-col items-center justify-center space-y-4">
          {/* Skeleton Loaders when loading next page */}
          {isLoadingMore && (
            <div className="4xl:grid-cols-5 grid w-full grid-cols-2 gap-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex animate-pulse flex-col space-y-3 rounded-2xl border border-black/5 bg-black/[0.02] p-3 dark:border-white/5 dark:bg-white/[0.02]"
                >
                  <div className="aspect-square w-full rounded-xl bg-black/5 dark:bg-white/5" />
                  <div className="h-4 w-3/4 rounded-md bg-black/5 dark:bg-white/5" />
                  <div className="h-3 w-1/2 rounded-md bg-black/5 dark:bg-white/5" />
                </div>
              ))}
            </div>
          )}

          {/* Trigger point for IntersectionObserver */}
          <div ref={observerRef} className="h-6 w-full" />

          {/* Load More Button fallback & HasMore indicators */}
          {hasMore && !isLoadingMore && onLoadMore && (
            <button
              type="button"
              onClick={onLoadMore}
              className="group flex cursor-pointer items-center space-x-2 rounded-full border border-black/10 bg-white px-6 py-2.5 text-xs font-black tracking-widest text-black uppercase shadow-sm transition-all hover:scale-105 hover:bg-black hover:text-white active:scale-95 dark:border-white/10 dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
            >
              <span>Load More Drops</span>
              <svg
                className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}

          {!hasMore && products.length > 0 && (
            <div className="text-foreground-subtle flex items-center space-x-2 text-[11px] font-bold tracking-widest uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>All {products.length} Products Loaded</span>
            </div>
          )}
        </div>
      )}

      {/* Sourcing Request Section */}
      <div
        className={`border-border border-t ${
          products.length > 0 ? 'mt-12 pt-8 sm:mt-16 sm:pt-12' : 'mt-3 pt-3 sm:mt-6 sm:pt-6'
        }`}
      >
        <Request />
      </div>
    </div>
  );
};
