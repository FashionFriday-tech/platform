'use client';

import React from 'react';
import { CloseIcon, LoaderIcon, LogOutIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}

export function LogoutConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: LogoutConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="bg-background/80 fixed inset-0 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-background border-border relative z-[110] w-full max-w-md rounded-t-[2.5rem] border-t p-7 shadow-2xl sm:m-4 sm:rounded-[2.5rem] sm:border sm:p-8"
          >
            {/* Header with Icon & Close */}
            <div className="mb-6 flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500 shadow-md">
                <LogOutIcon size={26} />
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="text-foreground-subtle hover:text-foreground hover:bg-foreground/5 rounded-full p-2 transition-colors disabled:opacity-50"
                aria-label="Close"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="text-foreground text-2xl font-black tracking-tight uppercase italic sm:text-3xl">
                Log Out?
              </h3>
              <p className="text-foreground-muted text-xs leading-relaxed font-medium">
                Are you sure you want to sign out? You will need to receive a WhatsApp verification code (OTP) to sign back in.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="bg-foreground text-background flex-1 cursor-pointer rounded-2xl py-4 text-center text-xs font-black tracking-widest uppercase transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Stay Logged In
              </button>
              <button
                type="button"
                onClick={() => void onConfirm()}
                disabled={isLoading}
                className="border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border py-4 text-center text-xs font-black tracking-widest uppercase transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <LoaderIcon size={16} className="animate-spin" />
                    <span>Logging Out...</span>
                  </>
                ) : (
                  <span>Log Out</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

