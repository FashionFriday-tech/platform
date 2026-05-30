import React from 'react';
import { BrandCatalog } from '@/features/brand';

interface Props {
  params: Promise<{ brand: string }>;
}

export default async function Page({ params }: Props) {
  const { brand } = await params;

  return <BrandCatalog brandName={brand} />;
}
