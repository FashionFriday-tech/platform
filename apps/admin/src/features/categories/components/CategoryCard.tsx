import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { EditIcon, PackageIcon, TrashIcon } from '@ff/ui';

import { type ProductCategory } from '../types';

interface CategoryCardProps {
  category: ProductCategory;
  onEdit?: (category: ProductCategory) => void;
  onDelete?: (category: ProductCategory) => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-[#111111]">
      <Link href={`/categories/${category.slug}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/5 dark:bg-white/5">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-[#222]">
              <span className="text-xs font-medium text-gray-400">No Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/30" />

          <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-1 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-12">
            <h3 className="text-lg font-bold text-white drop-shadow-sm">{category.name}</h3>
            <div className="flex items-center gap-1.5 text-sm font-medium text-white/90 drop-shadow-sm">
              <PackageIcon className="h-4 w-4" />
              <span>{category.productCount} Products</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
        {onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit(category);
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-black/60 text-white transition-all hover:bg-black active:scale-95"
            title="Edit category"
          >
            <EditIcon className="h-4 w-4" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(category);
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-black/60 text-white transition-all hover:bg-red-600 active:scale-95"
            title="Delete category"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
