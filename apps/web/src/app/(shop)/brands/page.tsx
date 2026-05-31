import React from 'react';

import { BrandsPage, getBrands } from '@/features/brand';

export default async function Page() {
  const initialBrands = await getBrands();
  return <BrandsPage initialBrands={initialBrands} />;
}
