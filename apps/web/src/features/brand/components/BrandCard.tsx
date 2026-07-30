'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { Brand } from '@ff/schemas';

interface BrandCardProps {
  brand: Brand;
}

export const BrandCard = ({ brand }: BrandCardProps) => {
  const [hasError, setHasError] = React.useState(false);
  const isBlackBackground = brand.color === '#000000';

  return (
    <Link href={`/brands/${brand.slug}`} className="group block h-full w-full">
      <div
        className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl p-5 duration-500 hover:scale-95 sm:rounded-3xl sm:p-8 md:rounded-4xl"
        style={{
          backgroundColor: isBlackBackground ? 'var(--color-foreground)' : brand.color,
        }}
      >
        <div className="relative flex h-full w-full skew-x-[6deg] items-center justify-center">
          {!hasError && brand.logo ? (
            <Image
              src={brand.logo}
              alt={brand.name}
              width={200}
              height={200}
              onError={() => {
                setHasError(true);
              }}
              className={`max-h-[65%] max-w-[70%] object-contain duration-500 group-hover:scale-110 ${
                isBlackBackground ? 'invert dark:invert-0' : 'invert'
              }`}
            />
          ) : (
            <span
              className={`px-3 text-center text-sm font-black tracking-widest uppercase sm:text-lg md:text-xl ${
                isBlackBackground ? 'text-background' : 'text-white'
              }`}
            >
              {brand.name}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
