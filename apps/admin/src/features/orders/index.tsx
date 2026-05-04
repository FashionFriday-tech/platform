'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OrderStats } from './components/OrderStats';
import { OrdersFilterBar } from './components/OrdersFilterBar';
import { OrdersTable } from './components/OrdersTable';
import { OrdersGrid } from './components/OrdersGrid';
import { useOrders } from './hooks/useOrders';

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
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-y-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
          Orders Management
        </h1>
        <p className="mt-1 text-black/60 dark:text-white/60">
          Review, manage and track all customer orders in real-time.
        </p>
      </motion.div>

      <OrderStats />

      <div className="flex flex-1 flex-col gap-4">
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
