import React from 'react';
import { CategoryCatalog } from '@/features/categories';

interface Props {
  params: Promise<{ category: string }>;
}

export default async function Page({ params }: Props) {
  const { category } = await params;

  return <CategoryCatalog category={category} />;
}
