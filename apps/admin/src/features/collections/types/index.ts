export interface ProductCollection {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export let MOCK_COLLECTIONS: ProductCollection[] = [
  {
    id: 'col_summer_24',
    name: "Summer Collection '24",
    slug: 'summer-collection-24',
    image:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop',
    productCount: 120,
  },
  {
    id: 'col_winter_essentials',
    name: 'Winter Essentials',
    slug: 'winter-essentials',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000&auto=format&fit=crop',
    productCount: 85,
  },
  {
    id: 'col_office_wear',
    name: 'Office Wear',
    slug: 'office-wear',
    image:
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1000&auto=format&fit=crop',
    productCount: 60,
  },
  {
    id: 'col_active_gear',
    name: 'Active Gear',
    slug: 'active-gear',
    image:
      'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1000&auto=format&fit=crop',
    productCount: 45,
  },
  {
    id: 'col_evening_elegance',
    name: 'Evening Elegance',
    slug: 'evening-elegance',
    image:
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=1000&auto=format&fit=crop',
    productCount: 30,
  },
  {
    id: 'col_casual_denim',
    name: 'Casual Denim',
    slug: 'casual-denim',
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop',
    productCount: 75,
  },
];

export const addCollection = (collection: Omit<ProductCollection, 'id' | 'productCount'>) => {
  const newCollection: ProductCollection = {
    ...collection,
    id: `col_${Date.now()}`,
    productCount: 0,
  };
  MOCK_COLLECTIONS = [newCollection, ...MOCK_COLLECTIONS];
  return newCollection;
};

export const updateCollection = (id: string, updates: Partial<ProductCollection>) => {
  MOCK_COLLECTIONS = MOCK_COLLECTIONS.map((c) => (c.id === id ? { ...c, ...updates } : c));
};

export const deleteCollection = (id: string) => {
  MOCK_COLLECTIONS = MOCK_COLLECTIONS.filter((c) => c.id !== id);
};
