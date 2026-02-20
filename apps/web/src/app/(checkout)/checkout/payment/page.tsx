'use client';

import {
  ChevronRightIcon,
  ChevronUpIcon,
  CloseIcon,
  CreditCardIcon,
  InfoIcon,
  ShieldCheckIcon,
  TruckIcon,
  ZapIcon,
} from '@ff/ui';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

import CheckoutStages from '../../_components/CheckoutProgress';

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<'prepay' | 'cod'>('prepay');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Pricing Logic
  const baseTotal = 3798;
  const codServiceFee = 200;
  const totalAmount = paymentMethod === 'cod' ? baseTotal + codServiceFee : baseTotal;

  return (
    <div className="bg-background text-foreground min-h-screen px-4 pb-40 md:px-6 lg:py-20">
      <CheckoutStages currentStage={3} />

      <main className="mx-auto max-w-4xl pt-12">
        <div className="space-y-10">
          {/* Header Section */}
          <div className="flex items-center justify-between px-2">
            <h2 className="text-foreground-subtle text-[9px] font-black tracking-[0.3em] uppercase">
              Payment Selection
            </h2>
            <button
              onClick={() => setShowInfo(true)}
              className="hover:text-foreground-subtle flex items-center gap-2 text-[9px] font-black tracking-widest uppercase transition-colors"
            >
              Payment Policy <InfoIcon size={14} />
            </button>
          </div>

          {/* Compact Payment Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* PRE-PAY CARD */}
            <button
              onClick={() => setPaymentMethod('prepay')}
              className={`group flex items-center justify-between rounded-3xl border p-6 transition-all duration-300 ${
                paymentMethod === 'prepay'
                  ? 'border-foreground bg-foreground text-background shadow-xl'
                  : 'border-border bg-background hover:bg-background-muted'
              }`}
            >
              <div className="flex items-center gap-4 text-left">
                <div
                  className={`rounded-xl p-3 ${
                    paymentMethod === 'prepay'
                      ? 'bg-background text-foreground'
                      : 'bg-background-muted'
                  }`}
                >
                  <CreditCardIcon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight uppercase italic">
                    Pre-pay Online
                  </h3>
                  <p className="mt-0.5 text-[9px] font-bold tracking-widest uppercase opacity-50">
                    Instant Confirmation
                  </p>
                </div>
              </div>
            </button>

            {/* COD CARD */}
            <button
              onClick={() => setPaymentMethod('cod')}
              className={`group flex items-center justify-between rounded-3xl border p-6 transition-all duration-300 ${
                paymentMethod === 'cod'
                  ? 'border-foreground bg-foreground text-background shadow-xl'
                  : 'border-border bg-background hover:bg-background-muted'
              }`}
            >
              <div className="flex items-center gap-4 text-left">
                <div
                  className={`rounded-xl p-3 ${
                    paymentMethod === 'cod'
                      ? 'bg-background text-foreground'
                      : 'bg-background-muted'
                  }`}
                >
                  <TruckIcon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight uppercase italic">
                    Cash on Delivery
                  </h3>
                  <p className="mt-0.5 text-[9px] font-bold tracking-widest uppercase opacity-50">
                    Pay at Doorstep
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Contextual Banners */}
          <AnimatePresence mode="wait">
            {paymentMethod === 'cod' ? (
              <motion.div
                key="cod"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative flex items-center gap-5 rounded-3xl border border-orange-500/20 bg-orange-500/5 p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                  <ShieldCheckIcon size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black tracking-widest text-orange-600 uppercase">
                    COD Policy Applied
                  </p>
                  <p className="text-[10px] leading-relaxed font-bold tracking-widest text-orange-800/60 uppercase">
                    An extra fee of{' '}
                    <span className="font-black text-orange-600">₹{codServiceFee}</span> is added
                    for logistics. Pay this advance now to confirm your order.
                  </p>
                </div>
                <span className="text-background absolute -top-4 left-5 rounded-t-4xl bg-orange-500 px-8 text-xs font-semibold tracking-wider uppercase">
                  Info
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="prepay"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative flex items-center gap-5 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
                  <ZapIcon size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black tracking-widest text-emerald-600 uppercase">
                    Prepay Benefit
                  </p>
                  <p className="text-[10px] leading-relaxed font-bold tracking-widest text-emerald-800/60 uppercase">
                    Enjoy{' '}
                    <span className="text-xs font-black text-emerald-600 italic underline underline-offset-2">
                      Free Shipping
                    </span>{' '}
                    and priority dispatch on all pre-paid orders.
                  </p>
                </div>
                <span className="text-background absolute -top-4 left-5 rounded-t-4xl bg-emerald-600 px-8 text-xs font-semibold tracking-wider uppercase">
                  Info
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* STICKY FOOTER */}
      <div className="fixed right-0 bottom-0 left-0 z-50 flex flex-col items-center">
        <motion.div
          animate={{ height: isExpanded ? 'auto' : 'auto' }}
          className="bg-background border-border w-full overflow-hidden rounded-t-[3rem] border-t shadow-2xl backdrop-blur-2xl"
        >
          <div className="mx-auto max-w-4xl px-4 pb-5">
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-foreground-subtle space-y-3 p-4 text-[10px] font-bold tracking-widest uppercase"
                >
                  <div className="flex justify-between">
                    <span>Product Subtotal</span>
                    <span className="text-foreground font-black">₹{baseTotal}</span>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="flex justify-between text-orange-500">
                      <span>COD Service Fee</span>
                      <span>+₹{codServiceFee}</span>
                    </div>
                  )}
                  <div className="bg-border h-px w-full" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-foreground shadow-foreground/20 flex w-full items-center justify-between rounded-full p-2 shadow-2xl">
              <div
                className="flex cursor-pointer flex-col px-6"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <p className="text-background/40 mb-0.5 flex items-center gap-2 text-[8px] font-black tracking-widest text-nowrap uppercase">
                  Final Payable{' '}
                  <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <ChevronUpIcon size={10} />
                  </motion.span>
                </p>
                <p className="text-background text-2xl font-black italic">₹{totalAmount}</p>
              </div>
              <button className="bg-background text-foreground flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-black tracking-wide uppercase transition-all active:scale-95">
                {paymentMethod === 'cod' ? `Pay ₹${codServiceFee} Now` : 'Pay Now'}
                <ChevronRightIcon size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Policy Modal Overlay */}
      <AnimatePresence>
        {showInfo && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfo(false)}
              className="bg-background/30 fixed inset-0 z-[60] backdrop-blur-md"
            />
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-background border-border fixed top-1/2 left-1/2 z-[70] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-[2.5rem] border p-8 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tighter uppercase italic">
                  Payments Info
                </h3>
                <button
                  onClick={() => setShowInfo(false)}
                  className="bg-background-muted rounded-full p-2"
                >
                  <CloseIcon size={16} />
                </button>
              </div>
              <div className="text-foreground-muted space-y-6 text-[9px] leading-loose font-bold tracking-widest uppercase">
                <p>
                  <span className="font-black text-emerald-500">Pre-pay:</span> Enjoy 100% Free
                  Shipping and priority processing.
                </p>
                <p>
                  <span className="font-black text-orange-500">COD:</span> An extra ₹200 fee is
                  applied to cover the higher risk and logistics cost of cash handling. This is paid
                  upfront to verify your order.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
