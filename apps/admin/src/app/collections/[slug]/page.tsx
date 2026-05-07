import { notFound } from 'next/navigation';
import { MOCK_COLLECTIONS } from '../../../features/collections/types';
import { CollectionDetailsView } from '../../../features/collections/components/CollectionDetailsView';
import { Metadata } from 'next';

interface CollectionDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CollectionDetailsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const collection = MOCK_COLLECTIONS.find(c => c.slug === resolvedParams.slug);
  return {
    title: collection ? `${collection.name} | Fashion Friday Admin` : 'Collection Not Found',
  };
}

export default async function CollectionDetailsPage({ params }: CollectionDetailsPageProps) {
  const resolvedParams = await params;
  const collection = MOCK_COLLECTIONS.find(c => c.slug === resolvedParams.slug);

  if (!collection) {
    notFound();
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden p-6">
      <CollectionDetailsView initialCollection={collection} />
    </div>
  );
}
