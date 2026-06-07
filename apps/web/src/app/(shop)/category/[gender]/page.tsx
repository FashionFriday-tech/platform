import { notFound } from 'next/navigation';

import { GenderLanding } from '@/features/categories';

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
