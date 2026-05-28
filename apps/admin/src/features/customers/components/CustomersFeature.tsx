'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CloseIcon, PhoneIcon, UserIcon } from '@ff/ui';

import { useCustomers } from '../hooks/useCustomers';
import { CustomersFilterBar } from './CustomersFilterBar';
import { CustomersTable } from './CustomersTable';
import { CustomerStats } from './CustomerStats';

export default function CustomersFeature() {
  const {
    customers,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    ordersFilter,
    setOrdersFilter,
    sortField,
    sortDirection,
    isLoading,
    handleSort,
    addCustomer,
    toggleCustomerStatus,
    handleExport,
  } = useCustomers();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 4) {
      errors.name = 'Name must be at least 4 characters long';
    }
    // Must match ^\+91[6-9]\d{9}$
    if (!phone.trim() || !/^\+91[6-9]\d{9}$/.test(phone)) {
      errors.phone = 'Phone must start with +91 followed by a valid 10-digit Indian mobile number';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    const success = await addCustomer({ name, phone });
    setIsSubmitting(false);
    if (success) {
      setName('');
      setPhone('+91');
      setFormErrors({});
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      <CustomerStats customers={customers} />

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <CustomersFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          ordersFilter={ordersFilter}
          onOrdersChange={setOrdersFilter}
          onExport={handleExport}
          onAddCustomer={() => {
            setIsAddModalOpen(true);
          }}
        />

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 items-center justify-center"
            >
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-black/10 border-t-black dark:border-white/10 dark:border-t-white" />
            </motion.div>
          ) : (
            <motion.div
              key="customers-table"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
            >
              <CustomersTable
                customers={customers}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onToggleStatus={toggleCustomerStatus}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Premium Glassmorphism Customer Registration Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSubmitting) {
                  setIsAddModalOpen(false);
                }
              }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl dark:border-white/5 dark:bg-[#111111]"
            >
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />

              <div className="flex items-center justify-between border-b border-black/5 p-6 dark:border-white/5">
                <h3 className="text-xl font-bold text-black dark:text-white">Register New Customer</h3>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                  }}
                  className="rounded-lg p-1.5 text-black/50 hover:bg-black/5 dark:text-white/50 dark:hover:bg-white/5"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-black/60 dark:text-white/60">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <UserIcon className="h-4 w-4 text-black/30 dark:text-white/30" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g., John Doe"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2.5 pr-4 pl-11 text-sm text-black placeholder-black/30 outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222222]"
                    />
                  </div>
                  {formErrors.name && (
                    <span className="mt-1 block text-xs font-medium text-red-500">{formErrors.name}</span>
                  )}
                </div>


                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-black/60 dark:text-white/60">
                    WhatsApp Number
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <PhoneIcon className="h-4 w-4 text-black/30 dark:text-white/30" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g., +919876543210"
                      value={phone}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (!value.startsWith('+91')) {
                          if (value.startsWith('+9') || value.startsWith('+') || value === '') {
                            value = '+91';
                          } else {
                            value = '+91' + value.replace(/^\+?9?1?/, '');
                          }
                        }
                        setPhone(value);
                      }}
                      className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2.5 pr-4 pl-11 text-sm text-black placeholder-black/30 outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222222]"
                    />
                  </div>
                  {formErrors.phone && (
                    <span className="mt-1 block text-xs font-medium text-red-500">{formErrors.phone}</span>
                  )}
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-black/5 pt-4 dark:border-white/5">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setIsAddModalOpen(false);
                    }}
                    className="rounded-xl border border-black/5 bg-transparent px-4 py-2.5 text-sm font-semibold text-black/70 hover:bg-black/5 active:scale-95 disabled:opacity-50 dark:border-white/5 dark:text-white/70 dark:hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    ) : (
                      'Register Customer'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
