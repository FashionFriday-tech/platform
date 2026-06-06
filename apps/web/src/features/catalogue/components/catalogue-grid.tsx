'use client';

import React from 'react';
import Image from 'next/image';

import { type Product } from '@ff/schemas';
import { motion } from 'motion/react';

import { CatalogueProductCard } from '@/components/ui/cards/catlogue-product-card';
import Request from '@/components/ui/sections/Request';

interface GridProps {
  products: Product[];
  activeFilters?: Record<string, string[]>;
  onRemoveFilter?: (key: string, value: string) => void;
  onClearFilters?: () => void;
  sortBy?: string;
  onSortChange?: (value: string) => void;
  sortOptions?: { label: string; value: string }[];
}

export const CatalogueGrid = ({
  products,
  activeFilters = {},
  onRemoveFilter,
  onClearFilters,
  sortBy,
  onSortChange,
  sortOptions = [],
}: GridProps) => {
  const ITEMS_PER_PROMO = 6;

  // Flatten active filters into chips
  const activeChips = Object.entries(activeFilters).flatMap(([key, values]) => {
    if (!values) {
      return [];
    }
    return values.map((val) => {
      let label = val;
      if (key === 'priceRange') {
        const [min, max] = val.split('-');
        label = `Price: ₹${Number(min).toLocaleString()} - ₹${Number(max).toLocaleString()}`;
      } else if (key === 'inStock') {
        label = 'In Stock Only';
      } else {
        label = `${key.toUpperCase()}: ${val}`;
      }
      return { key, value: val, label };
    });
  });

  return (
    <div className="w-full">
      {/* --- REFINEMENT & SORTING BAR --- */}
      <div className="border-border mb-6 flex flex-col gap-3 border-b pt-2 pb-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Results Count & Active Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black tracking-widest uppercase opacity-80">
            {products.length} {products.length === 1 ? 'Product Found' : 'Products Found'}
          </span>

          {activeChips.length > 0 && (
            <div className="border-border flex flex-wrap items-center gap-1.5 pl-2 sm:border-l">
              {activeChips.map((chip) => (
                <button
                  key={`${chip.key}-${chip.value}`}
                  onClick={() => {
                    onRemoveFilter?.(chip.key, chip.value);
                  }}
                  className="bg-background-muted hover:border-foreground/40 border-border group flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase transition-all active:scale-95"
                >
                  <span>{chip.label}</span>
                  <span className="text-foreground-subtle group-hover:text-foreground">✕</span>
                </button>
              ))}

              {onClearFilters && (
                <button
                  onClick={onClearFilters}
                  className="text-foreground-subtle pl-1 text-[10px] font-black uppercase transition-colors hover:text-red-500"
                >
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>

        {/* Desktop / Tablet Sort Selector */}
        {sortOptions.length > 0 && onSortChange && (
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-[10px] font-black tracking-widest uppercase opacity-50">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => {
                onSortChange(e.target.value);
              }}
              className="border-border bg-background hover:border-foreground/40 focus:border-foreground cursor-pointer rounded-2xl border px-3.5 py-1.5 text-[11px] font-black tracking-wider uppercase shadow-xs transition-colors outline-none"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="4xl:grid-cols-5 grid grid-cols-2 gap-4 gap-y-8 pt-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
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
                  className="bg-background-muted relative col-span-2 aspect-4/5 h-full min-h-[280px] w-full overflow-hidden rounded-4xl sm:aspect-auto lg:rounded-[2.5rem]"
                >
                  <Image
                    src="/gif/ad.gif"
                    alt="Promotion"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 flex flex-col justify-center bg-black/35 px-6 backdrop-blur-[0.5px] md:px-10">
                    <h4 className="text-2xl font-black tracking-tighter text-white uppercase italic sm:text-3xl md:text-4xl">
                      Exclusive Drop
                    </h4>
                    <p className="mt-1 text-[10px] font-bold tracking-widest text-white/80 uppercase sm:text-xs">
                      Premium Quality Guaranteed
                    </p>
                  </div>
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Sourcing Request Section */}
      <div className="border-border mt-16 border-t pt-12">
        <Request />
      </div>

      {/* Empty State Logic */}
      {products.length === 0 && (
        <div className="py-32 text-center">
          <p className="text-base font-black tracking-widest uppercase opacity-70">
            No Gear Matches Your Current Refinement
          </p>
          <p className="text-foreground-subtle mt-2 text-xs">
            Try adjusting or resetting your budget range, brand, or quality filters.
          </p>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="bg-foreground text-background mt-6 rounded-full px-6 py-3 text-[10px] font-black tracking-widest uppercase transition-transform hover:scale-105 active:scale-95"
            >
              Reset All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
