'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// --- Define Brand Interface ---
interface Brand {
  slug: string;
  name: string;
  logo: string;
  color: string;
}

interface BrandCardProps {
  brand: Brand;
}

export const BrandCard = ({ brand }: BrandCardProps) => {
  const isBlackBackground = brand.color === '#000000';

  return (
    <Link href={`/brands/${brand.slug}`} className="group">
      <div
        className="aspect-3/4 rounded-4xl md:w-62.5 group relative flex items-center justify-center overflow-hidden duration-500 hover:scale-95"
        style={{
          backgroundColor: isBlackBackground ? 'var(--color-foreground)' : brand.color,
        }}
      >
        <Image
          src={brand.logo}
          alt={brand.name}
          width={160}
          height={160}
          className={`object-contain duration-500 group-hover:scale-125 ${
            isBlackBackground ? 'invert dark:invert-0' : 'invert'
          }`}
        />
      </div>
    </Link>
  );
};
