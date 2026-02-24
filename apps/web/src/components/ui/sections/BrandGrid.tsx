'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { ArrowUpRightIcon } from '@ff/ui';
import { motion } from 'framer-motion';

interface BrandItem {
  id: number;
  name: string;
  logo: string;
  href: string;
}

interface Props {
  brands: BrandItem[];
  heading?: string;
  viewAllHref?: string;
}

export default function BrandGrid({ brands, viewAllHref = '/brands' }: Props) {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    // Added dynamic background to the section itself
    <section className="w-full py-16 transition-colors duration-300 lg:py-24">
      {/* HEADER */}
      <div className="container mx-auto mb-8 flex items-end justify-between px-4">
        <h2 className="text-4xl font-black tracking-tighter uppercase lg:text-4xl">
          Shop by brands
        </h2>

        <Link
          href={viewAllHref}
          className="hidden items-center gap-2 border-b-2 border-black pb-1 text-sm font-bold tracking-widest uppercase md:flex dark:border-white"
        >
          View All Brands <ArrowUpRightIcon className="h-4 w-4" />
        </Link>
      </div>

      {/* GRID */}
      <div className="container mx-auto px-4">
        <div
          onMouseLeave={() => {
            setActiveId(null);
          }}
          className="relative grid grid-cols-3 gap-0.5 border-2 border-black bg-black md:grid-cols-4 dark:border-white dark:bg-white"
        >
          {brands.map((brand) => {
            const isActive = activeId === brand.id;

            return (
              <Link
                key={brand.id}
                href={brand.href}
                onMouseEnter={() => {
                  setActiveId(brand.id);
                }}
                className="relative isolate flex aspect-square items-center justify-center overflow-hidden bg-white p-8 transition-colors md:aspect-6/3 dark:bg-black"
              >
                {/* HOVER OVERLAY (The box that moves) */}
                {isActive && (
                  <motion.div
                    layoutId="brandHover"
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 35,
                    }}
                    className="absolute inset-0 z-0 bg-black dark:bg-white"
                  />
                )}

                {/* LOGO LOGIC */}
                <div className="relative z-10 flex h-full w-full items-center justify-center">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={120}
                    height={60}
                    className={`object-contain transition-all duration-300 ${isActive ? 'invert dark:invert-0' : 'invert-0 dark:invert'} `}
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* MOBILE CTA */}
        <div className="mt-8 flex justify-center text-black md:hidden dark:text-white">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 border-b-2 border-black pb-1 text-sm font-bold tracking-widest uppercase dark:border-white"
          >
            View All Brands
          </Link>
        </div>
      </div>
    </section>
  );
}
