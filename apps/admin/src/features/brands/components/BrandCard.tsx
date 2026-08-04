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
  if (!hexColor) return true;
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

export function BrandCard({ brand, onClick, onToggleStatus }: BrandCardProps) {
  const [hasError, setHasError] = React.useState(false);
  const isActive = brand.isActive !== false;
  const isDark = isDarkColor(brand.color);

  return (
    <motion.div
      onClick={onClick}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-lg dark:bg-[#111111] ${
        isActive
          ? 'border-black/5 dark:border-white/5'
          : 'border-dashed border-red-500/40 opacity-75 grayscale-[30%] dark:border-red-400/40'
      }`}
    >
      <div
        className="relative flex aspect-square w-full items-center justify-center p-4 transition-colors"
        style={{ backgroundColor: brand.color ?? '#000000' }}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 z-10 bg-white opacity-0 mix-blend-overlay transition-opacity group-hover:opacity-20" />

        {/* Status indicator badge (top left) */}
        <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 rounded-full bg-black/70 px-2 py-0.5 backdrop-blur-md">
          <span
            className={`h-2 w-2 rounded-full ${
              isActive ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-red-400'
            }`}
          />
          <span className="text-[10px] font-bold tracking-wider text-white uppercase">
            {isActive ? 'Active' : 'Disabled'}
          </span>
        </div>

        {/* Quick Toggle Switch Button (top right) */}
        {onToggleStatus && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(e);
            }}
            className={`absolute top-2.5 right-2.5 z-20 flex h-6 w-11 items-center rounded-full p-0.5 shadow-md transition-colors focus:outline-none ${
              isActive ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-zinc-700 hover:bg-zinc-600'
            }`}
            title={isActive ? 'Click to disable brand' : 'Click to enable brand'}
            aria-label={isActive ? 'Disable brand' : 'Enable brand'}
          >
            <div
              className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                isActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        )}

        {!hasError && brand.logo ? (
          <Image
            fill
            src={brand.logo}
            alt={brand.name}
            onError={() => {
              setHasError(true);
            }}
            className={`object-contain p-4 drop-shadow-md ${isDark ? 'invert' : 'invert-0'}`}
          />
        ) : (
          <span className={`z-20 w-full text-center text-lg font-bold break-words ${isDark ? 'text-white' : 'text-black'}`}>
            {brand.name}
          </span>
        )}
      </div>

      {/* Card Footer with Brand Name & Status */}
      <div className="flex items-center justify-between border-t border-black/5 px-3 py-2 text-xs font-semibold dark:border-white/5">
        <span className="truncate text-black dark:text-white">{brand.name}</span>
        <span
          className={`shrink-0 text-[10px] font-bold uppercase ${
            isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
          }`}
        >
          {isActive ? 'Enabled' : 'Disabled'}
        </span>
      </div>
    </motion.div>
  );
}
