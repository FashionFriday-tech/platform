"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { StarBadgeIcon, StarsIcon } from "@ff/ui";
import brandLogos from "@/data/brandLogos";
import { Product } from "@ff/schemas";

interface StoreProductCardProps {
  // Use the concrete Product type instead of 'any' to catch errors early
  product: Product;
}

export function CatalogueProductCard({ product }: StoreProductCardProps) {
  // Safety check to prevent crashes if a null product enters the grid
  if (!product) return null;

  const getBrandLogoByName = (name: string) => {
    return brandLogos.find(
      (brand) => brand.name.toLowerCase() === name.toLowerCase()
    )?.logo;
  };

  // Helper to handle original price calculation safely
  const originalPrice = product.price.ogPrice || product.price.sellingPrice * 3;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group cursor-pointer"
    >
      <Link href={`/product/${product.slug}`} className="block cursor-pointer">
        <div className="aspect-4/5 overflow-hidden rounded-4xl lg:rounded-[2.5rem] bg-background-muted relative">
          <img
            src={product.media.mainImage || "/images/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        <div className="mt-1 px-1">
          <div className="flex justify-between items-center text-[8px] md:text-[10px]">
            <img
              src={getBrandLogoByName(product.brand[0])}
              alt={product.brand[0]}
              className="w-8 invert-0 dark:invert"
            />
            <span className="flex gap-1 px-2 py-0.5 justify-center items-center font-bold border border-border rounded-full uppercase text-blue-500">
              <StarBadgeIcon /> {product.attributes.quality}
            </span>
          </div>

          <h2 className="text-[14px] font-bold uppercase truncate tracking-tight text-foreground line-clamp-1">
            {product.name}
          </h2>

          <div className="flex items-center gap-2 text-[11px] mt-1">
            <div className="flex justify-between items-center w-full">
              <span className="flex items-center gap-2">
                <p className="font-medium text-foreground/50 line-through">
                  ₹{originalPrice}
                </p>
                <p className="font-black text-green-500">
                  ₹{product.price.sellingPrice}
                </p>
              </span>
              <span className="flex items-center gap-1 text-foreground-muted text-[10px]">
                <StarsIcon className="text-yellow-500" /> 4.5
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
