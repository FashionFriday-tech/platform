import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AddCollectionProductsView } from '../../../../features/collections/components/AddCollectionProductsView';
import { MOCK_COLLECTIONS } from '../../../../features/collections/types';

interface AddCollectionProductsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: AddCollectionProductsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const collection = MOCK_COLLECTIONS.find((c) => c.slug === resolvedParams.slug);
  return {
    title: collection
      ? `Add Products to ${collection.name} | Fashion Friday Admin`
      : 'Collection Not Found',
  };
}

export default async function AddCollectionProductsPage({
  params,
}: AddCollectionProductsPageProps) {
  const resolvedParams = await params;
  const collection = MOCK_COLLECTIONS.find((c) => c.slug === resolvedParams.slug);

  if (!collection) {
    notFound();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
      <AddCollectionProductsView collection={collection} />
    </div>
  );
}
