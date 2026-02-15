'use client';
import React from 'react';
import Link from 'next/link';

export const BrandCard = ({ brand }: { brand: any }) => {
  return (
    <Link href={`/brands/${brand.slug}`} className="group">
      <div
        className="group relative flex aspect-3/4 items-center justify-center overflow-hidden rounded-[2rem] duration-500 hover:scale-95 md:w-[250px]"
        style={{
          backgroundColor: brand.color === '#000000' ? 'var(--color-foreground)' : brand.color,
        }}
      >
        {' '}
        <img
          src={brand.logo}
          alt={brand.name}
          className={`w-40 object-contain duration-500 group-hover:scale-125 ${
            brand.color === '#000000' ? 'invert dark:invert-0' : 'invert'
          }`}
        />
      </div>
    </Link>
  );
};
