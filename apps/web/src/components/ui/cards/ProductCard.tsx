'use client';

import Image from 'next/image';
import Link from 'next/link';

import { StarBadgeIcon, StarsIcon } from '@ff/ui';
import { motion } from 'motion/react';

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
      className="group w-full cursor-pointer"
    >
      <Link href={`/product/${product.slug}`} className="block w-full">
        <div className="bg-foreground/5 relative aspect-4/5 w-full overflow-hidden rounded-[2.5rem]">
          <Image
            src={product.promoImage || '/images/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="mt-4 space-y-1 px-1">
        {/* Brand & Quality Badge */}
        <div className="mb-0.5 flex items-center justify-between text-[10px]">
          <Image
            src="/images/brand-logos/nike.png"
            alt="Nike brand logo"
            width={40}
            height={40}
            className="invert"
          />

          <span className="border-border flex items-center justify-center gap-1 rounded-full border px-1.5 py-0.5 font-bold text-green-500 uppercase">
            <StarBadgeIcon /> {product.quality}
          </span>
        </div>

        {/* Product Name */}
        <h2 className="text-foreground line-clamp-1 truncate text-[1.2rem] font-bold tracking-tight uppercase">
          {product.name}
        </h2>

        {/* Pricing & Rating */}
        <div className="flex items-center gap-2 text-[16px]">
          <div className="flex w-full items-center justify-between">
            <span className="flex items-center gap-2">
              <p className="text-foreground/40 font-medium line-through">₹14,999</p>
              <p className="text-foreground font-black">₹{product.price.toLocaleString()}</p>
            </span>
            <span className="flex items-center gap-1 text-[14px] text-blue-500">
              <StarsIcon /> 4.5
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
