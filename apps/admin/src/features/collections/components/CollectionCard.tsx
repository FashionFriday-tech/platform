import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { PackageIcon } from '@ff/ui';

import { type ProductCollection } from '../types';

interface CollectionCardProps {
  collection: ProductCollection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link href={`/collections/${collection.slug}`}>
      <div className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-[#111111]">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/5 dark:bg-white/5">
          <Image
            src={collection.image}
            alt={collection.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/30" />

          <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-1 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-12">
            <h3 className="text-lg font-bold text-white drop-shadow-sm">{collection.name}</h3>
            <div className="flex items-center gap-1.5 text-sm font-medium text-white/90 drop-shadow-sm">
              <PackageIcon className="h-4 w-4" />
              <span>{collection.productCount} Products</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
