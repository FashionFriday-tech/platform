"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Tag } from "lucide-react";

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
    <section className="w-full bg-white border-t border-gray-100">
      
      {/* --- DESKTOP LAYOUT (Split View) --- */}
      <div className="hidden lg:grid grid-cols-2 min-h-screen">
        
        {/* LEFT: STICKY IMAGE STAGE */}
        <div className="h-screen sticky top-0 overflow-hidden bg-gray-50 border-r border-gray-100">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeProduct.id}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // Custom easing for "luxury" feel
              className="absolute inset-0 w-[90%] h-[90%] mt-[5%] ml-[5%] rounded-4xl overflow-hidden"
            >
              <Image
                src={activeProduct.image}
                alt={activeProduct.title}
                fill
                className="object-cover"
                priority 
              />
              
              {/* Overlay Content on the Image */}
              <div className="absolute inset-0 bg-black/10 p-12 flex flex-col justify-between">
                <div className="self-start">
                   <span className="bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white">
                     {activeProduct.category}
                   </span>
                </div>
                {/* Large Title Overlay */}
                <h2 className="text-8xl font-black text-white mix-blend-overlay opacity-50 uppercase tracking-tighter leading-none break-all">
                  {activeProduct.title.split(" ")[0]} 
                </h2>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT: SCROLLABLE LIST */}
        <div className="flex flex-col py-24 px-12 xl:px-24 justify-center bg-white">
          
          <div className="mb-16">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4">
              Just Dropped
            </span>
            <h2 className="text-5xl font-black uppercase tracking-tight mb-6">
              The New <br/> Collection
            </h2>
            <p className="text-gray-500 max-w-md leading-relaxed">
              Explore the latest additions to our lineup. Engineered for performance, designed for the streets.
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
                <div className="flex items-baseline justify-between relative z-10">
                  <div className="flex flex-col">
                    <h3 className="text-3xl font-bold uppercase text-gray-400 group-hover:text-black transition-colors duration-300">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-2 group-hover:translate-y-0">
                      {product.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-medium text-gray-900">
                      ₹{product.price}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Hover Background Color Block */}
                <div className="absolute inset-0 bg-gray-50 scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 z-0" />
              </Link>
            ))}
          </div>

          <div className="mt-12">
             <Link href="/shop/new" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
                View All Arrivals
             </Link>
          </div>
        </div>
      </div>


      {/* --- MOBILE LAYOUT (Standard Stack) --- */}
      <div className="lg:hidden py-16 px-4">
        <h2 className="text-4xl font-black uppercase tracking-tight mb-8">New Arrivals</h2>
        <div className="grid grid-cols-1 gap-8">
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="group">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                   <span className="bg-white/90 backdrop-blur text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                     {product.category}
                   </span>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold uppercase leading-tight">{product.title}</h3>
                <span className="font-medium">${product.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
}