'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  createAddressAction,
  deleteAddressAction,
  fetchUserAddressesAction,
  setDefaultAddressAction,
  updateAddressAction,
} from '../services/addresses.actions';
import { type Address } from '../types';

const LOCAL_STORAGE_KEY = 'ff_local_addresses';

function getLocalAddresses(): Address[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Address[]) : [];
  } catch {
    return [];
  }
}

function setLocalAddresses(addresses: Address[]) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(addresses));
  } catch (err) {
    console.error('Failed to write local addresses:', err);
  }
}

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const loadAddresses = useCallback(async () => {
    setIsLoading(true);
    try {
      const serverAddresses = await fetchUserAddressesAction();
      if (serverAddresses && serverAddresses.length > 0) {
        setAddresses(serverAddresses);
        setLocalAddresses(serverAddresses);
      } else {
        const cached = getLocalAddresses();
        setAddresses(cached);
      }
    } catch (error) {
      console.error('Failed to load user addresses:', error);
      const cached = getLocalAddresses();
      setAddresses(cached);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAddresses();
  }, [loadAddresses]);

  const sortedAddresses = useMemo(() => {
    return [...addresses].sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));
  }, [addresses]);

  const handleSave = async (data: Address) => {
    setIsModalOpen(false);

    const isExisting = !!editingAddress && addresses.some((a) => a.id === data.id);
    const makeThisDefault = addresses.length === 0 || data.isDefault;

    // Optimistic update
    const updated = [...addresses];
    const finalData = { ...data, isDefault: makeThisDefault };

    if (makeThisDefault) {
      for (let i = 0; i < updated.length; i++) {
        updated[i] = { ...updated[i], isDefault: false };
      }
    }

    const idx = updated.findIndex((a) => a.id === data.id);
    if (idx >= 0) {
      updated[idx] = finalData;
    } else {
      updated.unshift(finalData);
    }

    setAddresses(updated);
    setLocalAddresses(updated);

    try {
      if (isExisting) {
        const saved = await updateAddressAction(data.id, data);
        if (saved) {
          setAddresses((prev) => {
            const next = prev.map((a) => (a.id === data.id ? saved : a));
            setLocalAddresses(next);
            return next;
          });
        }
      } else {
        const { id: _tempId, ...createData } = data;
        const saved = await createAddressAction(createData);
        if (saved) {
          setAddresses((prev) => {
            const next = prev.map((a) => (a.id === data.id ? saved : a));
            setLocalAddresses(next);
            return next;
          });
        }
      }
    } catch (error) {
      console.error('Failed to persist address to database:', error);
    }
  };

  const handleSetDefault = async (id: string) => {
    // Optimistic update
    const next = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    setAddresses(next);
    setLocalAddresses(next);

    try {
      await setDefaultAddressAction(id);
    } catch (error) {
      console.error('Failed to set default address on server:', error);
    }
  };

  const handleDelete = async (id: string) => {
    // Optimistic update
    const remaining = addresses.filter((a) => a.id !== id);
    if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
      remaining[0] = { ...remaining[0], isDefault: true };
    }
    setAddresses(remaining);
    setLocalAddresses(remaining);

    try {
      await deleteAddressAction(id);
    } catch (error) {
      console.error('Failed to delete address from server:', error);
    }
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
    isLoading,
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
