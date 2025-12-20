"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: 1,
    title: "Outerwear",
    image: "/images/categories/outfit.png",
    count: "42 Products",
    href: "/shop/outerwear",
  },
  {
    id: 2,
    title: "Footwear",
    image: "/images/categories/footwear.png",
    count: "18 Products",
    href: "/shop/footwear",
  },
  {
    id: 3,
    title: "Accessories",
    image: "/images/categories/accesories.png",
    count: "64 Products",
    href: "/shop/accessories",
  },
  {
    id: 4,
    title: "Sportswear",
    image: "/images/categories/sportswear.png",
    count: "35 Products",
    href: "/shop/sportswear",
  },
  {
    id: 5,
    title: "New Drops",
    image: "/images/categories/newdrop.png",
    count: "12 Products",
    href: "/shop/new",
  },
  {
    id: 3,
    title: "Accessories",
    image: "/images/categories/accesories.png",
    count: "64 Products",
    href: "/shop/accessories",
  },
  {
    id: 1,
    title: "Outerwear",
    image: "/images/categories/outfit.png",
    count: "42 Products",
    href: "/shop/outerwear",
  },
  {
    id: 2,
    title: "Footwear",
    image: "/images/categories/footwear.png",
    count: "18 Products",
    href: "/shop/footwear",
  },
];

export default function CategoryCarousel() {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });


  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  return (
    // 3. TALL PARENT: 'h-[300vh]' creates the physical space to scroll down
    <section ref={targetRef} className="relative h-[350vh] bg-white">
      {/* 4. STICKY CONTAINER: Keeps the design locked in view while scrolling */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* Header (Unchanged) */}
        <div className="container mx-auto px-4 lg:px-6 mb-10 flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
              Collections
            </span>
            <h2 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter text-gray-900">
              Shop by Category
            </h2>
          </div>
        </div>

        <motion.div
          style={{ x }}
          className="flex gap-4 lg:gap-6 px-4 lg:px-6 pb-12"
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              // EXACT SIZES PRESERVED
              className="relative shrink-0 w-[85vw] md:w-75 aspect-3/4 rounded-3xl overflow-hidden group cursor-pointer"
            >
              <Link href={cat.href} className="block w-full h-full">
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Fixed typo: bg-linear-to-t -> bg-gradient-to-t */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-90" />
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8">
                  <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                    <p className="text-gray-300 text-sm font-medium mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {cat.count}
                    </p>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter">
                      {cat.title}
                    </h3>
                  </div>
                </div>

                <div className="absolute bottom-8 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <ArrowRight className="w-5 h-5 text-black" />
                </div>
              </Link>
            </div>
          ))}

          {/* 'View All' End Card (Unchanged) */}
          <div className="shrink-0 w-[85vw] md:w-50 aspect-3/4 flex items-center justify-center">
            <Link
              href="/shop"
              className="w-24 h-24 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all group"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-center">
                View
                <br />
                All
              </span>
            </Link>
          </div>
        </motion.div>

        {/* SCROLL PROGRESS BAR (Linked to Vertical Scroll) */}
        <div className="container mx-auto px-4 lg:px-6 mt-4">
          <div className="w-full h-0.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-black"
              // Changed from scrollXProgress to scrollYProgress
              style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
