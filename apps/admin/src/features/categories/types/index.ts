export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  gender: 'Men' | 'Women' | 'Unisex';
  sizes?: string[];
}

export const MOCK_CATEGORIES: ProductCategory[] = [];
