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
    slippers: 'Slippers',
  };

  const formattedCategory =
    categoryMap[category.toLowerCase()] || category.charAt(0).toUpperCase() + category.slice(1);

  const products = await getProductsByCategory(formattedCategory);

  return <CatalogueClient categorySlug={formattedCategory} initialProducts={products} />;
}
