'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export default function CollectionsSection() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/collections`)
      .then((res) => res.json())
      .then((data) => {
        setCollections(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch collections:', err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading || collections.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="collections-heading" className="relative py-12 md:py-20">
      <div className="container mx-auto">
        <header className="mb-10 px-4 lg:px-6">
          <h2
            id="collections-heading"
            className="text-4xl font-black tracking-tighter uppercase lg:text-7xl"
          >
            Shop by Collections
          </h2>
        </header>

        <div className="no-scrollbar grid grid-cols-2 gap-4 px-4 md:flex md:overflow-x-auto md:gap-6 md:px-6 md:pb-4">
          {collections.map((item, index) => (
            <article
              key={item.id}
              className="group relative aspect-[3/4] h-[280px] sm:h-[360px] md:h-[420px] w-full shrink-0 overflow-hidden rounded-2xl md:w-80 md:rounded-3xl"
            >
              <Link href={`/collections/${item.slug}`} className="block h-full w-full" title={`Browse ${item.name}`}>
                <figure className="absolute inset-0 m-0 h-full w-full">
                  <Image
                    src={item.image}
                    alt={`Model featuring ${item.name} collection`}
                    fill
                    sizes="(max-width: 768px) 50vw, 320px"
                    className="object-cover"
                    priority={index < 2}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />
                </figure>

                <div className="absolute bottom-0 left-0 z-10 w-full p-4 md:p-8">
                  <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                    <p className="mb-1 text-[10px] font-medium text-zinc-300 md:mb-2 md:text-sm">
                      {item.productCount || 0} Items
                    </p>
                    <h3 className="text-xl font-black tracking-tighter text-white uppercase md:text-3xl">
                      {item.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

