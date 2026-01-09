"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";

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
    <section className="w-full py-12 lg:py-24 bg-white dark:bg-black">
      {/* Header */}
      <div className="container mx-auto px-4 lg:px-6 mb-12 flex items-end justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest mb-2 block opacity-60 text-zinc-500">
            {subheading}
          </span>
          <h2 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter text-black dark:text-white">
            {heading}
          </h2>
        </div>
        <Link
          href="/shop/new"
          className="hidden md:flex items-center gap-2 font-bold uppercase tracking-wider text-sm hover:opacity-70 transition-opacity text-black dark:text-white"
        >
          View All <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="w-full px-4 lg:px-6">
        {/* ADJUSTED RATIOS:
            DESKTOP: Active flex-[6] (approx 60-65% width), Inactive flex-1 (approx 10-12% each)
            This makes the 'unopened' containers much more visible.
        */}
        <div className="flex flex-col md:flex-row w-full gap-3 md:h-140">
          {collections.map((item) => {
            const isActive = activeId === item.id;

            return (
              <motion.div
                key={item.id}
                layout
                onClick={() => setActiveId(item.id)}
                onMouseEnter={() => {
                  if (typeof window !== "undefined" && window.innerWidth >= 768) {
                    setActiveId(item.id);
                  }
                }}
                className={`relative rounded-4xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                  ${isActive 
                    ? "h-112 md:h-full md:flex-6" 
                    : "h-15 md:h-full md:flex-1 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  }`}
              >
                {/* Image logic remains 'Open Only' */}
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between overflow-hidden">

                  <div className="relative h-full flex flex-col justify-center items-center md:items-start ">
                    
                    {/* INACTIVE STATE: Title is now slightly larger and clearer */}
                    {!isActive && (
                      <motion.h3 
                        layout="position"
                        className="md:text-3xl font-black uppercase md:left-1/2 md:-translate-x-1/2 md:-rotate-90  whitespace-nowrap text-white"
                      >
                        {item.title}
                      </motion.h3>
                    )}

                    {/* ACTIVE STATE: Details */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="w-full text-white flex flex-col justify-center items-center"
                        >

                          <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-none text-center">
                            {item.title}
                          </h3>

                          <Link
                            href={item.href}
                            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                          >
                            Shop Now
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
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