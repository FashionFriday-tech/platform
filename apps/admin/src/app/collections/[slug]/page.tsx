import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CollectionDetailsView } from '../../../features/collections/components/CollectionDetailsView';
import { MOCK_COLLECTIONS } from '../../../features/collections/types';

interface CollectionDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CollectionDetailsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const collection = MOCK_COLLECTIONS.find((c) => c.slug === resolvedParams.slug);
  return {
    title: collection ? `${collection.name} | Fashion Friday Admin` : 'Collection Not Found',
  };
}

export default async function CollectionDetailsPage({ params }: CollectionDetailsPageProps) {
  const resolvedParams = await params;
  const collection = MOCK_COLLECTIONS.find((c) => c.slug === resolvedParams.slug);

  if (!collection) {
    notFound();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
      <CollectionDetailsView initialCollection={collection} />
    </div>
  );
}
