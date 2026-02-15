'use client';

import { ArrowRightIcon, TagIcon, ShieldCheckIcon } from '@ff/ui';

export function OrderSummary() {
  const subtotal = 3798;
  const discount = 500;
  const shipping = 0;
  const total = subtotal - discount + shipping;

  return (
    <section id="summary" className="w-full transition-colors">
      {/* Container for both Mobile and Desktop */}
      <div className="bg-foreground border-border rounded-[2.5rem] border p-6 shadow-sm md:mb-20 md:p-10 lg:sticky lg:top-24 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-background text-2xl font-medium tracking-tight">Summary</h2>
          <span className="border-background text-background rounded-full border px-4 py-1 text-[10px] font-bold tracking-wider uppercase lg:hidden">
            {/* Logic: 3 Items */} 3 Items
          </span>
        </div>

        {/* 1. Full Breakdown (Visible on all screens now) */}
        <div className="space-y-5 text-[15px]">
          <div className="text-background-muted flex justify-between">
            <span className="font-medium">Subtotal</span>
            <span className="text-background font-semibold">₹{subtotal.toLocaleString()}</span>
          </div>

          <div className="text-background flex items-center justify-between font-medium">
            <div className="flex flex-col">
              <span className="flex items-center gap-2">Discount</span>
              <span className="text-[10px] tracking-tighter uppercase opacity-70">
                Promo: WELCOME10
              </span>
            </div>
            <span>- ₹{discount.toLocaleString()}</span>
          </div>

          <div className="text-background-muted flex justify-between">
            <span>Shipping</span>
            <span className="text-background text-[11px] font-semibold tracking-widest uppercase">
              Calculated at Checkout
            </span>
          </div>

          <div className="border-border mt-2 border-t pt-5">
            <div className="flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-background-muted text-[10px] font-bold tracking-[0.2em] uppercase">
                  Total
                </span>
                <p className="text-background text-[10px] tracking-wide">Inclusive of taxes</p>
              </div>
              <span className="text-background text-3xl font-bold tracking-tighter">
                ₹{total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Promo Code - Optimized for Mobile spacing */}
        <div className="relative mt-10 mb-8">
          <div className="text-background-subtle absolute top-1/2 left-4 -translate-y-1/2">
            <TagIcon size={16} />
          </div>
          <input
            type="text"
            placeholder="Promo Code"
            className="bg-background border-border focus:ring-foreground placeholder:text-background-subtle/50 w-full rounded-2xl border py-4 pr-24 pl-12 text-sm transition-all focus:ring-1 focus:outline-none"
          />
          <button className="bg-foreground text-background absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-xl px-4 py-2.5 text-[10px] font-black transition-opacity hover:opacity-90">
            APPLY
          </button>
        </div>

        {/* 3. Main Checkout Button */}
        <button className="group bg-background text-foreground shadow-brand/10 hidden w-full cursor-pointer items-center justify-center gap-3 rounded-full py-4 font-bold shadow-xl transition-all hover:opacity-95 active:scale-[0.98] lg:flex">
          Checkout Now
          <ArrowRightIcon size={20} className="transition-transform group-hover:translate-x-1" />
        </button>

        {/* 4. Trust Badge */}
        <div className="border-border/50 text-background mt-8 flex items-center justify-center gap-3 border-t pt-6 text-[10px] font-bold tracking-[0.2em] uppercase">
          <ShieldCheckIcon size={16} />
          <span>Secure Checkout SSL</span>
        </div>
      </div>

      {/* 5. Mobile Sticky "Quick-Action" Bar (Extra UX layer) */}
      {/* This only shows on mobile and slides up to give a final nudge */}
      <div className="bg-background fixed right-0 bottom-0 left-0 z-100 p-4 lg:hidden">
        <div className="bg-foreground text-background flex items-center justify-between rounded-full p-2 shadow-2xl">
          <div className="flex flex-col pl-6">
            <span className="text-[10px] font-black tracking-widest uppercase opacity-70">
              Total
            </span>
            <span className="text-xl leading-none font-bold">₹{total.toLocaleString()}</span>
          </div>
          <a
            href="/checkout/review"
            className="bg-background text-foreground flex h-12 items-center gap-2 rounded-full px-6 font-black tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-95"
          >
            Checkout Now <ArrowRightIcon size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
