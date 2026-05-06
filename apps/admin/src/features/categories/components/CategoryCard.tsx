import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ProductCategory } from '../types';
import { PackageIcon, EditIcon } from '@ff/ui';

interface CategoryCardProps {
  category: ProductCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <div className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-[#111111]">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/5 dark:bg-white/5">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/30" />
          
          <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-1 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-12">
            <h3 className="text-lg font-bold text-white drop-shadow-sm">
              {category.name}
            </h3>
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
