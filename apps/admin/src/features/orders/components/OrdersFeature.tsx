'use client';

import React from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { useOrders } from '../hooks/useOrders';
import { OrdersFilterBar } from './OrdersFilterBar';
import { OrdersGrid } from './OrdersGrid';
import { OrdersTable } from './OrdersTable';
import { OrderStats } from './OrderStats';

export default function OrdersFeature() {
  const {
    orders,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    paymentTypeFilter,
    setPaymentTypeFilter,
    viewMode,
    setViewMode,
    sortField,
    sortDirection,
    handleSort,
  } = useOrders();

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      <OrderStats />

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <OrdersFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          dateFilter={dateFilter}
          onDateChange={setDateFilter}
          paymentTypeFilter={paymentTypeFilter}
          onPaymentTypeChange={setPaymentTypeFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            {viewMode === 'table' ? (
              <OrdersTable
                orders={orders}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            ) : (
              <OrdersGrid orders={orders} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
