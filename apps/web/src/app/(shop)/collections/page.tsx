import React from 'react';
import type { Metadata } from 'next';
import { CollectionsPage } from '@/features/collections';

export const metadata: Metadata = {
  title: 'Collections | Fashion Friday',
  description: 'Explore all of our fashion collections.',
};

export default async function CollectionsRoute() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';

  let initialCollections = [];
  try {
    const res = await fetch(`${API_URL}/collections`, {
      next: { revalidate: 86400, tags: ['collections'] },
    });
    if (res.ok) {
      initialCollections = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch initial collections on server:', err);
  }

  return <CollectionsPage collections={initialCollections} />;
}
