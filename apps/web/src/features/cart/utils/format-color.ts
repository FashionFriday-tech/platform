import { MAJOR_COLORS } from '@ff/schemas';

export interface RgbColor {
  r: number;
  g: number;
  b: number;
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
 * Check if a color is light (high luminance) for UI contrast (e.g. black checkmark vs white checkmark).
 */
export function isLightColor(colorStr?: string | null): boolean {
  if (!colorStr) {
    return false;
  }
  const trimmed = colorStr.trim().toLowerCase();
  if (
    trimmed === 'white' ||
    trimmed === 'cream' ||
    trimmed === 'ivory' ||
    trimmed === 'beige' ||
    trimmed === 'yellow' ||
    trimmed === 'apricot' ||
    trimmed === 'silver'
  ) {
    return true;
  }
  let rgb = hexToRgb(trimmed);
  if (!rgb) {
    const match = MAJOR_COLORS.find((c) => c.name.toLowerCase() === trimmed);
    if (match) {
      rgb = hexToRgb(match.hex);
    }
  }
  if (!rgb) {
    return false;
  }
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.65;
}

/**
 * Format a raw color code/name for customer display.
 * Resolves hex values (e.g. #F5F5DC -> 'Beige') and filters out generic 'Standard'.
 */
export function formatColorLabel(color?: string | null): string {
  if (!color) {
    return '';
  }
  const trimmed = color.trim();
  if (trimmed.toLowerCase() === 'standard') {
    return '';
  }

  // If already matches a named color in MAJOR_COLORS exactly (e.g. "black" -> "Black")
  const namedMatch = MAJOR_COLORS.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
  if (namedMatch) {
    return namedMatch.name;
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

  // If string starts with '#'
  if (trimmed.startsWith('#')) {
    return findClosestColorName(trimmed);
  }

  // Title-case single or multi-word strings (e.g. "dark green" -> "Dark Green")
  return trimmed
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
