import { fetcher } from '@/lib/api-client';
import { BRAND_LOGOS, type Brand } from '@ff/schemas';

/**
 * Fetch all brands from the backend service.
 * Falls back to curated BRAND_LOGOS if backend array is empty or unavailable.
 */
export async function getBrands(): Promise<Brand[]> {
  try {
    const data = await fetcher<Brand[]>('/brands', {
      next: { revalidate: 3600, tags: ['brands'] },
    });
    return data && data.length > 0 ? data : BRAND_LOGOS;
  } catch (error) {
    console.error('Failed to fetch brands from backend:', error);
    return BRAND_LOGOS;
  }
}

/**
 * Fetch a single brand by slug.
 */
export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  try {
    const data = await fetcher<Brand>(`/brands/${slug}`);
    return data || BRAND_LOGOS.find((b) => b.slug === slug) || null;
  } catch (error) {
    console.error(`Failed to fetch brand [${slug}]:`, error);
    return BRAND_LOGOS.find((b) => b.slug === slug) || null;
  }
}

