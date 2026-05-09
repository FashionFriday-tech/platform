export interface Review {
  id: string;
  customerId: string;
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  date: string;
  isVerified?: boolean;
  isFeatured?: boolean;
}
