import React from 'react';

import { CategoryPage } from '@/features/categories';

interface Props {
  params: Promise<{ gender: string; category: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = ['watches', 'clothing', 'accessories', 'sneakers', 'slippers'];
  const genders = ['men', 'women'];
  const params = [];
  for (const gender of genders) {
    for (const category of categories) {
      params.push({ gender, category });
    }
  }
  return params;
}

export default async function Page({ params }: Props) {
  const { gender, category } = await params;

  return <CategoryPage gender={gender} category={category} />;
}
