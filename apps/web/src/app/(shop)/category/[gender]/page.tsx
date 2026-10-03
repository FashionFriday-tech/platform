import { notFound } from 'next/navigation';

import { GenderLanding } from '@/features/categories';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
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
    console.error('Failed to fetch initial category data on server:', err);
  }

  return (
    <GenderLanding initialCategories={initialCategories} initialCampaigns={initialCampaigns} />
  );
}
