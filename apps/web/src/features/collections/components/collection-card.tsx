'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRightIcon } from '@ff/ui';

import type { CollectionItem } from '../types';

interface CollectionCardProps {
  collection: CollectionItem;
}

export const CollectionCard = ({ collection }: CollectionCardProps) => {
  return (
    <Link href={`/collections/${collection.slug}`} className="group relative block aspect-[4/5] w-full overflow-hidden rounded-4xl">
      <Image
        src={collection.image}
        alt={collection.name}
        fill
        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <h3 className="text-2xl font-black uppercase text-white tracking-tight">{collection.name}</h3>
        <div className="mt-2 flex items-center justify-between text-white/80">
          <span className="text-sm font-medium">{collection.productCount} Products</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-black">
            <ArrowUpRightIcon className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};
