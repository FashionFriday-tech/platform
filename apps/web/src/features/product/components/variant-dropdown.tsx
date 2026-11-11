'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { MAJOR_COLORS, type ProductColorVariant } from '@ff/schemas';
import { ArrowDownIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

interface VariantDropdownProps {
  variants?: ProductColorVariant[];
  currentSlug: string;
  currentColor?: string;
}

// Build Hex-to-Name and Name-to-Hex lookup maps once for ultra-fast performance
const HEX_TO_NAME = new Map<string, string>();
const NAME_TO_HEX = new Map<string, string>();

for (const c of MAJOR_COLORS) {
  const normHex = c.hex.trim().toUpperCase();
  const normName = c.name.trim();
  if (!HEX_TO_NAME.has(normHex)) {
    HEX_TO_NAME.set(normHex, normName);
  }
  const lowerName = normName.toLowerCase();
  if (!NAME_TO_HEX.has(lowerName)) {
    NAME_TO_HEX.set(lowerName, normHex);
  }
}

// Common single-word color keywords for heuristic matching against product titles
const KNOWN_COLOR_KEYWORDS = [
  'Yellow',
  'Grey',
  'Gray',
  'Black',
  'White',
  'Red',
  'Blue',
  'Green',
  'Pink',
  'Beige',
  'Navy',
  'Purple',
  'Orange',
  'Brown',
  'Gold',
  'Silver',
  'Olive',
  'Cream',
  'Tan',
  'Mint',
  'Maroon',
  'Teal',
  'Sage',
  'Coral',
  'Lilac',
  'Lavender',
  'Burgundy',
  'Khaki',
  'Sand',
  'Multicolor',
  'Multi',
];

/**
 * Intelligent clean color label extractor.
 * NEVER outputs full product names like "CLASSIC CLOG CROCS YELLOW".
 * Accurately extracts clean colorways such as "Yellow", "Grey", "Black / White", etc.
 */
export function extractColorLabel(variant: ProductColorVariant): string {
  // 1. Check variant colors array
  if (Array.isArray(variant.colors) && variant.colors.length > 0) {
    const resolvedNames: string[] = [];

    for (const raw of variant.colors) {
      if (!raw) continue;
      const trimmed = raw.trim();

      // Case A: Hex code (e.g. "#FFFF00" or "FFFF00")
      if (trimmed.startsWith('#') || /^[0-9A-Fa-f]{6}$/.test(trimmed)) {
        const hex = (trimmed.startsWith('#') ? trimmed : `#${trimmed}`).toUpperCase();
        const matchedName = HEX_TO_NAME.get(hex);
        if (matchedName) {
          resolvedNames.push(matchedName);
          continue;
        }
        // Approximate basic fallback if not in dictionary
        resolvedNames.push(approximateHexColorName(hex));
        continue;
      }

      // Case B: Already a readable color name
      if (trimmed.length > 0 && trimmed.length <= 25) {
        resolvedNames.push(capitalizeWords(trimmed));
      }
    }

    if (resolvedNames.length > 0) {
      // Deduplicate while maintaining order
      const uniqueNames = Array.from(new Set(resolvedNames));
      return uniqueNames.slice(0, 2).join(' / ');
    }
  }

  // 2. Extract color suffix from name if separated by delimiter (e.g. "Dunk Low - University Blue")
  if (variant.name) {
    const parts = variant.name.split(/\s*[-–—/]\s*/);
    if (parts.length > 1) {
      const suffix = parts[parts.length - 1]?.trim();
      if (suffix && suffix.length > 0 && suffix.length <= 24) {
        return capitalizeWords(suffix);
      }
    }

    // 3. Match known color words at the end of the product title (e.g. "CLASSIC CLOG CROCS YELLOW" -> "Yellow")
    for (const color of KNOWN_COLOR_KEYWORDS) {
      const regex = new RegExp(`\\b${color}\\b`, 'i');
      if (regex.test(variant.name)) {
        return color;
      }
    }
  }

  // 4. Safe clean fallback (never raw product title)
  return 'Colorway';
}

/**
 * Extracts normalized hex color array for rendering color swatches.
 */
export function extractColorHexes(variant: ProductColorVariant): string[] {
  const hexes: string[] = [];

  if (Array.isArray(variant.colors)) {
    for (const c of variant.colors) {
      if (!c) continue;
      const trimmed = c.trim();
      if (trimmed.startsWith('#')) {
        hexes.push(trimmed);
      } else if (/^[0-9A-Fa-f]{6}$/.test(trimmed)) {
        hexes.push(`#${trimmed}`);
      } else {
        const mappedHex = NAME_TO_HEX.get(trimmed.toLowerCase());
        if (mappedHex) {
          hexes.push(mappedHex);
        }
      }
    }
  }

  if (hexes.length === 0 && variant.name) {
    for (const color of KNOWN_COLOR_KEYWORDS) {
      const regex = new RegExp(`\\b${color}\\b`, 'i');
      if (regex.test(variant.name)) {
        const mappedHex = NAME_TO_HEX.get(color.toLowerCase());
        if (mappedHex) {
          hexes.push(mappedHex);
          break;
        }
      }
    }
  }

  return hexes.slice(0, 2);
}

function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function approximateHexColorName(hex: string): string {
  // Simple RGB luminosity / hue approximation
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;

  if (r < 35 && g < 35 && b < 35) return 'Black';
  if (r > 220 && g > 220 && b > 220) return 'White';
  if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20) return 'Grey';
  if (r > g && r > b) return r > 180 && g > 180 ? 'Yellow' : 'Red';
  if (g > r && g > b) return 'Green';
  if (b > r && b > g) return 'Blue';
  return 'Colorway';
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

  // Determine current active variant's color label to show in header
  const activeVariant = useMemo(
    () => variants.find((v) => v.slug === currentSlug) ?? variants[0],
    [variants, currentSlug],
  );
  const activeColorLabel = activeVariant ? extractColorLabel(activeVariant) : '';

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-3.5 transition-all duration-300 dark:border-white/10 dark:bg-zinc-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-foreground text-[10px] font-black tracking-[0.2em] uppercase">
              Available Colors
            </span>
            {activeColorLabel && (
              <span className="text-foreground/90 font-bold text-[10px] tracking-wide">
                • {activeColorLabel}
              </span>
            )}
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
                  const hexes = extractColorHexes(v);
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
                            ? 'scale-105 ring-2 ring-black shadow-md dark:ring-white'
                            : 'ring-1 ring-transparent opacity-80 hover:scale-100 hover:opacity-100 hover:ring-zinc-400 dark:hover:ring-zinc-600'
                        }`}
                        title={`${label} (${v.name})${isSoldOut ? ' - Sold Out' : ''}`}
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

                      {/* Clean color label with visual swatch dot */}
                      <div className="flex max-w-[85px] items-center justify-center gap-1 px-0.5">
                        {hexes.length > 0 && (
                          <span
                            className="h-2 w-2 shrink-0 rounded-full border border-black/15 shadow-xs dark:border-white/20"
                            style={{
                              background:
                                hexes.length > 1
                                  ? `linear-gradient(135deg, ${hexes[0]} 50%, ${hexes[1]} 50%)`
                                  : hexes[0],
                            }}
                          />
                        )}
                        <span
                          className={`truncate text-center text-[10px] font-bold tracking-tight uppercase transition-colors ${
                            isCurrent
                              ? 'text-foreground font-black'
                              : 'text-foreground-muted group-hover:text-foreground'
                          }`}
                        >
                          {label}
                        </span>
                      </div>
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

