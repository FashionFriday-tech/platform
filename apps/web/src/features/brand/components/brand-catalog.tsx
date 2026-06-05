import type { JSX } from 'react';
import { notFound } from 'next/navigation';

import { getProductsByBrand } from '@/data/filter-engine';
import { CatalogueClient } from '@/features/catalogue';

import { getBrandBySlug } from '../services/queries';

interface BrandCatalogProps {
  brandName: string;
}

export async function BrandCatalog({ brandName }: BrandCatalogProps): Promise<JSX.Element> {
  if (!brandName) {
    return notFound();
  }

  // 1. Fetch exact brand metadata (e.g. slug 'nike' -> name 'Nike')
  const brand = await getBrandBySlug(brandName);
  if (!brand) {
    return notFound();
  }

  // 2. Fetch products specifically for this brand from API
  const brandProducts = await getProductsByBrand(brand.name);
  console.log('BRAND PRODUCTS COUNT for brand', brand.name, ':', brandProducts.length);

  // 3. Determine initial sidebar context
  const contextCategory = brandProducts.length > 0 ? brandProducts[0].categoryId : 'sneakers';

  return <CatalogueClient categorySlug={contextCategory} initialProducts={brandProducts} />;
}
