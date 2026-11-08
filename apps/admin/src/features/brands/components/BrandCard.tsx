import React from 'react';
import Image from 'next/image';

import { type Brand } from '@ff/schemas';
import { motion } from 'motion/react';

interface BrandCardProps {
  brand: Brand;
  onClick: () => void;
  onToggleStatus?: (e: React.MouseEvent) => void;
}

function isDarkColor(hexColor?: string): boolean {
  if (!hexColor) {
    return true;
  }
  const hex = hexColor.replace('#', '');
  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  }
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  }
  return true;
}

export function BrandCard({ brand, onClick }: BrandCardProps) {
  const [hasImageError, setHasImageError] = React.useState(false);
  const [hasFallbackText, setHasFallbackText] = React.useState(false);
  const isActive = brand.isActive !== false;
  const isDark = isDarkColor(brand.color);

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
        className="relative flex aspect-square w-full items-center justify-center transition-colors"
        style={{ backgroundColor: brand.color ?? '#000000' }}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 z-10 bg-white opacity-0 mix-blend-overlay transition-opacity group-hover:opacity-20" />

        {/* Centered logo container fitted inside the card */}
        <div className="relative z-10 flex h-full w-full items-center justify-center p-6 sm:p-7 md:p-8">
          {brand.logo && !hasFallbackText ? (
            <div className="relative flex h-full w-full max-h-[82%] max-w-[84%] items-center justify-center">
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
                    isDark ? 'invert' : 'invert-0'
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
                    isDark ? 'invert' : 'invert-0'
                  }`}
                />
              )}
            </div>
          ) : (
            <span
              className={`text-center text-base font-black tracking-wider break-words uppercase sm:text-lg ${
                isDark ? 'text-white' : 'text-black'
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
              isActive
                ? 'bg-emerald-500 shadow-[0_0_6px_#10b981]'
                : 'bg-zinc-400 dark:bg-zinc-500'
            }`}
          />
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </motion.div>
  );
}
