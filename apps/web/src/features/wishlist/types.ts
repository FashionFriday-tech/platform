export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  color: string;
  size: string;
  inStock: boolean;
  slug: string;
}
