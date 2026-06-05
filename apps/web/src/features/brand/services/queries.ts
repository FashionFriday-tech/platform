import { type Brand } from '@ff/schemas';

import { fetcher } from '@/lib/api-client';

/**
 * Fetch all brands from the backend service database.
 */
export async function getBrands(): Promise<Brand[]> {
  try {
    const data = await fetcher<Brand[]>('/brands', {
      next: { revalidate: 3600, tags: ['brands'] },
    });
    return data || [];
  } catch (error) {
    console.error('Failed to fetch brands from backend:', error);
    return [];
  }
}

/**
 * Fetch a single brand by slug from the database.
 */
export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  try {
    const data = await fetcher<Brand>(`/brands/${slug}`);
    return data || null;
  } catch (error) {
    console.error(`Failed to fetch brand [${slug}]:`, error);
    return null;
  }
}
