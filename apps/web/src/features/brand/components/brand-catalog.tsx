import { notFound } from 'next/navigation';

import { DUMMY_PRODUCTS } from '@/data/products';
import { CatalogueClient } from '@/features/catalogue';

interface BrandCatalogProps {
  brandName: string;
}

export function BrandCatalog({ brandName }: BrandCatalogProps) {
  if (!brandName) {
    return notFound();
  }

  // 2. Filter products with safety checks
  const brandProducts = DUMMY_PRODUCTS.filter(
    (p) => String(p.brand).toLowerCase() === brandName.toLowerCase(),
  );

  // 3. Determine initial sidebar context
  const contextCategory = brandProducts.length > 0 ? brandProducts[0].category : 'sneakers';

  return <CatalogueClient categorySlug={contextCategory} initialProducts={brandProducts} />;
}
