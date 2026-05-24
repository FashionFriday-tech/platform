'use client';

import Image from 'next/image';
import Link from 'next/link';

import { ArrowUpRightIcon } from '@ff/ui';

export const genderCategories = [
  {
    id: 'men',
    title: "Men's Collection",
    subtitle: 'Streetwear, Footwear & Accessories',
    image: '/images/categories/men.png',
    href: '/men',
    buttonText: 'Shop Men',
  },
  {
    id: 'women',
    title: "Women's Collection",
    subtitle: 'Curated Apparel & Statement Pieces',
    image: '/images/categories/womens.png',
    href: '/women',
    buttonText: 'Shop Women',
  },
];

export default function CategoryCarousel() {
  return (
    <section
      aria-labelledby="category-heading"
      className="relative py-12 md:py-20"
    >
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header Section */}
        <header className="mb-10 text-center md:text-left">
          <h2
            id="category-heading"
            className="text-4xl font-black tracking-tighter uppercase lg:text-7xl"
          >
            Shop by Category
          </h2>
        </header>

        {/* 2-Card Grid (Men & Women) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {genderCategories.map((cat) => (
            <article
              key={cat.id}
              className="group relative h-[420px] sm:h-[500px] lg:h-[580px] w-full overflow-hidden rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl transition-transform duration-500 hover:-translate-y-1"
            >
              <Link href={cat.href} className="block h-full w-full">
                <figure className="relative m-0 h-full w-full overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    priority
                  />
                  {/* Subtle vignette gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-500 group-hover:opacity-95" />
                </figure>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 z-10">
                  <span className="text-xs font-bold tracking-widest text-zinc-300 uppercase mb-1">
                    {cat.subtitle}
                  </span>
                  <h3 className="text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase mb-6">
                    {cat.title}
                  </h3>

                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold tracking-wider text-white uppercase backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-black">
                      {cat.buttonText}
                      <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
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
