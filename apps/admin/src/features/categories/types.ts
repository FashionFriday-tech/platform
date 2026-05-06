export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  gender: 'Men' | 'Women' | 'Kids' | 'Unisex';
}

export const MOCK_CATEGORIES: ProductCategory[] = [
  // Men
  {
    id: 'cat_men_footwear',
    name: 'Footwear',
    slug: 'men-footwear',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop',
    productCount: 45,
    gender: 'Men'
  },
  {
    id: 'cat_men_clothing',
    name: 'Clothing',
    slug: 'men-clothing',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1000&auto=format&fit=crop',
    productCount: 120,
    gender: 'Men'
  },
  {
    id: 'cat_men_watches',
    name: 'Watches',
    slug: 'men-watches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
    productCount: 30,
    gender: 'Men'
  },
  {
    id: 'cat_men_other',
    name: 'Other',
    slug: 'men-other',
    image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=1000&auto=format&fit=crop',
    productCount: 15,
    gender: 'Men'
  },
  // Women
  {
    id: 'cat_women_footwear',
    name: 'Footwear',
    slug: 'women-footwear',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop',
    productCount: 65,
    gender: 'Women'
  },
  {
    id: 'cat_women_clothing',
    name: 'Clothing',
    slug: 'women-clothing',
    image: 'https://images.unsplash.com/photo-1550614000-4b95dd2475ec?q=80&w=1000&auto=format&fit=crop',
    productCount: 150,
    gender: 'Women'
  },
  {
    id: 'cat_women_accessories',
    name: 'Accessories',
    slug: 'women-accessories',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1000&auto=format&fit=crop',
    productCount: 40,
    gender: 'Women'
  },
  // Kids
  {
    id: 'cat_kids_clothing',
    name: 'Clothing',
    slug: 'kids-clothing',
    image: 'https://images.unsplash.com/photo-1514090281788-b77823b7e716?q=80&w=1000&auto=format&fit=crop',
    productCount: 89,
    gender: 'Kids'
  },
  // Unisex
  {
    id: 'cat_unisex_other',
    name: 'Other',
    slug: 'unisex-other',
    image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1000&auto=format&fit=crop',
    productCount: 20,
    gender: 'Unisex'
  }
];
