"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface CollectionItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  color: string;
}

interface Props {
  collections: CollectionItem[];
  heading?: string;
  subheading?: string;
}

export default function FeatureRail({
  collections,
  heading = "New Arrivals",
  subheading = "This Week's Highlights",
}: Props) {
  const [activeId, setActiveId] = useState<number>(collections[0]?.id ?? 0);

  return (
    <section className="w-full py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-6 mb-12 flex items-end justify-between">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
            {subheading}
          </span>
          <h2 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter text-gray-900">
            {heading}
          </h2>
        </div>

        <Link
          href="/shop/new"
          className="hidden lg:flex items-center gap-2 font-bold uppercase tracking-wider text-sm hover:underline"
        >
          View All Drops <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="w-full px-4 lg:px-6">
        <div className="flex w-full gap-2 lg:gap-4 h-100">
          {collections.map((item) => {
            const isActive = activeId === item.id;

            return (
              <motion.div
                key={item.id}
                layout
                onMouseEnter={() => setActiveId(item.id)}
                className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500
                  ${isActive ? "flex-3" : "flex-1 hover:flex-[1.2]"}`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className={`object-cover transition-transform duration-1000 ${
                    isActive ? "scale-100" : "scale-110 grayscale"
                  }`}
                  priority={isActive}
                />

                <div className={`absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent
                  ${isActive ? "opacity-90" : "opacity-60"}`}
                />

                <div className="absolute inset-0 p-6 lg:p-10 flex flex-col justify-between">
                  <div
                    className={`w-12 h-12 bg-white rounded-full flex items-center justify-center transition-transform duration-500
                      ${isActive ? "scale-100 rotate-45" : "scale-0"}`}
                  >
                    <ArrowUpRight className="w-5 h-5 text-black" />
                  </div>

                  <div className="relative">
                    {!isActive && (
                      <h3 className="absolute bottom-0 -rotate-90 origin-bottom-left text-3xl font-black text-white uppercase tracking-widest whitespace-nowrap">
                        {item.title}
                      </h3>
                    )}

                    {isActive && (
                      <motion.div layout>
                        <span className={`inline-block w-2 h-2 rounded-full mb-2 ${item.color}`} />
                        <p className="text-gray-300 text-sm font-bold uppercase tracking-widest mb-1">
                          {item.subtitle}
                        </p>
                        <h3 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-6">
                          {item.title}
                        </h3>

                        <Link
                          href={item.href}
                          className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-200"
                        >
                          Shop Now
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
