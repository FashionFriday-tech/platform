'use client';

import React, { useState } from 'react';

import { AlertCircleIcon, CloseIcon, RefreshCcwIcon } from '@ff/ui';
import { toast } from 'sonner';

import { type PaymentDetailResponse } from '../types';

interface IssueRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  detail: PaymentDetailResponse | null;
  onConfirmRefund: (amount?: number, reason?: string) => Promise<void>;
}

export function IssueRefundModal({
  isOpen,
  onClose,
  detail,
  onConfirmRefund,
}: IssueRefundModalProps) {
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full');
  const [partialAmount, setPartialAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('Customer Cancellation');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !detail) return null;

  const order = detail.order;
  const maxRefundable = Math.max(0, order.finalAmount - order.refundedAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let refundAmount: number | undefined;

    if (refundType === 'partial') {
      const amt = parseFloat(partialAmount);
      if (isNaN(amt) || amt <= 0) {
        toast.error('Please enter a valid partial refund amount');
        return;
      }
      if (amt > maxRefundable) {
        toast.error(`Refund amount cannot exceed max refundable balance of ₹${maxRefundable}`);
        return;
      }
      refundAmount = amt;
    }

    const fullReason = customNotes.trim() ? `${reason}: ${customNotes.trim()}` : reason;

    try {
      setIsSubmitting(true);
      await onConfirmRefund(refundAmount, fullReason);
      onClose();
    } catch {
      // toast is handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-xs" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#161616]">
        <div className="flex items-center justify-between border-b border-black/5 pb-4 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
              <RefreshCcwIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">Issue Gateway Refund</h3>
              <p className="text-[11px] text-black/50 dark:text-white/50">
                Order #{order.orderNumber}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Warning Banner */}
          <div className="flex items-start gap-2.5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
            <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Refunds are dispatched through the payment gateway to the customer&apos;s source
              account. Processing takes 5-7 business days depending on their bank.
            </span>
          </div>

          {/* Refund Type Picker */}
          <div>
            <label className="text-xs font-bold text-black/60 dark:text-white/60">
              Refund Amount Option
            </label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRefundType('full')}
                className={`rounded-2xl border p-3 text-left transition-all ${
                  refundType === 'full'
                    ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                    : 'border-black/10 bg-black/[0.02] text-black/70 hover:bg-black/5 dark:border-white/10 dark:bg-white/[0.02] dark:text-white/70'
                }`}
              >
                <p className="text-xs font-bold">Full Refund</p>
                <p className="mt-0.5 text-sm font-black">₹{maxRefundable}</p>
              </button>

              <button
                type="button"
                onClick={() => setRefundType('partial')}
                className={`rounded-2xl border p-3 text-left transition-all ${
                  refundType === 'partial'
                    ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                    : 'border-black/10 bg-black/[0.02] text-black/70 hover:bg-black/5 dark:border-white/10 dark:bg-white/[0.02] dark:text-white/70'
                }`}
              >
                <p className="text-xs font-bold">Partial Refund</p>
                <p className="mt-0.5 text-xs font-medium opacity-80">Custom Amount</p>
              </button>
            </div>
          </div>

          {/* Custom Partial Amount Input */}
          {refundType === 'partial' && (
            <div>
              <label className="text-xs font-bold text-black/60 dark:text-white/60">
                Enter Amount (Max ₹{maxRefundable})
              </label>
              <div className="relative mt-1">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs font-bold text-black/40 dark:text-white/40">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max={maxRefundable}
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  placeholder={`e.g. ${Math.min(500, maxRefundable)}`}
                  className="w-full rounded-2xl border border-black/10 bg-white py-2 pr-3 pl-8 text-xs font-bold text-black focus:border-black/30 focus:outline-hidden dark:border-white/10 dark:bg-[#111111] dark:text-white"
                  required
                />
              </div>
            </div>
          )}

          {/* Reason Selector */}
          <div>
            <label className="text-xs font-bold text-black/60 dark:text-white/60">
              Refund Reason (Audit Log)
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-xs font-bold text-black focus:border-black/30 focus:outline-hidden dark:border-white/10 dark:bg-[#111111] dark:text-white"
            >
              <option value="Customer Cancellation">Customer Requested Cancellation</option>
              <option value="Item Out of Stock">Item Out of Stock / Unfulfillable</option>
              <option value="Damaged or Defective Item">Damaged or Defective Item</option>
              <option value="Wrong Item Delivered">Wrong Item Delivered</option>
              <option value="Delayed Shipment">Delayed Shipment Compensation</option>
              <option value="Goodwill Customer Retention">Goodwill Customer Retention</option>
              <option value="Duplicate Payment">Duplicate Payment</option>
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="text-xs font-bold text-black/60 dark:text-white/60">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. Approved by Sales Manager over phone"
              className="mt-1 w-full rounded-2xl border border-black/10 bg-white p-2.5 text-xs font-medium text-black focus:border-black/30 focus:outline-hidden dark:border-white/10 dark:bg-[#111111] dark:text-white"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-xs font-bold text-black hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-2xl bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 disabled:opacity-50"
            >
              <RefreshCcwIcon className={`h-3 w-3 ${isSubmitting ? 'animate-spin' : ''}`} />
              <span>{isSubmitting ? 'Processing...' : 'Confirm & Dispatch Refund'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
