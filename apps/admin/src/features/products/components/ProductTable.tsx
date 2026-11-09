'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  HangerCategoryIcon,
  JacketCategoryIcon,
  ShirtCategoryIcon,
  ShoeCategoryIcon,
} from '@ff/ui';

import { type ColumnId, type Product, type SortOption } from '../types';
import { DeleteProductModal } from './DeleteProductModal';
import { ProductTableHeader } from './ProductTableHeader';
import { ProductTableRow } from './ProductTableRow';

interface Props {
  products: Product[];
  isLoading: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  totalProducts?: number;
  onToggleStatus: (id: string) => void;
  onDeleteProduct: (id: string) => Promise<boolean | undefined>;
  selectedIds?: Set<string>;
  onToggleSelection?: (id: string) => void;
  onToggleAllSelection?: (ids: string[]) => void;
  sortOption: SortOption;
  setSortOption: (val: SortOption) => void;
  visibleColumns: Set<ColumnId>;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'outerwear':
    case 'jacket':
      return <JacketCategoryIcon className="mr-1.5 h-3.5 w-3.5" />;
    case 'footwear':
    case 'sneakers':
    case 'shoes':
      return <ShoeCategoryIcon className="mr-1.5 h-3.5 w-3.5" />;
    case 'shirts':
    case 't-shirts':
      return <ShirtCategoryIcon className="mr-1.5 h-3.5 w-3.5" />;
    default:
      return <HangerCategoryIcon className="mr-1.5 h-3.5 w-3.5" />;
  }
};

export function ProductTable({
  products,
  isLoading,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  totalProducts,
  onToggleStatus,
  onDeleteProduct,
  sortOption,
  setSortOption,
  visibleColumns,
}: Props) {
  const router = useRouter();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver to trigger onLoadMore when scrolling near bottom
  useEffect(() => {
    if (!onLoadMore || !hasMore || isLoadingMore || isLoading) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: '300px' },
    );

    const el = sentinelRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
      observer.disconnect();
    };
  }, [onLoadMore, hasMore, isLoadingMore, isLoading]);

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

  const handleDeleteConfirm = async () => {
    if (!productToDelete) {
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

  const gridTemplateColumns = [
    'minmax(180px, 2.2fr)',
    visibleColumns.has('Category') ? 'minmax(90px, 1fr)' : null,
    visibleColumns.has('Cost Price') ? 'minmax(85px, 0.9fr)' : null,
    visibleColumns.has('OG Price') ? 'minmax(85px, 0.9fr)' : null,
    'minmax(85px, 0.9fr)',
    visibleColumns.has('Variants') ? 'minmax(90px, 0.9fr)' : null,
    visibleColumns.has('Sales') ? 'minmax(75px, 0.8fr)' : null,
    visibleColumns.has('Date Added') ? 'minmax(115px, 1fr)' : null,
    'minmax(80px, 0.8fr)',
    visibleColumns.has('Stock') ? 'minmax(95px, 1fr)' : null,
    'minmax(48px, 0.4fr)',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-slate-50/50 p-2 shadow-xs sm:p-2.5 dark:border-white/10 dark:bg-black/20">
        <div className="scrollbar-hide flex-1 overflow-x-auto overflow-y-auto overscroll-contain [overscroll-behavior-x:none] [-webkit-overflow-scrolling:touch]">
          <div className="flex w-full min-w-full flex-col gap-2.5 pb-2">
            <ProductTableHeader
              products={products}
              sortOption={sortOption}
              setSortOption={setSortOption}
              visibleColumns={visibleColumns}
              gridTemplateColumns={gridTemplateColumns}
            />
            {products.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                onToggleStatus={onToggleStatus}
                onRequestDelete={(p) => {
                  setProductToDelete(p);
                }}
                visibleColumns={visibleColumns}
                gridTemplateColumns={gridTemplateColumns}
                onClick={() => {
                  router.push(`/products/${product.seoSlug ?? product.id}`);
                }}
                getCategoryIcon={getCategoryIcon}
              />
            ))}

            {/* Sentinel for dynamic infinite scroll */}
            <div ref={sentinelRef} className="h-4 w-full" />

            {/* Dynamic Loading Indicator */}
            {isLoadingMore && (
              <div className="flex items-center justify-center py-4 text-xs font-semibold text-black/50 dark:text-white/50">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
                Loading more products...
              </div>
            )}

            {!hasMore && products.length > 0 && (
              <div className="py-3 text-center text-xs font-medium text-black/40 dark:text-white/40">
                Showing all {totalProducts ?? products.length} products
              </div>
            )}
          </div>
        </div>
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
    </>
  );
}
