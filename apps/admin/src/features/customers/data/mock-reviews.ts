export interface Review {
  id: string;
  customerId: string;
  productId: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
}

export const mockReviews: Review[] = [
  {
    id: 'REV-001',
    customerId: 'CUST-001',
    productId: 'prod_1',
    productName: 'Oversized Vintage Wash Tee',
    rating: 5,
    comment: 'Absolutely love the fit and the material. Very comfortable!',
    date: '2026-04-25T10:00:00Z',
  },
  {
    id: 'REV-002',
    customerId: 'CUST-001',
    productId: 'prod_2',
    productName: 'Raw Denim Jacket',
    rating: 4,
    comment: 'Great quality, but it is a little stiff initially. Needs some breaking in.',
    date: '2026-03-12T14:30:00Z',
  },
  {
    id: 'REV-003',
    customerId: 'CUST-002',
    productId: 'prod_3',
    productName: 'Classic White Sneakers',
    rating: 5,
    comment: 'These are perfectly clean and minimal. Very happy with the purchase.',
    date: '2026-05-02T09:15:00Z',
  },
  {
    id: 'REV-004',
    customerId: 'CUST-004',
    productId: 'prod_4',
    productName: 'Pleated Wool Trousers',
    rating: 3,
    comment: 'They look great but the sizing runs slightly small around the waist.',
    date: '2026-04-10T11:45:00Z',
  },
  {
    id: 'REV-005',
    customerId: 'CUST-001',
    productId: 'prod_5',
    productName: 'Heavyweight Hoodie',
    rating: 5,
    comment: 'The perfect hoodie for winter. Thick, cozy, and the drop shoulder is exactly what I wanted.',
    date: '2026-05-15T08:20:00Z',
  },
  {
    id: 'REV-006',
    customerId: 'CUST-001',
    productId: 'prod_6',
    productName: 'Chunky Loafers',
    rating: 4,
    comment: 'Stylish, but the sole is a bit too heavy. Still wear them all the time though.',
    date: '2026-05-20T16:40:00Z',
  },
  {
    id: 'REV-007',
    customerId: 'CUST-002',
    productId: 'prod_7',
    productName: 'Knit Polo Shirt',
    rating: 5,
    comment: 'Amazing texture and it fits perfectly. Worth every penny.',
    date: '2026-05-28T12:00:00Z',
  }
];
