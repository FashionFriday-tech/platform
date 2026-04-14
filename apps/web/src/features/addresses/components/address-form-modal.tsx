import React from 'react';

import { AlertIcon, BriefcaseIcon, CheckIcon, CloseIcon, HomeIcon, LoaderIcon } from '@ff/ui';

import { useAddressForm } from '../hooks/use-address-form';
import { type Address } from '../types';
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
      <div className="bg-background/60 absolute inset-0 backdrop-blur-md" onClick={onClose} />
      <div className="bg-background-elevated border-border relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-4xl border shadow-2xl">
        <div className="border-border bg-background-elevated sticky top-0 z-10 flex items-center justify-between rounded-t-4xl border-b px-6 py-5">
          <h2 className="text-lg font-black tracking-tighter uppercase">Address Details</h2>
          <button
            onClick={onClose}
            className="hover:bg-background-muted rounded-full p-2 transition-colors"
          >
            <CloseIcon size={20} />
          </button>
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
            <div className="bg-background-muted border-border flex flex-col justify-center rounded-xl border px-3">
              <span className="text-foreground-subtle mb-1 text-[8px] leading-none font-black tracking-widest uppercase">
                Detected Region
              </span>
              <p className="text-foreground truncate text-[10px] font-bold">
                {formData.district
                  ? `${formData.district ?? ''}, ${formData.state ?? ''}`
                  : 'Waiting for Pin...'}
              </p>
            </div>
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
                label="Landmark"
                placeholder="Famous place nearby"
                value={formData.landmark ?? ''}
                onChange={(v: string) => {
                  setFormData({ ...formData, landmark: v });
                }}
              />
              <FormInput
                label="Building / House No"
                placeholder="No. / Name"
                required
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
              label="Recipient Name"
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
                required
                value={formData.phone ?? ''}
                onChange={(v: string) => {
                  setFormData({
                    ...formData,
                    phone: v.replace(/\D/g, '').slice(0, 10),
                  });
                }}
              />
              <FormInput
                inputRef={altPhoneRef}
                label="Alt Phone (Optional)"
                prefix="+91"
                value={formData.altPhone ?? ''}
                onChange={(v: string) => {
                  setFormData({
                    ...formData,
                    altPhone: v.replace(/\D/g, '').slice(0, 10),
                  });
                }}
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
            <div className="bg-background-muted border-border flex w-full rounded-full border p-1 sm:w-auto">
              {(['Home', 'Work'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, type: t });
                  }}
                  className={`flex-1 rounded-full py-2 text-[10px] font-black tracking-widest uppercase transition-all sm:px-6 ${
                    formData.type === t
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-foreground-subtle'
                  }`}
                >
                  {t === 'Home' ? (
                    <HomeIcon size={10} className="mr-1 inline" />
                  ) : (
                    <BriefcaseIcon size={10} className="mr-1 inline" />
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

        <div className="border-border bg-background-muted flex flex-col gap-2 rounded-b-4xl border-t px-6 py-5">
          {!isFormValid && (
            <p className="text-destructive flex items-center justify-center gap-1 text-center text-[10px] font-bold tracking-tight uppercase">
              <AlertIcon size={12} /> Fill all required fields
            </p>
          )}
          <button
            disabled={!isFormValid}
            onClick={() => {
              onSave({
                id: initialData?.id ?? Date.now().toString(),
                ...formData,
              } as Address);
            }}
            className={`w-full rounded-4xl py-4 text-xs font-black tracking-[0.2em] uppercase transition-all ${
              isFormValid
                ? 'bg-brand text-brand-foreground shadow-brand/20 shadow-xl active:scale-95'
                : 'bg-border text-foreground-subtle cursor-not-allowed'
            }`}
          >
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
};
