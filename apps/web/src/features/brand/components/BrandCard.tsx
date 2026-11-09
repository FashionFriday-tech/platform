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

function isBlackColor(color?: string): boolean {
  if (!color) return true;
  const c = color.trim().toLowerCase();
  return c === '#000000' || c === '#000' || c === 'black';
}

export const BrandCard = ({ brand, className, skewed = false }: BrandCardProps) => {
  const [hasError, setHasError] = React.useState(false);
  const [hasFallbackText, setHasFallbackText] = React.useState(false);
  const isBlack = isBlackColor(brand.color);

  return (
    <Link href={`/brands/${brand.slug}`} className="group block h-full w-full">
      <div
        className={cn(
          'group relative flex aspect-[3/4] h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-black/5 p-4 shadow-sm duration-500 hover:scale-95 sm:rounded-2xl sm:p-5 md:rounded-2xl md:p-5 dark:border-white/10',
          skewed && '-skew-x-[6deg]',
          isBlack ? 'bg-black dark:bg-white' : '',
          className,
        )}
        style={isBlack ? undefined : {
          backgroundColor: brand.color,
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
                className={cn(
                  'object-contain p-1.5 duration-500 group-hover:scale-105',
                  isBlack
                    ? 'brightness-0 invert dark:invert-0'
                    : 'brightness-0 invert drop-shadow-sm',
                )}
              />
            </div>
          ) : (
            <span
              className={cn(
                'px-2 text-center text-xs font-black tracking-widest uppercase sm:text-sm md:text-base',
                isBlack ? 'text-white dark:text-black' : 'text-white drop-shadow-sm',
              )}
            >
              {brand.name}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
