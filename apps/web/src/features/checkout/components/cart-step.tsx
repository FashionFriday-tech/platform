'use client';

import React from 'react';
import Link from 'next/link';

import { ChevronDownIcon, ShoppingBagIcon } from '@ff/ui';

import { CartItemsCard, OrderSummary, useCart } from '@/features/cart';

import { CheckoutProgress } from './checkout-progress';

export function CartStep() {
  const { cartItems, hasItems, isMounted } = useCart();

  return (
    <div className="bg-background text-foreground min-h-screen pt-20 transition-colors duration-300 sm:pt-24">
      <CheckoutProgress currentStage={1} />
      <main className="max-w-8xl mx-auto px-4 pt-8 md:px-8 lg:pt-12">
        <div className="w-full">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
            {/* Left Column: Items & Shipping */}
            <div className="flex-1 space-y-10">
              {/* Cart Items List */}
              <div>
                {!isMounted ? (
                  <div className="space-y-6">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="bg-background-elevated/40 border-border h-48 animate-pulse rounded-3xl border"
                      />
                    ))}
                  </div>
                ) : hasItems ? (
                  cartItems.map((item) => <CartItemsCard key={item.id} item={item} />)
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
                      href="/catalogue"
                      className="bg-foreground text-background inline-block rounded-full px-10 py-4 text-xs font-black tracking-widest uppercase transition-transform active:scale-95"
                    >
                      Explore Collection
                    </Link>
                  </div>
                )}
                {hasItems && (
                  <Link
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
                  </Link>
                )}
              </div>
            </div>

            {/* Right Column: Sticky Summary */}
            <aside className="w-full lg:sticky lg:top-40 lg:w-100">
              <OrderSummary />
            </aside>
          </div>

          <div className="h-24 sm:h-12" />
        </div>
      </main>
    </div>
  );
}
