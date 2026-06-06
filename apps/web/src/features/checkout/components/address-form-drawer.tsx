'use client';

import React, { useState } from 'react';

import { CloseIcon, ShieldCheckIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { cleanPhoneDigits, formatPhone334 } from '@/features/addresses';
import { useAuthStore } from '@/store/auth-store';

import { type AddressDetails } from '../types';

interface AddressFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AddressDetails) => void;
  initialData: AddressDetails | null;
}

export function AddressFormDrawer({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AddressFormDrawerProps) {
  const user = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState<AddressDetails>(() => {
    if (initialData) {
      return {
        ...initialData,
        primaryPhone: formatPhone334(initialData.primaryPhone),
        altPhone: initialData.altPhone ? formatPhone334(initialData.altPhone) : '',
      };
    }
    const cleanPhone = user?.phone ? user.phone.replace(/\D/g, '').slice(-10) : '';
    return {
      pincode: '',
      city: '',
      area: '',
      landmark: '',
      building: '',
      recipientName: user?.name ?? '',
      primaryPhone: cleanPhone ? formatPhone334(cleanPhone) : '',
      altPhone: '',
    };
  });

  const validate = () => {
    if (formData.pincode.length !== 6) {
      return false;
    }
    if (
      !formData.city ||
      !formData.area ||
      !formData.recipientName ||
      cleanPhoneDigits(formData.primaryPhone).length !== 10
    ) {
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
            className="bg-background/50 fixed inset-0 z-60 backdrop-blur-xl"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-background border-border fixed right-0 bottom-0 left-0 z-70 mx-auto flex max-h-[92vh] max-w-3xl flex-col rounded-t-[3rem] border-t shadow-2xl"
          >
            <div className="relative flex flex-col items-center justify-center p-8 pb-6 md:p-10 md:pb-8">
              <button
                onClick={onClose}
                aria-label="Close"
                className="bg-background-muted hover:bg-background-muted/80 absolute top-8 right-8 rounded-full p-3 transition-colors md:top-10 md:right-12"
              >
                <CloseIcon size={20} />
              </button>

              <h2 className="text-center text-2xl font-black tracking-tighter uppercase italic">
                Address Details
              </h2>
              <p className="text-foreground-muted mt-1.5 flex items-center justify-center gap-1.5 text-center text-xs tracking-widest uppercase">
                <ShieldCheckIcon size={14} className="shrink-0 text-emerald-500" />
                <span>Safe & Secure Delivery Info</span>
              </p>
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
                  <label className="text-foreground-muted px-4 text-[9px] font-black tracking-[0.2em] uppercase">
                    Detected Region
                  </label>
                  <div className="bg-background-muted/20 border-border text-foreground-muted flex h-14.5 w-full items-center rounded-2xl border-2 border-dotted p-4 text-[10px] font-black tracking-widest uppercase">
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
                  label="Building / House No (Optional)"
                  value={formData.building}
                  onChange={(v: string) => {
                    setFormData({ ...formData, building: v });
                  }}
                  placeholder="No. / Name"
                />
                <InputBox
                  label="Landmark (Optional)"
                  value={formData.landmark}
                  onChange={(v: string) => {
                    setFormData({ ...formData, landmark: v });
                  }}
                  placeholder="Famous place nearby"
                />
              </div>

              <InputBox
                label="Full Name"
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
                    setFormData({ ...formData, primaryPhone: formatPhone334(v) });
                  }}
                  placeholder="000 000 0000"
                />
                <InputBox
                  label="Alt Phone"
                  value={formData.altPhone}
                  onChange={(v: string) => {
                    setFormData({ ...formData, altPhone: formatPhone334(v) });
                  }}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="border-border bg-background/80 border-t p-8 backdrop-blur-xl md:px-12">
              <button
                onClick={() => {
                  if (validate()) {
                    onSave(formData);
                  }
                }}
                className="bg-foreground text-background flex w-full items-center justify-center gap-2 rounded-full py-6 text-xs font-black tracking-[0.2em] uppercase shadow-2xl transition-transform active:scale-95"
              >
                <ShieldCheckIcon size={16} />
                <span>Save Shipping Address</span>
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
      <label className="text-foreground-muted px-4 text-[8px] font-black tracking-[0.2em] uppercase">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        className="border-border focus:border-foreground w-full rounded-2xl border-2 border-dotted bg-transparent p-4 text-sm font-bold transition-all outline-none placeholder:opacity-20"
      />
    </div>
  );
}
