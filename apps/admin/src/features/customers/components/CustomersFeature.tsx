'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomersFilterBar } from './CustomersFilterBar';
import { CustomerStats } from './CustomerStats';
import { CustomersTable } from './CustomersTable';
import { useCustomers } from '../hooks/useCustomers';

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
    handleSort,
    toggleCustomerStatus,
    handleExport,
  } = useCustomers();

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      <CustomerStats />

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <CustomersFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          ordersFilter={ordersFilter}
          onOrdersChange={setOrdersFilter}
          onExport={handleExport}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key="customers-table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 min-h-0 overflow-hidden flex flex-col"
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
