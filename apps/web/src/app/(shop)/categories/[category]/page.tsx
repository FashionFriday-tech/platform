import React from 'react';

import { CategoryCatalog } from '@/features/categories';

interface Props {
  params: Promise<{ category: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return [
    { category: 'watches' },
    { category: 'clothing' },
    { category: 'accessories' },
    { category: 'sneakers' },
  ];
}

export default async function Page({ params }: Props) {
  const { category } = await params;

  return <CategoryCatalog category={category} />;
}
