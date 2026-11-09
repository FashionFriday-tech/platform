import React from 'react';
import Image from 'next/image';

import { type Brand } from '@ff/schemas';
import { motion } from 'motion/react';

interface BrandCardProps {
  brand: Brand;
  onClick: () => void;
  onToggleStatus?: (e: React.MouseEvent) => void;
}

function isBlackColor(color?: string): boolean {
  if (!color) {
    return true;
  }
  const c = color.trim().toLowerCase();
  return c === '#000000' || c === '#000' || c === 'black';
}

export function BrandCard({ brand, onClick }: BrandCardProps) {
  const [hasImageError, setHasImageError] = React.useState(false);
  const [hasFallbackText, setHasFallbackText] = React.useState(false);
  const isActive = brand.isActive !== false;
  const isBlack = isBlackColor(brand.color);

  return (
    <motion.div
      onClick={onClick}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-lg dark:bg-[#111111] ${
        isActive
          ? 'border-black/5 dark:border-white/5'
          : 'border-dashed border-zinc-400/30 opacity-75 grayscale-[20%] dark:border-zinc-700'
      }`}
    >
      <div
        className={`relative flex aspect-square w-full items-center justify-center transition-colors ${
          isBlack ? 'bg-black dark:bg-white' : ''
        }`}
        style={isBlack ? undefined : { backgroundColor: brand.color }}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 z-10 bg-white opacity-0 mix-blend-overlay transition-opacity group-hover:opacity-20" />

        {/* Centered logo container fitted inside the card */}
        <div className="relative z-10 flex h-full w-full items-center justify-center p-6 sm:p-7 md:p-8">
          {brand.logo && !hasFallbackText ? (
            <div className="relative flex h-full max-h-[82%] w-full max-w-[84%] items-center justify-center">
              {!hasImageError ? (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  onError={() => {
                    setHasImageError(true);
                  }}
                  className={`object-contain p-2 drop-shadow-sm transition-transform duration-300 group-hover:scale-105 ${
                    isBlack ? 'brightness-0 invert dark:invert-0' : 'brightness-0 invert'
                  }`}
                />
              ) : (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  onError={() => {
                    setHasFallbackText(true);
                  }}
                  className={`h-full w-full object-contain p-2 drop-shadow-sm transition-transform duration-300 group-hover:scale-105 ${
                    isBlack ? 'brightness-0 invert dark:invert-0' : 'brightness-0 invert'
                  }`}
                />
              )}
            </div>
          ) : (
            <span
              className={`text-center text-base font-black tracking-wider break-words uppercase drop-shadow-sm sm:text-lg ${
                isBlack ? 'text-white dark:text-black' : 'text-white'
              }`}
            >
              {brand.name}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer with Brand Name & Active/Inactive Status */}
      <div className="flex items-center justify-between border-t border-black/5 bg-white/60 px-4 py-3 backdrop-blur-xs dark:border-white/5 dark:bg-white/[0.02]">
        <span
          className="truncate text-xs font-bold text-black sm:text-sm dark:text-white"
          title={brand.name}
        >
          {brand.name}
        </span>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase sm:text-[11px] ${
            isActive
              ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
              : 'bg-zinc-500/10 text-zinc-500 dark:bg-zinc-500/15 dark:text-zinc-400'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isActive ? 'bg-emerald-500 shadow-[0_0_6px_#10b981]' : 'bg-zinc-400 dark:bg-zinc-500'
            }`}
          />
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </motion.div>
  );
}
