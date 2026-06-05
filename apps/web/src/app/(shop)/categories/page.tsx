import React from 'react';

import { CategoriesLanding } from '@/features/categories';

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

  return <CategoriesLanding categories={initialCategories} />;
}
