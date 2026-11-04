import type { JSX } from 'react';
import { notFound } from 'next/navigation';

import { getProductsByCategory } from '@/data/filter-engine';
import { CatalogueClient } from '@/features/catalogue';

interface CategoryPageProps {
  gender: string;
  category: string;
}

export async function CategoryPage({ gender, category }: CategoryPageProps): Promise<JSX.Element> {
  const categoryMap: Record<string, string> = {
    watches: 'Watches',
    clothing: 'Clothing',
    accessories: 'Accessories',
    sneakers: 'Sneakers',
    slippers: 'Slippers',
  };

  const formattedCategory =
    categoryMap[category.toLowerCase()] ||
    category.charAt(0).toUpperCase() + category.slice(1);
  const formattedGender = gender.toLowerCase();
  const validGenders = ['men', 'women'];

  if (!validGenders.includes(formattedGender)) {
    return notFound();
  }

  const products = await getProductsByCategory(formattedCategory, formattedGender);

  const initialProducts = products.filter((p) => {
    const pGender = p.gender?.toLowerCase() || 'unisex';
    const isCorrectGender = pGender === formattedGender || pGender === 'unisex';

    return isCorrectGender;
  });

  return <CatalogueClient categorySlug={formattedCategory} initialProducts={initialProducts} />;
}
