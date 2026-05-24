export interface CollectionItem {
  id: number;
  title: string;
  count: string;
  image: string;
  href: string;
}

export const collections: CollectionItem[] = [
  {
    id: 1,
    title: 'Streetwear Essentials',
    count: '85+ Items',
    image: '/images/categories/poster/clothing.png',
    href: '/collections/streetwear-essentials',
  },
  {
    id: 2,
    title: 'Y2K Style',
    count: '40+ Items',
    image: '/images/categories/poster/eyewear.png',
    href: '/collections/y2k-style',
  },
  {
    id: 3,
    title: 'Summer Drop',
    count: '60+ Items',
    image: '/images/categories/poster/sneakers.png',
    href: '/collections/summer-drop',
  },
  {
    id: 4,
    title: 'Luxury Elite',
    count: '30+ Items',
    image: '/images/categories/poster/watches.png',
    href: '/collections/luxury-elite',
  },
  {
    id: 5,
    title: 'Performance Active',
    count: '50+ Items',
    image: '/images/categories/poster/audio.png',
    href: '/collections/performance-active',
  },
];
