import { Product } from '../types';

const mockProducts: Product[] = [
  {
    id: '081794MT',
    name: 'Oversized Heritage Washed',
    sku: '081794MT',
    costPrice: 20.0,
    originalPrice: 64.15,
    sellingPrice: 50.0,
    stock: 900,
    maxStock: 1000,
    status: 'Active',
    category: 'Outerwear',
    store: 'Odama Store',
    variants: ['S', 'M', 'L', 'XL'],
    sales: 1245,
    dateAdded: '2023-11-12',
    description:
      'Premium oversized heritage washed jacket featuring a relaxed fit, dropped shoulders, and distinctive pocket detailing. Perfect for layering in colder weather. Crafted from high-quality sustainable materials with a worn-in aesthetic.',
    quality: 'Premium',
    brand: 'Heritage',
    color: 'Washed Black',
    gender: 'Unisex',
    tags: ['jacket', 'oversized', 'winter', 'streetwear', 'vintage'],
    seoTitle: 'Buy Oversized Heritage Washed Jacket Online',
    seoDesc:
      'Shop the Oversized Heritage Washed Jacket. A premium, comfortable outerwear piece perfect for layering. Available in multiple sizes.',
    seoSlug: 'oversized-heritage-washed',
    videoLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1520975954732-57dd22299614?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1559551409-dadc959f76b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '07642MS',
    name: 'Sweatshirt With Hood',
    sku: '07642MS',
    costPrice: 25.5,
    originalPrice: 74.34,
    sellingPrice: 74.34,
    stock: 600,
    maxStock: 1000,
    status: 'Active',
    category: 'Outerwear',
    store: 'Odama Store',
    variants: ['M', 'L', 'XXL'],
    sales: 850,
    dateAdded: '2023-12-05',
  },
  {
    id: '06473MB',
    name: 'Soft and Light Break',
    sku: '06473MB',
    costPrice: 15.0,
    originalPrice: 54.21,
    sellingPrice: 45.99,
    stock: 420,
    maxStock: 1000,
    status: 'Active',
    category: 'Outerwear',
    store: 'Odama Store',
    variants: ['XS', 'S', 'M'],
    sales: 2310,
    dateAdded: '2023-10-20',
  },
  {
    id: '081794MS',
    name: 'Bot Chelsea With Tor Protec...',
    sku: '081794MS',
    costPrice: 12.0,
    originalPrice: 30.43,
    sellingPrice: 30.43,
    stock: 900,
    maxStock: 1000,
    status: 'Inactive',
    category: 'Footwear',
    store: 'Main Store',
    variants: ['US 8', 'US 9', 'US 10'],
    sales: 452,
    dateAdded: '2024-01-15',
  },
  {
    id: '03261WS',
    name: 'Shirt With Patterned Design',
    sku: '03261WS',
    costPrice: 22.0,
    originalPrice: 84.24,
    sellingPrice: 70.0,
    stock: 820,
    maxStock: 1000,
    status: 'Draft',
    category: 'Shirts',
    store: 'Main Store',
    variants: ['S', 'M', 'L'],
    sales: 154,
    dateAdded: '2024-02-01',
  },
  {
    id: '08542WS',
    name: 'Oxford Shirt',
    sku: '08542WS',
    costPrice: 18.0,
    originalPrice: 64.15,
    sellingPrice: 64.15,
    stock: 300,
    maxStock: 1000,
    status: 'Inactive',
    category: 'Shirts',
    store: 'Main Store',
    variants: ['M', 'L', 'XL'],
    sales: 890,
    dateAdded: '2023-09-10',
  },
  {
    id: '09912SN',
    name: 'Classic High-Top Sneakers',
    sku: '09912SN',
    costPrice: 40.0,
    originalPrice: 110.0,
    sellingPrice: 110.0,
    stock: 150,
    maxStock: 500,
    status: 'Active',
    category: 'Sneakers',
    store: 'Main Store',
    variants: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11'],
    sales: 3420,
    dateAdded: '2023-08-22',
  },
  {
    id: '09913SN',
    name: 'Runner Pro Mesh Sneakers',
    sku: '09913SN',
    costPrice: 45.0,
    originalPrice: 135.5,
    sellingPrice: 115.0,
    stock: 85,
    maxStock: 300,
    status: 'Draft',
    category: 'Sneakers',
    store: 'Odama Store',
    variants: ['US 8', 'US 9', 'US 10.5'],
    sales: 1105,
    dateAdded: '2024-03-10',
  },
  {
    id: '08111FW',
    name: 'Leather Loafers',
    sku: '08111FW',
    costPrice: 35.0,
    originalPrice: 95.0,
    sellingPrice: 95.0,
    stock: 220,
    maxStock: 400,
    status: 'Inactive',
    category: 'Footwear',
    store: 'Main Store',
    variants: ['US 8', 'US 9'],
    sales: 430,
    dateAdded: '2023-11-01',
  },
];

export async function fetchProducts(): Promise<Product[]> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockProducts]);
    }, 800);
  });
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts.find((p) => p.id === id));
    }, 400);
  });
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockProducts.findIndex((p) => p.id === id);
      if (index === -1) {
        reject(new Error('Product not found'));
        return;
      }
      mockProducts[index] = { ...mockProducts[index], ...data };
      resolve(mockProducts[index]);
    }, 500);
  });
}
