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
    <Link href={`/brands/${brand.slug}`} className="group">
      <div
        className="group relative flex aspect-3/4 items-center justify-center overflow-hidden rounded-4xl duration-500 hover:scale-95 md:w-62.5"
        style={{
          backgroundColor: isBlackBackground ? 'var(--color-foreground)' : brand.color,
        }}
      >
        {!hasError && brand.logo ? (
          <Image
            src={brand.logo}
            alt={brand.name}
            width={160}
            height={160}
            onError={() => {
              setHasError(true);
            }}
            className={`object-contain duration-500 group-hover:scale-125 ${
              isBlackBackground ? 'invert dark:invert-0' : 'invert'
            }`}
          />
        ) : (
          <span
            className={`px-4 text-center text-xl font-black tracking-widest uppercase ${
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
