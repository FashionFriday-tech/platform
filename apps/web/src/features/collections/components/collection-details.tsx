import type { JSX } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { getProductsByCollection } from '@/data/filter-engine';
import { CatalogueClient } from '@/features/catalogue';

import { getCollectionBySlug } from '../services/queries';

interface CollectionDetailsProps {
  collectionSlug: string;
}

export async function CollectionDetails({ collectionSlug }: CollectionDetailsProps): Promise<JSX.Element> {
  if (!collectionSlug) {
    return notFound();
  }

  // 1. Fetch exact collection metadata
  const collection = await getCollectionBySlug(collectionSlug);
  if (!collection) {
    return notFound();
  }

  // 2. Fetch products specifically for this collection from API
  const collectionProducts = await getProductsByCollection(collection.slug);
  console.log('COLLECTION PRODUCTS COUNT for collection', collection.name, ':', collectionProducts.length);

  // 3. Determine initial sidebar context
  const contextCategory = collectionProducts.length > 0 ? collectionProducts[0].categoryId : 'sneakers';

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section aligned with the product grid to avoid sidebar overlap */}
      <div className="w-full max-w-none px-4 pt-24 md:px-8 md:pt-32 xl:px-10 2xl:px-14">
        <div className="w-full lg:pl-80">
          <section className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-black rounded-[2.5rem]">
            <Image
              src={collection.image}
              alt={collection.name}
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
            
            <div className="relative z-10 text-center px-4">
              <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white drop-shadow-lg">
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
