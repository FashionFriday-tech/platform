'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ShoppingBagIcon } from '@ff/ui';

import { type Product } from '../types';
import { DeleteProductModal } from './DeleteProductModal';
import { ProductActionMenu } from './ProductActionMenu';

interface Props {
  products: Product[];
  isLoading: boolean;
  onToggleStatus: (id: string) => void;
  onDeleteProduct?: (id: string) => Promise<boolean | undefined>;
  selectedIds?: Set<string>;
  onToggleSelection?: (id: string) => void;
  onToggleAllSelection?: (ids: string[]) => void;
}

export function ProductGrid({
  products,
  isLoading,
  onToggleStatus,
  onDeleteProduct,
}: Props) {
  const router = useRouter();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (!productToDelete || !onDeleteProduct) {
      return;
    }
    setIsDeleting(true);
    try {
      await onDeleteProduct(productToDelete.id);
      setProductToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 py-20 text-center text-black/50 dark:border-white/10 dark:text-white/50">
        No products found.
      </div>
    );
  }

  return (
    <div className="scrollbar-hide h-full w-full overflow-y-auto pb-6">
      {/* Top Controls: Counts */}
      <div className="mb-4 flex items-center justify-between px-2">
        <div className="text-sm font-medium text-black/60 dark:text-white/60">
          Showing <span className="font-bold text-black dark:text-white">{products.length}</span> products
        </div>
      </div>

      {/* Modern Product Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {products.map((product) => {
          const hasDiscount = Number(product.originalPrice || 0) > Number(product.sellingPrice || 0);

          return (
            <div
              key={product.id}
              onClick={() => {
                router.push(`/products/${product.seoSlug ?? product.id}`);
              }}
              className={`group relative flex cursor-pointer flex-col rounded-2xl border border-black/10 bg-white shadow-[0_2px_12px_rgb(0,0,0,0.03)] transition-colors hover:border-black/30 dark:border-white/10 dark:bg-[#151517] dark:hover:border-white/25 ${
                activeMenuId === product.id ? 'z-40' : 'hover:z-10'
              }`}
            >
              {/* Product Image Area with Overlays */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-black/5 dark:bg-white/5">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-black/30 dark:text-white/30">
                    <ShoppingBagIcon className="h-10 w-10 opacity-30" />
                  </div>
                )}

                {/* Top-Right: Status Badge */}
                <div className="absolute top-2.5 right-2.5 z-20">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStatus(product.id);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase shadow-md backdrop-blur-md transition-all ${
                      product.status === 'Active'
                        ? 'border border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                        : product.status === 'Draft'
                          ? 'border border-amber-400/40 bg-amber-400 text-amber-950'
                          : 'border border-zinc-600 bg-zinc-800 text-zinc-200'
                    }`}
                    title={`Status: ${product.status} (Click to toggle)`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        product.status === 'Active'
                          ? 'bg-emerald-400 dark:bg-emerald-600'
                          : 'bg-current'
                      }`}
                    />
                    {product.status}
                  </button>
                </div>

                {/* Bottom-Left: Full Brand ID Pill on Image */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    void navigator.clipboard.writeText(product.id);
                    toast.success('Product ID copied to clipboard');
                  }}
                  className="absolute bottom-2.5 left-2.5 z-20 flex items-center gap-1 rounded-md border border-black/10 bg-white/95 px-2 py-0.5 font-mono text-[10px] font-bold text-black shadow-sm backdrop-blur-md transition-colors hover:bg-white dark:border-white/15 dark:bg-black/85 dark:text-white"
                  title="Click to copy ID"
                >
                  <span>ID: {product.id}</span>
                </div>
              </div>

              {/* Product Card Content: Name, Brand, Quality, Price, Stock */}
              <div className="flex flex-1 flex-col justify-between p-3.5 space-y-2.5">
                <div className="space-y-1.5">
                  {/* Brand & Quality Tags */}
                  {(product.brand || product.quality) && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      {product.brand && (
                        <span className="rounded-md bg-black/5 px-2 py-0.5 font-bold uppercase tracking-wider text-black/80 dark:bg-white/10 dark:text-white/80">
                          {product.brand}
                        </span>
                      )}
                      {product.quality && (
                        <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 font-bold text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400">
                          {product.quality}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Product Name */}
                  <h4
                    className="line-clamp-2 text-sm leading-snug font-bold text-black transition-colors group-hover:text-black/70 dark:text-white dark:group-hover:text-white/70"
                    title={product.name}
                  >
                    {product.name}
                  </h4>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-base font-black text-black dark:text-white">
                      ₹{Number(product.sellingPrice || 0).toLocaleString('en-IN')}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs font-semibold text-black/40 line-through dark:text-white/40">
                        ₹{Number(product.originalPrice || 0).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock Level & Action Menu */}
                <div className="border-t border-black/5 pt-2.5 dark:border-white/5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between text-[10px] font-bold text-black/50 dark:text-white/50">
                        <span>Stock</span>
                        <span
                          className={
                            product.stock < 10
                              ? 'font-extrabold text-red-500'
                              : product.stock < 50
                                ? 'font-bold text-amber-500'
                                : 'font-bold text-black dark:text-white'
                          }
                        >
                          {product.stock} units
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            product.stock < 10
                              ? 'bg-red-500'
                              : product.stock < 50
                                ? 'bg-amber-500'
                                : 'bg-black dark:bg-white'
                          }`}
                          style={{
                            width: `${Math.min(100, Math.max(5, (product.stock / (product.maxStock || 100)) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* 3-Dot Actions Menu */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="relative z-30 ml-2"
                    >
                      <ProductActionMenu
                        product={product}
                        onToggleStatus={onToggleStatus}
                        onRequestDelete={(p) => {
                          setProductToDelete(p);
                        }}
                        isOpen={activeMenuId === product.id}
                        onOpenChange={(open) => {
                          setActiveMenuId(open ? product.id : null);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <DeleteProductModal
        isOpen={Boolean(productToDelete)}
        onClose={() => {
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        productName={productToDelete?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
}
