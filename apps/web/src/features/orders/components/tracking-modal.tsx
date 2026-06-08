'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'motion/react';

import {
  CheckIcon,
  ChevronRightIcon,
  CloseIcon,
  CopyIcon,
  ExternalLinkIcon,
  MapPinIcon,
  TruckIcon,
} from '@ff/ui';

import { type Order, type OrderItem } from '../types';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  item: OrderItem;
  officialTrackUrl: string;
  universalTrackUrl: string;
}

export function TrackingModal({
  isOpen,
  onClose,
  order,
  item,
  officialTrackUrl,
  universalTrackUrl,
}: TrackingModalProps) {
  const [copied, setCopied] = useState(false);
  const trackingNumber = order.trackingNumber || '';
  const courier = order.courierPartner || 'Courier';

  // Automatically copy tracking ID to clipboard on modal open
  useEffect(() => {
    if (isOpen && trackingNumber) {
      void navigator.clipboard.writeText(trackingNumber).then(() => {
        setCopied(true);
        toast.success('Tracking ID Copied!', {
          description: `AWB ${trackingNumber} is ready to paste.`,
        });
      }).catch(() => {
        // Fallback if clipboard permission is denied
      });
    } else {
      setCopied(false);
    }
  }, [isOpen, trackingNumber]);

  const handleCopy = () => {
    if (!trackingNumber) return;
    void navigator.clipboard.writeText(trackingNumber).then(() => {
      setCopied(true);
      toast.success('Copied to clipboard!', {
        description: `AWB ${trackingNumber} copied.`,
      });
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleOpenOfficial = () => {
    handleCopy();
    window.open(officialTrackUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenUniversal = () => {
    window.open(universalTrackUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="bg-background/80 fixed inset-0 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-background border-border relative z-10 w-full max-w-lg rounded-3xl border p-6 shadow-2xl sm:p-8"
          >
            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-brand/10 text-brand flex h-11 w-11 items-center justify-center rounded-2xl">
                  <TruckIcon size={22} />
                </div>
                <div>
                  <h3 className="text-foreground text-lg font-black tracking-tight">
                    Track Your Shipment
                  </h3>
                  <p className="text-foreground-subtle text-xs font-semibold">
                    Order #{order.orderNumber || order.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="hover:bg-background-muted text-foreground-subtle hover:text-foreground rounded-full p-2 transition-colors"
                aria-label="Close modal"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            {/* Tracking ID & Auto-Copy Box */}
            <div className="bg-background-muted/80 border-border mb-5 rounded-2xl border p-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-brand text-[11px] font-black tracking-widest uppercase">
                  {courier}
                </span>
                {copied && (
                  <span className="text-emerald-500 flex items-center gap-1 text-[11px] font-bold">
                    <CheckIcon size={14} /> Auto-Copied!
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-foreground font-mono text-base font-bold tracking-wider sm:text-lg">
                  {trackingNumber || 'Pending Assignment'}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="bg-background hover:bg-background-muted border-border flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors active:scale-95"
                >
                  {copied ? (
                    <>
                      <CheckIcon size={14} className="text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon size={14} className="text-foreground-muted" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Helpful Notice */}
            <div className="bg-brand/5 border-brand/20 text-foreground-muted mb-6 rounded-xl border p-3 text-xs leading-relaxed">
              <p>
                💡 <strong>Tracking ID copied!</strong> Some couriers require you to paste the number on their tracking page. Click below to open the official carrier portal.
              </p>
            </div>

            {/* Product Summary */}
            <div className="border-border/60 mb-6 flex items-center gap-3 rounded-2xl border p-3">
              <div className="bg-background-muted relative h-16 w-14 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={item.image || '/images/placeholders/2.png'}
                  alt={item.name || ''}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-xs font-bold">{item.name}</p>
                <p className="text-foreground-subtle text-[11px]">
                  Size {item.size} • Qty {item.quantity}
                </p>
                <div className="text-foreground-subtle mt-1 flex items-center gap-1 text-[11px]">
                  <MapPinIcon size={12} />
                  <span>Destination: {order.shippingAddress?.city || 'India'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleOpenOfficial}
                className="bg-brand text-brand-foreground shadow-brand/20 hover:opacity-90 active:scale-[0.98] flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold shadow-lg transition-all"
              >
                <span>Open {courier} Tracking Portal</span>
                <ExternalLinkIcon size={16} />
              </button>

              <button
                type="button"
                onClick={handleOpenUniversal}
                className="bg-background-muted hover:bg-background-muted/80 text-foreground active:scale-[0.98] flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-xs font-semibold transition-all"
              >
                <span>Direct Pre-filled Tracking (17TRACK)</span>
                <ChevronRightIcon size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
