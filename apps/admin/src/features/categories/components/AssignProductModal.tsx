import React, { useState } from 'react';
import Image from 'next/image';

import { CheckIcon, CloseIcon, PlusIcon, SearchIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { type Product } from '../../products/types';

interface AssignProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (productIds: string[]) => void;
  existingProductIds: string[];
  // Assuming we get all possible products passed here, or fetch them internally
  availableProducts: Product[];
}

export function AssignProductModal({
  isOpen,
  onClose,
  onAssign,
  existingProductIds,
  availableProducts,
}: AssignProductModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedProductIds([]);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const unassignedProducts = availableProducts.filter((p) => !existingProductIds.includes(p.id));

  const filteredProducts = unassignedProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleProductSelection = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id],
    );
  };

  const handleAssign = () => {
    onAssign(selectedProductIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#111111]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 p-6 dark:border-white/5">
          <div>
            <h2 className="text-xl font-bold text-black dark:text-white">Assign Products</h2>
            <p className="mt-1 text-sm text-black/60 dark:text-white/60">
              Select products to add to this category.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-black/60 transition-colors hover:bg-black/10 hover:text-black dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-black/5 p-4 dark:border-white/5">
          <div className="relative">
            <SearchIcon className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-black/40 dark:text-white/40" />
            <input
              type="text"
              placeholder="Search by product name or brand..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-3 pr-4 pl-12 text-sm text-black placeholder-black/40 outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/40 dark:focus:border-white/20 dark:focus:bg-[#222222]"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredProducts.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-black/40 dark:text-white/40">
              <p>No available products found.</p>
            </div>
          ) : (
            <div className="grid gap-2 p-2">
              {filteredProducts.map((product) => {
                const isSelected = selectedProductIds.includes(product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      toggleProductSelection(product.id);
                    }}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors ${
                      isSelected
                        ? 'border-black bg-black/5 dark:border-white dark:bg-white/5'
                        : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
                        <Image
                          src={
                            product.imageUrl ||
                            product.images?.[0] ||
                            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200'
                          }
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-black dark:text-white">{product.name}</p>
                        <p className="text-xs text-black/50 dark:text-white/50">{product.brand}</p>
                      </div>
                    </div>
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                        isSelected
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                          : 'border-black/20 dark:border-white/20'
                      }`}
                    >
                      {isSelected && <CheckIcon className="h-3 w-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-black/5 p-6 dark:border-white/5">
          <p className="text-sm font-medium text-black/60 dark:text-white/60">
            {selectedProductIds.length} product{selectedProductIds.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-xl px-6 py-2.5 text-sm font-semibold text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={selectedProductIds.length === 0}
              className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-black/90 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              Assign Products
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
