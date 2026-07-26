'use client';

import Image from 'next/image';

import { motion } from 'motion/react';

import { type ProductSuggestion } from '../hooks/use-search';

interface LiveProductSuggestionsProps {
  products: ProductSuggestion[];
  onSelectProduct: (slug: string, name: string) => void;
}

export const LiveProductSuggestions = ({
  products,
  onSelectProduct,
}: LiveProductSuggestionsProps) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <h4 className="mb-4 text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
        Matching Products
      </h4>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {products.map((product) => {
          const brandName = Array.isArray(product.brand) ? product.brand[0] : product.brand;
          return (
            <button
              key={product.id}
              onClick={() => {
                onSelectProduct(product.slug, product.name);
              }}
              className="group border-foreground/10 bg-foreground/[0.02] hover:border-foreground/30 hover:bg-foreground/[0.05] flex items-center gap-4 rounded-xl border p-2.5 text-left transition-all"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-900">
                {product.mainImage ? (
                  <Image
                    src={product.mainImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-neutral-600">
                    No Pic
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                {brandName && (
                  <span className="text-foreground/40 text-[10px] font-bold tracking-widest uppercase">
                    {brandName}
                  </span>
                )}
                <h5 className="text-foreground group-hover:text-brand truncate text-sm font-bold tracking-tight transition-colors">
                  {product.name}
                </h5>
                <span className="text-foreground/80 mt-1 font-mono text-xs font-semibold">
                  ₹{product.sellingPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};
