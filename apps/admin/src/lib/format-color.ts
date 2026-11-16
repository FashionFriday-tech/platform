import { MAJOR_COLORS } from '@ff/schemas';

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export const KNOWN_QUALITIES = [
  'UA',
  'SEMI UA',
  '10A',
  '7AA',
  '7A',
  '6A',
  '5A',
  'ORIGINAL',
  'PREMIUM',
  'STANDARD',
  'SURPLUS',
  'FIRST COPY',
  'MASTER COPY',
];

/**
 * Checks whether a string represents a quality tier rather than a color.
 */
export function isQualityValue(val?: string | null): boolean {
  if (!val) {
    return false;
  }
  const normalized = val.trim().toUpperCase();
  return KNOWN_QUALITIES.includes(normalized);
}

/**
 * Parse a hex color string (#fff or #ffffff) to RGB.
 */
export function hexToRgb(hex: string): RgbColor | null {
  const clean = hex.replace(/^#/, '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return null;
    }
    return { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return null;
    }
    return { r, g, b };
  }
  return null;
}

/**
 * Human-eye weighted color distance (Redmean formula)
 */
export function colorDistance(c1: RgbColor, c2: RgbColor): number {
  const rmean = (c1.r + c2.r) / 2;
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;
  return Math.sqrt((2 + rmean / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rmean) / 256) * db * db);
}

/**
 * Find the closest named color from MAJOR_COLORS for any arbitrary hex.
 */
export function findClosestColorName(hex: string): string {
  const targetRgb = hexToRgb(hex);
  if (!targetRgb) {
    return hex;
  }

  // 1. Exact match check
  const exact = MAJOR_COLORS.find((c) => c.hex.toLowerCase() === hex.toLowerCase());
  if (exact) {
    return exact.name;
  }

  // 2. Minimum weighted Euclidean distance
  let minDiff = Infinity;
  let bestName = hex;

  for (const c of MAJOR_COLORS) {
    const rgb = hexToRgb(c.hex);
    if (!rgb) {
      continue;
    }
    const diff = colorDistance(targetRgb, rgb);
    if (diff < minDiff) {
      minDiff = diff;
      bestName = c.name;
    }
  }

  return bestName;
}

/**
 * Format a raw color code/name for customer/admin display.
 * Resolves hex values (e.g. #C0C0C0 -> 'Silver', #000000 -> 'Black') and filters out generic 'Standard'.
 */
export function formatColorLabel(color?: string | null): string {
  if (!color) {
    return '';
  }
  const trimmed = color.trim();
  if (trimmed.toLowerCase() === 'standard' || isQualityValue(trimmed)) {
    return '';
  }

  // If already matches a named color in MAJOR_COLORS exactly (e.g. "black" -> "Black")
  const namedMatch = MAJOR_COLORS.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
  if (namedMatch) {
    return namedMatch.name;
  }

  // If string starts with '#'
  if (trimmed.startsWith('#')) {
    return findClosestColorName(trimmed);
  }

  // If text contains a parenthetical hex like "Black (#000000)" or "Blue #0000FF"
  if (/#[0-9a-fA-F]{3,6}/.test(trimmed)) {
    const cleaned = trimmed.replace(/\s*\([#0-9a-fA-F]+\)|\s*#[0-9a-fA-F]+/g, '').trim();
    if (cleaned.length > 0) {
      const cleanedMatch = MAJOR_COLORS.find((c) => c.name.toLowerCase() === cleaned.toLowerCase());
      return cleanedMatch ? cleanedMatch.name : cleaned;
    }
    const hexMatch = /#[0-9a-fA-F]{3,6}/.exec(trimmed);
    if (hexMatch) {
      return findClosestColorName(hexMatch[0]);
    }
  }

  // Title-case single or multi-word strings (e.g. "dark green" -> "Dark Green")
  return trimmed
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Robust helper to resolve { color, quality } for an OrderItem.
 * Ensures quality is never mislabeled as color and hex codes are converted to friendly names.
 */
export function resolveItemColorAndQuality(item: {
  color?: string | null;
  quality?: string | null;
  colors?: string[] | null;
  product?: { quality?: string | null; colors?: string[] | null } | null;
}): { color: string; quality: string } {
  const productQuality = item.quality || item.product?.quality || '';
  const rawColor = item.color?.trim() || '';

  let finalQuality = productQuality;
  let finalColor = '';

  // If rawColor matches known quality (e.g. "7AA") or matches product quality
  if (
    isQualityValue(rawColor) ||
    (productQuality && rawColor.toUpperCase() === productQuality.toUpperCase())
  ) {
    finalQuality = rawColor || productQuality;
    finalColor = '';
  } else {
    finalColor = formatColorLabel(rawColor);
  }

  // If color is empty but product has colors defined, fallback to product's primary color
  if (!finalColor) {
    const productColors = item.colors || item.product?.colors;
    if (Array.isArray(productColors) && productColors.length > 0 && productColors[0]) {
      finalColor = formatColorLabel(productColors[0]);
    }
  }

  return {
    color: finalColor,
    quality: finalQuality,
  };
}
