'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomersFilterBar } from './components/CustomersFilterBar';
import { CustomersTable } from './components/CustomersTable';
import { useCustomers } from './hooks/useCustomers';

export default function CustomersFeature() {
  const {
    customers,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortField,
    sortDirection,
    handleSort,
    toggleCustomerStatus,
  } = useCustomers();

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-y-auto">
      <div className="flex flex-1 flex-col gap-4">
        <CustomersFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key="customers-table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <CustomersTable
              customers={customers}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onToggleStatus={toggleCustomerStatus}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
