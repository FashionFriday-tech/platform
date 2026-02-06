"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TruckIcon,
  InfoIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ShieldCheckIcon,
  ZapIcon,
  CloseIcon,
  CreditCardIcon,
} from "@ff/ui";
import CheckoutStages from "../../_components/CheckoutProgress";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<"prepay" | "cod">(
    "prepay"
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Pricing Logic
  const baseTotal = 3798;
  const codServiceFee = 200;
  const totalAmount =
    paymentMethod === "cod" ? baseTotal + codServiceFee : baseTotal;

  return (
    <div className="min-h-screen bg-background text-foreground px-4 md:px-6 lg:py-20 pb-40">
      <CheckoutStages currentStage={3} />

      <main className="mx-auto max-w-4xl pt-12">
        <div className="space-y-10">
          {/* Header Section */}
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground-subtle">
              Payment Selection
            </h2>
            <button
              onClick={() => setShowInfo(true)}
              className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-foreground-subtle transition-colors"
            >
              Payment Policy <InfoIcon size={14} />
            </button>
          </div>

          {/* Compact Payment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PRE-PAY CARD */}
            <button
              onClick={() => setPaymentMethod("prepay")}
              className={`p-6 rounded-3xl border transition-all duration-300 flex items-center justify-between group ${
                paymentMethod === "prepay"
                  ? "border-foreground bg-foreground text-background shadow-xl"
                  : "border-border bg-background hover:bg-background-muted"
              }`}
            >
              <div className="flex items-center gap-4 text-left">
                <div
                  className={`p-3 rounded-xl ${
                    paymentMethod === "prepay"
                      ? "bg-background text-foreground"
                      : "bg-background-muted"
                  }`}
                >
                  <CreditCardIcon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight italic">
                    Pre-pay Online
                  </h3>
                  <p className="text-[9px] font-bold uppercase opacity-50 tracking-widest mt-0.5">
                    Instant Confirmation
                  </p>
                </div>
              </div>
            </button>

            {/* COD CARD */}
            <button
              onClick={() => setPaymentMethod("cod")}
              className={`p-6 rounded-3xl border transition-all duration-300 flex items-center justify-between group ${
                paymentMethod === "cod"
                  ? "border-foreground bg-foreground text-background shadow-xl"
                  : "border-border bg-background hover:bg-background-muted"
              }`}
            >
              <div className="flex items-center gap-4 text-left">
                <div
                  className={`p-3 rounded-xl ${
                    paymentMethod === "cod"
                      ? "bg-background text-foreground"
                      : "bg-background-muted"
                  }`}
                >
                  <TruckIcon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight italic">
                    Cash on Delivery
                  </h3>
                  <p className="text-[9px] font-bold uppercase opacity-50 tracking-widest mt-0.5">
                    Pay at Doorstep
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Contextual Banners */}
          <AnimatePresence mode="wait">
            {paymentMethod === "cod" ? (
              <motion.div
                key="cod"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative p-6 rounded-3xl bg-orange-500/5 border border-orange-500/20 flex items-center gap-5"
              >
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shrink-0">
                  <ShieldCheckIcon size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                    COD Policy Applied
                  </p>
                  <p className="text-[10px] font-bold text-orange-800/60 uppercase tracking-widest leading-relaxed">
                    An extra fee of{" "}
                    <span className="text-orange-600 font-black">
                      ₹{codServiceFee}
                    </span>{" "}
                    is added for logistics. Pay this advance now to confirm your
                    order.
                  </p>
                </div>
                <span className="absolute px-8 tracking-wider uppercase text-xs font-semibold text-background bg-orange-500 -top-4 left-5 rounded-t-4xl">
                  Info
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="prepay"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-5"
              >
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shrink-0">
                  <ZapIcon size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                    Prepay Benefit
                  </p>
                  <p className="text-[10px] font-bold text-emerald-800/60 uppercase tracking-widest leading-relaxed">
                    Enjoy{" "}
                    <span className="text-emerald-600 font-black text-xs italic underline underline-offset-2">
                      Free Shipping
                    </span>{" "}
                    and priority dispatch on all pre-paid orders.
                  </p>
                </div>
                <span className="absolute px-8 tracking-wider uppercase text-xs font-semibold text-background bg-emerald-600 -top-4 left-5 rounded-t-4xl">
                  Info
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* STICKY FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center">
        <motion.div
          animate={{ height: isExpanded ? "auto" : "auto" }}
          className="w-full bg-background backdrop-blur-2xl border-t border-border rounded-t-[3rem] overflow-hidden shadow-2xl"
        >
          <div className="max-w-4xl mx-auto px-4 pb-5 ">
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 space-y-3 text-[10px] font-bold uppercase tracking-widest text-foreground-subtle"
                >
                  <div className="flex justify-between">
                    <span>Product Subtotal</span>
                    <span className="text-foreground font-black">
                      ₹{baseTotal}
                    </span>
                  </div>
                  {paymentMethod === "cod" && (
                    <div className="flex justify-between text-orange-500">
                      <span>COD Service Fee</span>
                      <span>+₹{codServiceFee}</span>
                    </div>
                  )}
                  <div className="h-px bg-border w-full" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex w-full items-center justify-between bg-foreground rounded-full p-2 shadow-2xl shadow-foreground/20">
              <div
                className="flex flex-col cursor-pointer px-6"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <p className="text-[8px] font-black uppercase tracking-widest text-background/40 flex items-center gap-2 mb-0.5 text-nowrap">
                  Final Payable{" "}
                  <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <ChevronUpIcon size={10} />
                  </motion.span>
                </p>
                <p className="text-2xl font-black text-background italic">
                  ₹{totalAmount}
                </p>
              </div>
              <button className="bg-background px-8 text-foreground w-full py-4 rounded-full font-black uppercase text-sm tracking-wide flex justify-center items-center gap-3 active:scale-95 transition-all">
                {paymentMethod === "cod"
                  ? `Pay ₹${codServiceFee} Now`
                  : "Pay Now"}
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
              className="fixed inset-0 bg-background/30 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background border border-border p-8 rounded-[2.5rem] w-full max-w-sm z-[70] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black uppercase tracking-tighter italic">
                  Payments Info
                </h3>
                <button
                  onClick={() => setShowInfo(false)}
                  className="p-2 bg-background-muted rounded-full"
                >
                  <CloseIcon size={16} />
                </button>
              </div>
              <div className="space-y-6 text-[9px] font-bold uppercase tracking-widest text-foreground-muted leading-loose">
                <p>
                  <span className="text-emerald-500 font-black">Pre-pay:</span>{" "}
                  Enjoy 100% Free Shipping and priority processing.
                </p>
                <p>
                  <span className="text-orange-500 font-black">COD:</span> An
                  extra ₹200 fee is applied to cover the higher risk and
                  logistics cost of cash handling. This is paid upfront to
                  verify your order.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
