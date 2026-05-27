export type BannerPlacement =
  | 'home-carousel'
  | 'home-categories'
  | 'products-list'
  | 'trending-products'
  | 'content-partners'
  | 'whatsapp-reviews';

export type MediaType = 'image' | 'video';

export interface CampaignBanner {
  id: string;
  title: string;
  mediaUrl: string;
  mediaType: MediaType;
  linkUrl: string;
  placement: BannerPlacement;
  isActive: boolean;
  createdAt: string;
}

export let MOCK_BANNERS: CampaignBanner[] = [
  {
    id: 'b1',
    title: 'Summer Collection',
    mediaUrl:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1200',
    mediaType: 'image',
    linkUrl: '/collections/summer',
    placement: 'home-carousel',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b3',
    title: 'Mid-page Promo',
    mediaUrl:
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1200',
    mediaType: 'image',
    linkUrl: '/products',
    placement: 'products-list',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const PLACEMENT_ASPECT_RATIOS: Record<BannerPlacement, string> = {
  'home-carousel': 'aspect-[2/3]',
  'home-categories': 'aspect-square',
  'products-list': 'aspect-[21/9]',
  'trending-products': 'aspect-[3/4]',
  'content-partners': 'aspect-[3/5]',
  'whatsapp-reviews': 'aspect-[9/16]',
};

export const PLACEMENT_LABELS: Record<BannerPlacement, string> = {
  'home-carousel': 'Home Carousel',
  'home-categories': 'Category Cards (Men & Women)',
  'products-list': 'Products List Banner',
  'trending-products': 'Trending Products Banner',
  'content-partners': 'Content Partners (Influencer Carousel)',
  'whatsapp-reviews': 'WhatsApp Reviews',
};

