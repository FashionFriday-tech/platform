'use client';

import React, { useEffect, useRef, useState } from 'react';

import { DownloadIcon, PlusIcon, SearchIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { CustomSelect } from '../../../components/ui/CustomSelect';

interface CustomersFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  ordersFilter: string;
  onOrdersChange: (value: string) => void;
  onExport: () => void;
  onAddCustomer: () => void;
}

const statusOptions = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Blocked', value: 'blocked' },
];

const ordersOptions = [
  { label: 'All Orders', value: 'all' },
  { label: 'Has Orders', value: 'with-orders' },
  { label: 'No Orders', value: 'no-orders' },
];

export function CustomersFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  ordersFilter,
  onOrdersChange,
  onExport,
  onAddCustomer,
}: CustomersFilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close on outside click (desktop)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  const hasActiveFilters =
    Boolean(statusFilter && statusFilter !== 'all') ||
    Boolean(ordersFilter && ordersFilter !== 'all');

  const activeFilterCount =
    (statusFilter && statusFilter !== 'all' ? 1 : 0) +
    (ordersFilter && ordersFilter !== 'all' ? 1 : 0);

  const handleClear = () => {
    onStatusChange('all');
    onOrdersChange('all');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative z-40 flex items-center justify-between gap-2 rounded-2xl border border-black/5 bg-white p-2.5 sm:p-3 md:p-4 dark:border-white/5 dark:bg-[#111111]"
    >
      {/* Left: Search Input (fills remaining space) */}
      <div className="relative min-w-0 flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-3.5">
          <SearchIcon className="h-4 w-4 text-black/30 dark:text-white/30" />
        </div>
        <input
          type="text"
          placeholder="Search customers by name, email or phone..."
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
          }}
          className="block w-full truncate rounded-xl border border-black/5 bg-[#f8f9fa] py-2 pr-8 pl-9 text-xs text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 sm:py-2.5 sm:pl-10 sm:text-sm dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222222] dark:focus:ring-white/5"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Desktop Inline Controls (xl:flex) */}
      <div className="hidden items-center gap-3 xl:flex">
        <CustomSelect
          options={statusOptions}
          value={statusFilter}
          onChange={onStatusChange}
          className="z-50 w-36"
        />

        <CustomSelect
          options={ordersOptions}
          value={ordersFilter}
          onChange={onOrdersChange}
          className="z-50 w-36"
        />

        <button
          onClick={onExport}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-black/5 bg-[#f8f9fa] px-3.5 py-2 text-xs font-semibold whitespace-nowrap text-black/70 transition-all hover:bg-black/5 hover:text-black dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <DownloadIcon className="h-3.5 w-3.5" />
          <span>Export</span>
        </button>
      </div>

      {/* Right Controls: Unified Filter Button + Add Button */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {/* Single Filter Button (Visible on screens < xl) */}
        <div className="relative xl:hidden" ref={filterRef}>
          <button
            type="button"
            onClick={() => {
              setIsFilterOpen(!isFilterOpen);
            }}
            className={`flex items-center space-x-1 rounded-xl border px-2.5 py-2 text-xs font-medium transition-all sm:space-x-1.5 sm:px-3 sm:text-sm ${
              hasActiveFilters
                ? 'border-transparent bg-black text-white shadow-md dark:bg-white dark:text-black'
                : 'border-black/5 bg-[#f8f9fa] text-black/70 hover:bg-black/5 hover:text-black dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white'
            }`}
          >
            <svg
              className="h-3.5 w-3.5 sm:h-4 sm:w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Detailed Filters Drawer / Modal */}
          {isFilterOpen && (
            <>
              {/* Mobile Backdrop */}
              <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
                onClick={() => {
                  setIsFilterOpen(false);
                }}
              />

              <div className="fixed inset-x-3 bottom-3 z-50 flex max-h-[85vh] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-2xl backdrop-blur-2xl duration-200 md:absolute md:top-full md:right-0 md:bottom-auto md:left-auto md:mt-2 md:w-[320px] dark:border-white/10 dark:bg-[#111111]/95">
                <div className="flex items-center justify-between border-b border-black/5 p-4 pb-3 dark:border-white/5">
                  <h3 className="text-base font-bold text-black dark:text-white">
                    Detailed Filters
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFilterOpen(false);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-black/50 hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto p-4">
                  {/* Status Options */}
                  <div>
                    <label className="mb-2 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                      Customer Status
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {statusOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            onStatusChange(opt.value);
                          }}
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                            statusFilter === opt.value
                              ? 'border-transparent bg-black text-white dark:bg-white dark:text-black'
                              : 'border-black/10 bg-black/5 text-black/60 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/60'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orders Options */}
                  <div>
                    <label className="mb-2 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                      Order History
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {ordersOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            onOrdersChange(opt.value);
                          }}
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                            ordersFilter === opt.value
                              ? 'border-transparent bg-black text-white dark:bg-white dark:text-black'
                              : 'border-black/10 bg-black/5 text-black/60 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/60'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Export Action */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onExport();
                        setIsFilterOpen(false);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-black/5 py-2.5 text-xs font-semibold text-black transition-colors hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                    >
                      <DownloadIcon className="h-4 w-4" />
                      <span>Export Customers CSV</span>
                    </button>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center space-x-3 border-t border-black/10 bg-white/5 p-4 backdrop-blur-md dark:border-white/10 dark:bg-black/5">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex-1 rounded-xl px-4 py-2 text-xs font-medium text-black/60 transition-colors hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFilterOpen(false);
                    }}
                    className="flex-1 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-md transition-colors hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                  >
                    Done
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Add Customer Button (Rightmost) */}
        <button
          onClick={onAddCustomer}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-black px-3 py-2 text-xs font-semibold whitespace-nowrap text-white shadow-md transition-all hover:bg-black/90 active:scale-95 sm:px-4 sm:text-sm dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          <PlusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Add Customer</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </motion.div>
  );
}
