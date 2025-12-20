"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

// --- TYPES ---
export interface Product {
  id: number;
  title: string;
  tag: string;
  image: string;
}

// Optimized Spring Physics for "Floaty" Feel
const transitionSpec = {
  type: "spring" as const,
  stiffness: 150,
  damping: 25,
  mass: 1,
};

export default function CoverflowCarousel({ products }: { products: Product[] }) {
  // Start in the middle
  const [activeIndex, setActiveIndex] = useState(Math.floor(products.length / 2));

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % products.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  // --- 3D POSITION CALCULATOR ---
const getVariant = (index: number) => {
  const total = products.length;

  // circular offset
  let offset = index - activeIndex;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;

  // 1️⃣ CENTER
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

  // 2️⃣ NEAR SIDES (±1)
  if (Math.abs(offset) === 1) {
    const dir = Math.sign(offset);
    return {
      x: `${dir * 60}%`,
      scale: 0.82,
      rotateY: `${dir * -40}deg`,
      zIndex: 40,
      opacity: 0.75,
      filter: "brightness(0.6) blur(1px)",
    };
  }

  // 3️⃣ FAR SIDES (±2)  ← this is what you were missing
  if (Math.abs(offset) === 2) {
    const dir = Math.sign(offset);
    return {
      x: `${dir * 110}%`,
      scale: 0.65,
      rotateY: `${dir * -55}deg`,
      zIndex: 30,
      opacity: 0.4,
      filter: "brightness(0.35) blur(3px)",
    };
  }

  // 4️⃣ EVERYTHING ELSE (hidden)
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
    <div className="relative w-full h-150 flex flex-col items-center justify-center">
      
      {/* 3D STAGE CONTAINER */}
      <div className="relative w-full max-w-6xl h-112.5 flex items-center justify-center perspective-distant">
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
                className="absolute w-70 md:w-[320px] aspect-3/4 rounded-3xl overflow-hidden cursor-pointer border border-white/10 shadow-2xl bg-zinc-900"
                style={{ transformStyle: "preserve-3d" }}
                onClick={() => setActiveIndex(index)}
              >
                {/* IMAGE */}
                <div className="relative w-full h-full">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 300px, 400px"
                    className="object-cover"
                    priority={isActive} // Critical for LCP
                  />
                  
                  {/* DARK GRADIENT OVERLAY */}
                  {/* <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/0 to-transparent" /> */}

                  {/* TEXT CONTENT (Only visible on center card usually, but kept for style) */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    {/* Top Tag */}
                    <div className="self-start">
                      <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-white border border-white/10">
                        {product.tag}
                      </span>
                    </div>

                    {/* Bottom Title */}
                    {/* <motion.div 
                      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-2xl text-white leading-tight">
                        {product.title}
                      </h3>
                    </motion.div> */}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* CONTROLS (Bottom Center) */}
      <div className="flex gap-4 mt-8 z-50">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-95"
          aria-label="Previous"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-95"
          aria-label="Next"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}