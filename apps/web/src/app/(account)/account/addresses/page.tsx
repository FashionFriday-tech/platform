'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import {
  AlertIcon,
  BriefcaseIcon,
  CheckIcon,
  CloseIcon,
  EditIcon,
  HomeIcon,
  LoaderIcon,
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
  StarIcon,
  TrashIcon,
} from '@ff/ui';

// --- INTERFACES ---

interface Address {
  id: string;
  name: string;
  phone: string;
  altPhone?: string;
  pincode: string;
  addressLine1: string;
  addressLine2: string;
  landmark?: string;
  city: string;
  district: string;
  state: string;
  type: 'Home' | 'Work';
  isDefault: boolean;
}

interface PincodeAPIResponse {
  Status: string;
  PostOffice:
    | {
        State: string;
        District: string;
      }[]
    | null;
}

interface FormInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  prefix?: string;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  required?: boolean;
}

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

interface AddressFormModalProps {
  initialData: Address | null;
  onClose: () => void;
  onSave: (address: Address) => void;
  isFirstAddress: boolean;
}

// --- REUSABLE COMPONENTS ---

const FormInput = ({
  label,
  value,
  onChange,
  prefix,
  placeholder,
  inputRef,
  required,
}: FormInputProps) => (
  <div className="w-full space-y-1">
    <label className="text-foreground-subtle ml-1 flex justify-between text-[9px] font-black tracking-widest uppercase">
      {label}
      {required && <span className="text-brand text-[8px] opacity-60">Required</span>}
    </label>
    <div className="relative">
      {prefix && (
        <span className="text-foreground-subtle absolute top-1/2 left-3 -translate-y-1/2 text-xs font-bold">
          {prefix}
        </span>
      )}
      <input
        ref={inputRef}
        className={`bg-background border-border focus:border-brand placeholder:text-foreground-subtle/50 w-full rounded-xl border py-2.5 text-xs font-bold transition-all outline-none ${
          prefix ? 'pl-10' : 'px-3'
        } ${required && !value ? 'border-dashed' : ''}`}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) => (
  <div
    className={`bg-background-elevated flex flex-col rounded-4xl border p-6 transition-all duration-300 ${
      address.isDefault
        ? 'border-brand ring-brand shadow-xl ring-1'
        : 'border-border hover:border-foreground/20 shadow-sm'
    }`}
  >
    <div className="mb-6 flex items-start justify-between">
      <div className="flex flex-wrap gap-2">
        <span className="bg-background-muted text-foreground-muted flex items-center gap-1 rounded-full px-3 py-1 text-[9px] font-black tracking-widest uppercase">
          {address.type === 'Home' ? <HomeIcon size={10} /> : <BriefcaseIcon size={10} />}{' '}
          {address.type}
        </span>
        {address.isDefault ? (
          <span className="bg-brand text-brand-foreground flex items-center gap-1 rounded-full px-3 py-1 text-[9px] font-black tracking-widest uppercase">
            <StarIcon size={10} fill="currentColor" /> Default
          </span>
        ) : (
          <button
            onClick={() => onSetDefault(address.id)}
            className="border-border hover:border-brand hover:text-brand rounded-full border px-3 py-1 text-[9px] font-black tracking-widest uppercase transition-colors"
          >
            Set Default
          </button>
        )}
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => onEdit(address)}
          className="hover:bg-background-muted text-foreground-subtle hover:text-foreground rounded-full p-2 transition-colors"
        >
          <EditIcon size={14} />
        </button>
        <button
          onClick={() => onDelete(address.id)}
          className="hover:bg-destructive/10 text-foreground-subtle hover:text-destructive rounded-full p-2 transition-colors"
        >
          <TrashIcon size={14} />
        </button>
      </div>
    </div>

    <div className="grow space-y-2">
      <h3 className="truncate text-lg leading-tight font-black">{address.name}</h3>
      <p className="text-foreground-muted line-clamp-2 text-xs leading-relaxed">
        {address.addressLine1}, {address.addressLine2}{' '}
        {address.landmark && (
          <span className="text-foreground-subtle text-[10px] italic">
            {' '}
            (Near {address.landmark})
          </span>
        )}
      </p>
      <p className="text-foreground text-[11px] font-bold tracking-tight uppercase">
        {address.city}, {address.district}
      </p>
      <p className="text-foreground-subtle text-[9px] font-black tracking-widest uppercase">
        {address.state} — {address.pincode}
      </p>

      <div className="flex flex-wrap gap-2 pt-3">
        <div className="text-foreground bg-background-muted border-border flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[10px] font-black">
          <PhoneIcon size={12} className="text-brand" /> <span>+91 {address.phone}</span>
        </div>
        {address.altPhone && (
          <div className="text-foreground-subtle bg-background-muted/50 border-border flex items-center gap-2 rounded-lg border border-dashed px-3 py-1.5 text-[10px] font-black">
            <PhoneIcon size={12} /> <span>+91 {address.altPhone}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

const AddressFormModal = ({
  initialData,
  onClose,
  onSave,
  isFirstAddress,
}: AddressFormModalProps) => {
  const [formData, setFormData] = useState<Partial<Address>>(
    initialData || { type: 'Home', isDefault: isFirstAddress || false },
  );
  const [loading, setLoading] = useState(false);
  const altPhoneRef = useRef<HTMLInputElement>(null);

  const isFormValid = useMemo(() => {
    const requiredFields = [
      formData.name,
      formData.phone,
      formData.pincode,
      formData.addressLine1,
      formData.addressLine2,
      formData.city,
    ];
    return (
      requiredFields.every((f) => f && f.trim().length > 0) &&
      formData.phone?.length === 10 &&
      formData.pincode?.length === 6 &&
      !!formData.district
    );
  }, [formData]);

  useEffect(() => {
    if (formData.phone?.length === 10) {
      altPhoneRef.current?.focus();
    }
  }, [formData.phone]);

  useEffect(() => {
    if (formData.pincode?.length === 6) {
      const fetchRegion = async () => {
        setLoading(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
          const data = (await res.json()) as PincodeAPIResponse[];

          if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice) {
            const details = data[0].PostOffice[0];
            setFormData((prev) => ({
              ...prev,
              state: details.State,
              district: details.District,
            }));
          } else {
            setFormData((prev) => ({ ...prev, state: '', district: '' }));
          }
        } catch {
          setFormData((prev) => ({ ...prev, state: '', district: '' }));
        } finally {
          setLoading(false);
        }
      };
      void fetchRegion();
    } else {
      if (formData.district || formData.state) {
        setFormData((prev) => ({ ...prev, state: '', district: '' }));
      }
    }
  }, [formData.pincode, formData.district, formData.state]);

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
                value={formData.pincode || ''}
                onChange={(v: string) =>
                  setFormData({
                    ...formData,
                    pincode: v.replace(/\D/g, '').slice(0, 6),
                  })
                }
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
                  ? `${formData.district}, ${formData.state}`
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
                value={formData.city || ''}
                onChange={(v: string) => setFormData({ ...formData, city: v })}
              />
              <FormInput
                label="Area / Locality"
                placeholder="Street/Colony"
                required
                value={formData.addressLine2 || ''}
                onChange={(v: string) => setFormData({ ...formData, addressLine2: v })}
              />
            </div>
            <div className="flex gap-2">
              <FormInput
                label="Landmark"
                placeholder="Famous place nearby"
                value={formData.landmark || ''}
                onChange={(v: string) => setFormData({ ...formData, landmark: v })}
              />
              <FormInput
                label="Building / House No"
                placeholder="No. / Name"
                required
                value={formData.addressLine1 || ''}
                onChange={(v: string) => setFormData({ ...formData, addressLine1: v })}
              />
            </div>
          </div>

          <hr className="border-border border-dashed" />

          <div className="space-y-4">
            <FormInput
              label="Recipient Name"
              placeholder="Full name"
              required
              value={formData.name || ''}
              onChange={(v: string) => setFormData({ ...formData, name: v })}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Primary Phone"
                prefix="+91"
                required
                value={formData.phone || ''}
                onChange={(v: string) =>
                  setFormData({
                    ...formData,
                    phone: v.replace(/\D/g, '').slice(0, 10),
                  })
                }
              />
              <FormInput
                inputRef={altPhoneRef}
                label="Alt Phone (Optional)"
                prefix="+91"
                value={formData.altPhone || ''}
                onChange={(v: string) =>
                  setFormData({
                    ...formData,
                    altPhone: v.replace(/\D/g, '').slice(0, 10),
                  })
                }
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
            <div className="bg-background-muted border-border flex w-full rounded-full border p-1 sm:w-auto">
              {(['Home', 'Work'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: t })}
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
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
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
            onClick={() =>
              onSave({
                id: initialData?.id || Date.now().toString(),
                ...formData,
              } as Address)
            }
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

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const sortedAddresses = useMemo(() => {
    return [...addresses].sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));
  }, [addresses]);

  const handleSave = (data: Address) => {
    let updated = [...addresses];
    const makeThisDefault = addresses.length === 0 || data.isDefault;

    if (makeThisDefault) {
      updated = updated.map((a) => ({ ...a, isDefault: false }));
    }

    const idx = updated.findIndex((a) => a.id === data.id);
    const finalData = { ...data, isDefault: makeThisDefault };

    if (idx >= 0) {
      updated[idx] = finalData;
    } else {
      updated.push(finalData);
    }

    setAddresses(updated);
    setIsModalOpen(false);
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const handleDelete = (id: string) => {
    const remaining = addresses.filter((a) => a.id !== id);
    if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
      remaining[0].isDefault = true;
    }
    setAddresses(remaining);
  };

  return (
    <div className="bg-background text-foreground pb-20">
      <main className="mx-auto max-w-5xl px-4 md:pt-24">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter uppercase">My Addresses</h1>
            <p className="text-foreground-muted text-xs font-bold tracking-widest uppercase">
              {addresses.length} Saved Location
              {addresses.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => {
              setEditingAddress(null);
              setIsModalOpen(true);
            }}
            className="bg-brand text-brand-foreground flex items-center gap-2 rounded-4xl px-6 py-3 font-bold shadow-lg hover:opacity-90 active:scale-95"
          >
            <PlusIcon size={18} /> Add New
          </button>
        </div>

        {sortedAddresses.length === 0 ? (
          <div className="border-border text-foreground-subtle bg-background-elevated/50 flex flex-col items-center justify-center rounded-4xl border-2 border-dashed py-24">
            <MapPinIcon size={48} className="mb-4 opacity-10" />
            <p className="text-xs font-black tracking-widest uppercase">No addresses saved</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedAddresses.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                onEdit={(a) => {
                  setEditingAddress(a);
                  setIsModalOpen(true);
                }}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        )}
      </main>

      {isModalOpen && (
        <AddressFormModal
          initialData={editingAddress}
          isFirstAddress={addresses.length === 0}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
