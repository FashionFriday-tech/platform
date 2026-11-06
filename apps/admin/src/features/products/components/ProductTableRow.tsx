'use client';

import Image from 'next/image';

import { type ColumnId, type Product } from '../types';
import { ProductActionMenu } from './ProductActionMenu';

interface Props {
  product: Product;
  isSelected?: boolean;
  onToggleSelection?: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onRequestDelete: (product: Product) => void;
  visibleColumns: Set<ColumnId>;
  onClick: () => void;
  getCategoryIcon: (category: string) => React.ReactNode;
  gridTemplateColumns?: string;
}

export function ProductTableRow({
  product,
  onToggleStatus,
  onRequestDelete,
  visibleColumns,
  onClick,
  getCategoryIcon,
  gridTemplateColumns,
}: Props) {
  return (
    <div
      onClick={onClick}
      style={{ gridTemplateColumns }}
      className="grid cursor-pointer items-center rounded-xl border border-black/5 bg-white px-4 py-3.5 shadow-xs transition-all hover:border-black/15 hover:shadow-md sm:px-6 dark:border-white/10 dark:bg-[#141417] dark:hover:border-white/20"
    >
      {/* Product Info */}
      <div className="flex min-w-0 items-center space-x-3">
        <div className="flex min-w-0 items-center space-x-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/5 bg-black/5 dark:border-white/5 dark:bg-white/10">
            {product.imageUrl ? (
              <Image
                width={500}
                height={500}
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-black/30 dark:text-white/30">IMG</span>
            )}
          </div>
          <div className="min-w-0 pr-2">
            <p
              className="truncate text-sm font-semibold text-black/90 dark:text-white/90"
              title={product.name}
            >
              {product.name}
            </p>
            <p
              className="mt-0.5 truncate font-mono text-xs text-black/40 dark:text-white/40"
              title={product.id}
            >
              ID: {product.id}
            </p>
          </div>
        </div>
      </div>

      {visibleColumns.has('Category') && (
        <div className="min-w-0">
          <span className="inline-flex max-w-full items-center justify-center rounded-md bg-black/5 px-2.5 py-1 text-xs font-medium text-black/70 dark:bg-white/5 dark:text-white/70">
            {getCategoryIcon(product.category)}
            <span className="truncate">{product.category}</span>
          </span>
        </div>
      )}

      {visibleColumns.has('Cost Price') && (
        <div className="min-w-0 truncate text-sm font-medium text-black/70 dark:text-white/70">
          ₹{Number(product.costPrice ?? 0).toFixed(2)}
        </div>
      )}

      {visibleColumns.has('OG Price') && (
        <div className="min-w-0 truncate text-sm font-medium text-black/70 dark:text-white/70">
          ₹{Number(product.originalPrice ?? 0).toFixed(2)}
        </div>
      )}

      {/* Selling Price */}
      <div className="min-w-0 truncate text-sm font-semibold">
        {Number(product.sellingPrice ?? 0) < Number(product.costPrice ?? 0) ? (
          <span className="font-bold text-red-600 dark:text-red-500">
            ₹{Number(product.sellingPrice ?? 0).toFixed(2)}
          </span>
        ) : (
          <span className="font-bold text-green-600 dark:text-green-500">
            ₹{Number(product.sellingPrice ?? 0).toFixed(2)}
          </span>
        )}
      </div>

      {visibleColumns.has('Variants') && (
        <div className="min-w-0">
          <div className="grid w-max grid-flow-col grid-rows-2 gap-1">
            {product.variants?.map((v) => (
              <span
                key={v}
                className="flex h-[18px] min-w-[24px] items-center justify-center rounded border border-black/10 px-1 text-[9px] font-medium text-black/60 dark:border-white/10 dark:text-white/60"
              >
                {v}
              </span>
            )) ?? <span className="text-xs text-black/30 dark:text-white/30">-</span>}
          </div>
        </div>
      )}

      {visibleColumns.has('Sales') && (
        <div className="min-w-0 truncate text-sm font-semibold text-black/80 dark:text-white/80">
          {product.sales ? product.sales.toLocaleString() : '0'}
        </div>
      )}

      {visibleColumns.has('Date Added') && (
        <div className="min-w-0 truncate text-sm text-black/60 dark:text-white/60">
          {product.dateAdded ?? 'N/A'}
        </div>
      )}

      {/* Status */}
      <div className="min-w-0">
        <span
          className={`inline-flex max-w-full items-center justify-center rounded-md border px-2.5 py-1 text-xs font-medium ${
            product.stock <= 0
              ? 'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-400'
              : product.status === 'Active'
                ? 'border-black/10 bg-black/5 text-black dark:border-white/20 dark:bg-white/10 dark:text-white'
                : product.status === 'Draft'
                  ? 'border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-500'
                  : 'border-transparent bg-black/5 text-black/50 dark:bg-white/5 dark:text-white/50'
          }`}
        >
          <span className="truncate">
            {product.stock <= 0 && product.status === 'Active' ? 'Sold Out' : product.status}
          </span>
        </span>
      </div>

      {visibleColumns.has('Stock') && (
        <div className="min-w-0">
          <div className="flex w-24 max-w-full flex-col justify-center">
            <div className="mb-1 h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  product.stock <= 0
                    ? 'bg-rose-500'
                    : product.stock <= 20
                      ? 'bg-amber-500'
                      : 'bg-green-500'
                }`}
                style={{
                  width: `${Math.min(100, Math.max(product.stock > 0 ? 5 : 0, (product.stock / (product.maxStock || 100)) * 100))}%`,
                }}
              />
            </div>
            <p
              className={`text-right text-[10px] font-medium ${
                product.stock <= 0
                  ? 'font-bold text-rose-500'
                  : product.stock <= 20
                    ? 'font-semibold text-amber-600 dark:text-amber-500'
                    : 'text-green-600 dark:text-green-500'
              }`}
            >
              {product.stock}/{product.maxStock || 100}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div
        className="flex justify-end"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <ProductActionMenu
          product={product}
          onToggleStatus={onToggleStatus}
          onRequestDelete={onRequestDelete}
        />
      </div>
    </div>
  );
}
