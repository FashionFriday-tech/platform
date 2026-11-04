'use client';

import { useEffect, useMemo, useState } from 'react';

import { getGlobalSlot, getPageSlot } from '../utils/time';

const SLOT_MS = 5000;

export function useLiveProductMetric(staticNumber: number): number {
  const [slotTime, setSlotTime] = useState(() => Math.floor(Date.now() / SLOT_MS) * SLOT_MS);

  useEffect(() => {
    const syncToSlot = () => {
      const now = Date.now();
      const aligned = Math.floor(now / SLOT_MS) * SLOT_MS;
      setSlotTime(aligned);
    };

    // Sync immediately
    syncToSlot();

    // Calculate delay to next exact slot
    const delay = SLOT_MS - (Date.now() % SLOT_MS);

    const timeout = setTimeout(() => {
      syncToSlot();

      const interval = setInterval(syncToSlot, SLOT_MS);

      return () => {
        clearInterval(interval);
      };
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return useMemo(() => {
    const rawBase = staticNumber;
    if (!rawBase || isNaN(rawBase) || rawBase <= 0) {
      return 0;
    }

    const globalSlot = getGlobalSlot(slotTime);
    const pageSlot = getPageSlot(slotTime);

    let count: number;
    if (rawBase <= 5) {
      // Obfuscated index scale: e.g. 1 -> ~60-149
      const globalNumber = (globalSlot % 90) + 60; // 60–149
      const pageDelta = (pageSlot % 21) - 10; // -10 → +10
      count = rawBase * globalNumber + pageDelta;
    } else {
      // Direct count set by admin (e.g. 25, 60, 150 viewers):
      // Add a subtle organic variance (±8%)
      const varianceRange = Math.max(2, Math.floor(rawBase * 0.08));
      const delta = (pageSlot % (varianceRange * 2 + 1)) - varianceRange;
      count = rawBase + delta;
    }

    // View count can NEVER be negative / minus value
    return Math.max(1, Math.round(count));
  }, [slotTime, staticNumber]);
}
