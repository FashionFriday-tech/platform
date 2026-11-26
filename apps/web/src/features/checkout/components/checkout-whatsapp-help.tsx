'use client';

import React from 'react';

import { ArrowUpRightIcon, WhatsAppIcon } from '@ff/ui';

import { type CartItem } from '@/features/cart';

import { buildCheckoutWhatsAppUrl, type CheckoutStep } from '../utils/whatsapp-help';

interface CheckoutWhatsAppHelpProps {
  step: CheckoutStep;
  items?: CartItem[];
  totalAmount?: number;
  paymentMethod?: 'prepay' | 'cod';
  errorMessage?: string | null;
  variant?: 'default' | 'error';
  className?: string;
}

const STEP_COPY: Record<CheckoutStep, { title: string; subtitle: string; cta: string }> = {
  cart: {
    title: 'Need help with sizing or delivery?',
    subtitle: 'Message our team directly on WhatsApp before you check out.',
    cta: 'Ask on WhatsApp',
  },
  review: {
    title: 'Questions about shipping or your order?',
    subtitle: 'Instant support from our team on WhatsApp.',
    cta: 'Chat on WhatsApp',
  },
  payment: {
    title: 'First time ordering or facing a payment issue?',
    subtitle: 'Talk to our team on WhatsApp for instant help or manual order assistance.',
    cta: 'WhatsApp Support',
  },
};

export function CheckoutWhatsAppHelp({
  step,
  items = [],
  totalAmount,
  paymentMethod,
  errorMessage,
  variant = 'default',
  className = '',
}: CheckoutWhatsAppHelpProps) {
  const href = buildCheckoutWhatsAppUrl({
    step,
    items,
    totalAmount,
    paymentMethod,
    errorMessage,
  });

  const copy = STEP_COPY[step];
  const isError = variant === 'error';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center justify-between gap-4 rounded-2xl border p-4 transition-all duration-200 ${
        isError
          ? 'border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/15'
          : 'border-border bg-background-muted/40 hover:border-emerald-500/40 hover:bg-emerald-500/5'
      } ${className}`}
    >
      <div className="flex items-center gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-sm">
          <WhatsAppIcon size={18} />
        </div>
        <div className="text-left">
          <p className="text-foreground text-xs font-bold">
            {isError ? 'Need help completing this payment?' : copy.title}
          </p>
          <p className="text-foreground-muted mt-0.5 text-[11px] leading-snug">
            {isError
              ? 'Send your order details to us on WhatsApp and we will help you finish right away.'
              : copy.subtitle}
          </p>
        </div>
      </div>

      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#25D366]/15 px-3 py-1.5 text-[11px] font-bold text-emerald-700 transition-colors group-hover:bg-[#25D366] group-hover:text-white dark:text-emerald-400">
        {isError ? 'Get Help' : copy.cta}
        <ArrowUpRightIcon size={13} />
      </span>
    </a>
  );
}
