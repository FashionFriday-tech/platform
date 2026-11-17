'use client';

import React, { useState } from 'react';

import { ShieldCheckIcon } from '@ff/ui';

import { usePayments } from '../hooks/usePayments';
import { IssueRefundModal } from './IssueRefundModal';
import { PaymentDetailsDrawer } from './PaymentDetailsDrawer';
import { PaymentFilterBar } from './PaymentFilterBar';
import { PaymentReceiptModal } from './PaymentReceiptModal';
import { PaymentsTable } from './PaymentsTable';
import { PaymentStatsCards } from './PaymentStatsCards';
import { PaymentTrendChart } from './PaymentTrendChart';

export function PaymentsFeature() {
  const {
    payments,
    stats,
    isLoading,
    isStatsLoading,
    totalPages,
    totalCount,
    currentPage,
    itemsPerPage,
    selectedPaymentId,
    selectedPaymentDetail,
    isDetailLoading,
    actionLoadingId,
    searchQuery,
    statusFilter,
    methodFilter,
    dateRange,
    riskFilter,
    sortField,
    sortDir,
    autoRefreshInterval,
    setSearchQuery,
    setStatusFilter,
    setMethodFilter,
    setDateRange,
    setRiskFilter,
    setSortField,
    setSortDir,
    setCurrentPage,
    setItemsPerPage,
    setAutoRefreshInterval,
    setSelectedPaymentId,
    fetchPayments,
    fetchStats,
    fetchPaymentDetails,
    handleSyncGateway,
    handleCapture,
    handleVoid,
    handleRefund,
    exportLedgerToCsv,
  } = usePayments();

  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-black dark:text-white">
              Payments & Financial Ledger
            </h1>
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Gateway Connected
            </span>
          </div>
          <p className="mt-1 text-xs text-black/50 dark:text-white/50">
            Real-time multi-gateway transaction tracking, escrow hold release, and zero-fee stock
            voids
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-2xl border border-black/5 bg-white/80 px-3 py-1.5 text-xs font-bold text-black/70 shadow-xs dark:border-white/10 dark:bg-[#121212]/80 dark:text-white/70">
            <ShieldCheckIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Razorpay 2-Step Escrow Active</span>
          </div>
        </div>
      </div>

      {/* KPI Bento Cards */}
      <PaymentStatsCards
        stats={stats}
        isLoading={isStatsLoading}
        onFilterExpiring={() => {
          setStatusFilter('AUTHORIZED');
          setRiskFilter('EXPIRING');
        }}
        onFilterAuthorized={() => {
          setStatusFilter('AUTHORIZED');
          setRiskFilter('ALL');
        }}
      />

      {/* 7-Day Payment Trajectory Chart */}
      <PaymentTrendChart trendData={stats?.dailyTrend} isLoading={isStatsLoading} />

      {/* Filter and Command Hub */}
      <PaymentFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        methodFilter={methodFilter}
        onMethodChange={setMethodFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        riskFilter={riskFilter}
        onRiskFilterChange={setRiskFilter}
        autoRefreshInterval={autoRefreshInterval}
        onAutoRefreshChange={setAutoRefreshInterval}
        isLoading={isLoading}
        onRefresh={() => {
          void fetchPayments();
          void fetchStats();
        }}
        onExportCsv={exportLedgerToCsv}
        totalCount={totalCount}
      />

      {/* Master Transactions Ledger Table */}
      <PaymentsTable
        payments={payments}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        itemsPerPage={itemsPerPage}
        sortField={sortField}
        sortDir={sortDir}
        actionLoadingId={actionLoadingId}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
        onSortChange={(field) => {
          if (sortField === field) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
          } else {
            setSortField(field);
            setSortDir('desc');
          }
        }}
        onSelectPayment={(id) => {
          void fetchPaymentDetails(id);
        }}
        onSyncGateway={handleSyncGateway}
        onCapture={handleCapture}
        onVoid={handleVoid}
      />

      {/* Slide-over Forensics Drawer */}
      <PaymentDetailsDrawer
        isOpen={Boolean(selectedPaymentId)}
        onClose={() => setSelectedPaymentId(null)}
        detail={selectedPaymentDetail}
        isLoading={isDetailLoading}
        actionLoadingId={actionLoadingId}
        onSyncGateway={handleSyncGateway}
        onCapture={handleCapture}
        onVoid={handleVoid}
        onOpenRefundModal={() => setIsRefundModalOpen(true)}
        onOpenReceiptModal={() => setIsReceiptModalOpen(true)}
      />

      {/* Issue Refund Dialog */}
      <IssueRefundModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        detail={selectedPaymentDetail}
        onConfirmRefund={async (amount, reason) => {
          if (selectedPaymentId) {
            await handleRefund(selectedPaymentId, amount, reason);
          }
        }}
      />

      {/* Official Payment Receipt Modal */}
      <PaymentReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        detail={selectedPaymentDetail}
      />
    </div>
  );
}
