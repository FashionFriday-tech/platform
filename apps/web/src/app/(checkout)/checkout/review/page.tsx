'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ChevronRightIcon, ChevronUpIcon, CloseIcon, MapPinIcon, PlusIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'framer-motion';

import { bagItems } from '@/data/bag-items';

import CheckoutStages from '../../_components/CheckoutProgress';

// --- 1. Define the Address Interface ---
interface AddressDetails {
  pincode: string;
  city: string;
  area: string;
  landmark: string;
  building: string;
  recipientName: string;
  primaryPhone: string;
  altPhone: string;
}

export default function FinalReviewPage() {
  // --- 2. Apply the interface to State ---
  const [address, setAddress] = useState<AddressDetails | null>(null);
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
      router.push('/checkout/payment');
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen px-4 pb-60 transition-colors duration-300 md:px-6 lg:py-20 lg:pb-20">
      <CheckoutStages currentStage={2} />

      <main className="mx-auto max-w-7xl pt-10">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          <div className="flex-1 space-y-8">
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-foreground-subtle text-[10px] font-black uppercase tracking-[0.2em]">
                  Shipping Destination
                </h2>
              </div>

              <AnimatePresence mode="wait">
                {address ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-foreground bg-background shadow-foreground/5 rounded-4xl flex items-start justify-between border-2 p-8 shadow-xl"
                  >
                    <div className="flex gap-6">
                      <div className="bg-foreground text-background flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
                        <MapPinIcon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-tight">
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
                    className="border-border hover:border-foreground bg-background-muted/10 rounded-4xl group flex w-full flex-col items-center gap-2 border-2 border-dashed p-6 transition-all"
                  >
                    <div className="bg-background group-hover:bg-foreground group-hover:text-background flex items-center justify-center rounded-full border p-2 transition-colors">
                      <PlusIcon size={24} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">
                      Add Shipping Address
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            </section>

            <section>
              <h2 className="text-foreground-subtle mb-4 text-[10px] font-black uppercase tracking-[0.2em]">
                Your Selection ({bagItems.length})
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {bagItems.map((item) => (
                  <div
                    key={item.id}
                    className="border-border bg-background-muted/5 flex items-center gap-6 rounded-3xl border p-5"
                  >
                    <div className="bg-background-muted border-border h-22 relative w-20 overflow-hidden rounded-xl border">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xs font-bold uppercase tracking-tight">{item.name}</h3>
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
              <h3 className="mb-8 text-center text-[10px] font-black uppercase tracking-[0.3em] opacity-50">
                Checkout Summary
              </h3>

              <div className="mb-10 space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-80">
                  <span>Subtotal</span>
                  <span>₹{pricing.subtotal}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-emerald-400">
                  <span>Discount</span>
                  <span>-₹{pricing.discount}</span>
                </div>
                <div className="bg-background/10 my-4 h-px w-full" />
                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-50">
                      Total Payable
                    </span>
                    <span className="text-4xl font-black tracking-tighter">₹{pricing.total}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="bg-background text-foreground flex w-full items-center justify-center gap-3 rounded-full py-5 text-sm font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
              >
                {address ? (isLoggedIn ? 'Pay Now' : 'Verify & Continue') : 'Add Address'}
                <ChevronRightIcon size={18} />
              </button>
            </div>
            <p className="text-foreground-subtle text-center text-[8px] font-bold uppercase tracking-widest opacity-50">
              Secure Payment powered by Stripe & Razorpay
            </p>
          </aside>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center lg:hidden">
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
                  className="text-foreground-subtle space-y-4 p-4 text-xs font-bold uppercase tracking-widest"
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
                <p className="text-foreground-subtle mb-1 flex items-center gap-2 text-nowrap text-[8px] font-black uppercase tracking-widest">
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
                className="bg-background text-foreground flex w-full items-center justify-center gap-2 rounded-full px-4 py-4 text-center text-sm font-black uppercase tracking-wide transition-all active:scale-95"
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
        onSave={(data: AddressDetails) => {
          setAddress(data);
          setShowAddressForm(false);
        }}
        initialData={address}
      />

      <OTPModal
        isOpen={showOTPModal}
        _onClose={() => {
          setShowOTPModal(false);
        }}
        phoneNumber={address?.primaryPhone || ''}
        onVerify={() => {
          setIsLoggedIn(true);
          setShowOTPModal(false);
        }}
      />
    </div>
  );
}

interface AddressFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AddressDetails) => void;
  initialData: AddressDetails | null;
}

function AddressFormDrawer({ isOpen, onClose, onSave, initialData }: AddressFormDrawerProps) {
  const [formData, setFormData] = useState<AddressDetails>(
    initialData || {
      pincode: '',
      city: '',
      area: '',
      landmark: '',
      building: '',
      recipientName: '',
      primaryPhone: '+91 ',
      altPhone: '+91 ',
    },
  );

  const validate = () => {
    if (formData.pincode.length !== 6) {
      return false;
    }
    if (!formData.city || !formData.area || !formData.building || !formData.recipientName) {
      return false;
    }
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
            className="bg-background/50 z-60 fixed inset-0 backdrop-blur-xl"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-background border-border z-70 fixed bottom-0 left-0 right-0 mx-auto flex max-h-[92vh] max-w-3xl flex-col rounded-t-[3rem] border-t shadow-2xl"
          >
            <div className="flex items-center justify-between p-8 pb-6 md:p-12">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                Address Details
              </h2>
              <button onClick={onClose} className="bg-background-muted rounded-full p-3">
                <CloseIcon size={20} />
              </button>
            </div>

            <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto px-4 md:px-12">
              <div className="grid grid-cols-2 gap-2">
                <InputBox
                  label="Pincode"
                  value={formData.pincode}
                  onChange={(v: string) => {
                    setFormData({ ...formData, pincode: v.replace(/\D/g, '').slice(0, 6) });
                  }}
                  placeholder="6 Digits"
                  type="text"
                />
                <div className="space-y-2">
                  <label className="text-foreground-muted px-4 text-[9px] font-black uppercase tracking-[0.2em]">
                    Detected Region
                  </label>
                  <div className="bg-background-muted/20 border-border text-foreground-muted h-14.5 flex w-full items-center rounded-2xl border-2 border-dotted p-4 text-[10px] font-black uppercase tracking-widest">
                    {formData.pincode.length === 6 ? 'KERALA, MALAPPURAM' : 'Waiting...'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <InputBox
                  label="City / Town"
                  value={formData.city}
                  onChange={(v: string) => {
                    setFormData({ ...formData, city: v });
                  }}
                  placeholder="e.g. Puthanathani"
                />
                <InputBox
                  label="Area / Locality"
                  value={formData.area}
                  onChange={(v: string) => {
                    setFormData({ ...formData, area: v });
                  }}
                  placeholder="Street/Colony"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <InputBox
                  label="Building / House No"
                  value={formData.building}
                  onChange={(v: string) => {
                    setFormData({ ...formData, building: v });
                  }}
                  placeholder="No. / Name"
                />
                <InputBox
                  label="Landmark"
                  value={formData.landmark}
                  onChange={(v: string) => {
                    setFormData({ ...formData, landmark: v });
                  }}
                  placeholder="Optional"
                />
              </div>

              <InputBox
                label="Recipient Name"
                value={formData.recipientName}
                onChange={(v: string) => {
                  setFormData({ ...formData, recipientName: v });
                }}
                placeholder="Full name"
              />

              <div className="grid grid-cols-2 gap-2 pb-10">
                <InputBox
                  label="Primary Phone"
                  value={formData.primaryPhone}
                  onChange={(v: string) => {
                    setFormData({ ...formData, primaryPhone: v });
                  }}
                  placeholder="+91"
                />
                <InputBox
                  label="Alt Phone"
                  value={formData.altPhone}
                  onChange={(v: string) => {
                    setFormData({ ...formData, altPhone: v });
                  }}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="border-border bg-background/80 border-t p-8 backdrop-blur-xl md:px-12">
              <button
                onClick={() => validate() && onSave(formData)}
                className="bg-foreground text-background w-full rounded-full py-6 text-xs font-black uppercase tracking-[0.2em] shadow-2xl transition-transform active:scale-95"
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

function InputBox({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-foreground-muted px-4 text-[8px] font-black uppercase tracking-[0.2em]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        className="border-border focus:border-foreground w-full rounded-2xl border-2 border-dotted bg-transparent p-4 text-sm font-bold outline-none transition-all placeholder:opacity-20"
      />
    </div>
  );
}

interface OTPModalProps {
  isOpen: boolean;
  _onClose: () => void;
  phoneNumber: string;
  onVerify: () => void;
}

function OTPModal({ isOpen, _onClose, phoneNumber, onVerify }: OTPModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="bg-background/90 z-100 fixed inset-0 flex items-center justify-center p-6 backdrop-blur-xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background border-border w-full max-w-md rounded-[3rem] border p-10 text-center shadow-2xl"
          >
            <h2 className="mb-2 text-2xl font-black uppercase italic tracking-tighter">
              Verify Phone
            </h2>
            <p className="text-foreground-muted mb-8 text-[10px] font-bold uppercase tracking-widest">
              Sent to {phoneNumber}
            </p>
            <div className="mb-8 flex justify-center gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-background-muted/30 border-border h-16 w-12 rounded-2xl border-2 border-dotted"
                />
              ))}
            </div>
            <button
              onClick={onVerify}
              className="bg-foreground text-background w-full rounded-full py-5 text-xs font-black uppercase tracking-widest"
            >
              Verify & Pay
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
