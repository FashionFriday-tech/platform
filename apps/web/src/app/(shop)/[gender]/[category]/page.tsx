import React from 'react';
import { CategoryPage } from '@/features/gender';

interface Props {
  params: Promise<{ gender: string; category: string }>;
}

export default async function Page({ params }: Props) {
  const { gender, category } = await params;

  return <CategoryPage gender={gender} category={category} />;
}
