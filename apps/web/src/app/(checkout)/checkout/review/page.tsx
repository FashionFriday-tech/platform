"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  ChevronRight,
  Plus,
  X,
  ChevronUp,
  ShieldCheck,
} from "lucide-react";
import { bagItems } from "@/data/bagItems";
import CheckoutStages from "../../_components/CheckoutProgress";
import { useRouter } from "next/navigation";

export default function FinalReviewPage() {
  const [address, setAddress] = useState<any>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);

  const pricing = { subtotal: 4048, discount: 250, total: 3798 };

  const router = useRouter();

  const handleContinue = () => {
    if (!address) {
      setShowAddressForm(true);
    } else if (!isLoggedIn) {
      setShowOTPModal(true);
    } else {
      router.push("/checkout/payment");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 px-4 md:px-6 lg:py-20 pb-60 lg:pb-20">
      <CheckoutStages currentStage={2} />

      <main className="mx-auto max-w-7xl pt-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:items-start">
          {/* LEFT CONTENT: Stays exactly as your original design */}
          <div className="flex-1 space-y-8">
            {/* 1. ADDRESS PREVIEW SECTION */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-subtle">
                  Shipping Destination
                </h2>
              </div>

              <AnimatePresence mode="wait">
                {address ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-4xl border-2 border-foreground bg-background flex justify-between items-start shadow-xl shadow-foreground/5"
                  >
                    <div className="flex gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-foreground flex items-center justify-center text-background shrink-0">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="font-black uppercase text-sm tracking-tight">
                          {address.recipientName}
                        </p>
                        <p className="text-sm text-foreground-muted mt-1 leading-relaxed">
                          {address.building}, {address.area}
                          <br />
                          {address.city}, {address.pincode}
                        </p>
                        <p className="text-xs font-bold mt-3 text-foreground tracking-widest">
                          {address.primaryPhone}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="text-[10px] font-black uppercase underline underline-offset-4"
                    >
                      Edit
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    onClick={() => setShowAddressForm(true)}
                    className="w-full p-6 rounded-4xl border-2 border-dashed border-border hover:border-foreground transition-all flex flex-col items-center gap-2 bg-background-muted/10 group"
                  >
                    <div className="p-2 border rounded-full bg-background flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                      <Plus size={24} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">
                      Add Shipping Address
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            </section>

            {/* 2. PRODUCT REVIEW LIST */}
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-foreground-subtle">
                Your Selection ({bagItems.length})
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {bagItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-6 p-5 rounded-3xl border border-border bg-background-muted/5"
                  >
                    <div className="w-20 h-22 bg-background-muted rounded-xl overflow-hidden border border-border">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xs uppercase tracking-tight">
                        {item.name}
                      </h3>
                      <p className="text-[10px] font-bold text-foreground-muted uppercase mt-1">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                      <p className="text-[10px] font-bold text-foreground-muted uppercase mt-1">
                        Color: {item.color}
                      </p>
                    </div>
                    <p className="font-black text-sm tracking-tighter">
                      ₹{item.price}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT ASIDE: Only visible on Large Screens */}
          <aside className="hidden lg:block w-96 sticky top-24 space-y-4">
            <div className="bg-foreground rounded-[2.5rem] p-8 text-background shadow-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 opacity-50 text-center">
                Checkout Summary
              </h3>

              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-80">
                  <span>Subtotal</span>
                  <span>₹{pricing.subtotal}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-emerald-400">
                  <span>Discount</span>
                  <span>-₹{pricing.discount}</span>
                </div>
                <div className="h-px bg-background/10 w-full my-4" />
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-50">
                      Total Payable
                    </span>
                    <span className="text-4xl font-black tracking-tighter">
                      ₹{pricing.total}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-background text-foreground py-5 rounded-full font-black uppercase text-sm tracking-widest flex justify-center items-center gap-3 active:scale-95 transition-all shadow-xl"
              >
                {address
                  ? isLoggedIn
                    ? "Pay Now"
                    : "Verify & Continue"
                  : "Add Address"}
                <ChevronRight size={18} />
              </button>
            </div>
            <p className="text-center text-[8px] font-bold uppercase tracking-widest text-foreground-subtle opacity-50">
              Secure Payment powered by Stripe & Razorpay
            </p>
          </aside>
        </div>
      </main>

      {/* MOBILE STICKY FOOTER: Stays exactly as your original design */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center">
        <motion.div
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-16 bg-background border-t border-x border-border rounded-t-full py-2 font-bold text-[10px] tracking-[0.3em] cursor-pointer z-10"
        >
          YOU SAVED ₹{pricing.discount} 🎉
        </motion.div>

        <motion.div
          animate={{ height: isExpanded ? "auto" : "auto" }}
          className="w-full bg-background/90 backdrop-blur-2xl border-t border-border rounded-t-[3rem] overflow-hidden shadow-2xl"
        >
          <div className="max-w-4xl mx-auto px-4 pb-5">
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 space-y-4 text-xs font-bold uppercase tracking-widest text-foreground-subtle"
                >
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-foreground">₹{pricing.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-emerald-500">
                    <span>Discount</span>
                    <span>-₹{pricing.discount}</span>
                  </div>
                  <div className="h-px bg-border w-full" />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex w-full items-center justify-between bg-foreground rounded-full p-2">
              <div
                className="flex flex-col cursor-pointer px-4"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <p className="text-[8px] font-black uppercase tracking-widest text-foreground-subtle flex items-center gap-2 mb-1 text-nowrap">
                  Total Payable{" "}
                  <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <ChevronUp size={10} />
                  </motion.span>
                </p>
                <p className="text-2xl font-black text-background">
                  ₹{pricing.total}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleContinue();
                }}
                className="bg-background px-4 text-foreground w-full py-4 rounded-full font-black uppercase text-sm tracking-wide flex justify-center items-center text-center gap-2 active:scale-95 transition-all"
              >
                {address
                  ? isLoggedIn
                    ? "Pay Now"
                    : "Verify & Continue"
                  : "Add Address"}
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <AddressFormDrawer
        isOpen={showAddressForm}
        onClose={() => setShowAddressForm(false)}
        onSave={(data: any) => {
          setAddress(data);
          setShowAddressForm(false);
        }}
        initialData={address}
      />

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        phoneNumber={address?.primaryPhone || ""}
        onVerify={() => {
          setIsLoggedIn(true);
          setShowOTPModal(false);
        }}
      />
    </div>
  );
}

{
  /* --- Address Form Drawer --- */
}
function AddressFormDrawer({ isOpen, onClose, onSave, initialData }: any) {
  const [formData, setFormData] = useState<any>(
    initialData || {
      pincode: "",
      city: "",
      area: "",
      landmark: "",
      building: "",
      recipientName: "",
      primaryPhone: "+91 ",
      altPhone: "+91 ",
    }
  );

  const validate = () => {
    if (formData.pincode.length !== 6) return false;
    if (
      !formData.city ||
      !formData.area ||
      !formData.building ||
      !formData.recipientName
    )
      return false;
    return true;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/50 backdrop-blur-xl z-60"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-[3rem] z-70 shadow-2xl max-w-3xl mx-auto border-t border-border flex flex-col max-h-[92vh]"
          >
            <div className="flex justify-between items-center p-8 md:p-12 pb-6">
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">
                Address Details
              </h2>
              <button
                onClick={onClose}
                className="p-3 bg-background-muted rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-12 custom-scrollbar space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <InputBox
                  label="Pincode"
                  value={formData.pincode}
                  onChange={(v: string) =>
                    setFormData({ ...formData, pincode: v.slice(0, 6) })
                  }
                  placeholder="6 Digits"
                  type="number"
                />
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-foreground-muted uppercase tracking-[0.2em] px-4">
                    Detected Region
                  </label>
                  <div className="w-full bg-background-muted/20 border-2 border-border border-dotted rounded-2xl p-4 h-14.5 flex items-center text-[10px] font-black uppercase tracking-widest text-foreground-muted">
                    {formData.pincode.length === 6
                      ? "KERALA, MALAPPURAM"
                      : "Waiting..."}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <InputBox
                  label="City / Town"
                  value={formData.city}
                  onChange={(v: string) =>
                    setFormData({ ...formData, city: v })
                  }
                  placeholder="e.g. Puthanathani"
                />
                <InputBox
                  label="Area / Locality"
                  value={formData.area}
                  onChange={(v: string) =>
                    setFormData({ ...formData, area: v })
                  }
                  placeholder="Street/Colony"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <InputBox
                  label="Building / House No"
                  value={formData.building}
                  onChange={(v: string) =>
                    setFormData({ ...formData, building: v })
                  }
                  placeholder="No. / Name"
                />
                <InputBox
                  label="Landmark"
                  value={formData.landmark}
                  onChange={(v: string) =>
                    setFormData({ ...formData, landmark: v })
                  }
                  placeholder="Optional"
                />
              </div>

              <InputBox
                label="Recipient Name"
                value={formData.recipientName}
                onChange={(v: string) =>
                  setFormData({ ...formData, recipientName: v })
                }
                placeholder="Full name"
              />

              <div className="grid grid-cols-2 gap-2 pb-10">
                <InputBox
                  label="Primary Phone"
                  value={formData.primaryPhone}
                  onChange={(v: string) =>
                    setFormData({ ...formData, primaryPhone: v })
                  }
                  placeholder="+91"
                />
                <InputBox
                  label="Alt Phone"
                  value={formData.altPhone}
                  onChange={(v: string) =>
                    setFormData({ ...formData, altPhone: v })
                  }
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="p-8 md:px-12 border-t border-border bg-background/80 backdrop-blur-xl">
              <button
                onClick={() => validate() && onSave(formData)}
                className="w-full bg-foreground text-background py-6 rounded-full font-black uppercase tracking-[0.2em] text-xs shadow-2xl active:scale-95 transition-transform"
              >
                Save Shipping Address
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

{
  /* --- Helpers --- */
}
function InputBox({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[8px] font-black text-foreground-muted uppercase tracking-[0.2em] px-4">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-2 border-border border-dotted rounded-2xl p-4 focus:border-foreground outline-none transition-all font-bold text-sm placeholder:opacity-20"
      />
    </div>
  );
}

function OTPModal({ isOpen, onClose, phoneNumber, onVerify }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-background/90 backdrop-blur-xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background border border-border p-10 rounded-[3rem] w-full max-w-md text-center shadow-2xl"
          >
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">
              Verify Phone
            </h2>
            <p className="text-foreground-muted text-[10px] font-bold uppercase tracking-widest mb-8">
              Sent to {phoneNumber}
            </p>
            <div className="flex gap-4 justify-center mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-12 h-16 bg-background-muted/30 border-2 border-border border-dotted rounded-2xl"
                />
              ))}
            </div>
            <button
              onClick={onVerify}
              className="w-full bg-foreground text-background py-5 rounded-full font-black uppercase text-xs tracking-widest"
            >
              Verify & Pay
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
