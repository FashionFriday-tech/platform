'use client';

import Image from 'next/image';

import { type ColumnId, type Product } from '../types';
import { ProductActionMenu } from './ProductActionMenu';

interface Props {
  product: Product;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onRequestDelete: (product: Product) => void;
  visibleColumns: Set<ColumnId>;
  onClick: () => void;
  getCategoryIcon: (category: string) => React.ReactNode;
  gridTemplateColumns?: string;
}

export function ProductTableRow({
  product,
  isSelected,
  onToggleSelection,
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
      className={`grid cursor-pointer items-center rounded-xl border px-6 py-3.5 shadow-xs transition-all ${
        isSelected
          ? 'border-black/20 bg-slate-100/90 dark:border-white/20 dark:bg-white/10'
          : 'border-black/5 bg-white hover:border-black/15 hover:shadow-md dark:border-white/10 dark:bg-[#141417] dark:hover:border-white/20'
      }`}
    >
      {/* Select & Product Info */}
      <div className="flex items-center space-x-3">
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelection(product.id);
          }}
          className={`flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center rounded-md border transition-colors ${
            isSelected
              ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
              : 'border-black/20 hover:border-black/50 dark:border-white/20 dark:hover:border-white/50'
          }`}
        >
          {isSelected && (
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <div className="flex items-center space-x-3">
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
            <p className="mt-0.5 text-xs text-black/40 dark:text-white/40">ID: {product.sku}</p>
          </div>
        </div>
      </div>

      {visibleColumns.has('Category') && (
        <div>
          <span className="inline-flex min-w-[90px] items-center justify-center rounded-md bg-black/5 px-2.5 py-1 text-xs font-medium text-black/70 dark:bg-white/5 dark:text-white/70">
            {getCategoryIcon(product.category)}
            {product.category}
          </span>
        </div>
      )}

      {visibleColumns.has('Cost Price') && (
        <div className="text-sm font-medium text-black/70 dark:text-white/70">
          ₹{Number(product.costPrice ?? 0).toFixed(2)}
        </div>
      )}

      {visibleColumns.has('OG Price') && (
        <div className="text-sm font-medium text-black/70 dark:text-white/70">
          ₹{Number(product.originalPrice ?? 0).toFixed(2)}
        </div>
      )}

      {/* Selling Price */}
      <div className="text-sm font-semibold">
        {Number(product.sellingPrice ?? 0) < Number(product.originalPrice ?? 0) ? (
          <span className="font-bold text-red-500">
            ₹{Number(product.sellingPrice ?? 0).toFixed(2)}
          </span>
        ) : (
          <span className="text-black dark:text-white">
            ₹{Number(product.sellingPrice ?? 0).toFixed(2)}
          </span>
        )}
      </div>

      {visibleColumns.has('Variants') && (
        <div>
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
        <div className="text-sm font-semibold text-black/80 dark:text-white/80">
          {product.sales ? product.sales.toLocaleString() : '0'}
        </div>
      )}

      {visibleColumns.has('Date Added') && (
        <div className="text-sm text-black/60 dark:text-white/60">{product.dateAdded ?? 'N/A'}</div>
      )}

      {/* Status */}
      <div>
        <span
          className={`inline-flex min-w-[85px] items-center justify-center rounded-md border px-2.5 py-1 text-xs font-medium ${
            product.status === 'Active'
              ? 'border-black/10 bg-black/5 text-black dark:border-white/20 dark:bg-white/10 dark:text-white'
              : product.status === 'Draft'
                ? 'border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-500'
                : 'border-transparent bg-black/5 text-black/50 dark:bg-white/5 dark:text-white/50'
          }`}
        >
          {product.status}
        </span>
      </div>

      {visibleColumns.has('Stock') && (
        <div>
          <div className="flex w-24 flex-col justify-center">
            <div className="mb-1 h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  product.stock < 100
                    ? 'bg-red-500'
                    : product.stock < 500
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                }`}
                style={{ width: `${(product.stock / product.maxStock) * 100}%` }}
              />
            </div>
            <p
              className={`text-right text-[10px] font-medium ${
                product.stock < 100
                  ? 'text-red-500'
                  : product.stock < 500
                    ? 'text-yellow-600 dark:text-yellow-500'
                    : 'text-green-600 dark:text-green-500'
              }`}
            >
              {product.stock}/{product.maxStock}
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
