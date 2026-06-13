'use client';

import { useState } from 'react';
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
  onToggleStatus,
  onDeleteProduct,
  sortOption,
  setSortOption,
  visibleColumns,
}: Props) {
  const router = useRouter();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    'minmax(320px, 2.5fr)',
    visibleColumns.has('Category') ? 'minmax(130px, 1.2fr)' : null,
    visibleColumns.has('Cost Price') ? 'minmax(110px, 1fr)' : null,
    visibleColumns.has('OG Price') ? 'minmax(110px, 1fr)' : null,
    'minmax(130px, 1.1fr)',
    visibleColumns.has('Variants') ? 'minmax(120px, 1fr)' : null,
    visibleColumns.has('Sales') ? 'minmax(100px, 0.9fr)' : null,
    visibleColumns.has('Date Added') ? 'minmax(120px, 1fr)' : null,
    'minmax(120px, 1fr)',
    visibleColumns.has('Stock') ? 'minmax(130px, 1.1fr)' : null,
    'minmax(90px, 0.8fr)',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-slate-50/50 p-2.5 shadow-xs dark:border-white/10 dark:bg-black/20">
        <div className="scrollbar-hide flex-1 overflow-x-auto overflow-y-auto">
          <div className="flex min-w-[1200px] flex-col gap-2.5 pb-2">
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
