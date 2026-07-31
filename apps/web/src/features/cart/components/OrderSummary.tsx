'use client';

import { useState } from 'react';
import Link from 'next/link';

import { ArrowRightIcon, ChevronUpIcon, CloseIcon, ShieldCheckIcon, TagIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';

import { useCart } from '../hooks/use-cart';

export function OrderSummary() {
  const { totals, itemCount, hasItems, isMounted } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const renderSummaryCard = (isModal = false) => (
    <div
      className={`bg-white text-foreground border-border rounded-[2.5rem] border p-6 shadow-xl md:p-8 lg:p-8 dark:bg-zinc-900`}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-foreground text-2xl font-medium tracking-tight">Summary</h2>
        <div className="flex items-center gap-3">
          <span className="border-border text-foreground -skew-x-[12deg] rounded-lg border px-3 py-1 text-[10px] font-black tracking-widest uppercase">
            <span className="skew-x-[12deg] block">
              {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
            </span>
          </span>
          {isModal && (
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-foreground-muted hover:text-foreground -skew-x-[12deg] flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border transition-colors"
              aria-label="Close summary"
            >
              <span className="skew-x-[12deg]">
                <CloseIcon size={16} />
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-5 text-[15px]">
        <div className="text-foreground-muted flex justify-between">
          <span className="font-medium">Subtotal</span>
          <span className="text-foreground font-semibold">₹{subtotal.toLocaleString()}</span>
        </div>

        {standardDiscount > 0 && (
          <div className="text-foreground flex items-center justify-between font-medium">
            <div className="flex flex-col">
              <span>Catalogue Savings</span>
              <span className="text-[10px] tracking-tighter uppercase opacity-70">
                Instant Discount
              </span>
            </div>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              - ₹{standardDiscount.toLocaleString()}
            </span>
          </div>
        )}

        {appliedPromo && promoDiscount > 0 && (
          <div className="text-foreground flex items-center justify-between font-medium">
            <div className="flex flex-col">
              <span className="flex items-center gap-2">Promo Discount</span>
              <span className="text-[10px] tracking-tighter uppercase opacity-70">
                Code: {appliedPromo}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                - ₹{promoDiscount.toLocaleString()}
              </span>
              <button
                type="button"
                onClick={handleRemovePromo}
                className="text-foreground-muted hover:text-foreground cursor-pointer text-xs underline"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        <div className="text-foreground-muted flex justify-between">
          <span>Shipping</span>
          <span className="text-[11px] font-semibold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
            Free Delivery
          </span>
        </div>

        <div className="border-border mt-2 border-t pt-5">
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-foreground-muted text-[10px] font-bold tracking-[0.2em] uppercase">
                Total
              </span>
              <p className="text-foreground-subtle text-[10px] tracking-wide">Inclusive of all taxes</p>
            </div>
            <span className="text-foreground text-3xl font-bold tracking-tighter">
              ₹{total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Promo Code Input - Crossed Style */}
      <div className="border-border bg-foreground/5 relative mt-8 mb-8 -skew-x-[12deg] overflow-hidden rounded-xl border shadow-xs">
        <div className="text-foreground-subtle pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 skew-x-[12deg]">
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
          placeholder="ENTER PROMO CODE"
          className="bg-transparent text-foreground placeholder:text-foreground-subtle/50 w-full py-3.5 pr-24 pl-12 text-xs font-black tracking-widest uppercase skew-x-[12deg] focus:outline-none"
        />
        <button
          type="button"
          onClick={() => {
            handleApplyPromo();
          }}
          className="bg-foreground text-background absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-lg px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-opacity hover:opacity-90 active:scale-95"
        >
          <span className="skew-x-[12deg] block">Apply</span>
        </button>
      </div>

      {!isModal && (
        <>
          {/* Desktop Checkout Button */}
          {hasItems ? (
            <Link
              href="/checkout/review"
              className="bg-foreground text-background shadow-brand/10 group hidden w-full -skew-x-[12deg] cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-zinc-800 py-4 font-black tracking-widest uppercase shadow-xl transition-all hover:opacity-95 active:scale-[0.98] lg:flex dark:border-zinc-300"
            >
              <span className="flex skew-x-[12deg] items-center gap-2 text-xs font-black tracking-widest uppercase">
                <ShieldCheckIcon size={16} className="text-emerald-400" />
                Checkout Now
                <ArrowRightIcon size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ) : (
            <button
              disabled
              className="bg-foreground/20 text-foreground/40 hidden w-full -skew-x-[12deg] cursor-not-allowed items-center justify-center gap-2.5 rounded-xl py-4 font-black tracking-widest uppercase lg:flex"
            >
              <span className="skew-x-[12deg]">Your Bag is Empty</span>
            </button>
          )}
        </>
      )}

      {/* Trust Badge */}
      <div className="border-border text-foreground-muted mt-8 flex items-center justify-center gap-3 border-t pt-6 text-[10px] font-bold tracking-[0.2em] uppercase">
        <ShieldCheckIcon size={16} className="text-emerald-600 dark:text-emerald-400" />
        <span>Secure Checkout</span>
      </div>
    </div>
  );

  return (
    <section id="summary" className="w-full transition-colors">
      {/* Desktop Main Summary Card Only */}
      <div className="hidden lg:block">
        {renderSummaryCard(false)}
      </div>

      {/* Mobile Sticky Quick-Action Bar & Attached Summary Card Drawer */}
      {hasItems && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex w-full flex-col items-center transform-gpu will-change-transform lg:hidden">
          {/* Top Summary Button Tab - Fixed on Top, Cone / Corn Crossed Two Sides with Rounded Shape */}
          <div className="pointer-events-auto z-20 flex w-full justify-center">
            <button
              type="button"
              onClick={() => {
                setIsExpanded((prev) => !prev);
              }}
              className="relative -mb-px flex h-10 w-72 cursor-pointer items-center justify-center transition-all active:scale-98 sm:w-80"
              aria-label="Toggle Summary"
            >
              {/* Background SVG Tab: Cone shape crossed on both sides with rounded top corners */}
              <svg
                viewBox="0 0 300 40"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 h-full w-full drop-shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
              >
                {/* 100% Solid Opaque Fill */}
                <path
                  d="M 0 40 L 26 8 Q 32 0 44 0 L 256 0 Q 268 0 274 8 L 300 40 Z"
                  className="fill-white dark:fill-zinc-900"
                />
                {/* Border Stroke for Top & Slanted Sides */}
                <path
                  d="M 0 40 L 26 8 Q 32 0 44 0 L 256 0 Q 268 0 274 8 L 300 40"
                  fill="none"
                  className="stroke-border/80 dark:stroke-zinc-700"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Text & Icon Content */}
              <span className="relative z-10 flex items-center justify-center gap-2 text-foreground">
                <span className="text-[10px] font-black tracking-[0.25em] uppercase">
                  Summary
                </span>
                <motion.span
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronUpIcon size={12} />
                </motion.span>
              </span>
            </button>
          </div>

          {/* Attached Summary Drawer - Flat Bottom to Feel Attached to Bottom Bar, Solid White */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                className="pointer-events-auto w-full overflow-hidden"
              >
                <div className="mx-auto max-w-lg px-2 sm:px-4">
                  <div className="bg-white text-foreground border-border/80 max-h-[70vh] space-y-5 overflow-y-auto rounded-t-3xl rounded-b-none border-t border-x p-6 shadow-2xl dark:bg-zinc-900">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-foreground text-2xl font-medium tracking-tight">Summary</h2>
                      <div className="flex items-center gap-3">
                        <span className="border-border text-foreground -skew-x-[12deg] rounded-lg border px-3 py-1 text-[10px] font-black tracking-widest uppercase">
                          <span className="skew-x-[12deg] block">
                            {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsExpanded(false);
                          }}
                          className="text-foreground-muted hover:text-foreground -skew-x-[12deg] flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border transition-colors"
                          aria-label="Close summary"
                        >
                          <span className="skew-x-[12deg]">
                            <CloseIcon size={16} />
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-4 text-[14px]">
                      <div className="text-foreground-muted flex justify-between">
                        <span className="font-medium">Subtotal</span>
                        <span className="text-foreground font-semibold">₹{subtotal.toLocaleString()}</span>
                      </div>

                      {standardDiscount > 0 && (
                        <div className="text-foreground flex items-center justify-between font-medium">
                          <div className="flex flex-col">
                            <span>Catalogue Savings</span>
                            <span className="text-[10px] tracking-tighter uppercase opacity-70">
                              Instant Discount
                            </span>
                          </div>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            - ₹{standardDiscount.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {appliedPromo && promoDiscount > 0 && (
                        <div className="text-foreground flex items-center justify-between font-medium">
                          <div className="flex flex-col">
                            <span className="flex items-center gap-2">Promo Discount</span>
                            <span className="text-[10px] tracking-tighter uppercase opacity-70">
                              Code: {appliedPromo}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              - ₹{promoDiscount.toLocaleString()}
                            </span>
                            <button
                              type="button"
                              onClick={handleRemovePromo}
                              className="text-foreground-muted hover:text-foreground cursor-pointer text-xs underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="text-foreground-muted flex justify-between">
                        <span>Shipping</span>
                        <span className="text-[11px] font-semibold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                          Free Delivery
                        </span>
                      </div>

                      <div className="border-border/80 mt-2 border-t pt-4">
                        <div className="flex items-end justify-between">
                          <div className="flex flex-col">
                            <span className="text-foreground-muted text-[10px] font-bold tracking-[0.2em] uppercase">
                              Total
                            </span>
                            <p className="text-foreground-subtle text-[10px] tracking-wide">Inclusive of all taxes</p>
                          </div>
                          <span className="text-foreground text-3xl font-bold tracking-tighter">
                            ₹{total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Promo Code Input - Crossed Style */}
                    <div className="border-border/80 bg-foreground/5 relative mt-6 mb-6 -skew-x-[12deg] overflow-hidden rounded-xl border shadow-xs">
                      <div className="text-foreground-subtle pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 skew-x-[12deg]">
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
                        placeholder="ENTER PROMO CODE"
                        className="bg-transparent text-foreground placeholder:text-foreground-subtle/50 w-full py-3.5 pr-24 pl-12 text-xs font-black tracking-widest uppercase skew-x-[12deg] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          handleApplyPromo();
                        }}
                        className="bg-foreground text-background absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-lg px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-opacity hover:opacity-90 active:scale-95"
                      >
                        <span className="skew-x-[12deg] block">Apply</span>
                      </button>
                    </div>

                    {/* Trust Badge */}
                    <div className="border-border/60 text-foreground-muted mt-6 flex items-center justify-center gap-3 border-t pt-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                      <ShieldCheckIcon size={16} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Secure Checkout</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Bar Sitting Flush with Flat Bottom of Summary Drawer */}
          <div className="pointer-events-auto border-border/40 bg-white dark:bg-zinc-900 w-full border-t px-6 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
            <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-4">
              <div className="flex flex-col pl-1 shrink-0">
                <span className="text-foreground-muted text-[10px] font-black tracking-widest uppercase">
                  Total
                </span>
                <span className="text-foreground text-2xl leading-none font-black">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              {/* Wide Checkout Button */}
              <Link
                href="/checkout/review"
                className="flex h-12 flex-1 -skew-x-[12deg] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border border-zinc-800 bg-black px-8 text-white shadow-lg transition-transform outline-none active:scale-95 dark:border-zinc-300 dark:bg-white dark:text-black"
              >
                <span className="flex skew-x-[12deg] items-center gap-2 text-xs font-black tracking-widest whitespace-nowrap uppercase">
                  <ShieldCheckIcon size={15} className="text-emerald-400" />
                  Checkout Now
                  <ArrowRightIcon size={15} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
