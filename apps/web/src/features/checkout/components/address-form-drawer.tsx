'use client';

import React, { useEffect, useState } from 'react';

import {
  ArrowLeftIcon,
  CheckIcon,
  CloseIcon,
  LoaderIcon,
  MapPinIcon,
  PlusIcon,
  ShieldCheckIcon,
} from '@ff/ui';
import { Asterisk } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';

import { cleanPhoneDigits, formatPhone334 } from '@/features/addresses';
import { type Address } from '@/features/addresses/types';
import { useAuthStore } from '@/store/auth-store';

import { type AddressDetails } from '../types';

export interface AddressFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AddressDetails) => void;
  initialData: AddressDetails | null;
  savedAddresses?: Address[];
  selectedAddressId?: string;
  onSelectAddress?: (address: Address) => void;
  mode?: 'list' | 'add';
  onModeChange?: (mode: 'list' | 'add') => void;
}

export function AddressFormDrawer({
  isOpen,
  onClose,
  onSave,
  initialData,
  savedAddresses,
  selectedAddressId,
  onSelectAddress,
  mode,
  onModeChange,
}: AddressFormDrawerProps) {
  const user = useAuthStore((state) => state.user);
  const hasSavedAddresses = !!(savedAddresses && savedAddresses.length > 0);

  const [internalMode, setInternalMode] = useState<'list' | 'add'>('add');
  const activeMode = mode !== undefined ? mode : internalMode;
  const setMode = onModeChange || setInternalMode;

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
      district: '',
      state: '',
      landmark: '',
      building: '',
      recipientName: user?.name ?? '',
      primaryPhone: cleanPhone ? formatPhone334(cleanPhone) : '',
      altPhone: '',
    };
  });

  const resetForm = () => {
    const cleanPhone = user?.phone ? user.phone.replace(/\D/g, '').slice(-10) : '';
    setFormData({
      pincode: '',
      city: '',
      area: '',
      district: '',
      state: '',
      landmark: '',
      building: '',
      recipientName: user?.name ?? '',
      primaryPhone: cleanPhone ? formatPhone334(cleanPhone) : '',
      altPhone: '',
    });
    setDetectedRegion('');
  };

  useEffect(() => {
    if (isOpen) {
      if (mode === undefined) {
        setInternalMode(hasSavedAddresses ? 'list' : 'add');
      }
    }
  }, [isOpen, hasSavedAddresses, mode]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        primaryPhone: formatPhone334(initialData.primaryPhone),
        altPhone: initialData.altPhone ? formatPhone334(initialData.altPhone) : '',
      });
    } else if (user) {
      const cleanPhone = user.phone ? user.phone.replace(/\D/g, '').slice(-10) : '';
      setFormData((prev) => ({
        ...prev,
        recipientName: prev.recipientName || user.name || '',
        primaryPhone: prev.primaryPhone || (cleanPhone ? formatPhone334(cleanPhone) : ''),
      }));
    }
  }, [initialData, user]);

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
            const district = po.District ?? '';
            const state = po.State ?? '';
            const region = `${district}, ${state}`.toUpperCase();
            setDetectedRegion(region);
            setFormData((prev) => ({
              ...prev,
              city: prev.city || district || po.Block || '',
              district: district || prev.district || '',
              state: state || prev.state || '',
            }));
          } else {
            setDetectedRegion('UNKNOWN PINCODE');
          }
        })
        .catch(() => {
          setDetectedRegion('');
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
      toast.error('Please enter a valid 6-digit Pincode');
      return false;
    }
    if (!formData.city.trim()) {
      toast.error('City / Town is required');
      return false;
    }
    if (!formData.area.trim()) {
      toast.error('Area / Locality is required');
      return false;
    }
    if (!formData.recipientName.trim()) {
      toast.error('Recipient Full Name is required');
      return false;
    }
    if (cleanPhoneDigits(formData.primaryPhone).length !== 10) {
      toast.error('Please enter a valid 10-digit Primary Phone number');
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
            className="bg-background/50 fixed inset-0 z-[110] backdrop-blur-xl"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-background border-border fixed right-0 bottom-0 left-0 z-[120] mx-auto flex max-h-[92vh] max-w-3xl flex-col rounded-t-[3rem] border-t shadow-2xl"
          >
            {activeMode === 'list' && hasSavedAddresses ? (
              <>
                <div className="relative flex flex-col items-center justify-center p-8 pb-4 md:p-10 md:pb-6">
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="bg-background-muted hover:bg-background-muted/80 absolute top-8 right-8 rounded-full p-3 transition-colors md:top-10 md:right-12"
                  >
                    <CloseIcon size={20} />
                  </button>

                  <h2 className="text-center text-2xl font-black tracking-tighter uppercase">
                    Select Delivery Address
                  </h2>
                  <p className="text-foreground-muted mt-1.5 flex items-center justify-center gap-1.5 text-center text-xs tracking-widest uppercase">
                    <MapPinIcon size={14} className="text-brand shrink-0" />
                    <span>Choose from saved locations or add new</span>
                  </p>
                </div>

                <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto px-4 pb-8 md:px-12">
                  {/* Add New Address Button */}
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setMode('add');
                    }}
                    className="border-foreground/30 hover:border-foreground bg-foreground/[0.02] hover:bg-foreground/[0.05] text-foreground flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-4 text-xs font-black tracking-widest uppercase transition-all active:scale-[0.99]"
                  >
                    <div className="bg-foreground text-background flex h-7 w-7 items-center justify-center rounded-lg shadow-sm">
                      <PlusIcon size={16} />
                    </div>
                    <span>Add New Address</span>
                  </button>

                  {/* Saved Addresses List */}
                  <div className="space-y-3">
                    {savedAddresses?.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => {
                            onSelectAddress?.(addr);
                          }}
                          className={`flex cursor-pointer flex-col gap-3 rounded-2xl border p-5 transition-all duration-200 ${isSelected
                              ? 'border-foreground bg-foreground/[0.03] ring-foreground/20 shadow-md ring-1'
                              : 'border-border bg-background hover:border-foreground/40 hover:bg-foreground/[0.01]'
                            }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <div
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${isSelected
                                    ? 'border-foreground bg-foreground text-background'
                                    : 'border-border bg-background'
                                  }`}
                              >
                                {isSelected && <CheckIcon size={12} />}
                              </div>
                              <span className="text-sm font-black tracking-tight uppercase">
                                {addr.name}
                              </span>
                              <span className="bg-foreground/5 text-foreground-muted border-border rounded-full border px-2 py-0.5 text-[9px] font-black uppercase">
                                {addr.type}
                              </span>
                              {addr.isDefault && (
                                <span className="bg-brand/10 text-brand rounded-full px-2 py-0.5 text-[9px] font-black uppercase">
                                  Default
                                </span>
                              )}
                            </div>

                            {isSelected ? (
                              <span className="text-foreground shrink-0 text-[10px] font-black tracking-widest uppercase">
                                Selected
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectAddress?.(addr);
                                }}
                                className="border-border text-foreground hover:border-foreground hover:bg-foreground hover:text-background shrink-0 rounded-lg border px-3 py-1 text-[10px] font-black tracking-widest uppercase transition-all"
                              >
                                Deliver Here
                              </button>
                            )}
                          </div>

                          <p className="text-foreground-muted text-xs leading-relaxed font-semibold uppercase">
                            {addr.addressLine1 ? `${addr.addressLine1}, ` : ''}
                            {addr.addressLine2}
                            {addr.landmark ? ` (Near ${addr.landmark})` : ''}
                          </p>
                          <p className="text-foreground-muted text-xs font-semibold uppercase">
                            {addr.city}, {addr.district} - {addr.pincode}
                          </p>
                          <p className="text-foreground-subtle text-[11px] font-bold">
                            Phone: +91 {formatPhone334(addr.phone)}
                            {addr.altPhone ? ` | Alt: +91 ${formatPhone334(addr.altPhone)}` : ''}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="relative flex flex-col items-center justify-center p-8 pb-6 md:p-10 md:pb-8">
                  {hasSavedAddresses && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('list');
                      }}
                      className="text-foreground-muted hover:text-foreground absolute top-8 left-8 flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase transition-colors md:top-10 md:left-12"
                    >
                      <ArrowLeftIcon size={16} />
                      <span className="hidden sm:inline">Saved Addresses</span>
                    </button>
                  )}

                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="bg-background-muted hover:bg-background-muted/80 absolute top-8 right-8 rounded-full p-3 transition-colors md:top-10 md:right-12"
                  >
                    <CloseIcon size={20} />
                  </button>

                  <h2 className="text-center text-2xl font-black tracking-tighter uppercase">
                    {hasSavedAddresses ? 'Add New Address' : 'Address Details'}
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

                <div className="border-border bg-background/80 border-t p-4 backdrop-blur-xl md:px-12">
                  <button
                    onClick={() => {
                      if (validate()) {
                        onSave(formData);
                      }
                    }}
                    className="bg-foreground text-background border-foreground flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border py-4 text-xs font-black tracking-[0.2em] uppercase shadow-2xl transition-transform active:scale-95"
                  >
                    <ShieldCheckIcon size={14} className="shrink-0 text-emerald-500" />
                    <span>Save Shipping Address</span>
                  </button>
                </div>
              </>
            )}
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
      <div className="flex h-4 items-center justify-between px-1">
        <label className="text-foreground flex items-center gap-1 text-[11px] font-bold tracking-wide uppercase">
          <span>{label}</span>
          {required && (
            <Asterisk
              size={11}
              className="text-brand shrink-0 stroke-[2.5]"
              aria-label="Required"
            />
          )}
        </label>
        {badge ? (
          badge
        ) : optional ? (
          <span className="text-foreground-muted/70 text-[9px] font-bold tracking-widest uppercase">
            Optional
          </span>
        ) : null}
      </div>
      <div className="relative w-full">
        {prefix && (
          <span className="text-foreground absolute top-1/2 left-4 -translate-y-1/2 text-sm font-bold">
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
          className={`border-border/80 bg-foreground/[0.03] text-foreground focus:border-foreground placeholder:text-foreground-muted/60 h-12 w-full rounded-xl border text-sm font-semibold transition-all outline-none ${prefix ? 'pr-4 pl-14' : 'px-4'
            } ${readOnly ? 'focus:border-border cursor-default opacity-80 select-none' : ''}`}
        />
      </div>
    </div>
  );
}
