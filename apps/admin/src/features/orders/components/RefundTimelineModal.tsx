'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { CheckIcon, ClockIcon, CloseIcon, CopyIcon, RefreshCcwIcon, ShieldCheckIcon } from '@ff/ui';
import { WhatsAppIcon } from '@ff/ui/icons';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';

import { api } from '@/lib/api-client';

import { type Order, type RefundTimelineResponse } from '../types';

interface RefundTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export function RefundTimelineModal({ isOpen, onClose, order }: RefundTimelineModalProps) {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<RefundTimelineResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadData = () => {
    setIsLoading(true);
    setHasError(false);

    api
      .get<RefundTimelineResponse>(`/orders/${order.id}/refund-timeline`)
      .then((res) => {
        if (res) {
          setData(res);
        } else {
          setHasError(true);
        }
      })
      .catch((err: unknown) => {
        console.error('Failed to load refund timeline for admin:', err);
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    loadData();
  }, [isOpen, order.id]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopy = (text: string, label: string) => {
    if (!text) {
      return;
    }
    void navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedKey(label);
        toast.success(`${label} Copied!`, {
          description: `${text} is ready to paste.`,
        });
        setTimeout(() => {
          setCopiedKey(null);
        }, 2000);
      })
      .catch(() => {
        toast.error('Could not copy to clipboard');
      });
  };

  const handleShareWhatsApp = () => {
    const phone = order.customer?.phone || order.shippingAddress?.phoneNumber || '';
    const cleanPhone = phone.replace(/\D/g, '');
    const recipient = cleanPhone
      ? cleanPhone.startsWith('91')
        ? cleanPhone
        : `91${cleanPhone}`
      : '';

    const lines = [
      `*Fashion Friday Refund Update*`,
      ``,
      `Hello ${order.customer?.name || 'Customer'},`,
      `Your refund for Order *#${order.orderNumber || order.id}* is on file:`,
      ``,
      `• *Refund Amount:* ₹${refundAmount.toFixed(2)}`,
      `• *Status:* ${isProcessed ? 'Completed / Credited' : 'In Progress with Bank'}`,
      bankRrn ? `• *Bank Reference (RRN):* ${bankRrn}` : null,
      data?.paymentId ? `• *Payment Reference:* ${data.paymentId}` : null,
      data?.refundId ? `• *Refund ID:* ${data.refundId}` : null,
      `• *Destination:* ${data?.paymentAccount || 'Original Source Account'}`,
      ``,
      isProcessed
        ? `The refund has been cleared by our payment network. If not reflected yet, please check your bank account or quote the Bank Reference (RRN) to your bank.`
        : `Your bank is processing the credit. It usually reflects within 2-24 hours for UPI or 3-5 working days for Cards/Netbanking.`,
      ``,
      `Thank you for shopping with Fashion Friday!`,
    ].filter(Boolean);

    const message = encodeURIComponent(lines.join('\n'));
    const url = recipient
      ? `https://api.whatsapp.com/send?phone=${recipient}&text=${message}`
      : `https://api.whatsapp.com/send?text=${message}`;

    window.open(url, '_blank');
  };

  const refundAmount =
    data?.refundAmount ?? Number(order.refundedAmount || order.finalAmount || order.total || 0);
  const isProcessed = data?.refundStatus?.toLowerCase() === 'processed';
  const bankRrn = data?.bankRrn || null;

  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2.25rem] border border-zinc-200 bg-white shadow-2xl sm:max-h-[88vh] sm:rounded-3xl dark:border-zinc-800 dark:bg-[#141417]"
          >
            {/* Mobile Drag Indicator */}
            <div className="flex w-full justify-center pt-3 pb-1 sm:hidden">
              <div className="h-1.5 w-12 rounded-full bg-zinc-300 opacity-60 dark:bg-zinc-700" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 sm:px-6 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <RefreshCcwIcon size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black tracking-tight text-zinc-900 sm:text-lg dark:text-white">
                      Razorpay Refund Timeline
                    </h3>
                    <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      ADMIN
                    </span>
                  </div>
                  <p className="font-mono text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    Order #{order.orderNumber || order.id} • Customer:{' '}
                    {order.customer?.name || 'Guest'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadData}
                  disabled={isLoading}
                  title="Refresh status from Razorpay"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-black disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white"
                >
                  <RefreshCcwIcon size={14} className={isLoading ? 'animate-spin' : ''} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-black dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white"
                  aria-label="Close dialog"
                >
                  <CloseIcon size={16} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:space-y-6 sm:p-6">
              {isLoading && !data ? (
                /* Shimmer Loading Skeleton */
                <div className="space-y-4 py-2">
                  <div className="h-28 w-full animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800/80" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="h-20 w-full animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800/60" />
                    <div className="h-20 w-full animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800/60" />
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="h-14 w-full animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800/40" />
                    <div className="h-14 w-full animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800/40" />
                    <div className="h-14 w-full animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800/40" />
                  </div>
                </div>
              ) : hasError && !data ? (
                /* Error Fallback */
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <RefreshCcwIcon size={22} />
                  </div>
                  <h4 className="mt-3 text-sm font-bold text-zinc-900 dark:text-white">
                    Could not fetch Razorpay refund details
                  </h4>
                  <p className="mt-1 max-w-xs text-xs text-zinc-500 dark:text-zinc-400">
                    Failed to query gateway records for this order. Make sure Razorpay keys are
                    configured and the payment exists.
                  </p>
                  <button
                    type="button"
                    onClick={loadData}
                    className="mt-4 rounded-xl bg-black px-5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
                  >
                    Retry Fetching
                  </button>
                </div>
              ) : (
                <>
                  {/* Top Highlight Hero Card */}
                  <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-4 sm:p-5">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
                            ₹{refundAmount.toFixed(2)}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase ${
                              isProcessed
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isProcessed ? 'bg-emerald-500' : 'animate-ping bg-amber-500'
                              }`}
                            />
                            {isProcessed ? 'Refund Processed' : 'Refund in Progress'}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                          {isProcessed
                            ? 'Funds successfully dispatched by Razorpay to customer banking network.'
                            : 'Refund request registered with bank. Awaiting banking network clearance.'}
                        </p>
                      </div>

                      {/* WhatsApp Share Action Button */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleShareWhatsApp}
                          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95"
                          title="Share refund details & Bank RRN with customer on WhatsApp"
                        >
                          <WhatsAppIcon size={16} />
                          <span>Send RRN to Customer</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Reference & Banking Details Grid */}
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                    {/* Bank RRN Card */}
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3.5 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                          Bank Reference (RRN / ARN)
                        </span>
                        {bankRrn && (
                          <button
                            type="button"
                            onClick={() => handleCopy(bankRrn, 'Bank RRN')}
                            className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          >
                            {copiedKey === 'Bank RRN' ? (
                              <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckIcon size={12} /> Copied
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <CopyIcon size={12} /> Copy
                              </span>
                            )}
                          </button>
                        )}
                      </div>
                      <p className="mt-1 font-mono text-sm font-black tracking-wider text-emerald-600 sm:text-base dark:text-emerald-400">
                        {bankRrn || 'Awaiting RRN generation'}
                      </p>
                      <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                        {bankRrn
                          ? '12-digit acquirer reference number for bank disputes and customer queries.'
                          : 'RRN is populated once Razorpay dispatches the transaction to the bank.'}
                      </p>
                    </div>

                    {/* Razorpay Refund ID */}
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3.5 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                          Razorpay Refund ID
                        </span>
                        {data?.refundId && (
                          <button
                            type="button"
                            onClick={() => handleCopy(data.refundId!, 'Refund ID')}
                            className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          >
                            {copiedKey === 'Refund ID' ? (
                              <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckIcon size={12} /> Copied
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <CopyIcon size={12} /> Copy
                              </span>
                            )}
                          </button>
                        )}
                      </div>
                      <p className="mt-1 truncate font-mono text-xs font-bold text-zinc-900 sm:text-sm dark:text-white">
                        {data?.refundId || 'N/A'}
                      </p>
                      <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                        Status:{' '}
                        <span className="font-semibold uppercase">
                          {data?.refundStatus || 'Processing'}
                        </span>
                      </p>
                    </div>

                    {/* Razorpay Payment ID */}
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3.5 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                          Payment Reference
                        </span>
                        {(data?.paymentId || order.razorpayPaymentId) && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(data?.paymentId || order.razorpayPaymentId!, 'Payment ID')
                            }
                            className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          >
                            {copiedKey === 'Payment ID' ? (
                              <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckIcon size={12} /> Copied
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <CopyIcon size={12} /> Copy
                              </span>
                            )}
                          </button>
                        )}
                      </div>
                      <p className="mt-1 truncate font-mono text-xs font-bold text-zinc-900 sm:text-sm dark:text-white">
                        {data?.paymentId || order.razorpayPaymentId || 'N/A'}
                      </p>
                      <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                        Method:{' '}
                        <span className="font-semibold uppercase">
                          {data?.paymentMethod || order.paymentMethod || 'Online'}
                        </span>
                      </p>
                    </div>

                    {/* Destination Account */}
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3.5 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                      <span className="text-[10px] font-black tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                        Refund Destination Account
                      </span>
                      <p className="mt-1 truncate text-xs font-bold text-zinc-900 sm:text-sm dark:text-white">
                        {data?.paymentAccount || 'Original Source Account'}
                      </p>
                      <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                        {data?.estimatedSla || 'Standard banking clearance SLA'}
                      </p>
                    </div>
                  </div>

                  {/* Progressive Timeline Stepper */}
                  <div className="pt-2">
                    <h4 className="mb-4 text-[11px] font-black tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                      Payment & Refund Lifecycle
                    </h4>
                    <div className="relative pl-7 sm:pl-8">
                      {/* Vertical Spine Bar */}
                      <div className="absolute top-4 bottom-4 left-3 w-0.5 -translate-x-1/2 bg-zinc-200 sm:left-3.5 dark:bg-zinc-800" />

                      <div className="space-y-6 sm:space-y-7">
                        {data?.timeline?.map((step, idx) => {
                          const isDone = step.status === 'COMPLETED';
                          const isInProgress = step.status === 'IN_PROGRESS';

                          return (
                            <div key={step.id || idx} className="relative flex items-start gap-4">
                              {/* Step Node Icon */}
                              <div
                                className={`absolute -left-7 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all sm:-left-8 sm:h-7 sm:w-7 ${
                                  isDone
                                    ? 'border-emerald-500 bg-emerald-500 text-white shadow-xs'
                                    : isInProgress
                                      ? 'border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                                      : 'border-zinc-300 bg-white text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800'
                                }`}
                              >
                                {isDone ? (
                                  <CheckIcon size={12} />
                                ) : isInProgress ? (
                                  <ClockIcon size={12} className="animate-pulse" />
                                ) : (
                                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                                )}
                              </div>

                              {/* Step Details */}
                              <div className="flex-1">
                                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                                  <h5
                                    className={`text-xs font-black tracking-tight sm:text-sm ${
                                      isDone || isInProgress
                                        ? 'text-zinc-900 dark:text-white'
                                        : 'text-zinc-400 dark:text-zinc-500'
                                    }`}
                                  >
                                    {step.title}
                                  </h5>
                                  <span className="font-mono text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                                    {step.timestamp
                                      ? new Date(step.timestamp).toLocaleString('en-IN', {
                                          day: '2-digit',
                                          month: 'short',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        })
                                      : 'Pending'}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                                  {step.subtitle}
                                </p>
                                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Trust Footer Notice */}
                  <div className="flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-zinc-50 p-3.5 text-xs text-zinc-600 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:text-zinc-400">
                    <ShieldCheckIcon
                      size={18}
                      className="shrink-0 text-emerald-600 dark:text-emerald-400"
                    />
                    <span>
                      Live gateway sync powered directly by Razorpay Payments API. All reference
                      numbers and RRNs are official bank settlement records.
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Footer Close Bar */}
            <div className="flex items-center justify-end border-t border-zinc-200 bg-zinc-50 px-5 py-3.5 sm:px-6 dark:border-zinc-800 dark:bg-zinc-900/60">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-zinc-300 bg-white px-5 py-2 text-xs font-bold text-zinc-900 shadow-sm transition-all hover:bg-zinc-50 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
