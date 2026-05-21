import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { EditIcon, PackageIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { type ProductCategory } from '../types';

interface CategoryCardProps {
  category: ProductCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <div className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-[#111111]">
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
      </div>
    </Link>
  );
}
