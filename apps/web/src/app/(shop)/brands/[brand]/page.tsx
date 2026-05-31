import React from 'react';

import { BrandCatalog, getBrands } from '@/features/brand';

interface Props {
  params: Promise<{ brand: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const brands = await getBrands();
    return brands.map((b) => ({
      brand: b.slug.toLowerCase(),
    }));
  } catch (err) {
    console.error('Failed to generate static params for brands:', err);
    return [];
  }
}

export default async function Page({ params }: Props) {
  const { brand } = await params;

  return <BrandCatalog brandName={brand} />;
}
