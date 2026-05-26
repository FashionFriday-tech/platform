import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { PackageIcon } from '@ff/ui';
import { type ProductCollection } from '../types';

interface CollectionCardProps {
  collection: ProductCollection;
  onEdit: (collection: ProductCollection) => void;
  onDelete: (id: string) => void;
}

export function CollectionCard({ collection, onEdit, onDelete }: CollectionCardProps) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-[#111111]"
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <Link href={`/collections/${collection.slug}`} className="cursor-pointer block relative aspect-[3/4] w-full overflow-hidden bg-black/5 dark:bg-white/5">
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
      </Link>

      {/* Edit and Delete Buttons */}
      <div
        className={`absolute top-4 right-4 flex gap-2 transition-opacity duration-300 ${
          showOptions ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit(collection);
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black shadow-sm backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 dark:bg-black/90 dark:text-white"
          title="Edit Collection"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(collection.id);
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/90 text-white shadow-sm backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
          title="Delete Collection"
        >

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
