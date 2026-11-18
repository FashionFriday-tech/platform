'use client';

import React, { useEffect, useRef } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { PinStorage } from '@/lib/security/pin-storage';

import { usePinLockStore } from '../store/pin-lock.store';
import { PinLockModal } from './PinLockModal';

interface PinLockProviderProps {
  children: React.ReactNode;
}

const INACTIVITY_TIMEOUT_MS = 12 * 60 * 60 * 1000; // 12 hours of zero interaction

export function PinLockProvider({ children }: PinLockProviderProps) {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);
  const { lock, setHasPin } = usePinLockStore();
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initialize PIN status: only lock if not already unlocked in this browser session
  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }
    setHasPin(true);

    let isUnlockedInSession = false;
    try {
      if (typeof window !== 'undefined') {
        const sessionUnlocked = sessionStorage.getItem('ff_admin_pin_unlocked') === 'true';
        const unlockUntil = Number(localStorage.getItem('ff_admin_pin_unlocked_until') || 0);
        isUnlockedInSession = sessionUnlocked || unlockUntil > Date.now();
      }
    } catch {
      // sessionStorage restricted or partitioned in Safari
    }

    if (!isUnlockedInSession) {
      lock();
    }
  }, [isAuthenticated, user, lock, setHasPin]);

  // 3. Inactivity Timer (Auto-lock after 15 minutes of no touch/mouse activity)

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const resetTimer = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      inactivityTimerRef.current = setTimeout(() => {
        if (PinStorage.hasPin()) {
          lock();
        }
      }, INACTIVITY_TIMEOUT_MS);
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'];
    events.forEach((evt) => {
      window.addEventListener(evt, resetTimer, { passive: true });
    });
    resetTimer();

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      events.forEach((evt) => {
        window.removeEventListener(evt, resetTimer);
      });
    };
  }, [isAuthenticated, lock]);

  return (
    <>
      {children}
      <PinLockModal />
    </>
  );
}
