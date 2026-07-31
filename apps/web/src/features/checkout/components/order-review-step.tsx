'use client';

import React from 'react';
import Image from 'next/image';

import {
  ArrowRightIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CloseIcon,
  MapPinIcon,
  PlusIcon,
  ShieldCheckIcon,
} from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { useCheckoutReview } from '../hooks/use-checkout-review';
import { AddressFormDrawer } from './address-form-drawer';
import { CheckoutProgress } from './checkout-progress';
import { OTPModal } from './otp-modal';

export function OrderReviewStep() {
  const {
    address,
    handleSaveAddress,
    showAddressForm,
    setShowAddressForm,
    isExpanded,
    setIsExpanded,
    isLoggedIn,
    setIsLoggedIn,
    showOTPModal,
    setShowOTPModal,
    pricing,
    cartItems,
    isMounted,
    handleContinue,
  } = useCheckoutReview();

  return (
    <div className="bg-background text-foreground min-h-screen pt-[60px] pb-20 transition-colors duration-300 sm:pt-[92px] lg:pt-[170px] lg:pb-8">
      <CheckoutProgress currentStage={2} />

      <main className="mx-auto max-w-7xl px-4 pt-0 md:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          <div className="flex-1 space-y-8">
            <section>
              <div className="my-4 flex items-center justify-between">
                <h2 className="text-foreground-subtle text-[10px] font-black tracking-[0.2em] uppercase">
                  Shipping Destination
                </h2>
              </div>

              <AnimatePresence mode="wait">
                {address ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-foreground bg-background shadow-foreground/5 flex items-start justify-between rounded-4xl border-2 p-8 shadow-xl"
                  >
                    <div className="flex gap-6">
                      <div className="bg-foreground text-background flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                        <MapPinIcon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black tracking-tight uppercase">
                          {address.recipientName}
                        </p>
                        <p className="text-foreground-muted mt-2 text-xs font-semibold uppercase">
                          {address.building ? `${address.building}, ` : ''}
                          {address.area}
                        </p>
                        <p className="text-foreground-muted text-xs font-semibold uppercase">
                          {address.city} - {address.pincode}
                        </p>
                        <p className="text-foreground-muted mt-3 text-xs font-semibold">
                          Phone: {address.primaryPhone}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowAddressForm(true);
                      }}
                      className="border-border text-foreground hover:border-foreground cursor-pointer rounded-lg border px-4 py-1.5 text-[10px] font-black tracking-widest uppercase transition-all active:scale-95"
                    >
                      Change
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => {
                      setShowAddressForm(true);
                    }}
                    className="border-border hover:border-foreground/50 flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-8 transition-colors active:scale-98"
                  >
                    <div className="bg-foreground/5 flex h-8 w-8 items-center justify-center rounded-lg border border-border">
                      <PlusIcon size={16} />
                    </div>
                    <span className="text-xs font-black tracking-widest uppercase">
                      Add Shipping Address
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            </section>

            <section>
              <h2 className="text-foreground-subtle mb-4 text-[10px] font-black tracking-[0.2em] uppercase">
                Your Selection ({isMounted ? cartItems.length : 0})
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {!isMounted ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="bg-background-elevated/40 border-border h-24 animate-pulse rounded-3xl border"
                      />
                    ))}
                  </div>
                ) : (
                  cartItems.map((item) => {
                    const product = item.product;
                    const mainImage = product?.mainImage || '/images/placeholders/2.png';
                    const name = product?.name || 'Product';
                    const price = (product?.sellingPrice ?? 0) * item.quantity;

                    return (
                      <div
                        key={item.id}
                        className="border-border bg-background-muted/5 flex items-center gap-6 rounded-3xl border p-5"
                      >
                        <div className="bg-background-muted border-border relative h-22 w-20 overflow-hidden rounded-xl border">
                          <Image
                            src={mainImage}
                            alt={name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="line-clamp-2 text-xs font-bold tracking-tight uppercase">{name}</h3>
                          <p className="text-foreground-muted mt-1 text-[10px] font-bold uppercase">
                            Size: {item.size} • Qty: {item.quantity}
                          </p>
                          <p className="text-foreground-muted mt-1 text-[10px] font-bold uppercase">
                            Color: {item.color}
                          </p>
                        </div>
                        <p className="text-sm font-black tracking-tighter">
                          ₹{price.toLocaleString()}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>

          <aside className="sticky top-48 hidden w-96 shrink-0 space-y-4 self-start lg:block">
            <div className="bg-foreground text-background rounded-[2.5rem] p-8 shadow-2xl">
              <h3 className="mb-8 text-center text-[10px] font-black tracking-[0.3em] uppercase opacity-50">
                Checkout Summary
              </h3>

              <div className="mb-10 space-y-4">
                <div className="flex justify-between text-xs font-bold tracking-widest uppercase opacity-80">
                  <span>Subtotal</span>
                  <span>₹{pricing.subtotal.toLocaleString()}</span>
                </div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-xs font-bold tracking-widest text-emerald-400 uppercase">
                    <span>Discount</span>
                    <span>-₹{pricing.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="bg-background/10 my-4 h-px w-full" />
                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black tracking-widest uppercase opacity-50">
                      Total Payable
                    </span>
                    <span className="text-4xl font-black tracking-tighter">
                      ₹{pricing.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="bg-background text-foreground flex w-full items-center justify-center gap-3 rounded-full py-5 text-sm font-black tracking-widest uppercase shadow-xl transition-all active:scale-95"
              >
                {!address && <PlusIcon size={18} />}
                {address ? (isLoggedIn ? 'Pay Now' : 'Verify & Continue') : 'Add Address'}
                <ChevronRightIcon size={18} />
              </button>
            </div>
            <p className="text-foreground-subtle text-center text-[8px] font-bold tracking-widest uppercase opacity-50">
              Secure Payment powered by Stripe & Razorpay
            </p>
          </aside>
        </div>
      </main>

      {/* Mobile Sticky Quick-Action Bar & Attached Summary Card Drawer (Bag Page Design) */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex w-full flex-col items-center lg:hidden">
        {/* Top Summary Button Tab */}
        <div className="pointer-events-auto z-20 flex w-full justify-center">
          <button
            type="button"
            onClick={() => {
              setIsExpanded((prev) => !prev);
            }}
            className="relative -mb-px flex h-[34px] w-64 cursor-pointer items-center justify-center transition-all active:scale-98 sm:w-72"
            aria-label="Toggle Summary"
          >
            {/* Background SVG Tab: Smooth curved edges with compact height */}
            <svg
              viewBox="0 0 320 34"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <path
                d="M 0 34 C 18 34 28 0 46 0 L 274 0 C 292 0 302 34 320 34 Z"
                className="fill-background"
              />
              <path
                d="M 0 34 C 18 34 28 0 46 0 L 274 0 C 292 0 302 34 320 34"
                fill="none"
                className="stroke-border"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

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

        {/* Attached Summary Drawer - Same width (w-full), Flat Bottom, Separated with border */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="pointer-events-auto w-full overflow-hidden"
            >
              <div className="w-full">
                <div className="bg-background text-foreground border-border max-h-[70vh] overflow-y-auto rounded-t-2xl rounded-b-none border-t border-b p-6 shadow-xl w-full">
                  <div className="mx-auto max-w-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-foreground text-xl font-bold tracking-tight">Summary</h2>
                      <button
                        type="button"
                        onClick={() => {
                          setIsExpanded(false);
                        }}
                        className="text-foreground-muted hover:text-foreground -skew-x-[8deg] flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border transition-colors"
                        aria-label="Close summary"
                      >
                        <span className="skew-x-[8deg]">
                          <CloseIcon size={16} />
                        </span>
                      </button>
                    </div>

                    <div className="space-y-3 text-[14px]">
                      <div className="text-foreground-muted flex justify-between">
                        <span className="font-medium">Subtotal</span>
                        <span className="text-foreground font-semibold">₹{pricing.subtotal.toLocaleString()}</span>
                      </div>

                      {pricing.discount > 0 && (
                        <div className="text-foreground flex items-center justify-between font-medium">
                          <span>Savings</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            - ₹{pricing.discount.toLocaleString()}
                          </span>
                        </div>
                      )}

                      <div className="text-foreground-muted flex justify-between">
                        <span>Shipping</span>
                        <span className="text-[11px] font-semibold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                          Free Delivery
                        </span>
                      </div>

                      <div className="border-border mt-2 border-t pt-4">
                        <div className="flex items-end justify-between">
                          <div className="flex flex-col">
                            <span className="text-foreground-muted text-[10px] font-bold tracking-[0.2em] uppercase">
                              Total
                            </span>
                            <p className="text-foreground-subtle text-[10px] tracking-wide">Inclusive of all taxes</p>
                          </div>
                          <span className="text-foreground text-3xl font-bold tracking-tighter">
                            ₹{pricing.total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Bar: Same width (w-full), no shadow, theme-dependent */}
        <div className="pointer-events-auto border-border bg-background w-full border-t px-6 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
          <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-4">
            <div className="flex flex-col pl-1 shrink-0">
              <span className="text-foreground-muted text-[10px] font-black tracking-widest uppercase">
                Total
              </span>
              <span className="text-foreground text-2xl leading-none font-black">
                ₹{pricing.total.toLocaleString()}
              </span>
            </div>

            {/* Action Button: Reduced height (h-[46px]), fixed matching width (w-[200px] sm:w-[220px]), theme-dependent, with plus icon for add address */}
            <button
              onClick={handleContinue}
              className="flex h-[46px] w-[200px] -skew-x-[12deg] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border border-foreground bg-foreground text-background transition-transform outline-none active:scale-95 sm:w-[220px]"
            >
              <span className="flex skew-x-[12deg] items-center gap-2 text-xs font-black tracking-widest whitespace-nowrap uppercase">
                {address ? (
                  <ShieldCheckIcon size={15} className="text-emerald-500 dark:text-emerald-400" />
                ) : (
                  <PlusIcon size={15} />
                )}
                {address ? (isLoggedIn ? 'Pay Now' : 'Continue') : 'Add Address'}
                <ArrowRightIcon size={15} />
              </span>
            </button>
          </div>
        </div>
      </div>

      <AddressFormDrawer
        isOpen={showAddressForm}
        onClose={() => {
          setShowAddressForm(false);
        }}
        onSave={handleSaveAddress}
        initialData={address}
      />

      <OTPModal
        isOpen={showOTPModal}
        phoneNumber={address?.primaryPhone ?? ''}
        onVerify={() => {
          setIsLoggedIn(true);
          setShowOTPModal(false);
        }}
      />
    </div>
  );
}
