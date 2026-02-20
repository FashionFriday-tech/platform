import { notFound } from 'next/navigation';

import { DUMMY_PRODUCTS } from '@/data/products';
import CatalogueClient from '@/features/catalogue';

interface Props {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  // Map URL slugs to your exact Data Categories
  const categoryMap: Record<string, string> = {
    watches: 'Watches',
    clothing: 'Clothing',
    accessories: 'Accessories',
    sneakers: 'Sneakers',
  };

  const formattedCategory = categoryMap[category.toLowerCase()];

  if (!formattedCategory) {
    return notFound();
  }

  const initialProducts = DUMMY_PRODUCTS.filter((p) => p.category === formattedCategory);

  return <CatalogueClient categorySlug={formattedCategory} initialProducts={initialProducts} />;
}
