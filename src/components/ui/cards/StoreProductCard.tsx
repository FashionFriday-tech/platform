"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RiShieldStarFill } from "react-icons/ri";
import { MdStars } from "react-icons/md";
import brandLogos from "@/data/brandLogos";

interface StoreProductCardProps {
  product: any;
}

export function StoreProductCard({ product }: StoreProductCardProps) {
  const getBrandLogoByName = (name: string) => {
    return brandLogos.find(
      (brand) => brand.name.toLowerCase() === name.toLowerCase()
    )?.logo;
  };

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
            src={product.promoImage || "/images/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      </Link>

      <div className="mt-4 px-1 space-y-1">
        <div className="flex justify-between items-center text-[8px] md:text-[10px]">
          <img
            src={getBrandLogoByName(product.brand)}
            alt={product.brand}
            className="w-8 invert-0 dark:invert"
          />
          <span className="flex gap-1 justify-center items-center font-bold border border-border  rounded-full  uppercase text-blue-500">
            <RiShieldStarFill className=" " /> {product.quality}
          </span>
        </div>

        <h2 className="text-[14px] font-bold uppercase truncate tracking-tight text-foreground line-clamp-1">
          {product.name}
        </h2>

        <div className="flex items-center gap-2 text-[11px]">
          <div className="flex justify-between items-center w-full">
            <span className="flex items-center gap-2">
              <p className="font-medium text-foreground/50 line-through">
                ₹{(product.price * 1.5).toLocaleString()}{" "}
              </p>
              <p className="font-black text-green-500">
                ₹{product.price.toLocaleString()}
              </p>
            </span>
            <span className="flex items-center gap-1 text-foreground-muted text-[10px]">
              <MdStars className="text-yellow-500" /> {product.rating || "4.5"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
