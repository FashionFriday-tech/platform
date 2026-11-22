import React from 'react';

import { CategoriesLanding } from '@/features/categories';

// Production standard: 24h ISR cache, invalidated on-demand when categories/campaigns change
export const revalidate = 86400;

export default async function StoreLandingPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';

  let initialCategories = [];
  let initialCampaigns = [];

  try {
    const [categoriesRes, campaignsRes] = await Promise.all([
      fetch(`${API_URL}/categories`, {
        next: { tags: ['home-categories'], revalidate: 86400 },
      }),
      fetch(`${API_URL}/campaigns`, {
        next: { tags: ['home-campaigns'], revalidate: 3600 },
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

  return <CategoriesLanding categories={initialCategories} initialCampaigns={initialCampaigns} />;
}
