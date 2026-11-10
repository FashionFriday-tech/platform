'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { type ProductColorVariant } from '@ff/schemas';
import { ArrowDownIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

interface VariantDropdownProps {
  variants?: ProductColorVariant[];
  currentSlug: string;
  currentColor?: string;
}

export function extractColorLabel(variant: ProductColorVariant): string {
  // 1. If product name has a color suffix after " - " or " / "
  if (variant.name) {
    const parts = variant.name.split(/\s*[-–—/]\s*/);
    if (parts.length > 1) {
      const last = parts[parts.length - 1].trim();
      if (last.length > 0 && last.length <= 30) {
        return last;
      }
    }
  }
  // 2. Fall back to colors array if available
  if (variant.colors && variant.colors.length > 0 && variant.colors[0]) {
    const c = variant.colors[0];
    if (!c.startsWith('#')) {
      return c;
    }
  }
  // 3. Fallback to product name
  return variant.name || 'Colorway';
}

export default function VariantDropdown({
  variants = [],
  currentSlug,
}: VariantDropdownProps) {
  // If there are no color variants or only 1 item, don't show the tray
  if (!variants || variants.length <= 1) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-3.5 transition-all duration-300 dark:border-white/10 dark:bg-zinc-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-foreground text-[10px] font-black tracking-[0.2em] uppercase">
              Available Colors
            </span>
            <span className="text-foreground/70 rounded-full bg-black/5 px-2 py-0.5 text-[9px] font-bold dark:bg-white/10">
              {variants.length} Colors
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-foreground-muted hover:text-foreground flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase transition-colors"
          >
            <span>{isOpen ? 'Collapse' : 'Expand'}</span>
            <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
              <ArrowDownIcon size={14} />
            </motion.span>
          </button>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="no-scrollbar flex gap-3 overflow-x-auto pt-3.5 pb-1">
                {variants.map((v) => {
                  const isCurrent = v.slug === currentSlug;
                  const label = extractColorLabel(v);
                  const isSoldOut = (v.totalStock ?? 1) <= 0;

                  return (
                    <div
                      key={v.id || v.slug}
                      className="group flex shrink-0 flex-col items-center gap-1.5"
                    >
                      <Link
                        href={`/product/${v.slug}`}
                        prefetch
                        className={`relative flex items-center justify-center rounded-xl p-0.5 transition-all duration-200 ${
                          isCurrent
                            ? 'scale-105 ring-2 ring-black dark:ring-white'
                            : 'ring-1 ring-transparent opacity-75 hover:scale-100 hover:opacity-100 hover:ring-zinc-400 dark:hover:ring-zinc-600'
                        }`}
                        title={`${v.name}${isSoldOut ? ' (Sold Out)' : ''}`}
                      >
                        <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                          {v.mainImage ? (
                            <Image
                              src={v.mainImage}
                              width={56}
                              height={56}
                              className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 ${
                                isSoldOut ? 'grayscale opacity-60' : ''
                              }`}
                              alt={label}
                            />
                          ) : (
                            <div className="h-full w-full bg-zinc-200 dark:bg-zinc-700" />
                          )}

                          {isSoldOut && (
                            <span className="absolute inset-x-0 bottom-0 bg-rose-600/90 py-0.5 text-center text-[7px] font-black tracking-wider text-white uppercase">
                              Sold Out
                            </span>
                          )}
                        </div>
                      </Link>

                      <span
                        className={`max-w-[70px] truncate text-center text-[9px] font-bold tracking-wider uppercase transition-colors ${
                          isCurrent
                            ? 'text-foreground font-black'
                            : 'text-foreground-muted group-hover:text-foreground'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
