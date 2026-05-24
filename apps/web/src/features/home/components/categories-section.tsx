'use client';

import Image from 'next/image';
import Link from 'next/link';

import { categories } from '@/features/home/data/categories';

export default function CategoryCarousel() {
  return (
    <section
      aria-labelledby="category-heading"
      className="relative py-12 md:py-20"
    >
      <div className="container mx-auto">
        {/* Header Section */}
        <header className="mb-10 px-4 lg:px-6">
          <h2
            id="category-heading"
            className="text-4xl font-black tracking-tighter uppercase lg:text-7xl"
          >
            Shop by Category
          </h2>
        </header>

        {/* Categories Grid/Carousel */}
        <div
          className="no-scrollbar grid grid-cols-2 gap-4 px-4 md:flex md:overflow-x-auto md:gap-6 md:px-6 md:pb-4"
        >
          {categories.map((cat, index) => (
            <article
              key={`${cat.id}-${index}`}
              className="group relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-2xl md:w-80 md:rounded-3xl"
            >
              <Link href={cat.href} className="block h-full w-full" title={`Browse ${cat.title}`}>
                <figure className="absolute inset-0 m-0 h-full w-full">
                  <Image
                    src={cat.image}
                    alt={`Model featuring ${cat.title} collection`}
                    fill
                    sizes="(max-width: 768px) 50vw, 320px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority={index < 2} // Optimization: Priority for first two items
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity group-hover:opacity-80" />
                </figure>

                <div className="absolute bottom-0 left-0 z-10 w-full p-4 md:p-8">
                  <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                    <p className="mb-1 text-[10px] font-medium text-zinc-300 opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:mb-2 md:text-sm">
                      {cat.count}
                    </p>
                    <h3 className="text-xl font-black tracking-tighter text-white uppercase md:text-4xl">
                      {cat.title}
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

