'use client';

import React from 'react';

import { CloseIcon, DownloadIcon, ShieldCheckIcon } from '@ff/ui';

import { type PaymentDetailResponse } from '../types';

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  detail: PaymentDetailResponse | null;
}

function formatInr(val: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(val);
}

export function PaymentReceiptModal({ isOpen, onClose, detail }: PaymentReceiptModalProps) {
  if (!isOpen || !detail) return null;

  const order = detail.order;
  const customer = detail.customer;
  const gw = detail.gateway;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-xs" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-3xl border border-black/10 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-[#141414]">
        {/* Actions Bar (hidden when printing) */}
        <div className="flex items-center justify-between border-b border-black/5 pb-4 dark:border-white/10 print:hidden">
          <span className="text-xs font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
            Official Payment Voucher
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-2xl bg-black px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              <DownloadIcon className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="mt-6 space-y-6 text-black dark:text-white" id="payment-receipt-print">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-black tracking-wider uppercase">FASHION FRIDAY</h1>
              <p className="text-[11px] text-black/50 dark:text-white/50">
                Official E-Commerce Transaction Receipt
              </p>
              <p className="mt-1 text-[11px] text-black/40 dark:text-white/40">
                GSTIN: 32AABCF1234F1Z5 • support@fashionfriday.in
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <ShieldCheckIcon className="h-3 w-3" />
                VERIFIED PAYMENT
              </span>
              <p className="mt-1 font-mono text-xs font-bold">#{order.orderNumber}</p>
              <p className="text-[11px] text-black/40 dark:text-white/40">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Customer & Gateway Info */}
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-black/5 bg-black/[0.02] p-4 text-xs dark:border-white/10 dark:bg-white/[0.02]">
            <div>
              <p className="text-[10px] font-bold text-black/40 uppercase dark:text-white/40">
                Billed To
              </p>
              <p className="mt-0.5 font-bold">{customer.name}</p>
              <p className="text-black/60 dark:text-white/60">{customer.phone}</p>
              {customer.email && (
                <p className="text-black/60 dark:text-white/60">{customer.email}</p>
              )}
            </div>

            <div className="text-right">
              <p className="text-[10px] font-bold text-black/40 uppercase dark:text-white/40">
                Gateway Reference
              </p>
              <p className="mt-0.5 font-mono font-bold">
                {order.razorpayPaymentId || 'COD Reference'}
              </p>
              <p className="text-black/60 dark:text-white/60">Method: {order.paymentMethod}</p>
              {gw?.bankRrn && (
                <p className="font-mono text-[11px] text-black/60 dark:text-white/60">
                  Bank RRN: {gw.bankRrn}
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="divide-y divide-black/5 text-xs dark:divide-white/5">
            <div className="flex justify-between py-2 text-[10px] font-bold text-black/40 uppercase dark:text-white/40">
              <span>Item Description</span>
              <span>Amount</span>
            </div>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between py-2.5">
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-[11px] text-black/50 dark:text-white/50">
                    Size: {item.size} • Qty: {item.quantity}
                  </p>
                </div>
                <span className="font-bold">{formatInr(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Financial Totals */}
          <div className="space-y-1.5 border-t border-black/10 pt-3 text-xs dark:border-white/10">
            <div className="flex justify-between text-black/60 dark:text-white/60">
              <span>Subtotal:</span>
              <span>{formatInr(order.totalAmount)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Discount Applied:</span>
                <span>-{formatInr(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-black/60 dark:text-white/60">
              <span>Shipping & Delivery:</span>
              <span>{order.shippingFees > 0 ? formatInr(order.shippingFees) : 'FREE'}</span>
            </div>
            <div className="flex justify-between border-t border-black/10 pt-2 text-sm font-black dark:border-white/10">
              <span>Total Paid:</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {formatInr(order.finalAmount)}
              </span>
            </div>
          </div>

          {/* Footer Legal & Security */}
          <div className="border-t border-black/5 pt-4 text-center text-[10px] text-black/40 dark:border-white/5 dark:text-white/40">
            This is an electronically generated receipt verified with Razorpay payment gateway
            infrastructure.
          </div>
        </div>
      </div>
    </div>
  );
}
