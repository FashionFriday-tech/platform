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
      className={`bg-white text-black border-zinc-200 rounded-[2.5rem] border p-6 shadow-xl md:p-8 lg:p-8 dark:bg-white dark:text-black dark:border-zinc-200`}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-black text-2xl font-medium tracking-tight">Summary</h2>
        <div className="flex items-center gap-3">
          <span className="border-zinc-300 text-black -skew-x-[8deg] rounded-lg border px-3 py-1 text-[10px] font-black tracking-widest uppercase">
            <span className="skew-x-[8deg] block">
              {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
            </span>
          </span>
          {isModal && (
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-zinc-500 hover:text-black -skew-x-[8deg] flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 transition-colors"
              aria-label="Close summary"
            >
              <span className="skew-x-[8deg]">
                <CloseIcon size={16} />
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-5 text-[15px]">
        <div className="text-zinc-500 flex justify-between">
          <span className="font-medium">Subtotal</span>
          <span className="text-black font-semibold">₹{subtotal.toLocaleString()}</span>
        </div>

        {standardDiscount > 0 && (
          <div className="text-black flex items-center justify-between font-medium">
            <div className="flex flex-col">
              <span>Catalogue Savings</span>
              <span className="text-[10px] tracking-tighter uppercase text-zinc-500">
                Instant Discount
              </span>
            </div>
            <span className="font-semibold text-emerald-600">
              - ₹{standardDiscount.toLocaleString()}
            </span>
          </div>
        )}

        {appliedPromo && promoDiscount > 0 && (
          <div className="text-black flex items-center justify-between font-medium">
            <div className="flex flex-col">
              <span className="flex items-center gap-2">Promo Discount</span>
              <span className="text-[10px] tracking-tighter uppercase text-zinc-500">
                Code: {appliedPromo}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-emerald-600">
                - ₹{promoDiscount.toLocaleString()}
              </span>
              <button
                type="button"
                onClick={handleRemovePromo}
                className="text-zinc-500 hover:text-black cursor-pointer text-xs underline"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        <div className="text-zinc-500 flex justify-between">
          <span>Shipping</span>
          <span className="text-[11px] font-semibold tracking-widest text-emerald-600 uppercase">
            Free Delivery
          </span>
        </div>

        <div className="border-zinc-200 mt-2 border-t pt-5">
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase">
                Total
              </span>
              <p className="text-zinc-400 text-[10px] tracking-wide">Inclusive of all taxes</p>
            </div>
            <span className="text-black text-3xl font-bold tracking-tighter">
              ₹{total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Promo Code Input - Smooth Curved Style */}
      <div className="border-zinc-200 bg-zinc-50 relative mt-8 mb-8 -skew-x-[8deg] overflow-hidden rounded-xl border shadow-xs dark:bg-zinc-50 dark:border-zinc-200">
        <div className="text-zinc-400 pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 skew-x-[8deg]">
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
          className="bg-transparent text-black placeholder:text-zinc-400 w-full py-3.5 pr-24 pl-12 text-xs font-black tracking-widest uppercase skew-x-[8deg] focus:outline-none dark:text-black dark:placeholder:text-zinc-400"
        />
        <button
          type="button"
          onClick={() => {
            handleApplyPromo();
          }}
          className="bg-black text-white absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-lg px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-opacity hover:opacity-90 active:scale-95 dark:bg-black dark:text-white"
        >
          <span className="skew-x-[8deg] block">Apply</span>
        </button>
      </div>

      {!isModal && (
        <>
          {/* Desktop Checkout Button */}
          {hasItems ? (
            <Link
              href="/checkout/review"
              className="bg-black text-white shadow-brand/10 group hidden w-full -skew-x-[12deg] cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-zinc-900 py-4 font-black tracking-widest uppercase shadow-xl transition-all hover:opacity-95 active:scale-[0.98] lg:flex dark:bg-black dark:text-white dark:border-zinc-900"
            >
              <span className="flex skew-x-[12deg] items-center gap-2 text-xs font-black tracking-widest uppercase text-white dark:text-white">
                <ShieldCheckIcon size={16} className="text-emerald-400" />
                Checkout Now
                <ArrowRightIcon size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ) : (
            <button
              disabled
              className="bg-zinc-200 text-zinc-400 hidden w-full -skew-x-[12deg] cursor-not-allowed items-center justify-center gap-2.5 rounded-xl py-4 font-black tracking-widest uppercase lg:flex"
            >
              <span className="skew-x-[12deg]">Your Bag is Empty</span>
            </button>
          )}
        </>
      )}

      {/* Trust Badge */}
      <div className="border-zinc-200 text-zinc-500 mt-8 flex items-center justify-center gap-3 border-t pt-6 text-[10px] font-bold tracking-[0.2em] uppercase dark:border-zinc-200">
        <ShieldCheckIcon size={16} className="text-emerald-600" />
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
          {/* Top Summary Button Tab - Fixed on Top, Smooth Curved Design for Soft Edge */}
          <div className="pointer-events-auto z-20 flex w-full justify-center">
            <button
              type="button"
              onClick={() => {
                setIsExpanded((prev) => !prev);
              }}
              className="relative -mb-px flex h-10 w-72 cursor-pointer items-center justify-center transition-all active:scale-98 sm:w-80"
              aria-label="Toggle Summary"
            >
              {/* Background SVG Tab: Continuous Smooth Curved Bezier Spline */}
              <svg
                viewBox="0 0 320 40"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 h-full w-full drop-shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
              >
                {/* 100% Solid Pure White Fill in both light and dark mode */}
                <path
                  d="M 0 40 C 18 40 28 34 36 22 L 48 10 C 56 2 68 0 82 0 L 238 0 C 252 0 264 2 272 10 L 284 22 C 292 34 302 40 320 40 Z"
                  fill="#ffffff"
                />
                {/* Smooth Border Stroke (Top and curved sides) */}
                <path
                  d="M 0 40 C 18 40 28 34 36 22 L 48 10 C 56 2 68 0 82 0 L 238 0 C 252 0 264 2 272 10 L 284 22 C 292 34 302 40 320 40"
                  fill="none"
                  stroke="#e4e4e7"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Text & Icon Content */}
              <span className="relative z-10 flex items-center justify-center gap-2 text-black dark:text-black">
                <span className="text-[10px] font-black tracking-[0.25em] uppercase text-black dark:text-black">
                  Summary
                </span>
                <motion.span
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-black dark:text-black"
                >
                  <ChevronUpIcon size={12} />
                </motion.span>
              </span>
            </button>
          </div>

          {/* Attached Summary Drawer - Flat Bottom, Solid White in Dark Mode */}
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
                  <div className="bg-white text-black border-zinc-200/90 max-h-[70vh] space-y-5 overflow-y-auto rounded-t-3xl rounded-b-none border-t border-x p-6 shadow-2xl dark:bg-white dark:text-black dark:border-zinc-200/90">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-black text-2xl font-medium tracking-tight">Summary</h2>
                      <div className="flex items-center gap-3">
                        <span className="border-zinc-300 text-black -skew-x-[8deg] rounded-lg border px-3 py-1 text-[10px] font-black tracking-widest uppercase">
                          <span className="skew-x-[8deg] block">
                            {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsExpanded(false);
                          }}
                          className="text-zinc-500 hover:text-black -skew-x-[8deg] flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 transition-colors"
                          aria-label="Close summary"
                        >
                          <span className="skew-x-[8deg]">
                            <CloseIcon size={16} />
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-4 text-[14px]">
                      <div className="text-zinc-500 flex justify-between">
                        <span className="font-medium">Subtotal</span>
                        <span className="text-black font-semibold">₹{subtotal.toLocaleString()}</span>
                      </div>

                      {standardDiscount > 0 && (
                        <div className="text-black flex items-center justify-between font-medium">
                          <div className="flex flex-col">
                            <span>Catalogue Savings</span>
                            <span className="text-[10px] tracking-tighter uppercase text-zinc-500">
                              Instant Discount
                            </span>
                          </div>
                          <span className="font-semibold text-emerald-600">
                            - ₹{standardDiscount.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {appliedPromo && promoDiscount > 0 && (
                        <div className="text-black flex items-center justify-between font-medium">
                          <div className="flex flex-col">
                            <span className="flex items-center gap-2">Promo Discount</span>
                            <span className="text-[10px] tracking-tighter uppercase text-zinc-500">
                              Code: {appliedPromo}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-emerald-600">
                              - ₹{promoDiscount.toLocaleString()}
                            </span>
                            <button
                              type="button"
                              onClick={handleRemovePromo}
                              className="text-zinc-500 hover:text-black cursor-pointer text-xs underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="text-zinc-500 flex justify-between">
                        <span>Shipping</span>
                        <span className="text-[11px] font-semibold tracking-widest text-emerald-600 uppercase">
                          Free Delivery
                        </span>
                      </div>

                      <div className="border-zinc-200 mt-2 border-t pt-4">
                        <div className="flex items-end justify-between">
                          <div className="flex flex-col">
                            <span className="text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase">
                              Total
                            </span>
                            <p className="text-zinc-400 text-[10px] tracking-wide">Inclusive of all taxes</p>
                          </div>
                          <span className="text-black text-3xl font-bold tracking-tighter">
                            ₹{total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Promo Code Input - Smooth Curved Style */}
                    <div className="border-zinc-200 bg-zinc-50 relative mt-6 mb-6 -skew-x-[8deg] overflow-hidden rounded-xl border shadow-xs dark:bg-zinc-50 dark:border-zinc-200">
                      <div className="text-zinc-400 pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 skew-x-[8deg]">
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
                        className="bg-transparent text-black placeholder:text-zinc-400 w-full py-3.5 pr-24 pl-12 text-xs font-black tracking-widest uppercase skew-x-[8deg] focus:outline-none dark:text-black dark:placeholder:text-zinc-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          handleApplyPromo();
                        }}
                        className="bg-black text-white absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-lg px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-opacity hover:opacity-90 active:scale-95 dark:bg-black dark:text-white"
                      >
                        <span className="skew-x-[8deg] block">Apply</span>
                      </button>
                    </div>

                    {/* Trust Badge */}
                    <div className="border-zinc-200 text-zinc-500 mt-6 flex items-center justify-center gap-3 border-t pt-4 text-[10px] font-bold tracking-[0.2em] uppercase dark:border-zinc-200">
                      <ShieldCheckIcon size={16} className="text-emerald-600" />
                      <span>Secure Checkout</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Bar Sitting Flush with Flat Bottom of Summary Drawer: Solid White in Dark Mode */}
          <div className="pointer-events-auto border-zinc-200/80 bg-white w-full border-t px-6 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_20px_rgba(0,0,0,0.12)] dark:bg-white dark:border-zinc-200/80">
            <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-4">
              <div className="flex flex-col pl-1 shrink-0">
                <span className="text-zinc-500 text-[10px] font-black tracking-widest uppercase dark:text-zinc-500">
                  Total
                </span>
                <span className="text-black text-2xl leading-none font-black dark:text-black">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              {/* Wide Checkout Button: Solid Black in Dark Mode */}
              <Link
                href="/checkout/review"
                className="flex h-12 flex-1 -skew-x-[12deg] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border border-zinc-900 bg-black px-8 text-white shadow-lg transition-transform outline-none active:scale-95 dark:border-zinc-900 dark:bg-black dark:text-white"
              >
                <span className="flex skew-x-[12deg] items-center gap-2 text-xs font-black tracking-widest whitespace-nowrap uppercase text-white dark:text-white">
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
