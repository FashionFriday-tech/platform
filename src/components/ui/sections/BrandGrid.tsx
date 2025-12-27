"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
    <section className="w-full py-16 lg:py-24 bg-white">
      {/* HEADER */}
      <div className="container mx-auto px-4 mb-8 flex justify-between items-end">
        <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter">
          Shop by <br /> brands
        </h2>

        <Link
          href={viewAllHref}
          className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1"
        >
          View All Brands <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* GRID */}
      <div className="container mx-auto px-4">
        <div
          onMouseLeave={() => setActiveId(null)}
          className="relative grid grid-cols-3 md:grid-cols-4 gap-0.5 border-2 border-black bg-neutral-900"
        >
          {brands.map((brand) => {
            const isActive = activeId === brand.id;

            return (
              <Link
                key={brand.id}
                href={brand.href}
                onMouseEnter={() => setActiveId(brand.id)}
                className="relative isolate bg-white aspect-2/2 md:aspect-6/3 flex items-center justify-center p-8 overflow-hidden"
              >
                {/* FLOATING BLACK BOX */}
                {isActive && (
                  <motion.div
                    layoutId="brandHover"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 35,
                    }}
                    className="absolute inset-0 bg-black z-0"
                  />
                )}

                {/* LOGO (ALWAYS VISIBLE) */}
                <div className="relative z-10">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={120}
                    height={60}
                    className={`object-contain transition-all duration-300 ${
                      isActive ? "invert" : "grayscale"
                    }`}
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* MOBILE CTA */}
        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1"
          >
            View All Brands
          </Link>
        </div>
      </div>
    </section>
  );
}
