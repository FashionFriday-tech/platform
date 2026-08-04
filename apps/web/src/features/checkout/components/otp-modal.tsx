'use client';

import React, { useEffect, useRef, useState } from 'react';

import { CloseIcon, LoaderIcon, ShieldCheckIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { formatPhone334 } from '@/features/addresses';

interface OTPModalProps {
  isOpen: boolean;
  phoneNumber: string;
  onClose: () => void;
  onVerifyOtp: (otp: string) => Promise<void>;
  onResendOtp?: () => Promise<void>;
  isVerifying?: boolean;
}

export function OTPModal({
  isOpen,
  phoneNumber,
  onClose,
  onVerifyOtp,
  onResendOtp,
  isVerifying = false,
}: OTPModalProps) {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setError(null);
      setTimer(30);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isOpen, timer]);

  const handleInputChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError(null);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 6 digits entered
    if (digit && index === 5 && newOtp.every((d) => d !== '')) {
      void submitOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) {
      return;
    }

    const newOtp = [...otp];
    pastedData.split('').forEach((char, idx) => {
      if (idx < 6) {
        newOtp[idx] = char;
      }
    });
    setOtp(newOtp);
    setError(null);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();

    if (newOtp.every((d) => d !== '')) {
      void submitOtp(newOtp.join(''));
    }
  };

  const fillTestOtp = () => {
    const testDigits = ['7', '8', '6', '7', '8', '6'];
    setOtp(testDigits);
    setError(null);
    inputRefs.current[5]?.focus();
    void submitOtp('786786');
  };

  const submitOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otp.join('');
    if (code.length < 6) {
      setError('Please enter the full 6-digit OTP');
      return;
    }
    setError(null);
    try {
      await onVerifyOtp(code);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid OTP. Please try again.';
      setError(msg);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isResending) {
      return;
    }
    setIsResending(true);
    setError(null);
    try {
      if (onResendOtp) {
        await onResendOtp();
      }
      setTimer(30);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to resend OTP';
      setError(msg);
    } finally {
      setIsResending(false);
    }
  };

  const displayPhone = formatPhone334(phoneNumber);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="bg-background/80 fixed inset-0 backdrop-blur-xl"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="border-border bg-background relative z-10 w-full max-w-md rounded-3xl border p-6 text-center shadow-2xl sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-foreground-muted hover:text-foreground border-border hover:border-foreground absolute top-5 right-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border transition-all"
              aria-label="Close"
            >
              <CloseIcon size={14} />
            </button>

            {/* Icon Header */}
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <ShieldCheckIcon size={28} />
            </div>

            <h2 className="text-foreground text-xl font-black tracking-tight uppercase">
              Verify Phone Number
            </h2>
            <p className="text-foreground-muted mt-1 text-xs font-semibold">
              Enter the 6-digit code sent to{' '}
              <span className="text-foreground font-black tracking-wider">+91 {displayPhone}</span>
            </p>

            {/* Test OTP Shortcut Badge */}
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={fillTestOtp}
                className="group border-border bg-foreground/[0.04] hover:border-foreground/40 flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold transition-all active:scale-95"
              >
                <span className="text-foreground-muted">Test OTP:</span>
                <span className="font-black tracking-widest text-emerald-500">786786</span>
                <span className="text-foreground-muted group-hover:text-foreground text-[10px]">
                  (Click to fill)
                </span>
              </button>
            </div>

            {/* 6 Digit Input Boxes */}
            <div className="my-6 flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    handleInputChange(index, e.target.value);
                  }}
                  onKeyDown={(e) => {
                    handleKeyDown(index, e);
                  }}
                  onPaste={handlePaste}
                  className={`border-border bg-foreground/[0.03] text-foreground focus:border-foreground h-12 w-11 rounded-xl border text-center text-lg font-black transition-all outline-none sm:h-14 sm:w-12 sm:text-xl ${
                    digit ? 'border-foreground bg-foreground/[0.08]' : ''
                  }`}
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <p className="animate-in fade-in mb-4 text-xs font-semibold text-rose-500">{error}</p>
            )}

            {/* Submit Action Button */}
            <button
              onClick={() => void submitOtp()}
              disabled={isVerifying || otp.includes('')}
              className="bg-foreground text-background flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-4 text-xs font-black tracking-[0.2em] uppercase shadow-xl transition-all active:scale-98 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <LoaderIcon size={16} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify & Save Address</span>
              )}
            </button>

            {/* Resend & Edit Footer */}
            <div className="mt-5 flex items-center justify-between text-xs font-bold">
              <button
                type="button"
                onClick={onClose}
                className="text-foreground-muted hover:text-foreground cursor-pointer underline underline-offset-4 transition-colors"
              >
                Change Address
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={timer > 0 || isResending}
                className="text-foreground-muted hover:text-foreground disabled:text-foreground-muted/40 cursor-pointer transition-colors disabled:cursor-not-allowed"
              >
                {isResending ? (
                  'Sending...'
                ) : timer > 0 ? (
                  <span>
                    Resend in <span className="text-foreground font-black">{timer}s</span>
                  </span>
                ) : (
                  <span className="font-black text-emerald-500">Resend Code</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
