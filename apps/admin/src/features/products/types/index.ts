export type ProductStatus = 'Active' | 'Inactive' | 'Draft';

export interface Product {
  id: string;
  name: string;
  sku: string;
  costPrice: number;
  originalPrice: number;
  sellingPrice: number;
  stock: number;
  maxStock: number;
  status: ProductStatus;
  category: string;
  store: string;
  variants: string[];
  sales: number;
  dateAdded: string;
  imageUrl?: string;
  description?: string;
  quality?: string;
  brand?: string;
  color?: string;
  gender?: string;
  tags?: string[];
  seoTitle?: string;
  seoDesc?: string;
  seoSlug?: string;
  images?: string[];
  videoLink?: string;
}

export type SortOption =
  | 'Default'
  | 'Price: Low to High'
  | 'Price: High to Low'
  | 'Name: A to Z'
  | 'Name: Z to A';
export type StatusFilter = 'All Status' | 'Active' | 'Inactive' | 'Draft';
export type ViewMode = 'list' | 'grid';
export type ColumnId =
  | 'Category'
  | 'Cost Price'
  | 'OG Price'
  | 'Variants'
  | 'Sales'
  | 'Date Added'
  | 'Stock';

export interface AdvancedFilters {
  categories: Set<string>;
  statuses: Set<ProductStatus>;
  stores: Set<string>;
  minPrice: string;
  maxPrice: string;
}
