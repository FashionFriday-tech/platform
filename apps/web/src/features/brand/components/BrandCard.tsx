'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { Brand } from '@ff/schemas';

import { cn } from '@/lib/utils';

interface BrandCardProps {
  brand: Brand;
  className?: string;
  skewed?: boolean;
}

export const BrandCard = ({ brand, className, skewed = false }: BrandCardProps) => {
  const [hasError, setHasError] = React.useState(false);
  const [hasFallbackText, setHasFallbackText] = React.useState(false);

  return (
    <Link href={`/brands/${brand.slug}`} className="group block h-full w-full">
      <div
        className={cn(
          'group relative flex aspect-[3/4] h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-black/5 p-4 shadow-sm duration-500 hover:scale-95 sm:rounded-2xl sm:p-5 md:rounded-2xl md:p-5 dark:border-white/10',
          skewed && '-skew-x-[6deg]',
          className,
        )}
        style={{
          backgroundColor: brand.color ?? '#000000',
        }}
      >
        <div
          className={cn(
            'relative flex h-full w-full items-center justify-center p-3 sm:p-4',
            skewed && 'skew-x-[6deg]',
          )}
        >
          {brand.logo && !hasFallbackText && !hasError ? (
            <div className="relative flex h-full w-full max-h-[82%] max-w-[85%] items-center justify-center">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
                onError={() => {
                  setHasError(true);
                  setHasFallbackText(true);
                }}
                className="object-contain p-1.5 drop-shadow-sm duration-500 group-hover:scale-105 brightness-0 invert"
              />
            </div>
          ) : (
            <span className="px-2 text-center text-xs font-black tracking-widest uppercase text-white drop-shadow-sm sm:text-sm md:text-base">
              {brand.name}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
