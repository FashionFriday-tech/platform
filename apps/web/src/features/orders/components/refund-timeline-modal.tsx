'use client';

import React, { useEffect, useState } from 'react';

import { CheckIcon, ClockIcon, CloseIcon, CopyIcon, RefreshCcwIcon, ShieldCheckIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';

import {
  fetchOrderRefundTimelineAction,
  type RefundTimelineResponse,
} from '../services/orders.actions';
import { type Order } from '../types';

interface RefundTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export function RefundTimelineModal({ isOpen, onClose, order }: RefundTimelineModalProps) {
  const [data, setData] = useState<RefundTimelineResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const loadData = () => {
    setIsLoading(true);
    setHasError(false);

    fetchOrderRefundTimelineAction(order.id)
      .then((res) => {
        if (res) {
          setData(res);
        } else {
          setHasError(true);
        }
      })
      .catch((err: unknown) => {
        console.error('Failed to load refund timeline:', err);
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

  const refundAmount = data?.refundAmount ?? Number(order.refundedAmount || order.finalAmount || 0);
  const isProcessed = data?.refundStatus?.toLowerCase() === 'processed';
  const bankRrn = data?.bankRrn || null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container: Bottom sheet on mobile, centered dialog on sm+ */}
          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="bg-background border-border relative z-10 flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-[2.25rem] border-t shadow-2xl sm:max-h-[88vh] sm:rounded-3xl sm:border"
          >
            {/* Mobile Drag Indicator */}
            <div className="flex w-full justify-center pt-3 pb-1 sm:hidden">
              <div className="bg-border h-1.5 w-12 rounded-full opacity-60" />
            </div>

            {/* Header */}
            <div className="border-border flex items-center justify-between border-b px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <RefreshCcwIcon size={20} />
                </div>
                <div>
                  <h3 className="text-foreground text-base font-black tracking-tight sm:text-lg">
                    Refund Timeline
                  </h3>
                  <p className="text-foreground-muted font-mono text-[11px] font-semibold">
                    Order #{order.orderNumber || order.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="bg-background-muted text-foreground-muted hover:bg-background-muted/80 hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full transition-colors active:scale-95"
                aria-label="Close dialog"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:space-y-6 sm:p-6">
              {isLoading ? (
                /* Shimmer Loading Skeleton */
                <div className="space-y-4 py-2">
                  <div className="bg-background-muted/70 h-28 w-full animate-pulse rounded-2xl" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="bg-background-muted/50 h-20 w-full animate-pulse rounded-2xl" />
                    <div className="bg-background-muted/50 h-20 w-full animate-pulse rounded-2xl" />
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="bg-background-muted/40 h-14 w-full animate-pulse rounded-xl" />
                    <div className="bg-background-muted/40 h-14 w-full animate-pulse rounded-xl" />
                    <div className="bg-background-muted/40 h-14 w-full animate-pulse rounded-xl" />
                  </div>
                </div>
              ) : hasError ? (
                /* Fallback State */
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                    <RefreshCcwIcon size={22} />
                  </div>
                  <h4 className="mt-3 text-sm font-bold">Could not load live timeline</h4>
                  <p className="text-foreground-muted mt-1 max-w-xs text-xs">
                    We were unable to reach the gateway. Your refund is safely recorded on our
                    system.
                  </p>
                  <button
                    type="button"
                    onClick={loadData}
                    className="bg-foreground text-background mt-4 rounded-full px-5 py-2 text-xs font-bold transition-opacity hover:opacity-90"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  {/* Top Highlight Hero Card */}
                  <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-4 sm:p-5">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="text-foreground text-2xl font-black tracking-tight sm:text-3xl">
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
                        <p className="text-foreground-muted mt-1.5 text-xs font-medium">
                          {isProcessed
                            ? 'The refund has been completed by payment network.'
                            : 'Refund request sent to bank. Crediting to your source account.'}
                        </p>
                      </div>

                      {/* Payment Destination Pill */}
                      <div className="border-border/60 bg-background/90 rounded-xl border p-2.5 shadow-xs sm:text-right">
                        <p className="text-foreground-muted text-[10px] font-bold tracking-wider uppercase">
                          Refund Destination
                        </p>
                        <p className="text-foreground mt-0.5 truncate text-xs font-bold">
                          {data?.paymentAccount || 'Original Source Account'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reference & Banking Details Grid */}
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                    {/* Bank RRN Card */}
                    <div className="bg-background-muted/40 border-border/80 group rounded-2xl border p-3.5 sm:p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground-muted text-[10px] font-black tracking-wider uppercase">
                          Bank Reference (RRN)
                        </span>
                        {bankRrn && (
                          <button
                            type="button"
                            onClick={() => {
                              handleCopy(bankRrn, 'Bank RRN');
                            }}
                            className="text-foreground-muted hover:text-foreground flex items-center gap-1 text-[11px] font-semibold transition-colors"
                          >
                            {copiedKey === 'Bank RRN' ? (
                              <span className="flex items-center gap-1 font-bold text-emerald-600">
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
                        {bankRrn || 'Generated upon bank dispatch'}
                      </p>
                      <p className="text-foreground-muted mt-1 text-[10px]">
                        Share this 12-digit RRN with your bank or UPI app for reference.
                      </p>
                    </div>

                    {/* Payment Reference ID */}
                    <div className="bg-background-muted/40 border-border/80 group rounded-2xl border p-3.5 sm:p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground-muted text-[10px] font-black tracking-wider uppercase">
                          Payment Reference
                        </span>
                        {data?.paymentId && (
                          <button
                            type="button"
                            onClick={() => {
                              handleCopy(data.paymentId!, 'Payment ID');
                            }}
                            className="text-foreground-muted hover:text-foreground flex items-center gap-1 text-[11px] font-semibold transition-colors"
                          >
                            {copiedKey === 'Payment ID' ? (
                              <span className="flex items-center gap-1 font-bold text-emerald-600">
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
                      <p className="text-foreground mt-1 truncate font-mono text-xs font-bold sm:text-sm">
                        {data?.paymentId || order.razorpayPaymentId || 'N/A'}
                      </p>
                      <p className="text-foreground-muted mt-1 text-[10px]">
                        Method: {data?.paymentMethod || 'Online UPI / Card'}
                      </p>
                    </div>
                  </div>

                  {/* Progressive Timeline Stepper */}
                  <div className="pt-1">
                    <h4 className="text-foreground-muted mb-4 text-[11px] font-black tracking-wider uppercase">
                      Live Gateway Progress
                    </h4>
                    <div className="relative pl-7 sm:pl-8">
                      {/* Vertical Spine Bar */}
                      <div className="bg-border absolute top-4 bottom-4 left-3 w-0.5 -translate-x-1/2 sm:left-3.5" />

                      <div className="space-y-6 sm:space-y-7">
                        {data?.timeline?.map((step, idx) => {
                          const isDone = step.status === 'COMPLETED';
                          const isInProgress = step.status === 'IN_PROGRESS';

                          return (
                            <div key={step.id || idx} className="relative flex items-start gap-4">
                              {/* Step Node Icon */}
                              <div
                                className={`relative z-10 -ml-7 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-xs sm:-ml-8 sm:h-7 sm:w-7 ${
                                  isDone
                                    ? 'bg-emerald-500 text-white'
                                    : isInProgress
                                      ? 'bg-amber-500 text-white ring-4 ring-amber-500/20'
                                      : 'bg-background-muted text-foreground-muted border-border border'
                                }`}
                              >
                                {isDone ? (
                                  <CheckIcon size={13} strokeWidth={3} />
                                ) : isInProgress ? (
                                  <ClockIcon size={13} />
                                ) : (
                                  <span className="text-[10px]">{idx + 1}</span>
                                )}
                              </div>

                              {/* Step Details */}
                              <div className="min-w-0 flex-1 pt-0.5">
                                <div className="flex flex-wrap items-baseline justify-between gap-1">
                                  <h5
                                    className={`text-xs font-black tracking-wide uppercase sm:text-sm ${
                                      isDone
                                        ? 'text-foreground'
                                        : isInProgress
                                          ? 'text-amber-600 dark:text-amber-400'
                                          : 'text-foreground-muted'
                                    }`}
                                  >
                                    {step.title}
                                  </h5>
                                  {step.timestamp && (
                                    <span className="text-foreground-muted text-[10px] font-semibold sm:text-[11px]">
                                      {new Date(step.timestamp).toLocaleDateString([], {
                                        month: 'short',
                                        day: 'numeric',
                                      })}{' '}
                                      •{' '}
                                      {new Date(step.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </span>
                                  )}
                                </div>

                                {step.subtitle && (
                                  <p className="text-foreground mt-0.5 text-xs font-bold">
                                    {step.subtitle}
                                  </p>
                                )}

                                <p className="text-foreground-muted mt-1 text-[11px] leading-relaxed sm:text-xs">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Informational Guidance Callout */}
                  <div className="bg-background-muted/60 border-border/70 rounded-2xl border p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-foreground-muted mt-0.5 shrink-0">
                        <ShieldCheckIcon size={18} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-foreground text-[11px] font-black tracking-wider uppercase">
                          How does the refund reach your account?
                        </p>
                        <p className="text-foreground-muted text-[11px] leading-relaxed sm:text-xs">
                          Refunds are credited automatically to the original payment source. If paid
                          via UPI (GPay, PhonePe, Paytm, BHIM), funds arrive directly in your linked
                          bank account without any manual claims.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-border bg-background-muted/20 flex items-center justify-between border-t px-5 py-3.5 sm:px-6 sm:py-4">
              <span className="text-foreground-muted flex items-center gap-1.5 text-[11px] font-semibold">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Fashion Friday Buyer Protection
              </span>
              <button
                type="button"
                onClick={onClose}
                className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-5 py-2 text-xs font-bold transition-all active:scale-95"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
