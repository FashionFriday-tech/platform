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
}

export const CatalogueGrid = ({ products, onClearFilters }: GridProps) => {
  const ITEMS_PER_PROMO = 6;

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
