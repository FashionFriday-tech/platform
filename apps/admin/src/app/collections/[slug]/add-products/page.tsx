import { notFound } from 'next/navigation';
import { MOCK_COLLECTIONS } from '../../../../features/collections/types';
import { AddCollectionProductsView } from '../../../../features/collections/components/AddCollectionProductsView';
import { Metadata } from 'next';

interface AddCollectionProductsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: AddCollectionProductsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const collection = MOCK_COLLECTIONS.find(c => c.slug === resolvedParams.slug);
  return {
    title: collection ? `Add Products to ${collection.name} | Fashion Friday Admin` : 'Collection Not Found',
  };
}

export default async function AddCollectionProductsPage({ params }: AddCollectionProductsPageProps) {
  const resolvedParams = await params;
  const collection = MOCK_COLLECTIONS.find(c => c.slug === resolvedParams.slug);

  if (!collection) {
    notFound();
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden p-6">
      <AddCollectionProductsView collection={collection} />
    </div>
  );
}
