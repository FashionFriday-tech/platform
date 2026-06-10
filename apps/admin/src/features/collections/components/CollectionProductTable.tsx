import React, { useState } from 'react';
import Image from 'next/image';

import { CheckIcon, PackageIcon, TrashIcon } from '@ff/ui';

import { type Product } from '../../products/types';

interface CollectionProductTableProps {
  products: Product[];
  onRemoveProduct: (productId: string) => void;
}

export function CollectionProductTable({ products, onRemoveProduct }: CollectionProductTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 py-12 dark:border-white/10">
        <PackageIcon className="mb-4 h-12 w-12 text-black/20 dark:text-white/20" />
        <p className="text-sm font-medium text-black/60 dark:text-white/60">
          No products in this collection
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-black/10 bg-slate-50/50 p-2.5 shadow-xs dark:border-white/10 dark:bg-black/20">
      <div className="scrollbar-hide overflow-x-auto overflow-y-auto">
        <div className="flex min-w-[700px] flex-col gap-2.5 pb-2">
          {/* Header Tab - Fixed / Sticky on Top (Black in Light Mode) */}
          <div className="sticky top-0 z-20 pb-0.5">
            <div className="grid grid-cols-[minmax(280px,3fr)_minmax(120px,1.2fr)_minmax(120px,1.2fr)_minmax(90px,0.8fr)] items-center rounded-xl border border-black/10 bg-black px-6 py-3.5 text-xs font-semibold tracking-wider text-white uppercase shadow-md backdrop-blur-md dark:border-white/10 dark:bg-white dark:text-black dark:shadow-sm">
              <div>Product</div>
              <div>Status</div>
              <div>Price</div>
              <div className="text-right">Actions</div>
            </div>
          </div>

          {/* Product Row Tabs */}
          {products.map((product) => (
            <div
              key={product.id}
              onMouseEnter={() => {
                setHoveredRow(product.id);
              }}
              onMouseLeave={() => {
                setHoveredRow(null);
              }}
              className="grid grid-cols-[minmax(280px,3fr)_minmax(120px,1.2fr)_minmax(120px,1.2fr)_minmax(90px,0.8fr)] items-center rounded-xl border border-black/5 bg-white px-6 py-3.5 shadow-xs transition-all hover:border-black/15 hover:shadow-md dark:border-white/10 dark:bg-[#141417] dark:hover:border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-black/5 bg-[#f8f9fa] dark:border-white/5 dark:bg-[#1a1a1a]">
                  <Image
                    src={
                      product.imageUrl ??
                      product.images?.[0] ??
                      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200'
                    }
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 pr-2">
                  <p
                    className="truncate text-sm font-bold text-black dark:text-white"
                    title={product.name}
                  >
                    {product.name}
                  </p>
                  <p className="text-xs text-black/50 dark:text-white/50">{product.brand}</p>
                </div>
              </div>

              <div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    product.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-black/5 text-black/60 dark:bg-white/5 dark:text-white/60'
                  }`}
                >
                  {product.status === 'Active' && <CheckIcon className="h-3 w-3" />}
                  {product.status}
                </span>
              </div>

              <div className="font-semibold text-black dark:text-white">
                ₹{Number(product.sellingPrice || 0).toFixed(2)}
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => {
                    onRemoveProduct(product.id);
                  }}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-600 transition-all hover:bg-red-500/20 active:scale-95 ${
                    hoveredRow === product.id ? 'opacity-100' : 'opacity-70'
                  }`}
                  title="Remove from collection"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
