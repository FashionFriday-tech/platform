"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { 
  CloseIcon,
  TrashIcon,
  PhoneIcon,
  StarIcon,
  EditIcon,
  CheckIcon,
  LoaderIcon,
  PlusIcon,
  HomeIcon,
  BriefcaseIcon,
  AlertIcon,
  MapPinIcon 
} from "@ff/ui";

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
  type: "Home" | "Work";
  isDefault: boolean;
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
}: any) => (
  <div className="space-y-1 w-full">
    <label className="text-[9px] font-black uppercase tracking-widest text-foreground-subtle ml-1 flex justify-between">
      {label}
      {required && (
        <span className="text-brand opacity-60 text-[8px]">Required</span>
      )}
    </label>
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle text-xs font-bold">
          {prefix}
        </span>
      )}
      <input
        ref={inputRef}
        className={`w-full bg-background border border-border rounded-xl py-2.5 text-xs font-bold outline-none focus:border-brand transition-all placeholder:text-foreground-subtle/50 ${
          prefix ? "pl-10" : "px-3"
        } ${required && !value ? "border-dashed" : ""}`}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }: any) => (
  <div
    className={`p-6 rounded-4xl border bg-background-elevated flex flex-col transition-all duration-300  ${
      address.isDefault
        ? "border-brand ring-1 ring-brand shadow-xl"
        : "border-border shadow-sm hover:border-foreground/20"
    }`}
  >
    <div className="flex justify-between items-start mb-6">
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 bg-background-muted text-foreground-muted rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
          {address.type === "Home" ? (
            <HomeIcon size={10} />
          ) : (
            <BriefcaseIcon size={10} />
          )}{" "}
          {address.type}
        </span>
        {address.isDefault ? (
          <span className="px-3 py-1 bg-brand text-brand-foreground rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
            <StarIcon size={10} fill="currentColor" /> Default
          </span>
        ) : (
          <button
            onClick={() => onSetDefault(address.id)}
            className="px-3 py-1 border border-border hover:border-brand hover:text-brand rounded-full text-[9px] font-black uppercase tracking-widest transition-colors"
          >
            Set Default
          </button>
        )}
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => onEdit(address)}
          className="p-2 hover:bg-background-muted rounded-full text-foreground-subtle hover:text-foreground transition-colors"
        >
          <EditIcon size={14} />
        </button>
        <button
          onClick={() => onDelete(address.id)}
          className="p-2 hover:bg-destructive/10 rounded-full text-foreground-subtle hover:text-destructive transition-colors"
        >
          <TrashIcon size={14} />
        </button>
      </div>
    </div>

    <div className="grow space-y-2">
      <h3 className="font-black text-lg leading-tight truncate">
        {address.name}
      </h3>
      <p className="text-foreground-muted text-xs leading-relaxed line-clamp-2">
        {address.addressLine1}, {address.addressLine2}{" "}
        {address.landmark && (
          <span className="italic text-foreground-subtle text-[10px]">
            {" "}
            (Near {address.landmark})
          </span>
        )}
      </p>
      <p className="text-foreground font-bold text-[11px] uppercase tracking-tight">
        {address.city}, {address.district}
      </p>
      <p className="text-foreground-subtle text-[9px] font-black uppercase tracking-widest">
        {address.state} — {address.pincode}
      </p>

      <div className="pt-3 flex flex-wrap gap-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-foreground bg-background-muted px-3 py-1.5 rounded-lg border border-border">
          <PhoneIcon size={12} className="text-brand" />{" "}
          <span>+91 {address.phone}</span>
        </div>
        {address.altPhone && (
          <div className="flex items-center gap-2 text-[10px] font-black text-foreground-subtle bg-background-muted/50 px-3 py-1.5 rounded-lg border border-border border-dashed">
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
}: any) => {
  const [formData, setFormData] = useState<Partial<Address>>(
    initialData || { type: "Home", isDefault: isFirstAddress || false }
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
      formData.district // Ensures API successfully found the region
    );
  }, [formData]);

  // Auto-focus to Alt Phone
  useEffect(() => {
    if (formData.phone?.length === 10) altPhoneRef.current?.focus();
  }, [formData.phone]);

  // PINCODE API LOGIC - Attempts every time pincode becomes 6 digits
  useEffect(() => {
    if (formData.pincode?.length === 6) {
      setLoading(true);
      fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`)
        .then((res) => res.json())
        .then((data) => {
          if (data[0].Status === "Success") {
            const details = data[0].PostOffice[0];
            setFormData((prev) => ({
              ...prev,
              state: details.State,
              district: details.District,
            }));
          } else {
            // Reset if invalid pincode
            setFormData((prev) => ({ ...prev, state: "", district: "" }));
          }
        })
        .catch(() => {
          setFormData((prev) => ({ ...prev, state: "", district: "" }));
        })
        .finally(() => setLoading(false));
    } else {
      // Clear region if user types or deletes pincode
      if (formData.district || formData.state) {
        setFormData((prev) => ({ ...prev, state: "", district: "" }));
      }
    }
  }, [formData.pincode]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative bg-background-elevated w-full max-w-lg rounded-4xl shadow-2xl border border-border flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-background-elevated sticky top-0 rounded-t-4xl z-10">
          <h2 className="text-lg font-black uppercase tracking-tighter">
            Address Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background-muted rounded-full transition-colors"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-6 no-scrollbar">
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <FormInput
                label="Pincode"
                placeholder="6 Digits"
                required
                value={formData.pincode || ""}
                onChange={(v: string) =>
                  setFormData({
                    ...formData,
                    pincode: v.replace(/\D/g, "").slice(0, 6),
                  })
                }
              />
              {loading && (
                <LoaderIcon
                  className="absolute right-3 bottom-2.5 animate-spin text-brand"
                  size={16}
                />
              )}
            </div>
            <div className="bg-background-muted rounded-xl px-3 border border-border flex flex-col justify-center">
              <span className="text-[8px] font-black uppercase text-foreground-subtle tracking-widest leading-none mb-1">
                Detected Region
              </span>
              <p className="text-[10px] font-bold truncate text-foreground">
                {formData.district
                  ? `${formData.district}, ${formData.state}`
                  : "Waiting for Pin..."}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <FormInput
                label="City / Town"
                placeholder="e.g. Puthanathani"
                required
                value={formData.city || ""}
                onChange={(v: string) => setFormData({ ...formData, city: v })}
              />
              <FormInput
                label="Area / Locality"
                placeholder="Street/Colony"
                required
                value={formData.addressLine2 || ""}
                onChange={(v: string) =>
                  setFormData({ ...formData, addressLine2: v })
                }
              />
            </div>
            <div className="flex gap-2">
              <FormInput
                label="Landmark"
                placeholder="Famous place nearby"
                value={formData.landmark || ""}
                onChange={(v: string) =>
                  setFormData({ ...formData, landmark: v })
                }
              />
              <FormInput
                label="Building / House No"
                placeholder="No. / Name"
                required
                value={formData.addressLine1 || ""}
                onChange={(v: string) =>
                  setFormData({ ...formData, addressLine1: v })
                }
              />
            </div>
          </div>

          <hr className="border-border border-dashed" />

          <div className="space-y-4">
            <FormInput
              label="Recipient Name"
              placeholder="Full name"
              required
              value={formData.name || ""}
              onChange={(v: string) => setFormData({ ...formData, name: v })}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Primary Phone"
                prefix="+91"
                required
                value={formData.phone || ""}
                onChange={(v: string) =>
                  setFormData({
                    ...formData,
                    phone: v.replace(/\D/g, "").slice(0, 10),
                  })
                }
              />
              <FormInput
                inputRef={altPhoneRef}
                label="Alt Phone (Optional)"
                prefix="+91"
                value={formData.altPhone || ""}
                onChange={(v: string) =>
                  setFormData({
                    ...formData,
                    altPhone: v.replace(/\D/g, "").slice(0, 10),
                  })
                }
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex bg-background-muted p-1 rounded-full border border-border w-full sm:w-auto">
              {(["Home", "Work"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: t })}
                  className={`flex-1 sm:px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    formData.type === t
                      ? "bg-background text-foreground shadow-sm"
                      : "text-foreground-subtle"
                  }`}
                >
                  {t === "Home" ? (
                    <HomeIcon size={10} className="inline mr-1" />
                  ) : (
                    <BriefcaseIcon size={10} className="inline mr-1" />
                  )}
                  {t}
                </button>
              ))}
            </div>

            {!isFirstAddress && (
              <label className="flex items-center gap-2 cursor-pointer group w-full sm:w-auto justify-center">
                <div
                  className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                    formData.isDefault
                      ? "bg-brand border-brand shadow-lg"
                      : "border-border"
                  }`}
                >
                  {formData.isDefault && (
                    <CheckIcon size={12} className="text-brand-foreground" />
                  )}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                />
                <span className="text-[10px] font-black text-foreground-subtle uppercase tracking-widest">
                  Set Default
                </span>
              </label>
            )}
          </div>
        </div>

        <div className="px-6 py-5 border-t border-border bg-background-muted flex flex-col gap-2 rounded-b-4xl">
          {!isFormValid && (
            <p className="text-[10px] text-destructive font-bold text-center flex items-center justify-center gap-1 uppercase tracking-tight">
              <AlertIcon size={12} /> Fill all required fields
            </p>
          )}
          <button
            disabled={!isFormValid}
            onClick={() =>
              onSave({
                id: initialData?.id || Date.now().toString(),
                ...formData,
              })
            }
            className={`w-full py-4 rounded-4xl font-black uppercase text-xs tracking-[0.2em] transition-all ${
              isFormValid
                ? "bg-brand text-brand-foreground shadow-xl shadow-brand/20 active:scale-95"
                : "bg-border text-foreground-subtle cursor-not-allowed"
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

  // Default address always on top
  const sortedAddresses = useMemo(() => {
    return [...addresses].sort((a, b) =>
      a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
    );
  }, [addresses]);

  const handleSave = (data: Address) => {
    let updated = [...addresses];
    const makeThisDefault = addresses.length === 0 || data.isDefault;

    if (makeThisDefault) {
      updated = updated.map((a) => ({ ...a, isDefault: false }));
    }

    const idx = updated.findIndex((a) => a.id === data.id);
    const finalData = { ...data, isDefault: makeThisDefault };

    idx >= 0 ? (updated[idx] = finalData) : updated.push(finalData);
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
      <main className="max-w-5xl mx-auto px-4 md:pt-24">
        <div className="flex justify-between items-end mb-10 gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase tracking-tighter">
              My Addresses
            </h1>
            <p className="text-foreground-muted text-xs font-bold uppercase tracking-widest">
              {addresses.length} Saved Location
              {addresses.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => {
              setEditingAddress(null);
              setIsModalOpen(true);
            }}
            className="bg-brand text-brand-foreground px-6 py-3 rounded-4xl font-bold shadow-lg flex items-center gap-2 hover:opacity-90 active:scale-95"
          >
            <PlusIcon size={18} /> Add New
          </button>
        </div>

        {sortedAddresses.length === 0 ? (
          <div className="py-24 border-2 border-dashed border-border rounded-4xl flex flex-col items-center justify-center text-foreground-subtle bg-background-elevated/50">
            <MapPinIcon size={48} className="mb-4 opacity-10" />
            <p className="font-black uppercase text-xs tracking-widest">
              No addresses saved
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAddresses.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                onEdit={(a: Address) => {
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
