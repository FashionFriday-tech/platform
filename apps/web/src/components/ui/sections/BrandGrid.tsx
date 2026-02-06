"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@ff/ui";
import { useState } from "react";
import { motion } from "framer-motion";

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

export default function BrandGrid({
  brands,
  viewAllHref = "/brands",
}: Props) {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    // Added dynamic background to the section itself
    <section className="w-full py-16 lg:py-24 transition-colors duration-300">
      {/* HEADER */}
      <div className="container mx-auto px-4 mb-8 flex justify-between items-end">
        <h2 className="text-4xl lg:text-4xl font-black uppercase tracking-tighter">
          Shop by brands
        </h2>

        <Link
          href={viewAllHref}
          className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b-2 border-black dark:border-white pb-1"
        >
          View All Brands <ArrowUpRightIcon className="w-4 h-4" />
        </Link>
      </div>

      {/* GRID */}
      <div className="container mx-auto px-4">
        <div
          onMouseLeave={() => setActiveId(null)}
          className="
            relative grid grid-cols-3 md:grid-cols-4 gap-0.5
            border-2 border-black dark:border-white
            bg-black dark:bg-white
          "
        >
          {brands.map((brand) => {
            const isActive = activeId === brand.id;

            return (
              <Link
                key={brand.id}
                href={brand.href}
                onMouseEnter={() => setActiveId(brand.id)}
                className="
                  relative isolate aspect-square md:aspect-6/3
                  flex items-center justify-center p-8 overflow-hidden
                  bg-white dark:bg-black transition-colors
                "
              >
                {/* HOVER OVERLAY (The box that moves) */}
                {isActive && (
                  <motion.div
                    layoutId="brandHover"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 35,
                    }}
                    className="absolute inset-0 z-0 bg-black dark:bg-white"
                  />
                )}

                {/* LOGO LOGIC */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={120}
                    height={60}
                    className={`
                      object-contain transition-all duration-300 
                      ${isActive ? "invert dark:invert-0" : "invert-0 dark:invert"}
                    `}
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* MOBILE CTA */}
        <div className="mt-8 flex justify-center md:hidden text-black dark:text-white">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b-2 border-black dark:border-white pb-1"
          >
            View All Brands
          </Link>
        </div>
      </div>
    </section>
  );
}