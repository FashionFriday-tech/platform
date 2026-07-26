import React from 'react';

import { CategoriesLanding } from '@/features/categories';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StoreLandingPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';

  let initialCategories = [];
  let initialCampaigns = [];

  try {
    const [categoriesRes, campaignsRes] = await Promise.all([
      fetch(`${API_URL}/categories`, {
        cache: 'no-store',
        next: { tags: ['home-categories'], revalidate: 0 },
      }),
      fetch(`${API_URL}/campaigns`, {
        cache: 'no-store',
        next: { tags: ['home-campaigns'], revalidate: 0 },
      }),
    ]);

    if (categoriesRes.ok) {
      initialCategories = await categoriesRes.json();
    }
    if (campaignsRes.ok) {
      initialCampaigns = await campaignsRes.json();
    }
  } catch (err) {
    console.error('Failed to fetch initial categories on server:', err);
  }

  return (
    <CategoriesLanding
      categories={initialCategories}
      initialCampaigns={initialCampaigns}
    />
  );
}
