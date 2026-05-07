export type BannerPlacement = 
  | 'home-carousel' 
  | 'home-grid-large' 
  | 'home-grid-small-1' 
  | 'home-grid-small-2' 
  | 'products-list'
  | 'trending-products';

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
    mediaUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1200',
    mediaType: 'image',
    linkUrl: '/collections/summer',
    placement: 'home-carousel',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b2',
    title: 'Accessories Drop',
    mediaUrl: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=800',
    mediaType: 'image',
    linkUrl: '/categories/accessories',
    placement: 'home-grid-large',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b3',
    title: 'Mid-page Promo',
    mediaUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1200',
    mediaType: 'image',
    linkUrl: '/products',
    placement: 'products-list',
    isActive: true,
    createdAt: new Date().toISOString(),
  }
];

export const addBanner = (banner: CampaignBanner) => {
  MOCK_BANNERS = [...MOCK_BANNERS, banner];
};

export const updateBanner = (id: string, updates: Partial<CampaignBanner>) => {
  MOCK_BANNERS = MOCK_BANNERS.map(b => b.id === id ? { ...b, ...updates } : b);
};

export const deleteBanner = (id: string) => {
  MOCK_BANNERS = MOCK_BANNERS.filter(b => b.id !== id);
};

export const PLACEMENT_ASPECT_RATIOS: Record<BannerPlacement, string> = {
  'home-carousel': 'aspect-[21/9]',
  'home-grid-large': 'aspect-square',
  'home-grid-small-1': 'aspect-video',
  'home-grid-small-2': 'aspect-video',
  'products-list': 'aspect-[21/9]',
  'trending-products': 'aspect-[3/4]',
};

export const PLACEMENT_LABELS: Record<BannerPlacement, string> = {
  'home-carousel': 'Home Carousel',
  'home-grid-large': 'Home Grid (Large)',
  'home-grid-small-1': 'Home Grid (Small 1)',
  'home-grid-small-2': 'Home Grid (Small 2)',
  'products-list': 'Products List Banner',
  'trending-products': 'Trending Products Banner',
};
