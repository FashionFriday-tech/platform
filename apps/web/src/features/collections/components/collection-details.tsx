import type { JSX } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { getProductsByCollection } from '@/data/filter-engine';
import { CatalogueClient } from '@/features/catalogue';

import { getCollectionBySlug } from '../services/queries';

interface CollectionDetailsProps {
  collectionSlug: string;
}

export async function CollectionDetails({
  collectionSlug,
}: CollectionDetailsProps): Promise<JSX.Element> {
  if (!collectionSlug) {
    return notFound();
  }

  // 1. Fetch exact collection metadata
  const collection = await getCollectionBySlug(collectionSlug);
  if (!collection) {
    return notFound();
  }

  // 2. Fetch products specifically for this collection from API
  const collectionProducts = await getProductsByCollection(collection.slug, collection.name);

  // 3. Determine initial sidebar context
  const contextCategory =
    collectionProducts.length > 0 ? collectionProducts[0].categoryId : 'sneakers';

  return (
    <div className="flex w-full flex-col">
      {/* Hero Section aligned with the product grid to avoid sidebar overlap */}
      <div className="w-full max-w-none px-4 pt-24 md:px-8 md:pt-32 xl:px-10 2xl:px-14">
        <div className="w-full lg:pl-80">
          <section className="relative flex h-[40vh] w-full items-center justify-center overflow-hidden rounded-[2.5rem] bg-black md:h-[50vh]">
            {collection.image ? (
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                className="object-cover opacity-60"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950" />
            )}
            <div className="from-background/50 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />

            <div className="relative z-10 px-4 text-center">
              <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic drop-shadow-lg md:text-7xl">
                {collection.name}
              </h1>
            </div>
          </section>
        </div>
      </div>

      {/* Catalogue Grid */}
      <CatalogueClient categorySlug={contextCategory} initialProducts={collectionProducts} />
    </div>
  );
}
