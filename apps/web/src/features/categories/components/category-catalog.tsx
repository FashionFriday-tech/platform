import { notFound } from 'next/navigation';
import type { JSX } from 'react';

import { getProductsByCategory } from '@/data/filter-engine';
import { CatalogueClient } from '@/features/catalogue';

interface CategoryCatalogProps {
  category: string;
}

export async function CategoryCatalog({ category }: CategoryCatalogProps): Promise<JSX.Element> {
  // Map URL slugs to exact Data Categories
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

  const products = await getProductsByCategory(formattedCategory);
  const initialProducts = products.filter((p) => p.categoryId?.toLowerCase() === formattedCategory.toLowerCase());

  return <CatalogueClient categorySlug={formattedCategory} initialProducts={initialProducts} />;
}
