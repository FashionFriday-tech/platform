export interface Category {
  id: number;
  title: string;
  count: string;
  image: string;
  href: string;
  tagline?: string;
}

export const categories: Category[] = [
  {
    id: 1,
    title: 'Footwear',
    count: '120+ Styles',
    image: '/images/categories/poster/sneakers.png',
    href: '/categories/sneakers',
    tagline: 'Street & Performance',
  },
  {
    id: 2,
    title: 'Apparel',
    count: '450+ Items',
    image: '/images/categories/poster/clothing.png',
    href: '/categories/apparel',
    tagline: 'Designer Essentials',
  },
  {
    id: 3,
    title: 'Audio Wear',
    count: '25+ Models',
    image: '/images/categories/poster/audio.png',
    href: '/categories/audio-wear',
    tagline: 'Immersive Style',
  },
  {
    id: 4,
    title: 'Timepieces',
    count: '60+ Models',
    image: '/images/categories/poster/watches.png',
    href: '/categories/watches',
    tagline: 'Precision Tech',
  },
  {
    id: 5,
    title: 'Eyewear',
    count: '40+ Styles',
    image: '/images/categories/poster/eyewear.png',
    href: '/categories/eyewear',
    tagline: 'Visionary Aesthetics',
  },
  {
    id: 6,
    title: 'Bags & Tech',
    count: '80+ Items',
    image: '/images/categories/poster/bag.png',
    href: '/categories/accessories',
    tagline: 'Utility & Carry',
  },
];
