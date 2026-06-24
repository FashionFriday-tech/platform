'use client';

import React from 'react';

import { useSellers } from '../hooks/useSellers';
import { AddSellerModal } from './AddSellerModal';
import { SellersFilterBar } from './SellersFilterBar';
import { SellersTable } from './SellersTable';
import { SellerStats } from './SellerStats';

export function SellersFeature() {
  const {
    stats,
    categories,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    isAddModalOpen,
    setIsAddModalOpen,
    sellerToEdit,
    setSellerToEdit,
    isLoading,
    filteredSellers,
    handleSaveSeller,
  } = useSellers();

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      {/* Top Metric Cards */}
      <SellerStats stats={stats} />

      {/* Filter and Action Bar */}
      <SellersFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
        onOpenAddModal={() => {
          setSellerToEdit(null);
          setIsAddModalOpen(true);
        }}
      />

      {/* Sellers Data Table */}
      <div className="scrollbar-hide min-h-0 flex-1 overflow-auto pb-6">
        <SellersTable sellers={filteredSellers} isLoading={isLoading} />
      </div>

      {/* Create / Edit Modal */}
      <AddSellerModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSellerToEdit(null);
        }}
        onSave={handleSaveSeller}
        sellerToEdit={sellerToEdit}
        categories={categories}
      />
    </div>
  );
}
