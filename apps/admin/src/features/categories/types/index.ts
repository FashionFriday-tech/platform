export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  gender: 'Men' | 'Women' | 'Unisex';
}

export const MOCK_CATEGORIES: ProductCategory[] = [];
