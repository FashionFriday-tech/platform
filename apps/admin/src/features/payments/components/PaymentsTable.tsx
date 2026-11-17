'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import {
  ArrowUpDownIcon,
  CopyIcon,
  CreditCardIcon,
  EyeIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
} from '@ff/ui';
import { WhatsAppIcon } from '@ff/ui/icons';
import { toast } from 'sonner';

import type {
  PaymentItem,
  PaymentMethodType,
  PaymentSortDir,
  PaymentSortField,
  PaymentStatusType,
} from '../types';

interface PaymentsTableProps {
  payments: PaymentItem[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  sortField: PaymentSortField;
  sortDir: PaymentSortDir;
  actionLoadingId: string | null;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (limit: number) => void;
  onSortChange: (field: PaymentSortField) => void;
  onSelectPayment: (id: string) => void;
  onSyncGateway: (id: string) => void;
  onCapture: (id: string) => void;
  onVoid: (id: string) => void;
}

function formatInr(val: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
}

function getRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / (60 * 1000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });
}

export function PaymentsTable({
  payments,
  isLoading,
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  sortField,
  sortDir,
  actionLoadingId,
  onPageChange,
  onItemsPerPageChange,
  onSortChange,
  onSelectPayment,
  onSyncGateway,
  onCapture,
  onVoid,
}: PaymentsTableProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedKey(text);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const renderStatusBadge = (status: PaymentStatusType, isExpiringSoon: boolean) => {
    switch (status) {
      case 'CAPTURED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Settled / Captured
          </span>
        );
      case 'AUTHORIZED':
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
              isExpiringSoon
                ? 'border-red-500/30 bg-red-500/15 text-red-600 dark:text-red-400'
                : 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isExpiringSoon ? 'animate-pulse bg-red-500' : 'bg-amber-500'
              }`}
            />
            {isExpiringSoon ? 'Expiring Hold (<24h)' : 'Escrow Hold (₹0 Fee)'}
          </span>
        );
      case 'REFUNDED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/15 dark:text-indigo-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Fully Refunded
          </span>
        );
      case 'PARTIALLY_REFUNDED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-bold text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/15 dark:text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
            Partially Refunded
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[11px] font-bold text-red-700 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Payment Failed
          </span>
        );
      case 'VOIDED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/5 px-2.5 py-1 text-[11px] font-bold text-black/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-black/40 dark:bg-white/40" />
            Voided (₹0 Fee)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/5 px-2.5 py-1 text-[11px] font-bold text-black/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-black/40 dark:bg-white/40" />
            {status}
          </span>
        );
    }
  };

  const renderMethodBadge = (method: PaymentMethodType) => {
    switch (method) {
      case 'RAZORPAY':
        return (
          <span className="inline-flex items-center gap-1 rounded-xl bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
            <CreditCardIcon className="h-3 w-3" />
            Razorpay Online
          </span>
        );
      case 'COD':
        return (
          <span className="inline-flex items-center gap-1 rounded-xl bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
            COD Advance (₹200)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-xl bg-black/5 px-2 py-0.5 text-[11px] font-bold text-black/70 dark:bg-white/10 dark:text-white/70">
            {method}
          </span>
        );
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-black/5 bg-white/80 shadow-xs backdrop-blur-xl dark:border-white/10 dark:bg-[#121212]/80">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-black/5 text-[11px] font-bold tracking-wider text-black/40 uppercase dark:border-white/10 dark:text-white/40">
              <th
                onClick={() => onSortChange('orderNumber')}
                className="cursor-pointer px-5 py-4 transition-colors hover:text-black dark:hover:text-white"
              >
                <div className="flex items-center gap-1.5">
                  <span>Order & Payment ID</span>
                  <ArrowUpDownIcon
                    className={`h-3 w-3 ${sortField === 'orderNumber' ? 'text-black dark:text-white' : ''}`}
                  />
                  {sortField === 'orderNumber' && (
                    <span className="text-[9px] font-black">{sortDir === 'asc' ? '▲' : '▼'}</span>
                  )}
                </div>
              </th>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Method & Gateway</th>
              <th
                onClick={() => onSortChange('amount')}
                className="cursor-pointer px-5 py-4 transition-colors hover:text-black dark:hover:text-white"
              >
                <div className="flex items-center gap-1.5">
                  <span>Financial Breakdown</span>
                  <ArrowUpDownIcon
                    className={`h-3 w-3 ${sortField === 'amount' ? 'text-black dark:text-white' : ''}`}
                  />
                  {sortField === 'amount' && (
                    <span className="text-[9px] font-black">{sortDir === 'asc' ? '▲' : '▼'}</span>
                  )}
                </div>
              </th>
              <th
                onClick={() => onSortChange('status')}
                className="cursor-pointer px-5 py-4 transition-colors hover:text-black dark:hover:text-white"
              >
                <div className="flex items-center gap-1.5">
                  <span>Payment Status</span>
                  <ArrowUpDownIcon
                    className={`h-3 w-3 ${sortField === 'status' ? 'text-black dark:text-white' : ''}`}
                  />
                  {sortField === 'status' && (
                    <span className="text-[9px] font-black">{sortDir === 'asc' ? '▲' : '▼'}</span>
                  )}
                </div>
              </th>
              <th
                onClick={() => onSortChange('createdAt')}
                className="cursor-pointer px-5 py-4 transition-colors hover:text-black dark:hover:text-white"
              >
                <div className="flex items-center gap-1.5">
                  <span>Initiated</span>
                  <ArrowUpDownIcon
                    className={`h-3 w-3 ${sortField === 'createdAt' ? 'text-black dark:text-white' : ''}`}
                  />
                  {sortField === 'createdAt' && (
                    <span className="text-[9px] font-black">{sortDir === 'asc' ? '▲' : '▼'}</span>
                  )}
                </div>
              </th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {isLoading && payments.length === 0 ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="px-5 py-4">
                    <div className="h-8 rounded-xl bg-black/5 dark:bg-white/5" />
                  </td>
                </tr>
              ))
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-3xl bg-black/5 dark:bg-white/10">
                    <CreditCardIcon className="h-6 w-6 text-black/40 dark:text-white/40" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-black dark:text-white">
                    No payment transactions found
                  </h3>
                  <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                    Try adjusting your filters, date range, or search criteria.
                  </p>
                </td>
              </tr>
            ) : (
              payments.map((p) => {
                const isActionLoading = actionLoadingId === p.id;
                const cleanPhone = p.customer.phone ? p.customer.phone.replace(/\D/g, '') : '';
                const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

                return (
                  <tr
                    key={p.id}
                    onClick={() => onSelectPayment(p.id)}
                    className="group cursor-pointer transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                  >
                    {/* Order & Payment ID */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/orders?search=${p.orderNumber}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-black text-black hover:underline dark:text-white"
                          >
                            #{p.orderNumber}
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(p.orderNumber, 'Order Number');
                            }}
                            className={`rounded p-0.5 transition-colors ${
                              copiedKey === p.orderNumber
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white'
                            }`}
                            title="Copy Order #"
                          >
                            <CopyIcon className="h-3 w-3" />
                          </button>
                        </div>
                        {p.razorpayPaymentId ? (
                          <div className="mt-1 flex items-center gap-1 text-[11px] text-black/50 dark:text-white/50">
                            <span className="font-mono">{p.razorpayPaymentId}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(p.razorpayPaymentId!, 'Payment ID');
                              }}
                              className={`rounded p-0.5 transition-colors ${
                                copiedKey === p.razorpayPaymentId
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-black/30 hover:text-black dark:text-white/30 dark:hover:text-white'
                              }`}
                              title="Copy Payment ID"
                            >
                              <CopyIcon className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="mt-0.5 text-[11px] text-black/40 dark:text-white/40">
                            Payment ID: Pending Gateway
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-black dark:text-white">
                          {p.customer.name}
                        </span>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-black/50 dark:text-white/50">
                          <span>{p.customer.phone || 'No phone'}</span>
                          {waPhone && (
                            <a
                              href={`https://wa.me/${waPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400"
                              title="Chat on WhatsApp"
                            >
                              <WhatsAppIcon className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Method */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col items-start gap-1">
                        {renderMethodBadge(p.paymentMethod)}
                        {p.razorpaySignatureVerified && (
                          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <ShieldCheckIcon className="h-3 w-3" />
                            HMAC Verified
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Financial Breakdown */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-black dark:text-white">
                          {formatInr(p.amount)}
                        </span>
                        {p.paymentMethod === 'COD' && p.balanceAmount > 0 && (
                          <div className="mt-0.5 flex items-center gap-1 text-[11px]">
                            <span className="text-emerald-600 dark:text-emerald-400">
                              Adv: {formatInr(p.advanceAmount)}
                            </span>
                            <span className="text-black/30 dark:text-white/30">•</span>
                            <span className="text-amber-600 dark:text-amber-400">
                              Due: {formatInr(p.balanceAmount)}
                            </span>
                          </div>
                        )}
                        {p.refundedAmount > 0 && (
                          <span className="mt-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                            Refunded: {formatInr(p.refundedAmount)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      {renderStatusBadge(p.paymentStatus, p.isExpiringSoon)}
                    </td>

                    {/* Initiated Date */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-black/80 dark:text-white/80">
                          {getRelativeTime(p.createdAt)}
                        </span>
                        <span className="text-[10px] text-black/40 dark:text-white/40">
                          {new Date(p.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Quick Capture Button for Authorized holds */}
                        {p.paymentStatus === 'AUTHORIZED' && (
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => onCapture(p.id)}
                            className="rounded-xl bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                            title="Capture payment now"
                          >
                            Capture
                          </button>
                        )}

                        {/* Quick Void Button */}
                        {p.paymentStatus === 'AUTHORIZED' && (
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => onVoid(p.id)}
                            className="rounded-xl border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[11px] font-bold text-red-600 transition-all hover:bg-red-500/20 active:scale-95 disabled:opacity-50 dark:text-red-400"
                            title="Void authorization (₹0 Fee)"
                          >
                            Void
                          </button>
                        )}

                        {/* Sync Gateway */}
                        {p.razorpayPaymentId && (
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => onSyncGateway(p.id)}
                            className="rounded-xl border border-black/5 bg-black/5 p-1.5 text-black/60 transition-all hover:bg-black/10 hover:text-black active:scale-95 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
                            title="Sync live status with Razorpay"
                          >
                            <RefreshCcwIcon
                              className={`h-3.5 w-3.5 ${isActionLoading ? 'animate-spin' : ''}`}
                            />
                          </button>
                        )}

                        {/* View Forensics Drawer */}
                        <button
                          type="button"
                          onClick={() => onSelectPayment(p.id)}
                          className="rounded-xl border border-black/10 bg-white p-1.5 text-black transition-all hover:bg-black hover:text-white active:scale-95 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-white dark:hover:text-black"
                          title="View Payment Forensics"
                        >
                          <EyeIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-black/5 px-5 py-4 sm:flex-row dark:border-white/10">
        <div className="flex items-center gap-2 text-xs font-semibold text-black/50 dark:text-white/50">
          <span>
            Showing {payments.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} records
          </span>
          <span>•</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="rounded-xl border border-black/10 bg-transparent px-2 py-1 text-xs font-bold text-black focus:outline-hidden dark:border-white/10 dark:text-white"
          >
            <option value="10">10 / page</option>
            <option value="20">20 / page</option>
            <option value="50">50 / page</option>
            <option value="100">100 / page</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1 || isLoading}
            onClick={() => onPageChange(currentPage - 1)}
            className="rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs font-bold text-black transition-all hover:bg-black/5 disabled:opacity-40 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-white/5"
          >
            Previous
          </button>
          <div className="px-2 text-xs font-bold text-black dark:text-white">
            Page {currentPage} of {Math.max(1, totalPages)}
          </div>
          <button
            type="button"
            disabled={currentPage >= totalPages || isLoading}
            onClick={() => onPageChange(currentPage + 1)}
            className="rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs font-bold text-black transition-all hover:bg-black/5 disabled:opacity-40 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-white/5"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
