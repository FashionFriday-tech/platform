import { fetcher } from '@/lib/api-client';

export interface QualityItem {
  id: string;
  name: string;
  description?: string | null;
  categories: string[];
  position?: number;
  productCount?: number;
}

export interface ColorItem {
  id: string;
  name: string;
  hex: string;
}

/**
 * Fetch all available qualities dynamically from backend database.
 */
export async function getQualities(): Promise<QualityItem[]> {
  try {
    const data = await fetcher<QualityItem[]>('/qualities', {
      next: { revalidate: 3600, tags: ['qualities'] },
    });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch qualities from backend:', error);
    return [];
  }
}

/**
 * Fetch all available colors dynamically from backend database.
 */
export async function getColors(): Promise<ColorItem[]> {
  try {
    const data = await fetcher<ColorItem[]>('/colors', {
      next: { revalidate: 3600, tags: ['colors'] },
    });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch colors from backend:', error);
    return [];
  }
}
