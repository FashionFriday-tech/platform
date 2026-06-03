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
    <div className="w-full">
      <table className="relative w-full min-w-[800px] text-left text-sm">
        <thead className="sticky top-0 z-10 border-b border-black/5 bg-[#f8f9fa] text-xs font-semibold tracking-wider text-black/60 uppercase dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white/60">
          <tr>
            <th className="px-6 py-4">Product</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5 dark:divide-white/5">
          {products.map((product) => (
            <tr
              key={product.id}
              onMouseEnter={() => {
                setHoveredRow(product.id);
              }}
              onMouseLeave={() => {
                setHoveredRow(null);
              }}
              className="transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-black/5 bg-[#f8f9fa] dark:border-white/5 dark:bg-[#1a1a1a]">
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
                  <div>
                    <p className="font-bold text-black dark:text-white">{product.name}</p>
                    <p className="text-xs text-black/50 dark:text-white/50">{product.brand}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
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
              </td>
              <td className="px-6 py-4 font-medium text-black dark:text-white">
                ${product.sellingPrice.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-right">
                <div
                  className={`flex items-center justify-end gap-2 transition-opacity duration-200 ${hoveredRow === product.id ? 'opacity-100' : 'opacity-0'}`}
                >
                  <button
                    onClick={() => {
                      onRemoveProduct(product.id);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-600 transition-colors hover:bg-red-500/20"
                    title="Remove from collection"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
