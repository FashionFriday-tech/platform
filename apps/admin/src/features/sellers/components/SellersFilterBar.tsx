'use client';

import React from 'react';

import { PlusIcon, SearchIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { CustomSelect } from '../../../components/ui/CustomSelect';
import { type SellerCategory, type SellerStatus } from '../types';

interface SellersFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: 'ALL' | SellerStatus;
  setStatusFilter: (val: 'ALL' | SellerStatus) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  categories: SellerCategory[];
  onOpenAddModal: () => void;
}

export function SellersFilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  categories,
  onOpenAddModal,
}: SellersFilterBarProps) {
  const categoryOptions = [
    { label: 'All Categories', value: 'ALL' },
    ...categories.map((c) => ({
      label: `${c.name} (${c.gender ?? 'All'})`,
      value: c.id,
    })),
  ];

  const statusOptions = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'Suspended', value: 'SUSPENDED' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative z-30 flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-4 lg:flex-row lg:items-center lg:justify-between dark:border-white/5 dark:bg-[#111111]"
    >
      <div className="relative max-w-md flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <SearchIcon className="h-4 w-4 text-black/30 dark:text-white/30" />
        </div>
        <input
          type="text"
          placeholder="Search by name, store, phone, or email..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2.5 pr-4 pl-11 text-sm text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222222] dark:focus:ring-white/5"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <CustomSelect
          options={categoryOptions}
          value={categoryFilter}
          onChange={(val) => {
            setCategoryFilter(val);
          }}
          className="z-30 w-48"
        />

        <CustomSelect
          options={statusOptions}
          value={statusFilter}
          onChange={(val) => {
            setStatusFilter(val as 'ALL' | SellerStatus);
          }}
          className="z-20 w-36"
        />

        <button
          onClick={onOpenAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-black/90 hover:shadow-lg active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          <PlusIcon className="h-4 w-4" />
          Add Seller
        </button>
      </div>
    </motion.div>
  );
}
