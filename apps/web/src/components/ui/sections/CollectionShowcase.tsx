'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { ArrowUpRightIcon, TagIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'framer-motion';

export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

export default function CollectionShowcase({ products }: { products: Product[] }) {
  const [activeProduct, setActiveProduct] = useState<Product>(products[0]);

  return (
    <section className="w-full border-t border-gray-100 bg-white">
      {/* --- DESKTOP LAYOUT (Split View) --- */}
      <div className="hidden min-h-screen grid-cols-2 lg:grid">
        {/* LEFT: STICKY IMAGE STAGE */}
        <div className="sticky top-0 h-screen overflow-hidden border-r border-gray-100 bg-gray-50">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeProduct.id}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // Custom easing for "luxury" feel
              className="absolute inset-0 mt-[5%] ml-[5%] h-[90%] w-[90%] overflow-hidden rounded-4xl"
            >
              <Image
                src={activeProduct.image}
                alt={activeProduct.title}
                fill
                className="object-cover"
                priority
              />

              {/* Overlay Content on the Image */}
              <div className="absolute inset-0 flex flex-col justify-between bg-black/10 p-12">
                <div className="self-start">
                  <span className="rounded-full border border-white bg-white/90 px-3 py-1 text-xs font-bold tracking-widest uppercase backdrop-blur">
                    {activeProduct.category}
                  </span>
                </div>
                {/* Large Title Overlay */}
                <h2 className="text-8xl leading-none font-black tracking-tighter break-all text-white uppercase opacity-50 mix-blend-overlay">
                  {activeProduct.title.split(' ')[0]}
                </h2>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT: SCROLLABLE LIST */}
        <div className="flex flex-col justify-center bg-white px-12 py-24 xl:px-24">
          <div className="mb-16">
            <span className="mb-4 block text-xs font-bold tracking-widest text-gray-400 uppercase">
              Just Dropped
            </span>
            <h2 className="mb-6 text-5xl font-black tracking-tight uppercase">
              The New <br /> Collection
            </h2>
            <p className="max-w-md leading-relaxed text-gray-500">
              Explore the latest additions to our lineup. Engineered for performance, designed for
              the streets.
            </p>
          </div>

          <div className="flex flex-col">
            {products.map((product) => (
              <Link
                href={`/product/${product.id}`}
                key={product.id}
                onMouseEnter={() => setActiveProduct(product)} // SWITCH IMAGE ON HOVER
                className="group relative border-t border-gray-200 py-12 transition-all hover:px-4"
              >
                <div className="relative z-10 flex items-baseline justify-between">
                  <div className="flex flex-col">
                    <h3 className="text-3xl font-bold text-gray-400 uppercase transition-colors duration-300 group-hover:text-black">
                      {product.title}
                    </h3>
                    <p className="mt-2 -translate-y-2 text-sm text-gray-400 opacity-0 transition-opacity duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xl font-medium text-gray-900">₹{product.price}</span>
                    <div className="flex h-10 w-10 -translate-x-4 items-center justify-center rounded-full bg-black text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      <ArrowUpRightIcon className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Hover Background Color Block */}
                <div className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-gray-50 transition-transform duration-500 group-hover:scale-y-100" />
              </Link>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/shop/new"
              className="inline-flex items-center gap-2 border-b-2 border-black pb-1 text-sm font-bold tracking-widest uppercase transition-colors hover:border-gray-600 hover:text-gray-600"
            >
              View All Arrivals
            </Link>
          </div>
        </div>
      </div>

      {/* --- MOBILE LAYOUT (Standard Stack) --- */}
      <div className="px-4 py-16 lg:hidden">
        <h2 className="mb-8 text-4xl font-black tracking-tight uppercase">New Arrivals</h2>
        <div className="grid grid-cols-1 gap-8">
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="group">
              <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
                <Image src={product.image} alt={product.title} fill className="object-cover" />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-widest uppercase backdrop-blur">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <h3 className="text-xl leading-tight font-bold uppercase">{product.title}</h3>
                <span className="font-medium">${product.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
