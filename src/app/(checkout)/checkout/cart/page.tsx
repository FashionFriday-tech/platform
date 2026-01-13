"use client";

import CartItemCard from "@/components/sections/bag/BagItemCard";
import OrderSummary from "@/components/sections/bag/OrderSummary";
import { bagItems } from "@/data/bagItems";
import { Truck, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function CartPage() {
  const freeShippingThreshold = 5000;
  const currentTotal = 3798;
  const progress = Math.min((currentTotal / freeShippingThreshold) * 100, 100);
  const remaining = freeShippingThreshold - currentTotal;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <main className="mx-auto max-w-8xl px-2 lg:p-16">
        <div className="w-full">
          <div className="flex flex-col lg:flex-row gap-12 lg:items-start">
            {/* Left Column: Items & Shipping */}
            <div className="flex-1 space-y-10">
              {/* 2. Cart Items List */}
              <div>
                {bagItems.length > 0 ? (
                  bagItems.map((item) => (
                    <CartItemCard key={item.id} item={item} />
                  ))
                ) : (
                  <div className="py-24 text-center">
                    <div className="w-20 h-20 rounded-full bg-background-muted mx-auto flex items-center justify-center mb-6 text-foreground-subtle">
                      <ShoppingBag size={32} strokeWidth={1} />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">
                      Your bag is empty
                    </h2>
                    <p className="text-foreground-muted text-sm mb-8">
                      Seems like you haven't added anything yet.
                    </p>
                    <Link
                      href="/shop"
                      className="inline-block rounded-full bg-foreground px-10 py-4 text-xs font-black uppercase tracking-widest text-background transition-transform active:scale-95"
                    >
                      Explore Collection
                    </Link>
                  </div>
                )}
                <a
                  href="#summary"
                  className="lg:hidden bottom-28 right-6 z-40 flex items-center justify-between gap-3 px-6 py-3 bg-background/80 backdrop-blur-xl border border-border rounded-full animate-bounce-subtle group active:scale-95 transition-all mt-10"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-subtle leading-none">
                      View
                    </span>
                    <span className="font-bold uppercase tracking-widest text-foreground">
                      Summary
                    </span>
                  </div>

                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground text-background transition-transform group-hover:translate-y-0.5">
                    <ChevronDown size={16} strokeWidth={3} />
                  </div>
                </a>
              </div>

              {/* 3. Cross-sell Section */}
              {bagItems.length > 0 && (
                <section className="pt-10">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-6 text-foreground-subtle">
                    Complete the look
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="group cursor-pointer">
                        <div className="aspect-3/4 bg-background-muted rounded-4xl overflow-hidden border border-border relative">
                          <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                            <img
                              src="/images/placeholders/2.png"
                              alt="ff"
                              className="invert-0 dark:invert"
                            />
                          </div>
                        </div>
                        <div className="mt-4 px-2">
                          <div className="h-3 w-2/3 bg-background-muted rounded-full mb-2" />
                          <div className="h-3 w-1/3 bg-background-muted rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column: Sticky Summary */}
            <aside className="w-full lg:w-100 lg:sticky lg:top-24">
              <OrderSummary />
            </aside>
          </div>

          <div className="h-24 sm:h-12" />
        </div>
      </main>
    </div>
  );
}
