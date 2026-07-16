'use client';

import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PinStorage } from '@/lib/security/pin-storage';
import { usePinLockStore } from '../store/pin-lock.store';
import { PinLockModal } from './PinLockModal';

interface PinLockProviderProps {
  children: React.ReactNode;
}

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes of zero interaction

export function PinLockProvider({ children }: PinLockProviderProps) {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);
  const { lock, setHasPin } = usePinLockStore();
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Service Worker Registration
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    }
  }, []);

  // 2. Initialize PIN status: only lock if not already unlocked in this browser session
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    setHasPin(true);

    const isUnlockedInSession =
      typeof window !== 'undefined' &&
      sessionStorage.getItem('ff_admin_pin_unlocked') === 'true';

    if (!isUnlockedInSession) {
      lock();
    }
  }, [isAuthenticated, user, lock, setHasPin]);

  // 3. Inactivity Timer (Auto-lock after 15 minutes of no touch/mouse activity)

  useEffect(() => {
    if (!isAuthenticated) return;

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
    events.forEach((evt) => window.addEventListener(evt, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      events.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
  }, [isAuthenticated, lock]);

  return (
    <>
      {children}
      <PinLockModal />
    </>
  );
}
