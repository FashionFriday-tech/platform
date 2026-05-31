import { fetcher } from '@/lib/api-client';
import { type Brand } from '@ff/schemas';

export interface CampaignBanner {
  id: string;
  title: string;
  mediaUrl: string;
  mediaType: string;
  linkUrl: string;
  placement: string;
  isActive: boolean;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  description?: string;
}

export interface WhatsappReview {
  id: string;
  imageUrl: string;
  rating?: number;
}

export async function getHomeCampaigns(): Promise<CampaignBanner[]> {
  try {
    const data = await fetcher<CampaignBanner[]>('/campaigns', {
      next: { tags: ['home-campaigns'] },
    });
    return data || [];
  } catch (error) {
    console.error('Failed to fetch home campaigns:', error);
    return [];
  }
}

export async function getHomeCollections(): Promise<Collection[]> {
  try {
    const data = await fetcher<Collection[]>('/collections', {
      next: { tags: ['home-collections'] },
    });
    return data || [];
  } catch (error) {
    console.error('Failed to fetch home collections:', error);
    return [];
  }
}

export async function getHomeBrands(): Promise<Brand[]> {
  try {
    const data = await fetcher<Brand[]>('/brands', {
      next: { tags: ['home-brands'] },
    });
    return data || [];
  } catch (error) {
    console.error('Failed to fetch home brands:', error);
    return [];
  }
}

export async function getHomeReviews(): Promise<WhatsappReview[]> {
  try {
    const data = await fetcher<WhatsappReview[]>('/whatsapp-reviews', {
      next: { tags: ['home-reviews'] },
    });
    return data || [];
  } catch (error) {
    console.error('Failed to fetch home reviews:', error);
    return [];
  }
}
