'use client';

import React from 'react';

import { AnimatePresence, motion } from 'framer-motion';

interface OTPModalProps {
  isOpen: boolean;
  phoneNumber: string;
  onVerify: () => void;
}

export function OTPModal({ isOpen, phoneNumber, onVerify }: OTPModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="bg-background/90 fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background border-border w-full max-w-md rounded-[3rem] border p-10 text-center shadow-2xl"
          >
            <h2 className="mb-2 text-2xl font-black tracking-tighter uppercase italic">
              Verify Phone
            </h2>
            <p className="text-foreground-muted mb-8 text-[10px] font-bold tracking-widest uppercase">
              Sent to {phoneNumber}
            </p>
            <div className="mb-8 flex justify-center gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-background-muted/30 border-border h-16 w-12 rounded-2xl border-2 border-dotted"
                />
              ))}
            </div>
            <button
              onClick={onVerify}
              className="bg-foreground text-background w-full rounded-full py-5 text-xs font-black tracking-widest uppercase"
            >
              Verify & Pay
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
