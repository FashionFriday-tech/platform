'use client';

import React from 'react';
import Link from 'next/link';

import { ShoppingBagIcon } from '@ff/ui';

import { CartItemsCard, OrderSummary, useCart } from '@/features/cart';

import { CheckoutProgress } from './checkout-progress';

export function CartStep() {
  const { cartItems, hasItems, isMounted } = useCart();

  return (
    <div className="bg-background text-foreground min-h-screen pt-[60px] pb-16 transition-colors duration-300 sm:pt-[92px] lg:pt-[170px] lg:pb-6">
      <CheckoutProgress currentStage={1} />
      <main className="max-w-8xl mx-auto px-4 pt-0 md:px-8">
        <div className="w-full">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* Left Column: Items & Shipping */}
            <div className="flex-1 space-y-4">
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
                      className="border-border bg-foreground text-background hover:bg-foreground/90 inline-flex h-12 -skew-x-[12deg] cursor-pointer items-center justify-center overflow-hidden rounded-xl border px-8 shadow-lg transition-all active:scale-95 dark:border-white/10"
                    >
                      <span className="skew-x-[12deg] text-xs font-black tracking-widest uppercase">
                        Explore Collections
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Sticky Summary */}
            <aside className="w-full self-start lg:sticky lg:top-48 lg:w-[420px] lg:shrink-0">
              <OrderSummary />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
