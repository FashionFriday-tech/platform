import React from 'react';

import { GenderLanding } from '@/features/categories';

export const dynamicParams = true;

export async function generateStaticParams() {
  return [
    { gender: 'men' },
    { gender: 'women' },
  ];
}

export default async function StoreLandingPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';
  
  let initialCategories = [];
  try {
    const res = await fetch(`${API_URL}/categories`, {
      next: { revalidate: 86400, tags: ['home-categories'] },
    });
    if (res.ok) {
      initialCategories = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch initial categories on server:', err);
  }

  return <GenderLanding initialCategories={initialCategories} />;
}
