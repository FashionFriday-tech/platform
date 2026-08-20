'use client';

import React from 'react';
import { CollectionCard } from './collection-card';
import type { CollectionItem } from '../types';

interface CollectionsPageProps {
  collections: CollectionItem[];
}

export function CollectionsPage({ collections }: CollectionsPageProps) {
  return (
    <main className="bg-background text-foreground min-h-screen px-4 pt-10 pb-24 md:px-10 md:pt-26">
      <header className="mb-10">
        <h1 className="text-center text-6xl leading-[0.8] font-black tracking-tighter uppercase italic md:text-8xl">
          All <br /> <span className="text-muted-foreground font-outline-2">Collections</span>
        </h1>
      </header>

      {collections.length === 0 ? (
        <div className="flex h-64 w-full items-center justify-center">
          <p className="text-muted-foreground text-xl font-bold uppercase">No collections found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}
    </main>
  );
}
