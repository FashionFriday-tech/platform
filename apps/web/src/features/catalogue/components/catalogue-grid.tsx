"use client";

import React from "react"; // Fix: Explicitly import React to resolve UMD global error
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@ff/schemas";
import { CatalogueProductCard } from "@/components/ui/cards/catlogue-product-card";

interface GridProps {
  products: Product[];
}

export const CatalogueGrid = ({ products }: GridProps) => {
  // Logic: In a 3-column grid (xl), 3 rows equals 9 items
  const ITEMS_PER_PROMO = 6;

  return (
    <div className="flex-1">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8 pt-8 md:pt-28">
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
                  className="col-span-2 xl:col-span-2 h-full md:h-full rounded-4xl bg-background overflow-hidden relative"
                >
                  <img
                    src="/gif/ad.gif"
                    alt="Promotion"
                    className="w-full h-full object-cover scale-105 "
                  />
                  <div className="absolute inset-0 bg-black/20 flex flex-col justify-center px-10">
                    <h4 className="text-white font-black italic uppercase text-2xl tracking-tighter">
                      Exclusive Drop
                    </h4>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
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
          <p className="opacity-30 text-[10px] font-black uppercase tracking-widest">
            No Gear Matches Your Current Refinement
          </p>
        </div>
      )}
    </div>
  );
};
