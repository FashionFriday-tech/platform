import { fetcher } from '@/lib/api-client';

import type { CatalogueCampaignBanner } from '../hooks/use-catalogue-campaigns';

export type { CatalogueCampaignBanner };

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

/**
 * Fetch active catalogue ad campaigns from backend database.
 */
export async function getCatalogueCampaigns(): Promise<CatalogueCampaignBanner[]> {
  try {
    const data = await fetcher<CatalogueCampaignBanner[]>('/campaigns', {
      cache: 'no-store',
      next: { tags: ['catalogue-campaigns', 'home-campaigns'], revalidate: 0 },
    });
    if (!Array.isArray(data)) {
      return [];
    }
    return data.filter(
      (b) => (b.placement === 'products-list' || b.placement === 'catalogue') && b.isActive,
    );
  } catch (error) {
    console.error('Failed to fetch catalogue campaigns:', error);
    return [];
  }
}
