import { notFound } from 'next/navigation';
import type { JSX } from 'react';

import { DUMMY_PRODUCTS } from '@/data/products';
import { CatalogueClient } from '@/features/catalogue';

interface BrandCatalogProps {
  brandName: string;
}

export function BrandCatalog({ brandName }: BrandCatalogProps): JSX.Element {
  if (!brandName) {
    return notFound();
  }

  // 2. Filter products with safety checks
  const brandProducts = DUMMY_PRODUCTS.filter(
    (p) => String(p.brand).toLowerCase() === brandName.toLowerCase(),
  );

  // 3. Determine initial sidebar context
  const contextCategory = brandProducts.length > 0 ? brandProducts[0].categoryId : 'sneakers';

  return <CatalogueClient categorySlug={contextCategory} initialProducts={brandProducts} />;
}
