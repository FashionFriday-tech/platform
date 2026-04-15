import React from 'react';

import { AlertTriangleIcon, CloseIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'framer-motion';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDeleting: boolean;
  onDelete: () => void;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  isDeleting,
  onDelete,
}: DeleteAccountModalProps) {
  const items = [
    'Complete Order History',
    'Stored Referral Credits',
    'Verified Shipping Addresses',
    'Stored Payment Methods',
    'Wishlists & Favorites',
    'Phone & KYC Verification',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="bg-background/80 fixed inset-0 z-[100] backdrop-blur-xl"
          />
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="bg-background border-border fixed bottom-0 left-0 z-[110] w-full max-w-xl rounded-t-[3.5rem] border-t p-10 shadow-2xl lg:top-1/2 lg:bottom-auto lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-[3rem] lg:border lg:p-12"
          >
            <div className="mb-8 flex items-start justify-between">
              <div className="rounded-3xl bg-red-600 p-4 text-white shadow-xl shadow-red-600/20">
                <AlertTriangleIcon size={32} />
              </div>
              <button
                onClick={onClose}
                className="hover:bg-muted rounded-full p-2 transition-colors"
              >
                <CloseIcon size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <h3 className="text-3xl font-black tracking-tighter uppercase italic">
                Permanent Wipe
              </h3>
              <p className="text-foreground-subtle text-[10px] leading-loose font-bold tracking-widest uppercase">
                Deleting your account will purge all personal data from the **Fashion Friday**
                database. This is an irreversible action that clears:
              </p>

              <ul className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
                {items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-[9px] font-black tracking-widest text-red-600/60 uppercase"
                  >
                    <div className="h-1 w-1 rounded-full bg-red-600" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="space-y-3 pt-8">
                <button
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="w-full rounded-full bg-red-600 py-5 text-[10px] font-black tracking-widest text-white uppercase shadow-2xl shadow-red-600/30 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isDeleting ? 'Wiping Data...' : 'I Understand, Delete All Data'}
                </button>
                <button
                  onClick={onClose}
                  className="bg-foreground text-background w-full rounded-full py-5 text-[10px] font-black tracking-widest uppercase"
                >
                  Cancel & Protect My Account
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
