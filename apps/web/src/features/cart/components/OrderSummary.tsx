'use client';

import { useState } from 'react';
import Link from 'next/link';

import { ArrowRightIcon, ShieldCheckIcon, TagIcon } from '@ff/ui';
import { toast } from 'sonner';

import { useCart } from '../hooks/use-cart';

export function OrderSummary() {
  const { totals, itemCount, hasItems, isMounted } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const subtotal = totals.subtotal;
  const standardDiscount = totals.discount;
  const shipping = totals.shipping;

  const total = Math.max(0, subtotal - promoDiscount + shipping);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      return;
    }

    if (code === 'WELCOME10') {
      const discountAmount = Math.round(subtotal * 0.1);
      setPromoDiscount(discountAmount);
      setAppliedPromo('WELCOME10');
      toast.success('Promo code WELCOME10 applied (10% OFF)!');
    } else if (code === 'FF500' && subtotal >= 2000) {
      setPromoDiscount(500);
      setAppliedPromo('FF500');
      toast.success('Promo code FF500 applied (₹500 OFF)!');
    } else {
      toast.error('Invalid or expired promo code');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    setPromoCode('');
    toast.info('Promo code removed');
  };

  if (!isMounted) {
    return <div className="bg-foreground/5 h-96 animate-pulse rounded-[2.5rem]" />;
  }

  return (
    <section id="summary" className="w-full transition-colors">
      {/* Container for Desktop & Mobile */}
      <div className="bg-foreground border-border rounded-[2.5rem] border p-6 shadow-sm md:p-8 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-background text-2xl font-medium tracking-tight">Summary</h2>
          <span className="border-background text-background rounded-full border px-4 py-1 text-[10px] font-bold tracking-wider uppercase">
            {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {/* Breakdown */}
        <div className="space-y-5 text-[15px]">
          <div className="text-background-muted flex justify-between">
            <span className="font-medium">Subtotal</span>
            <span className="text-background font-semibold">₹{subtotal.toLocaleString()}</span>
          </div>

          {standardDiscount > 0 && (
            <div className="text-background flex items-center justify-between font-medium">
              <div className="flex flex-col">
                <span>Catalogue Savings</span>
                <span className="text-[10px] tracking-tighter uppercase opacity-70">
                  Instant Discount
                </span>
              </div>
              <span className="font-semibold text-emerald-400">
                - ₹{standardDiscount.toLocaleString()}
              </span>
            </div>
          )}

          {appliedPromo && promoDiscount > 0 && (
            <div className="text-background flex items-center justify-between font-medium">
              <div className="flex flex-col">
                <span className="flex items-center gap-2">Promo Discount</span>
                <span className="text-[10px] tracking-tighter uppercase opacity-70">
                  Code: {appliedPromo}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-emerald-400">
                  - ₹{promoDiscount.toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={handleRemovePromo}
                  className="text-background/60 hover:text-background cursor-pointer text-xs underline"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <div className="text-background-muted flex justify-between">
            <span>Shipping</span>
            <span className="text-[11px] font-semibold tracking-widest text-emerald-400 uppercase">
              Free Delivery
            </span>
          </div>

          <div className="border-border/30 mt-2 border-t pt-5">
            <div className="flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-background-muted text-[10px] font-bold tracking-[0.2em] uppercase">
                  Total
                </span>
                <p className="text-background text-[10px] tracking-wide">Inclusive of all taxes</p>
              </div>
              <span className="text-background text-3xl font-bold tracking-tighter">
                ₹{total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Promo Code Input */}
        <div className="relative mt-8 mb-8">
          <div className="text-background-subtle absolute top-1/2 left-4 -translate-y-1/2">
            <TagIcon size={16} />
          </div>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleApplyPromo();
              }
            }}
            placeholder="Enter Promo Code (e.g. WELCOME10)"
            className="bg-background text-foreground border-border focus:ring-foreground placeholder:text-foreground-subtle/50 w-full rounded-2xl border py-4 pr-24 pl-12 text-sm uppercase transition-all focus:ring-1 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => {
              handleApplyPromo();
            }}
            className="bg-foreground text-background absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-xl px-4 py-2.5 text-[10px] font-black tracking-widest uppercase transition-opacity hover:opacity-90 active:scale-95"
          >
            Apply
          </button>
        </div>

        {/* Desktop Checkout Button */}
        {hasItems ? (
          <Link
            href="/checkout/review"
            className="bg-background text-foreground shadow-brand/10 group hidden w-full cursor-pointer items-center justify-center gap-3 rounded-full py-4 font-bold shadow-xl transition-all hover:opacity-95 active:scale-[0.98] lg:flex"
          >
            Checkout Now
            <ArrowRightIcon size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
        ) : (
          <button
            disabled
            className="bg-background/40 text-foreground/40 hidden w-full cursor-not-allowed items-center justify-center gap-3 rounded-full py-4 font-bold lg:flex"
          >
            Your Bag is Empty
          </button>
        )}

        {/* Trust Badge */}
        <div className="border-border/20 text-background mt-8 flex items-center justify-center gap-3 border-t pt-6 text-[10px] font-bold tracking-[0.2em] uppercase">
          <ShieldCheckIcon size={16} className="text-emerald-400" />
          <span>Secure Checkout</span>
        </div>
      </div>

      {/* Mobile Sticky Quick-Action Bar */}
      {hasItems && (
        <div className="border-border/40 bg-background/95 fixed inset-x-0 bottom-0 z-50 border-t px-6 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_20px_rgba(0,0,0,0.2)] backdrop-blur-md transform-gpu will-change-transform lg:hidden">
          <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-3">
            <div className="flex flex-col pl-1">
              <span className="text-foreground-muted text-[10px] font-black tracking-widest uppercase">
                Total
              </span>
              <span className="text-foreground text-xl leading-tight font-black">
                ₹{total.toLocaleString()}
              </span>
            </div>
            <Link
              href="/checkout/review"
              className="flex h-12 flex-1 -skew-x-[12deg] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border border-zinc-800 bg-black text-white shadow-lg transition-transform outline-none active:scale-95 dark:border-zinc-300 dark:bg-white dark:text-black"
            >
              <span className="flex skew-x-[12deg] items-center gap-2 text-sm font-black tracking-widest whitespace-nowrap uppercase">
                Checkout Now <ArrowRightIcon size={16} />
              </span>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
