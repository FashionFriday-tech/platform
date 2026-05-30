import { notFound } from 'next/navigation';
import type { JSX } from 'react';

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

  const formattedCategory = categoryMap[category.toLowerCase()];
  const formattedGender = gender.toLowerCase();
  const validGenders = ['men', 'women'];

  if (!formattedCategory || !validGenders.includes(formattedGender)) {
    return notFound();
  }

  const products = await getProductsByCategory(formattedCategory);

  const initialProducts = products.filter((p) => {
    const isCorrectCategory = p.categoryId?.toLowerCase() === formattedCategory.toLowerCase();

    const pGender = p.gender.toLowerCase();
    const isCorrectGender = pGender === formattedGender || pGender === 'unisex';

    return isCorrectCategory && isCorrectGender;
  });

  return <CatalogueClient categorySlug={formattedCategory} initialProducts={initialProducts} />;
}
