'use client';

import React from 'react';

import { useSellers } from '../hooks/useSellers';
import { AddSellerModal } from './AddSellerModal';
import { SellerDetailsModal } from './SellerDetailsModal';
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
    selectedSeller,
    setSelectedSeller,
    detailsDefaultTab,
    sellerToEdit,
    setSellerToEdit,
    isLoading,
    filteredSellers,
    handleSaveSeller,
    handleDeleteSeller,
    handleToggleStatus,
    openSellerOrders,
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
        <SellersTable
          sellers={filteredSellers}
          isLoading={isLoading}
          onSelectSeller={(seller) => {
            setSelectedSeller(seller);
          }}
          onEditSeller={(seller) => {
            setSellerToEdit(seller);
            setIsAddModalOpen(true);
          }}
          onDeleteSeller={handleDeleteSeller}
          onToggleStatus={handleToggleStatus}
          onOpenOrders={openSellerOrders}
        />
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

      {/* Seller Details & Orders Modal */}
      <SellerDetailsModal
        seller={selectedSeller}
        isOpen={!!selectedSeller}
        onClose={() => {
          setSelectedSeller(null);
        }}
        defaultTab={detailsDefaultTab}
        onEdit={(seller) => {
          setSelectedSeller(null);
          setSellerToEdit(seller);
          setIsAddModalOpen(true);
        }}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}
