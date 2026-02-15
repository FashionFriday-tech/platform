'use client';
import { CartItemsCard, OrderSummary } from '@/features/cart';
import { bagItems } from '@/data/bagItems';
import { ShoppingBagIcon, ChevronDownIcon } from '@ff/ui';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CheckoutStages from '../../_components/CheckoutProgress';

export default function CartPage() {
  const freeShippingThreshold = 5000;
  const currentTotal = 3798;
  const progress = Math.min((currentTotal / freeShippingThreshold) * 100, 100);
  const remaining = freeShippingThreshold - currentTotal;

  return (
    <div className="bg-background text-foreground min-h-screen px-2 transition-colors duration-300 md:px-6 lg:py-20">
      <CheckoutStages currentStage={1} />
      <main className="max-w-8xl mx-auto">
        <div className="w-full">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
            {/* Left Column: Items & Shipping */}
            <div className="flex-1 space-y-10">
              {/* 2. Cart Items List */}
              <div>
                {bagItems.length > 0 ? (
                  bagItems.map((item) => <CartItemsCard key={item.id} item={item} />)
                ) : (
                  <div className="py-24 text-center">
                    <div className="bg-background-muted text-foreground-subtle mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                      <ShoppingBagIcon size={32} />
                    </div>
                    <h2 className="mb-2 text-2xl font-black tracking-tighter uppercase">
                      Your bag is empty
                    </h2>
                    <p className="text-foreground-muted mb-8 text-sm">
                      Seems like you haven't added anything yet.
                    </p>
                    <Link
                      href="/shop"
                      className="bg-foreground text-background inline-block rounded-full px-10 py-4 text-xs font-black tracking-widest uppercase transition-transform active:scale-95"
                    >
                      Explore Collection
                    </Link>
                  </div>
                )}
                <a
                  href="#summary"
                  className="bg-background/80 border-border animate-bounce-subtle group right-6 bottom-28 z-40 mt-10 flex items-center justify-between gap-3 rounded-full border px-6 py-3 backdrop-blur-xl transition-all active:scale-95 lg:hidden"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-foreground-subtle text-[10px] leading-none font-black tracking-[0.2em] uppercase">
                      View
                    </span>
                    <span className="text-foreground font-bold tracking-widest uppercase">
                      Summary
                    </span>
                  </div>

                  <div className="bg-foreground text-background flex h-8 w-8 items-center justify-center rounded-full transition-transform group-hover:translate-y-0.5">
                    <ChevronDownIcon size={16} />
                  </div>
                </a>
              </div>

              {/* 3. Cross-sell Section */}
              {bagItems.length > 0 && (
                <section className="pt-10">
                  <h3 className="text-foreground-subtle mb-6 text-sm font-bold tracking-[0.2em] uppercase">
                    Complete the look
                  </h3>
                  <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="group cursor-pointer">
                        <div className="bg-background-muted border-border relative aspect-3/4 overflow-hidden rounded-4xl border">
                          <div className="bg-foreground/5 absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" />
                          <div className="absolute inset-0 flex animate-pulse items-center justify-center">
                            <img
                              src="/images/placeholders/2.png"
                              alt="ff"
                              className="invert-0 dark:invert"
                            />
                          </div>
                        </div>
                        <div className="mt-4 px-2">
                          <div className="bg-background-muted mb-2 h-3 w-2/3 rounded-full" />
                          <div className="bg-background-muted h-3 w-1/3 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column: Sticky Summary */}
            <aside className="w-full lg:sticky lg:top-24 lg:w-100">
              <OrderSummary />
            </aside>
          </div>

          <div className="h-24 sm:h-12" />
        </div>
      </main>
    </div>
  );
}
