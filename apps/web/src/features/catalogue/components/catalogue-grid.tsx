'use client';

import React from 'react'; // Fix: Explicitly import React to resolve UMD global error
import Image from 'next/image';

import { type Product } from '@ff/schemas';
import { motion } from 'motion/react';

import { CatalogueProductCard } from '@/components/ui/cards/catlogue-product-card';

interface GridProps {
  products: Product[];
}

export const CatalogueGrid = ({ products }: GridProps) => {
  // Logic: In a 3-column grid (xl), 3 rows equals 9 items
  const ITEMS_PER_PROMO = 6;

  return (
    <div className="flex-1">
      <div className="grid grid-cols-2 gap-4 gap-y-8 pt-8 md:pt-28 lg:grid-cols-3">
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

              {/* PROMO CONTAINER: Spans full width after every 3 rows */}
              {isPromoPosition && (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-background relative col-span-2 h-full overflow-hidden rounded-4xl md:h-full xl:col-span-2"
                >
                  <Image
                    src="/gif/ad.gif"
                    alt="Promotion"
                    fill
                    className="scale-105 object-cover"
                    sizes="100vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 flex flex-col justify-center bg-black/20 px-10">
                    <h4 className="text-2xl font-black tracking-tighter text-white uppercase italic">
                      Exclusive Drop
                    </h4>
                    <p className="text-[10px] font-bold tracking-widest text-white/60 uppercase">
                      Premium Quality Guaranteed
                    </p>
                  </div>
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Empty State Logic */}
      {products.length === 0 && (
        <div className="py-32 text-center">
          <p className="text-[10px] font-black tracking-widest uppercase opacity-30">
            No Gear Matches Your Current Refinement
          </p>
        </div>
      )}
    </div>
  );
};
