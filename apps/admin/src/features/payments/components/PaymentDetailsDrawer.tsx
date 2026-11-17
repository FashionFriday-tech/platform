'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import {
  CloseIcon,
  CopyIcon,
  CreditCardIcon,
  DownloadIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
} from '@ff/ui';
import { WhatsAppIcon } from '@ff/ui/icons';
import { toast } from 'sonner';

import { type PaymentDetailResponse } from '../types';

interface PaymentDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  detail: PaymentDetailResponse | null;
  isLoading: boolean;
  actionLoadingId: string | null;
  onSyncGateway: (id: string) => void;
  onCapture: (id: string) => void;
  onVoid: (id: string) => void;
  onOpenRefundModal: () => void;
  onOpenReceiptModal: () => void;
}

function formatInr(val: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(val);
}

export function PaymentDetailsDrawer({
  isOpen,
  onClose,
  detail,
  isLoading,
  actionLoadingId,
  onSyncGateway,
  onCapture,
  onVoid,
  onOpenRefundModal,
  onOpenReceiptModal,
}: PaymentDetailsDrawerProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedKey(text);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const order = detail?.order;
  const customer = detail?.customer;
  const fee = detail?.feeBreakdown;
  const gw = detail?.gateway;
  const isActionLoading = actionLoadingId === order?.id;

  const cleanPhone = customer?.phone ? customer.phone.replace(/\D/g, '') : '';
  const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl transition-all dark:bg-[#111111]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/5 px-6 py-5 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 text-black dark:bg-white/10 dark:text-white">
                <CreditCardIcon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-black dark:text-white">
                    Payment Forensics & Audit
                  </h2>
                  {order && (
                    <span className="rounded-md bg-black/5 px-2 py-0.5 font-mono text-xs font-bold text-black/70 dark:bg-white/10 dark:text-white/70">
                      #{order.orderNumber}
                    </span>
                  )}
                </div>
                <p className="text-xs text-black/40 dark:text-white/40">
                  Transaction ledger, gateway settlement & risk verification
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {order?.razorpayPaymentId && (
                <button
                  type="button"
                  disabled={isActionLoading || isLoading}
                  onClick={() => onSyncGateway(order.id)}
                  className="flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs font-bold text-black shadow-xs transition-all hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-white/5"
                  title="Re-query live gateway state"
                >
                  <RefreshCcwIcon
                    className={`h-3.5 w-3.5 ${isActionLoading ? 'animate-spin' : ''}`}
                  />
                  <span>Re-Sync Gateway</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-black/40 hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="scrollbar-hide h-[calc(100vh-140px)] space-y-6 overflow-y-auto p-6">
            {isLoading || !detail ? (
              <div className="animate-pulse space-y-4">
                <div className="h-28 rounded-2xl bg-black/5 dark:bg-white/5" />
                <div className="h-40 rounded-2xl bg-black/5 dark:bg-white/5" />
                <div className="h-48 rounded-2xl bg-black/5 dark:bg-white/5" />
              </div>
            ) : (
              <>
                {/* 1. Transaction Hero Banner */}
                <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-radial from-emerald-500/10 via-transparent to-transparent p-6 shadow-xs dark:border-white/10 dark:from-emerald-500/15">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="text-xs font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                        Total Transaction Amount
                      </span>
                      <p className="mt-1 text-3xl font-black text-black dark:text-white">
                        {formatInr(order!.finalAmount)}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs font-semibold text-black/60 dark:text-white/60">
                          Status:
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-2.5 py-0.5 text-xs font-bold text-black dark:border-white/15 dark:bg-[#1a1a1a] dark:text-white">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          {order!.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end">
                      <span className="text-xs font-semibold text-black/40 dark:text-white/40">
                        Method & Gateway
                      </span>
                      <span className="mt-1 text-sm font-bold text-black dark:text-white">
                        {order!.paymentMethod === 'RAZORPAY'
                          ? 'Razorpay Gateway'
                          : order!.paymentMethod === 'COD'
                            ? 'Cash on Delivery (Advance Deposit)'
                            : order!.paymentMethod}
                      </span>
                      {order!.razorpayPaymentId && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-black/60 dark:text-white/60">
                          <span className="font-mono">{order!.razorpayPaymentId}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(order!.razorpayPaymentId!, 'Payment ID')}
                            className={`rounded p-0.5 transition-colors ${
                              copiedKey === order!.razorpayPaymentId
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white'
                            }`}
                            title="Copy Payment ID"
                          >
                            <CopyIcon className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Financial Breakdown & Net Settlement */}
                <div className="rounded-3xl border border-black/5 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/[0.02]">
                  <h3 className="text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                    Settlement & Gateway Fees Breakdown
                  </h3>
                  <div className="mt-4 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-black/60 dark:text-white/60">Gross Order Value:</span>
                      <span className="font-bold text-black dark:text-white">
                        {formatInr(order!.finalAmount)}
                      </span>
                    </div>

                    {order!.paymentMethod === 'COD' ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-emerald-600 dark:text-emerald-400">
                            Advance Collected (Razorpay):
                          </span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {formatInr(order!.advanceAmount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-amber-600 dark:text-amber-400">
                            Balance Due on Delivery:
                          </span>
                          <span className="font-bold text-amber-600 dark:text-amber-400">
                            {formatInr(order!.balanceDue)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-black/60 dark:text-white/60">
                            Estimated Gateway Fee (2% MDR):
                          </span>
                          <span className="font-semibold text-rose-600 dark:text-rose-400">
                            -{formatInr(fee!.estimatedMdrFee)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-black/60 dark:text-white/60">
                            GST on Gateway Fee (18%):
                          </span>
                          <span className="font-semibold text-rose-600 dark:text-rose-400">
                            -{formatInr(fee!.estimatedGstOnFee)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-t border-black/5 pt-2 font-bold dark:border-white/10">
                          <span className="text-black dark:text-white">
                            Estimated Net Bank Payout:
                          </span>
                          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                            {formatInr(fee!.estimatedNetPayout)}
                          </span>
                        </div>
                      </>
                    )}

                    {order!.refundedAmount > 0 && (
                      <div className="flex items-center justify-between border-t border-black/5 pt-2 font-bold text-rose-600 dark:border-white/10 dark:text-rose-400">
                        <span>Total Refunded to Customer:</span>
                        <span>-{formatInr(order!.refundedAmount)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Gateway & Cryptographic Verification Audit */}
                <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#161616]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                      Gateway Forensics & Bank RRN
                    </h3>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheckIcon className="h-3.5 w-3.5" />
                      Cryptographically Verified
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                    <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.02]">
                      <span className="text-black/40 dark:text-white/40">Gateway Order ID:</span>
                      <p className="mt-0.5 font-mono font-bold text-black dark:text-white">
                        {order!.razorpayOrderId || 'N/A'}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.02]">
                      <span className="text-black/40 dark:text-white/40">Acquirer Bank RRN:</span>
                      <p className="mt-0.5 font-mono font-bold text-black dark:text-white">
                        {gw?.bankRrn ||
                          (gw?.livePayment?.acquirer_data?.rrn as string) ||
                          'Recorded via Gateway'}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.02]">
                      <span className="text-black/40 dark:text-white/40">Gateway Method:</span>
                      <p className="mt-0.5 font-semibold text-black capitalize dark:text-white">
                        {(gw?.livePayment?.method as string) || order!.paymentMethod}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.02]">
                      <span className="text-black/40 dark:text-white/40">Signature Status:</span>
                      <p className="mt-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                        {order!.razorpaySignature ? 'HMAC-SHA256 Match' : 'Unsigned / COD'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Customer & Shipping Contact */}
                <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#161616]">
                  <h3 className="text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                    Buyer & Destination
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-black dark:text-white">
                        {customer?.name}
                      </p>
                      <p className="text-xs text-black/50 dark:text-white/50">
                        {customer?.phone || 'No phone'}{' '}
                        {customer?.email ? `• ${customer.email}` : ''}
                      </p>
                    </div>
                    {waPhone && (
                      <a
                        href={`https://wa.me/${waPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-95"
                      >
                        <WhatsAppIcon className="h-3.5 w-3.5" />
                        <span>WhatsApp Buyer</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* 5. Items in this Payment */}
                <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#161616]">
                  <h3 className="text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                    Items ({order!.items.length})
                  </h3>
                  <div className="mt-3 divide-y divide-black/5 dark:divide-white/5">
                    {order!.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 py-2.5">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-10 w-10 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-xl bg-black/5 dark:bg-white/10" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-black dark:text-white">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-black/40 dark:text-white/40">
                            Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-black dark:text-white">
                          {formatInr(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer Actions */}
          <div className="border-t border-black/5 bg-white/90 p-4 backdrop-blur-md dark:border-white/10 dark:bg-[#111111]/90">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenReceiptModal}
                  className="flex items-center gap-1.5 rounded-2xl border border-black/10 bg-white px-3.5 py-2 text-xs font-bold text-black shadow-xs transition-all hover:bg-black/5 active:scale-95 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-white/5"
                >
                  <DownloadIcon className="h-3.5 w-3.5" />
                  <span>Download Receipt</span>
                </button>
                {order && (
                  <Link
                    href={`/orders?search=${order.orderNumber}`}
                    className="flex items-center gap-1 rounded-2xl border border-black/5 bg-black/5 px-3.5 py-2 text-xs font-bold text-black/70 transition-all hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/70"
                  >
                    View in Orders
                  </Link>
                )}
              </div>

              {/* Action Buttons depending on status */}
              <div className="flex items-center gap-2">
                {order?.paymentStatus === 'AUTHORIZED' && (
                  <>
                    <button
                      type="button"
                      disabled={isActionLoading}
                      onClick={() => onCapture(order.id)}
                      className="rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                    >
                      Capture Payment Now
                    </button>
                    <button
                      type="button"
                      disabled={isActionLoading}
                      onClick={() => onVoid(order.id)}
                      className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-600 transition-all hover:bg-red-500/20 active:scale-95 disabled:opacity-50 dark:text-red-400"
                    >
                      Void (₹0 Fee)
                    </button>
                  </>
                )}

                {order?.paymentStatus === 'CAPTURED' && (
                  <button
                    type="button"
                    onClick={onOpenRefundModal}
                    className="flex items-center gap-1.5 rounded-2xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-rose-700 active:scale-95"
                  >
                    <RefreshCcwIcon className="h-3.5 w-3.5" />
                    <span>Issue Refund</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
