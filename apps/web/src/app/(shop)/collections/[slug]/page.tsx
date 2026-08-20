import React from 'react';
import { Metadata } from 'next';

import { CollectionDetails } from '@/features/collections';
import { getAllCollections, getCollectionBySlug } from '@/features/collections/services/queries';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const collections = await getAllCollections();
    return collections.map((c) => ({
      slug: c.slug.toLowerCase(),
    }));
  } catch (err) {
    console.error('Failed to generate static params for collections:', err);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    return {
      title: 'Collection Not Found | Fashion Friday',
      description: 'The requested collection could not be found.',
    };
  }

  return {
    title: `${collection.name} Collection | Fashion Friday`,
    description: `Explore the ${collection.name} collection at Fashion Friday. Discover our latest products and exclusive items.`,
    openGraph: {
      title: `${collection.name} Collection | Fashion Friday`,
      description: `Explore the ${collection.name} collection at Fashion Friday.`,
      images: [collection.image],
    },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;

  return <CollectionDetails collectionSlug={slug} />;
}
