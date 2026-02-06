"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { StarBadgeIcon, StarsIcon } from "@ff/ui";

interface Product {
  id: string | number;
  slug: string;
  name: string;
  brand: string;
  defaultPrice: number;
  promoImage: string;
  quality:string;
}

interface RelatedProductsProps {
  products: Product[];
  title?: string;
}

export default function RelatedProducts({
  products,
  title = "Related Drops",
}: RelatedProductsProps) {
  return (
    <section className="w-full py-6 lg:py-20">
      {/* Header */}
      <div className="px-4 lg:px-8 mb-8 flex items-end justify-between">
        <h2 className="text-3xl lg:text-4xl font-black uppercase italic tracking-tighter">
          {title}
        </h2>
      </div>

      {/* Scroll Container */}
      <div className="relative">
        <div className="flex gap-4 lg:gap-8 overflow-x-auto no-scrollbar px-4 lg:px-8 pb-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[70vw] md:w-[300px] lg:w-[360px] shrink-0 snap-start"
            >
              {/* Product Card */}
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="group cursor-pointer w-full"
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="block w-full"
                >
                  <div className="w-full aspect-4/5 overflow-hidden rounded-[2.5rem] bg-foreground/5 relative">
                    <img
                      src={product.promoImage || "/images/placeholder.png"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </Link>

                <div className="mt-4 px-1 space-y-1">
                  {/* Brand & Quality */}
                  <div className="flex justify-between items-center mb-0.5 text-[10px]">
                    <img
                      src="/images/brand-logos/nike.png"
                      alt="brand"
                      className="w-10 invert"
                    />

                    <span className="flex gap-1 items-center font-bold border border-border px-1.5 py-0.5 rounded-full text-blue-500 uppercase">
                      <StarBadgeIcon /> {product.quality}
                    </span>
                  </div>

                  {/* Name */}
                  <h2 className="text-[1.2rem] font-bold uppercase truncate tracking-tight text-foreground line-clamp-1">
                    {product.name}
                  </h2>

                  {/* Price & Rating */}
                  <div className="flex items-center gap-2 text-[16px]">
                    <div className="flex justify-between items-center w-full">
                      <span className="flex items-center gap-2">
                        <p className="font-medium text-foreground/40 line-through">
                          ₹14,999
                        </p>
                        <p className="font-black text-green-500">
                          ₹{product.defaultPrice.toLocaleString()}
                        </p>
                      </span>

                      <span className="flex items-center gap-1 text-yellow-500 text-[14px]">
                        <StarsIcon /> 4.5
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
