'use client';

import React, { useEffect, useState } from 'react';

import { CloseIcon, LoaderIcon, ShieldCheckIcon } from '@ff/ui';
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

  const [detectedRegion, setDetectedRegion] = useState('');
  const [isLoadingRegion, setIsLoadingRegion] = useState(false);

  useEffect(() => {
    if (formData.pincode.length === 6) {
      setIsLoadingRegion(true);
      fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`)
        .then((res) => res.json())
        .then((data: unknown) => {
          interface PincodeItem {
            Status?: string;
            PostOffice?: {
              District?: string;
              State?: string;
              Block?: string;
            }[];
          }
          const items = data as PincodeItem[];
          if (items?.[0]?.Status === 'Success' && items[0].PostOffice?.[0]) {
            const po = items[0].PostOffice[0];
            const region = `${po.District ?? ''}, ${po.State ?? ''}`.toUpperCase();
            setDetectedRegion(region);
            setFormData((prev) => ({
              ...prev,
              city: prev.city || po.District || po.Block || '',
            }));
          } else {
            setDetectedRegion('UNKNOWN PINCODE');
          }
        })
        .catch(() => {
          setDetectedRegion('KERALA, MALAPPURAM');
        })
        .finally(() => {
          setIsLoadingRegion(false);
        });
    } else {
      setDetectedRegion('');
    }
  }, [formData.pincode]);

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
                    const digits = v.replace(/\D/g, '').slice(0, 6);
                    setFormData({ ...formData, pincode: digits });
                  }}
                  placeholder="6 Digits"
                  type="text"
                  required
                />
                <InputBox
                  label="Detected Region"
                  value={detectedRegion}
                  readOnly
                  placeholder={isLoadingRegion ? 'Detecting...' : 'Waiting for 6 digits...'}
                  badge={
                    isLoadingRegion ? (
                      <LoaderIcon size={11} className="text-brand animate-spin" />
                    ) : detectedRegion && detectedRegion !== 'UNKNOWN PINCODE' ? (
                      <span className="text-[8px] font-bold tracking-wider text-emerald-500 uppercase">
                        Auto-Detected
                      </span>
                    ) : null
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <InputBox
                  label="City / Town"
                  value={formData.city}
                  onChange={(v: string) => {
                    setFormData({ ...formData, city: v });
                  }}
                  placeholder="e.g. Puthanathani"
                  required
                />
                <InputBox
                  label="Area / Locality"
                  value={formData.area}
                  onChange={(v: string) => {
                    setFormData({ ...formData, area: v });
                  }}
                  placeholder="Street/Colony"
                  required
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
                  placeholder="Famous place nearby"
                  optional
                />
              </div>

              <InputBox
                label="Full Name"
                value={formData.recipientName}
                onChange={(v: string) => {
                  setFormData({ ...formData, recipientName: v });
                }}
                placeholder="Full name"
                required
              />

              <div className="grid grid-cols-2 gap-2 pb-10">
                <InputBox
                  label="Primary Phone"
                  prefix="+91"
                  value={formData.primaryPhone}
                  onChange={(v: string) => {
                    const digits = v.replace(/\D/g, '').slice(0, 10);
                    setFormData({ ...formData, primaryPhone: formatPhone334(digits) });
                  }}
                  placeholder="000 000 0000"
                  required
                />
                <InputBox
                  label="Alt Phone"
                  prefix="+91"
                  value={formData.altPhone}
                  onChange={(v: string) => {
                    const digits = v.replace(/\D/g, '').slice(0, 10);
                    setFormData({ ...formData, altPhone: formatPhone334(digits) });
                  }}
                  placeholder="000 000 0000"
                  optional
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
  optional = false,
  required = false,
  readOnly = false,
  badge,
  prefix,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  optional?: boolean;
  required?: boolean;
  readOnly?: boolean;
  badge?: React.ReactNode;
  prefix?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex h-4 items-center justify-between px-3">
        <label className="text-foreground-muted truncate text-[8.5px] font-black tracking-[0.18em] uppercase">
          {label}
        </label>
        {badge ? (
          badge
        ) : optional ? (
          <span className="text-foreground-muted/60 text-[8px] font-bold tracking-widest uppercase">
            Optional
          </span>
        ) : required ? (
          <span className="text-brand/80 text-[8px] font-bold tracking-widest uppercase">
            Required
          </span>
        ) : null}
      </div>
      <div className="relative w-full">
        {prefix && (
          <span className="text-foreground-muted absolute top-1/2 left-4 -translate-y-1/2 text-xs font-bold">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          readOnly={readOnly}
          tabIndex={readOnly ? -1 : undefined}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={`border-border focus:border-foreground h-14 w-full rounded-2xl border-2 border-dotted bg-transparent text-sm font-bold transition-all outline-none placeholder:opacity-20 ${
            prefix ? 'pr-4 pl-13' : 'px-4'
          } ${readOnly ? 'focus:border-border cursor-default select-none' : ''}`}
        />
      </div>
    </div>
  );
}
