"use client";

import { ArrowRight, Tag, ShieldCheck, ChevronUp } from "lucide-react";

export default function OrderSummary() {
  const subtotal = 3798;
  const discount = 500;
  const shipping = 0;
  const total = subtotal - discount + shipping;

  return (
    <section id="summary" className="w-full transition-colors">
      {/* Container for both Mobile and Desktop */}
      <div className="bg-foreground p-6 md:p-10 md:mb-20 lg:p-8 rounded-[2.5rem] border border-border lg:sticky lg:top-24 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-medium tracking-tight text-background">Summary</h2>
          <span className="lg:hidden text-[10px] border border-background text-background px-4 py-1 rounded-full font-bold uppercase tracking-wider">
            {/* Logic: 3 Items */} 3 Items
          </span>
        </div>

        {/* 1. Full Breakdown (Visible on all screens now) */}
        <div className="space-y-5 text-[15px]">
          <div className="flex justify-between text-background-muted">
            <span className="font-medium">Subtotal</span>
            <span className="font-semibold text-background">₹{subtotal.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center text-background font-medium">
            <div className="flex flex-col">
              <span className="flex items-center gap-2">Discount</span>
              <span className="text-[10px] opacity-70 uppercase tracking-tighter">Promo: WELCOME10</span>
            </div>
            <span>- ₹{discount.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-background-muted">
            <span>Shipping</span>
            <span className="font-semibold text-background uppercase text-[11px] tracking-widest">Calculated at Checkout</span>
          </div>
          
          <div className="border-t border-border pt-5 mt-2">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-background-muted uppercase text-[10px] font-bold tracking-[0.2em]">Total</span>
                <p className="text-[10px] text-background tracking-wide">Inclusive of taxes</p>
              </div>
              <span className="text-3xl font-bold tracking-tighter text-background">₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 2. Promo Code - Optimized for Mobile spacing */}
        <div className="relative mt-10 mb-8">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-background-subtle">
            <Tag size={16} strokeWidth={1.5} />
          </div>
          <input 
            type="text" 
            placeholder="Promo Code" 
            className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-24 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all placeholder:text-background-subtle/50"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-foreground text-background text-[10px] font-black px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer">
            APPLY
          </button>
        </div>

        {/* 3. Main Checkout Button */}
        <button className="hidden lg:flex w-full group bg-background text-foreground py-4 rounded-full font-bold items-center justify-center gap-3 hover:opacity-95 transition-all active:scale-[0.98] cursor-pointer shadow-xl shadow-brand/10">
          Checkout Now
          <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
        </button>

        {/* 4. Trust Badge */}
        <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-center gap-3 text-[10px] text-background uppercase tracking-[0.2em] font-bold">
          <ShieldCheck size={16}/>
          <span>Secure Checkout SSL</span>
        </div>
      </div>

      {/* 5. Mobile Sticky "Quick-Action" Bar (Extra UX layer) */}
      {/* This only shows on mobile and slides up to give a final nudge */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-100 p-4 bg-background">
         <div className="bg-foreground text-background rounded-full p-2 flex items-center justify-between shadow-2xl">
            <div className="pl-6 flex flex-col">
               <span className="text-[10px] opacity-70 uppercase font-black tracking-widest">Total</span>
               <span className="text-xl font-bold leading-none">₹{total.toLocaleString()}</span>
            </div>
            <a href="/checkout/review" className="bg-background text-foreground h-12 px-6 rounded-full font-black uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
               Checkout Now <ArrowRight size={16} />
            </a>
         </div>
      </div>
    </section>
  );
}