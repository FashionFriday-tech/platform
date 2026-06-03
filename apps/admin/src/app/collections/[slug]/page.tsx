import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CollectionDetailsView } from '../../../features/collections/components/CollectionDetailsView';
import { type ProductCollection } from '../../../features/collections/types';

interface CollectionDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getCollectionBySlug(slug: string): Promise<ProductCollection | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/collections/${slug}`,
      {
        cache: 'no-store',
      },
    );
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: CollectionDetailsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const collection = await getCollectionBySlug(resolvedParams.slug);
  return {
    title: collection ? `${collection.name} | Fashion Friday Admin` : 'Collection Not Found',
  };
}

export default async function CollectionDetailsPage({ params }: CollectionDetailsPageProps) {
  const resolvedParams = await params;
  const collection = await getCollectionBySlug(resolvedParams.slug);

  if (!collection) {
    notFound();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
      <CollectionDetailsView initialCollection={collection} />
    </div>
  );
}
