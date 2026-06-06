import React from 'react';

import { BriefcaseIcon, CheckIcon, CloseIcon, HomeIcon, LoaderIcon, ShieldCheckIcon } from '@ff/ui';

import { useAddressForm } from '../hooks/use-address-form';
import { type Address } from '../types';
import { formatPhone334 } from '../utils/phone';
import { FormInput } from './form-input';

interface AddressFormModalProps {
  initialData: Address | null;
  onClose: () => void;
  onSave: (address: Address) => void;
  isFirstAddress: boolean;
}

export const AddressFormModal = ({
  initialData,
  onClose,
  onSave,
  isFirstAddress,
}: AddressFormModalProps) => {
  const { formData, setFormData, loading, altPhoneRef, isFormValid } = useAddressForm(
    initialData,
    isFirstAddress,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-background/60 absolute inset-0 backdrop-blur-md" />
      <div className="bg-background-elevated border-border relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-4xl border shadow-2xl">
        <div className="border-border bg-background-elevated sticky top-0 z-10 flex flex-col items-center justify-center rounded-t-4xl border-b px-6 py-5">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="hover:bg-background-muted absolute top-5 right-5 rounded-full p-2 transition-colors"
          >
            <CloseIcon size={18} />
          </button>

          <h2 className="text-center text-lg font-black tracking-tight uppercase">
            Address Details
          </h2>
          <p className="text-foreground-subtle mt-1 flex items-center justify-center gap-1.5 text-center text-[10px] tracking-widest uppercase">
            <ShieldCheckIcon size={13} className="shrink-0 text-emerald-500" />
            <span>Safe & Secure Delivery Info</span>
          </p>
        </div>

        <div className="no-scrollbar space-y-6 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <FormInput
                label="Pincode"
                placeholder="6 Digits"
                required
                value={formData.pincode ?? ''}
                onChange={(v: string) => {
                  setFormData({
                    ...formData,
                    pincode: v.replace(/\D/g, '').slice(0, 6),
                  });
                }}
              />
              {loading && (
                <LoaderIcon
                  className="text-brand absolute right-3 bottom-2.5 animate-spin"
                  size={16}
                />
              )}
            </div>
            <FormInput
              label="Detected Region"
              placeholder="waiting for pincode..."
              value={formData.district ? `${formData.district}, ${formData.state ?? ''}` : ''}
              readOnly
              badge={
                formData.district ? (
                  <span className="text-[8px] font-bold tracking-wider text-emerald-500 uppercase opacity-80">
                    Auto-Detected
                  </span>
                ) : (
                  <span className="text-foreground-subtle text-[8px] opacity-40">Auto</span>
                )
              }
            />
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <FormInput
                label="City / Town"
                placeholder="e.g. Puthanathani"
                required
                value={formData.city ?? ''}
                onChange={(v: string) => {
                  setFormData({ ...formData, city: v });
                }}
              />
              <FormInput
                label="Area / Locality"
                placeholder="Street/Colony"
                required
                value={formData.addressLine2 ?? ''}
                onChange={(v: string) => {
                  setFormData({ ...formData, addressLine2: v });
                }}
              />
            </div>
            <div className="flex gap-2">
              <FormInput
                label="Landmark (Optional)"
                placeholder="Famous place nearby"
                value={formData.landmark ?? ''}
                onChange={(v: string) => {
                  setFormData({ ...formData, landmark: v });
                }}
              />
              <FormInput
                label="Building / House No (Optional)"
                placeholder="No. / Name"
                value={formData.addressLine1 ?? ''}
                onChange={(v: string) => {
                  setFormData({ ...formData, addressLine1: v });
                }}
              />
            </div>
          </div>

          <hr className="border-border border-dashed" />

          <div className="space-y-4">
            <FormInput
              label="Full Name"
              placeholder="Full name"
              required
              value={formData.name ?? ''}
              onChange={(v: string) => {
                setFormData({ ...formData, name: v });
              }}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Primary Phone"
                prefix="+91"
                placeholder="000 000 0000"
                required
                value={formData.phone ?? ''}
                onChange={(v: string) => {
                  setFormData({
                    ...formData,
                    phone: formatPhone334(v),
                  });
                }}
              />
              <FormInput
                inputRef={altPhoneRef}
                label="Alt Phone (Optional)"
                prefix="+91"
                placeholder="000 000 0000"
                value={formData.altPhone ?? ''}
                onChange={(v: string) => {
                  setFormData({
                    ...formData,
                    altPhone: formatPhone334(v),
                  });
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-2">
            <div className="bg-background-muted border-border flex w-full rounded-full border p-1">
              {(['Home', 'Work'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, type: t });
                  }}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-[11px] font-black tracking-widest uppercase transition-all ${
                    formData.type === t
                      ? 'bg-foreground text-background shadow-md'
                      : 'text-foreground-subtle hover:text-foreground'
                  }`}
                >
                  {t === 'Home' ? (
                    <HomeIcon size={12} className="inline" />
                  ) : (
                    <BriefcaseIcon size={12} className="inline" />
                  )}
                  {t}
                </button>
              ))}
            </div>

            {!isFirstAddress && (
              <label className="group flex w-full cursor-pointer items-center justify-center gap-2 sm:w-auto">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-lg border-2 transition-all ${
                    formData.isDefault ? 'bg-brand border-brand shadow-lg' : 'border-border'
                  }`}
                >
                  {formData.isDefault && <CheckIcon size={12} className="text-brand-foreground" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.isDefault}
                  onChange={(e) => {
                    setFormData({ ...formData, isDefault: e.target.checked });
                  }}
                />
                <span className="text-foreground-subtle text-[10px] font-black tracking-widest uppercase">
                  Set Default
                </span>
              </label>
            )}
          </div>
        </div>

        <div className="border-border bg-background-muted flex flex-col gap-2.5 rounded-b-4xl border-t px-6 py-5">
          <button
            disabled={!isFormValid}
            onClick={() => {
              onSave({
                id: initialData?.id ?? Date.now().toString(),
                ...formData,
              } as Address);
            }}
            className={`flex w-full items-center justify-center gap-2 rounded-4xl py-4 text-xs font-black tracking-[0.2em] uppercase transition-all ${
              isFormValid
                ? 'bg-brand text-brand-foreground shadow-brand/20 shadow-xl active:scale-95'
                : 'bg-border text-foreground-subtle cursor-not-allowed'
            }`}
          >
            <ShieldCheckIcon size={15} />
            <span>Save Address</span>
          </button>
        </div>
      </div>
    </div>
  );
};
