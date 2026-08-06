import { type Brand, BRAND_LOGOS } from '@ff/schemas';

import { fetcher } from '@/lib/api-client';

/**
 * Fetch all brands from the backend service database.
 */
export async function getBrands(): Promise<Brand[]> {
  try {
    const data = await fetcher<Brand[]>('/brands', {
      next: { revalidate: 3600, tags: ['brands'] },
    });
    return Array.isArray(data) && data.length > 0 ? data : BRAND_LOGOS;
  } catch (error) {
    console.error('Failed to fetch brands from backend:', error);
    return BRAND_LOGOS;
  }
}

/**
 * Fetch a single brand by slug from the database with reliable fallback.
 */
export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  if (!slug || typeof slug !== 'string') {
    return null;
  }

  const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();
  const withoutHyphens = cleanSlug.replace(/-/g, '');

  try {
    const data = await fetcher<Brand>(`/brands/${encodeURIComponent(cleanSlug)}`);
    if (data && data.name) {
      return data;
    }
  } catch (error) {
    console.warn(`Failed to fetch brand [${cleanSlug}] from backend:`, error);
  }

  // Resilient fallback to BRAND_LOGOS from @ff/schemas
  const fallback = BRAND_LOGOS.find(
    (b) =>
      b.slug.toLowerCase() === cleanSlug ||
      b.name.toLowerCase() === cleanSlug ||
      b.slug.replace(/-/g, '') === withoutHyphens ||
      b.name.toLowerCase().replace(/\s+/g, '-') === cleanSlug,
  );

  return fallback || null;
}
