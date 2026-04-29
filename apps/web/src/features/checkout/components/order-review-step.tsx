'use client';

import React from 'react';
import Image from 'next/image';

import { ChevronRightIcon, ChevronUpIcon, MapPinIcon, PlusIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'framer-motion';

import { bagItems } from '@/features/cart';

import { useCheckoutReview } from '../hooks/use-checkout-review';
import { AddressFormDrawer } from './address-form-drawer';
import { CheckoutProgress } from './checkout-progress';
import { OTPModal } from './otp-modal';

export function OrderReviewStep() {
  const {
    address,
    setAddress,
    showAddressForm,
    setShowAddressForm,
    isExpanded,
    setIsExpanded,
    isLoggedIn,
    setIsLoggedIn,
    showOTPModal,
    setShowOTPModal,
    pricing,
    handleContinue,
  } = useCheckoutReview();

  return (
    <div className="bg-background text-foreground min-h-screen px-4 pb-60 transition-colors duration-300 md:px-6 lg:py-20 lg:pb-20">
      <CheckoutProgress currentStage={2} />

      <main className="mx-auto max-w-7xl pt-10">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          <div className="flex-1 space-y-8">
            <section>
              <div className="mb-4 flex items-center justify-between">
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
                      <div className="bg-foreground text-background flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
                        <MapPinIcon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black tracking-tight uppercase">
                          {address.recipientName}
                        </p>
                        <p className="text-foreground-muted mt-1 text-sm leading-relaxed">
                          {address.building}, {address.area}
                          <br />
                          {address.city}, {address.pincode}
                        </p>
                        <p className="text-foreground mt-3 text-xs font-bold tracking-widest">
                          {address.primaryPhone}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowAddressForm(true);
                      }}
                      className="text-[10px] font-black uppercase underline underline-offset-4"
                    >
                      Edit
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    onClick={() => {
                      setShowAddressForm(true);
                    }}
                    className="border-border hover:border-foreground bg-background-muted/10 group flex w-full flex-col items-center gap-2 rounded-4xl border-2 border-dashed p-6 transition-all"
                  >
                    <div className="bg-background group-hover:bg-foreground group-hover:text-background flex items-center justify-center rounded-full border p-2 transition-colors">
                      <PlusIcon size={24} />
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
                Your Selection ({bagItems.length})
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {bagItems.map((item) => (
                  <div
                    key={item.id}
                    className="border-border bg-background-muted/5 flex items-center gap-6 rounded-3xl border p-5"
                  >
                    <div className="bg-background-muted border-border relative h-22 w-20 overflow-hidden rounded-xl border">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xs font-bold tracking-tight uppercase">{item.name}</h3>
                      <p className="text-foreground-muted mt-1 text-[10px] font-bold uppercase">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                      <p className="text-foreground-muted mt-1 text-[10px] font-bold uppercase">
                        Color: {item.color}
                      </p>
                    </div>
                    <p className="text-sm font-black tracking-tighter">₹{item.price}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="sticky top-24 hidden w-96 space-y-4 lg:block">
            <div className="bg-foreground text-background rounded-[2.5rem] p-8 shadow-2xl">
              <h3 className="mb-8 text-center text-[10px] font-black tracking-[0.3em] uppercase opacity-50">
                Checkout Summary
              </h3>

              <div className="mb-10 space-y-4">
                <div className="flex justify-between text-xs font-bold tracking-widest uppercase opacity-80">
                  <span>Subtotal</span>
                  <span>₹{pricing.subtotal}</span>
                </div>
                <div className="flex justify-between text-xs font-bold tracking-widest text-emerald-400 uppercase">
                  <span>Discount</span>
                  <span>-₹{pricing.discount}</span>
                </div>
                <div className="bg-background/10 my-4 h-px w-full" />
                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black tracking-widest uppercase opacity-50">
                      Total Payable
                    </span>
                    <span className="text-4xl font-black tracking-tighter">₹{pricing.total}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="bg-background text-foreground flex w-full items-center justify-center gap-3 rounded-full py-5 text-sm font-black tracking-widest uppercase shadow-xl transition-all active:scale-95"
              >
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

      <div className="fixed right-0 bottom-0 left-0 z-50 flex flex-col items-center lg:hidden">
        <motion.div
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
          className="bg-background border-border z-10 cursor-pointer rounded-t-full border-x border-t px-16 py-2 text-[10px] font-bold tracking-[0.3em]"
        >
          YOU SAVED ₹{pricing.discount} 🎉
        </motion.div>

        <motion.div
          animate={{ height: isExpanded ? 'auto' : 'auto' }}
          className="bg-background/90 border-border w-full overflow-hidden rounded-t-[3rem] border-t shadow-2xl backdrop-blur-2xl"
        >
          <div className="mx-auto max-w-4xl px-4 pb-5">
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-foreground-subtle space-y-4 p-4 text-xs font-bold tracking-widest uppercase"
                >
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-foreground">₹{pricing.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-emerald-500">
                    <span>Discount</span>
                    <span>-₹{pricing.discount}</span>
                  </div>
                  <div className="bg-border h-px w-full" />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="bg-foreground flex w-full items-center justify-between rounded-full p-2">
              <div
                className="flex cursor-pointer flex-col px-4"
                onClick={() => {
                  setIsExpanded(!isExpanded);
                }}
              >
                <p className="text-foreground-subtle mb-1 flex items-center gap-2 text-[8px] font-black tracking-widest text-nowrap uppercase">
                  Total Payable{' '}
                  <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <ChevronUpIcon size={10} />
                  </motion.span>
                </p>
                <p className="text-background text-2xl font-black">₹{pricing.total}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleContinue();
                }}
                className="bg-background text-foreground flex w-full items-center justify-center gap-2 rounded-full px-4 py-4 text-center text-sm font-black tracking-wide uppercase transition-all active:scale-95"
              >
                {address ? (isLoggedIn ? 'Pay Now' : 'Verify & Continue') : 'Add Address'}
                <ChevronRightIcon size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <AddressFormDrawer
        isOpen={showAddressForm}
        onClose={() => {
          setShowAddressForm(false);
        }}
        onSave={(data) => {
          setAddress(data);
          setShowAddressForm(false);
        }}
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
