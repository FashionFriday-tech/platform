'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { motion } from 'motion/react';

import { useAuth } from '@/contexts/AuthContext';
import { PinStorage } from '@/lib/security/pin-storage';

import { usePinLockStore } from '../store/pin-lock.store';

export function PinLockModal() {
  const { isLocked, unlock, failedAttempts, recordFailedAttempt, lockedUntil } = usePinLockStore();
  const { user, logout } = useAuth();

  const [enteredPin, setEnteredPin] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [remainingLockSeconds, setRemainingLockSeconds] = useState(0);

  // Rate-limiting countdown timer
  useEffect(() => {
    if (!lockedUntil) {
      setRemainingLockSeconds(0);
      return;
    }

    const updateCountdown = () => {
      const diff = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (diff <= 0) {
        setRemainingLockSeconds(0);
      } else {
        setRemainingLockSeconds(diff);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [lockedUntil]);

  const triggerShake = (msg: string) => {
    setIsShaking(true);
    setErrorMessage(msg);
    setEnteredPin('');
    setTimeout(() => {
      setIsShaking(false);
    }, 500);
  };

  const handleDigit = useCallback(
    async (digit: string) => {
      if (remainingLockSeconds > 0) {
        return;
      }
      if (enteredPin.length >= 4) {
        return;
      }

      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);
      setErrorMessage('');

      if (nextPin.length === 4) {
        const isValid = await PinStorage.verifyPin(nextPin, user?.phone);
        if (isValid) {
          setEnteredPin('');
          unlock();
        } else {
          recordFailedAttempt();
          triggerShake('Incorrect PIN (Default: 1234)');
        }
      }
    },
    [enteredPin, recordFailedAttempt, remainingLockSeconds, unlock, user?.phone],
  );

  const handleBackspace = () => {
    if (enteredPin.length > 0) {
      setEnteredPin(enteredPin.slice(0, -1));
      setErrorMessage('');
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    if (!isLocked) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        void handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleDigit, isLocked]);

  if (!isLocked) {
    return null;
  }

  const isRateLimited = remainingLockSeconds > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-4 text-neutral-900 transition-colors duration-200 select-none dark:bg-black dark:text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex w-full max-w-sm flex-col items-center text-center"
      >
        {/* Curved Brand App Icon Badge */}
        <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl dark:border-white/15 dark:bg-black dark:shadow-2xl">
          <img
            src="/icons/ff_admin_app_icon.png"
            alt="Fashion Friday Admin"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Enter Security PIN
        </h2>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          {isRateLimited
            ? `Device locked. Try again in ${remainingLockSeconds}s`
            : user?.name
              ? `Welcome back, ${user.name}`
              : 'Enter your 4-digit passcode (Default: 1234)'}
        </p>

        {/* 4 Dot Indicators */}
        <motion.div
          animate={isShaking ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="my-8 flex justify-center space-x-5"
        >
          {[0, 1, 2, 3].map((index) => {
            const isFilled = enteredPin.length > index;
            return (
              <div
                key={index}
                className={`h-4 w-4 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'scale-110 bg-black shadow-[0_0_12px_rgba(0,0,0,0.25)] dark:bg-white dark:shadow-[0_0_14px_rgba(255,255,255,0.9)]'
                    : 'border-2 border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900'
                }`}
              />
            );
          })}
        </motion.div>

        {/* Error message */}
        <div className="h-5 text-xs font-semibold text-rose-500 dark:text-rose-400">
          {errorMessage ||
            (failedAttempts > 0 && !isRateLimited ? `Failed attempts: ${failedAttempts}/5` : '')}
        </div>

        {/* Numeric Keypad (3x4 Grid) */}
        <div className="mt-4 grid w-full max-w-[270px] grid-cols-3 gap-4">
          {[
            { num: '1', letters: '' },
            { num: '2', letters: 'ABC' },
            { num: '3', letters: 'DEF' },
            { num: '4', letters: 'GHI' },
            { num: '5', letters: 'JKL' },
            { num: '6', letters: 'MNO' },
            { num: '7', letters: 'PQRS' },
            { num: '8', letters: 'TUV' },
            { num: '9', letters: 'WXYZ' },
          ].map(({ num, letters }) => (
            <button
              key={num}
              type="button"
              disabled={isRateLimited}
              onClick={() => void handleDigit(num)}
              className="mx-auto flex h-16 w-16 flex-col items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-neutral-900 shadow-sm transition-all hover:border-neutral-300 hover:bg-neutral-200/70 active:scale-90 active:bg-neutral-200 disabled:pointer-events-none disabled:opacity-30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:shadow-md dark:hover:border-neutral-700 dark:hover:bg-neutral-800/80 dark:active:bg-neutral-800"
            >
              <span className="text-xl leading-none font-semibold">{num}</span>
              {letters && (
                <span className="mt-0.5 text-[9px] tracking-widest text-neutral-500 dark:text-neutral-400">
                  {letters}
                </span>
              )}
            </button>
          ))}

          {/* Bottom Row */}
          <div className="flex items-center justify-center" />

          <button
            type="button"
            disabled={isRateLimited}
            onClick={() => void handleDigit('0')}
            className="mx-auto flex h-16 w-16 flex-col items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-neutral-900 shadow-sm transition-all hover:border-neutral-300 hover:bg-neutral-200/70 active:scale-90 active:bg-neutral-200 disabled:pointer-events-none disabled:opacity-30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:shadow-md dark:hover:border-neutral-700 dark:hover:bg-neutral-800/80 dark:active:bg-neutral-800"
          >
            <span className="text-xl leading-none font-semibold">0</span>
          </button>

          <button
            type="button"
            onClick={handleBackspace}
            disabled={enteredPin.length === 0}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-neutral-500 transition-all hover:text-neutral-900 active:scale-90 disabled:opacity-0 dark:text-neutral-400 dark:hover:text-white"
            aria-label="Backspace"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
              />
            </svg>
          </button>
        </div>

        {/* Fallback to Password Sign Out */}
        <button
          type="button"
          onClick={() => {
            unlock();
            logout();
          }}
          className="mt-8 text-xs text-neutral-500 underline underline-offset-4 transition-colors hover:text-rose-500 dark:text-neutral-400 dark:hover:text-rose-400"
        >
          Forgot PIN? Sign In with Phone & OTP
        </button>
      </motion.div>
    </div>
  );
}
