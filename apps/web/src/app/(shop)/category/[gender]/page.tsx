import { notFound } from 'next/navigation';

import { GenderLanding } from '@/features/categories';

// Production standard: 24h ISR cache, invalidated on-demand when categories/campaigns change
export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  return [{ gender: 'men' }, { gender: 'women' }];
}

interface Props {
  params: Promise<{ gender: string }>;
}

export default async function StoreLandingPage({ params }: Props) {
  const { gender } = await params;

  if (gender !== 'men' && gender !== 'women') {
    return notFound();
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002';

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
    console.error('Failed to fetch initial category data on server:', err);
  }

  return (
    <GenderLanding initialCategories={initialCategories} initialCampaigns={initialCampaigns} />
  );
}
