import React from 'react';
import Image from 'next/image';

import { type Brand } from '@ff/schemas';
import { motion } from 'motion/react';

interface BrandCardProps {
  brand: Brand;
  onClick: () => void;
}

export function BrandCard({ brand, onClick }: BrandCardProps) {
  const [hasError, setHasError] = React.useState(false);
  const isHttpUrl = brand.logo?.startsWith('http');
  const isBlackBg = brand.color === '#000000';

  return (
    <motion.div
      onClick={onClick}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all hover:shadow-lg dark:border-white/5 dark:bg-[#111111]"
    >
      <div
        className="relative flex aspect-square w-full items-center justify-center p-4 transition-colors"
        style={{ backgroundColor: brand.color || '#000000' }}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 z-10 bg-white opacity-0 mix-blend-overlay transition-opacity group-hover:opacity-20" />

        {!hasError && brand.logo ? (
          <Image
            fill
            src={brand.logo}
            alt={brand.name}
            onError={() => {
              setHasError(true);
            }}
            className="object-contain p-4 drop-shadow-md invert"
          />
        ) : (
          <span className="z-20 w-full text-center text-lg font-bold break-words text-white">
            {brand.name}
          </span>
        )}
      </div>
    </motion.div>
  );
}
