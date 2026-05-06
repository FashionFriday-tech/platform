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

export const mockReviews: Review[] = [
  {
    id: 'REV-001',
    customerId: 'CUST-001',
    productId: 'prod_1',
    productName: 'Oversized Vintage Wash Tee',
    productImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80',
    rating: 5,
    comment: 'Absolutely love the fit and the material. Very comfortable!',
    date: '2026-04-25T10:00:00Z',
    isVerified: true,
    isFeatured: true,
  },
  {
    id: 'REV-002',
    customerId: 'CUST-001',
    productId: 'prod_2',
    productName: 'Raw Denim Jacket',
    productImage: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=200&q=80',
    rating: 4,
    comment: 'Great quality, but it is a little stiff initially. Needs some breaking in.',
    date: '2026-03-12T14:30:00Z',
    isVerified: true,
  },
  {
    id: 'REV-003',
    customerId: 'CUST-002',
    productId: 'prod_3',
    productName: 'Classic White Sneakers',
    productImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&q=80',
    rating: 5,
    comment: 'These are perfectly clean and minimal. Very happy with the purchase.',
    date: '2026-05-02T09:15:00Z',
    isVerified: true,
    isFeatured: true,
  },
  {
    id: 'REV-004',
    customerId: 'CUST-004',
    productId: 'prod_4',
    productName: 'Pleated Wool Trousers',
    productImage: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&q=80',
    rating: 3,
    comment: 'They look great but the sizing runs slightly small around the waist.',
    date: '2026-04-10T11:45:00Z',
    isVerified: false,
  },
  {
    id: 'REV-005',
    customerId: 'CUST-001',
    productId: 'prod_5',
    productName: 'Heavyweight Hoodie',
    productImage: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=80',
    rating: 5,
    comment: 'The perfect hoodie for winter. Thick, cozy, and the drop shoulder is exactly what I wanted.',
    date: '2026-05-15T08:20:00Z',
    isVerified: true,
  },
  {
    id: 'REV-006',
    customerId: 'CUST-001',
    productId: 'prod_6',
    productName: 'Chunky Loafers',
    productImage: 'https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=200&q=80',
    rating: 4,
    comment: 'Stylish, but the sole is a bit too heavy. Still wear them all the time though.',
    date: '2026-05-20T16:40:00Z',
    isVerified: false,
  },
  {
    id: 'REV-007',
    customerId: 'CUST-002',
    productId: 'prod_7',
    productName: 'Knit Polo Shirt',
    productImage: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=200&q=80',
    rating: 5,
    comment: 'Amazing texture and it fits perfectly. Worth every penny.',
    date: '2026-05-28T12:00:00Z',
    isVerified: true,
  }
];
