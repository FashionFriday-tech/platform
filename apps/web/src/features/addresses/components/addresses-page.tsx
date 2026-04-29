'use client';

import React from 'react';

import { MapPinIcon, PlusIcon } from '@ff/ui';

import { useAddresses } from '../hooks/use-addresses';
import { AddressCard } from './address-card';
import { AddressFormModal } from './address-form-modal';

export function AddressesPage() {
  const {
    addresses,
    sortedAddresses,
    isModalOpen,
    editingAddress,
    handleSave,
    handleSetDefault,
    handleDelete,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
  } = useAddresses();

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
            onClick={handleOpenAddModal}
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
                onEdit={handleOpenEditModal}
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
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
export default AddressesPage;
