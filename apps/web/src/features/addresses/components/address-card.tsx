import React from 'react';

import { BriefcaseIcon, EditIcon, HomeIcon, PhoneIcon, StarIcon, TrashIcon } from '@ff/ui';

import { type Address } from '../types';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export const AddressCard = ({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) => (
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
            onClick={() => {
              onSetDefault(address.id);
            }}
            className="border-border hover:border-brand hover:text-brand rounded-full border px-3 py-1 text-[9px] font-black tracking-widest uppercase transition-colors"
          >
            Set Default
          </button>
        )}
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => {
            onEdit(address);
          }}
          className="hover:bg-background-muted text-foreground-subtle hover:text-foreground rounded-full p-2 transition-colors"
        >
          <EditIcon size={14} />
        </button>
        <button
          onClick={() => {
            onDelete(address.id);
          }}
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
