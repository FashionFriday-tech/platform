export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  gender: 'Men' | 'Women' | 'Unisex';
}

export const MOCK_CATEGORIES: ProductCategory[] = [
  { id: '1', name: 'Sneakers', slug: 'sneakers', image: '', productCount: 10, gender: 'Unisex' },
  { id: '2', name: 'Watches', slug: 'watches', image: '', productCount: 5, gender: 'Unisex' },
];
