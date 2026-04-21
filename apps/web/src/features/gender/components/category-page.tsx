import { notFound } from 'next/navigation';

import { DUMMY_PRODUCTS } from '@/data/products';
import CatalogueClient from '@/features/catalogue';

interface CategoryPageProps {
  gender: string;
  category: string;
}

export async function CategoryPage({ gender, category }: CategoryPageProps) {
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

  // The logic: (Category must match) AND (Product Gender is current department OR Unisex)
  const initialProducts = DUMMY_PRODUCTS.filter((p) => {
    const isCorrectCategory = p.category === formattedCategory;

    const pGender = p.gender.toLowerCase();
    const isCorrectGender = pGender === formattedGender || pGender === 'unisex';

    return isCorrectCategory && isCorrectGender;
  });

  return <CatalogueClient categorySlug={formattedCategory} initialProducts={initialProducts} />;
}
