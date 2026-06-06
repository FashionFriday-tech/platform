export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  brand?: string[];
  ogPrice: number;
  sellingPrice: number;
  mainImage: string;
  totalStock: number;
  sizes?: string[];
  colors?: string[];
  status?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  size: string;
  color: string;
  quantity: number;
  product: CartProduct;
}

export interface CartTotals {
  subtotal: number;
  originalSubtotal: number;
  discount: number;
  shipping: number;
  total: number;
  itemCount: number;
  totalQuantity: number;
}

export interface AddToCartInput {
  productId: string;
  size?: string;
  color?: string;
  quantity?: number;
  product?: CartProduct;
}

export interface SyncCartItem {
  productId: string;
  size: string;
  color: string;
  quantity: number;
}
