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
    <Link href={`/brands/${brand.slug}`} className="group block w-full">
      <div
        className="group relative flex aspect-3/4 w-full items-center justify-center overflow-hidden rounded-3xl duration-500 hover:scale-95 sm:rounded-4xl p-4 sm:p-6"
        style={{
          backgroundColor: isBlackBackground ? 'var(--color-foreground)' : brand.color,
        }}
      >
        {!hasError && brand.logo ? (
          <div className="relative flex h-full w-full items-center justify-center">
            <Image
              src={brand.logo}
              alt={brand.name}
              width={160}
              height={160}
              onError={() => {
                setHasError(true);
              }}
              className={`max-h-[70%] max-w-[75%] object-contain duration-500 group-hover:scale-110 ${
                isBlackBackground ? 'invert dark:invert-0' : 'invert'
              }`}
            />
          </div>
        ) : (
          <span
            className={`px-3 text-center text-sm sm:text-lg md:text-xl font-black tracking-widest uppercase ${
              isBlackBackground ? 'text-background' : 'text-white'
            }`}
          >
            {brand.name}
          </span>
        )}
      </div>
    </Link>
  );
};
