"use client";

import CartItemCard from "@/components/sections/bag/BagItemCard";
import OrderSummary from "@/components/sections/bag/OrderSummary";
import { bagItems } from "@/data/bagItems";
import { Truck, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CartPage() {
  const freeShippingThreshold = 5000;
  const currentTotal = 3798; 
  const progress = Math.min((currentTotal / freeShippingThreshold) * 100, 100);
  const remaining = freeShippingThreshold - currentTotal;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-10 sm:py-16">
        <div className="w-full">
          {/* Header Section */}
          <header className="mb-12 border-b border-border pb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-5xl font-black uppercase tracking-tighter sm:text-7xl lg:text-8xl">
                  Bag
                </h1>
                <p className="mt-2 text-sm font-medium text-foreground-muted uppercase tracking-widest">
                  Review your selection • {bagItems.length} {bagItems.length === 1 ? "Item" : "Items"}
                </p>
              </div>
              
              <Link 
                href="/shop" 
                className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-brand transition-colors"
              >
                Continue Shopping
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </header>

          <div className="flex flex-col lg:flex-row gap-12 lg:items-start">
            {/* Left Column: Items & Shipping */}
            <div className="flex-1 space-y-10">
              
              {/* 1. Shipping Progress Bar */}
              <div className="rounded-4xl bg-background-muted/30 border border-border p-6 md:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-foreground">
                    <Truck size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest">
                      {remaining > 0 
                        ? `Add ₹${remaining.toLocaleString()} more for free shipping` 
                        : "You've unlocked free shipping!"}
                    </p>
                  </div>
                </div>
                
                <div className="h-2 w-full bg-background border border-border rounded-full overflow-hidden p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-foreground rounded-full"
                  />
                </div>
              </div>

              {/* 2. Cart Items List */}
              <div className="divide-y divide-border border-t border-border">
                {bagItems.length > 0 ? (
                  bagItems.map((item) => (
                    <CartItemCard key={item.id} item={item} />
                  ))
                ) : (
                  <div className="py-24 text-center">
                    <div className="w-20 h-20 rounded-full bg-background-muted mx-auto flex items-center justify-center mb-6 text-foreground-subtle">
                      <ShoppingBag size={32} strokeWidth={1} />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Your bag is empty</h2>
                    <p className="text-foreground-muted text-sm mb-8">Seems like you haven't added anything yet.</p>
                    <Link href="/shop" className="inline-block rounded-full bg-foreground px-10 py-4 text-xs font-black uppercase tracking-widest text-background transition-transform active:scale-95">
                      Explore Collection
                    </Link>
                  </div>
                )}
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
                             <ShoppingBag size={24} className="text-foreground/10" />
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
              
              <div className="mt-6 flex items-center justify-center gap-6 text-foreground-subtle">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Secure Checkout
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Free Returns
                </div>
              </div>
            </aside>
          </div>

          <div className="h-24 sm:h-12" />
        </div>
      </main>
    </div>
  );
}