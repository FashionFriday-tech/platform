"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { ArrowLeftIcon, ArrowRightIcon } from "@ff/ui";

// --- TYPES ---
export interface Product {
  id: number;
  title: string;
  slug: string;
  image: string;
}

const transitionSpec = {
  type: "spring" as const,
  stiffness: 150,
  damping: 25,
  mass: 1,
};

export default function CoverflowCarousel({
  products,
}: {
  products: Product[];
}) {
  const [activeIndex, setActiveIndex] = useState(
    Math.floor(products.length / 2)
  );

  const handleNext = () =>
    setActiveIndex((prev) => (prev + 1) % products.length);
  const handlePrev = () =>
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);

  const getVariant = (index: number) => {
    const total = products.length;
    let offset = index - activeIndex;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    if (offset === 0) {
      return {
        x: "0%",
        scale: 1,
        rotateY: 0,
        zIndex: 50,
        opacity: 1,
        filter: "brightness(1) blur(0px)",
      };
    }
    if (Math.abs(offset) === 1) {
      const dir = Math.sign(offset);
      return {
        x: `${dir * 60}%`,
        scale: 0.82,
        rotateY: `${dir * -40}deg`,
        zIndex: 40,
        opacity: 0.8,
        filter: "brightness(0.8) blur(1px)",
      };
    }
    if (Math.abs(offset) === 2) {
      const dir = Math.sign(offset);
      return {
        x: `${dir * 110}%`,
        scale: 0.65,
        rotateY: `${dir * -55}deg`,
        zIndex: 30,
        opacity: 0.6,
        filter: "brightness(0.35) blur(3px)",
      };
    }
    const dir = Math.sign(offset);
    return {
      x: `${dir * 160}%`,
      scale: 0.5,
      rotateY: `${dir * -65}deg`,
      zIndex: 10,
      opacity: 0,
      filter: "brightness(0.2) blur(6px)",
    };
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      {/* 3D STAGE CONTAINER */}
      <div className="relative w-full max-w-6xl h-112 flex items-center justify-center perspective-distant">
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => {
            const variant = getVariant(index);
            const isActive = index === activeIndex;

            return (
              <motion.div
                key={product.id}
                animate={variant}
                initial={variant}
                transition={transitionSpec}
                className="absolute w-70 md:w-[320px] aspect-3/4 rounded-4xl overflow-hidden shadow-xl"
                style={{ transformStyle: "preserve-3d" }}
                onClick={() => !isActive && setActiveIndex(index)}
              >
                {isActive ? (
                  <Link
                    href={`/product/${product.slug}`}
                    className="block w-full h-full cursor-pointer"
                  >
                    <CardContent product={product} isActive={isActive} />
                  </Link>
                ) : (
                  <div className="w-full h-full cursor-pointer">
                    <CardContent product={product} isActive={isActive} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* CONTROLS */}
      <div className="flex gap-10 sm:mt-10 z-40">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-95"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-95"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Sub-component for cleaner code
function CardContent({
  product,
  isActive,
}: {
  product: Product;
  isActive: boolean;
}) {
  return (
    <div className="relative w-full h-full">
      <Image
        src={product.image}
        alt={product.title}
        fill
        sizes="(max-width: 768px) 300px, 400px"
        className="object-cover"
        priority={isActive}
      />
      {/* Optional Title Overlay on Hover */}
      <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-end p-6">
        <p className="text-white font-bold uppercase text-xs tracking-widest">
          {product.title}
        </p>
      </div>
    </div>
  );
}
