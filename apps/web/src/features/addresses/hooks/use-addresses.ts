import { useMemo, useState } from 'react';

import { type Address } from '../types';

export function useAddresses() {
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
      updated = updated.map((a, i) => (i === idx ? finalData : a));
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

  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return {
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
  };
}
