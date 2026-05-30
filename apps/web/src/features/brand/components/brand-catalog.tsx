import { notFound } from 'next/navigation';
import type { JSX } from 'react';

import { getAllProducts } from '@/data/filter-engine';
import { CatalogueClient } from '@/features/catalogue';

interface BrandCatalogProps {
  brandName: string;
}

export async function BrandCatalog({ brandName }: BrandCatalogProps): Promise<JSX.Element> {
  if (!brandName) {
    return notFound();
  }

  const products = await getAllProducts();
  console.log('ALL PRODUCTS COUNT:', products.length);

  // 2. Filter products with safety checks
  const brandProducts = products.filter((p) =>
    Array.isArray(p.brand)
      ? p.brand.some((b) => b.toLowerCase() === brandName.toLowerCase())
      : String(p.brand).toLowerCase() === brandName.toLowerCase()
  );
  console.log('BRAND PRODUCTS COUNT for brand', brandName, ':', brandProducts.length);

  // 3. Determine initial sidebar context
  const contextCategory = brandProducts.length > 0 ? brandProducts[0].categoryId : 'sneakers';

  return <CatalogueClient categorySlug={contextCategory} initialProducts={brandProducts} />;
}
