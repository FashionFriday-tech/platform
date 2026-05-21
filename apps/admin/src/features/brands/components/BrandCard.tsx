import React from 'react';
import Image from 'next/image';

import { type Brand } from '@ff/schemas';
import { motion } from 'motion/react';

interface BrandCardProps {
  brand: Brand;
  onClick: () => void;
}

export function BrandCard({ brand, onClick }: BrandCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all hover:shadow-lg dark:border-white/5 dark:bg-[#111111]"
    >
      <div
        className="relative flex aspect-square w-full items-center justify-center transition-colors"
        style={{ backgroundColor: brand.color || '#000000' }}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 z-10 bg-white opacity-0 mix-blend-overlay transition-opacity group-hover:opacity-20" />
        <Image
          fill
          src={brand.logo}
          alt={brand.name}
          className="object-cover drop-shadow-md"
        />
      </div>
    </motion.div>
  );
}
