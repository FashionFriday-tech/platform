import { type Brand } from '@ff/schemas';

/**
 * Resolves a brand name to its logo URL directly from the database brands.
 * Falls back to local public image asset (/images/brand-logos/${slug}.png) if needed.
 */
export function getBrandLogo(
  brandName?: string | string[] | null,
  brands?: Brand[],
): string | null {
  if (!brandName) {
    return null;
  }

  const rawName = Array.isArray(brandName) ? brandName[0] : brandName;
  if (!rawName || typeof rawName !== 'string') {
    return null;
  }

  const trimmed = rawName.trim();
  if (!trimmed) {
    return null;
  }

  const normalized = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Resolve directly from dynamic brands in database
  if (Array.isArray(brands) && brands.length > 0) {
    const brandFromDb = brands.find((b) => {
      const bNameNorm = b.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const bSlugNorm = (b.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return bNameNorm === normalized || bSlugNorm === normalized;
    });

    if (brandFromDb?.logo) {
      return brandFromDb.logo;
    }
  }

  // 2. Fallback to local image asset if brand is not yet in database
  if (normalized) {
    return `/images/brand-logos/${normalized}.png`;
  }

  return null;
}
