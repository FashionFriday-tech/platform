"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { StarBadgeIcon, StarsIcon } from "@ff/ui";

interface Product {
  id: string | number;
  slug: string;
  name: string;
  brand: string;
  price: number;
  promoImage: string;
  quality: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group cursor-pointer w-full"
    >
      <Link href={`/product/${product.slug}`} className="block w-full">
        <div className="w-full aspect-4/5 overflow-hidden rounded-[2.5rem] bg-foreground/5 relative">
          <img
            src={product.promoImage || "/images/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      </Link>

      <div className="mt-4 px-1 space-y-1">
        {/* Brand & Quality Badge */}
        <div className="flex justify-between items-center mb-0.5 text-[10px]">
          <img
            src="/images/brand-logos/nike.png"
            alt="brand"
            className="w-10 invert"
          />

          <span className="flex gap-1 justify-center items-center font-bold border border-border px-1.5 py-0.5 rounded-full text-green-500 uppercase">
            <StarBadgeIcon /> {product.quality}
          </span>
        </div>

        {/* Product Name */}
        <h2 className="text-[1.2rem] font-bold uppercase truncate tracking-tight text-foreground line-clamp-1">
          {product.name}
        </h2>

        {/* Pricing & Rating */}
        <div className="flex items-center gap-2 text-[16px]">
          <div className="flex justify-between items-center w-full">
            <span className="flex items-center gap-2">
              <p className="font-medium text-foreground/40 line-through">
                ₹14,999
              </p>
              <p className="font-black text-foreground">
                ₹{product.price.toLocaleString()}
              </p>
            </span>
            <span className="flex items-center gap-1 text-blue-500 text-[14px]">
              <StarsIcon /> 4.5
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
