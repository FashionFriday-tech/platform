'use client';

import { useEffect, useMemo, useState } from 'react';
import { getGlobalSlot, getPageSlot } from '../lib/time';

const SLOT_MS = 5000;

export function useLiveProductMetric(staticNumber: number) {
  const [slotTime, setSlotTime] = useState(() => Math.floor(Date.now() / SLOT_MS) * SLOT_MS);

  useEffect(() => {
    const syncToSlot = () => {
      const now = Date.now();
      const aligned = Math.floor(now / SLOT_MS) * SLOT_MS;
      setSlotTime(aligned);
    };

    // sync immediately
    syncToSlot();

    // calculate delay to next exact UTC slot
    const delay = SLOT_MS - (Date.now() % SLOT_MS);

    const timeout = setTimeout(() => {
      syncToSlot();

      const interval = setInterval(syncToSlot, SLOT_MS);

      // proper cleanup
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  return useMemo(() => {
    const globalSlot = getGlobalSlot(slotTime);
    const pageSlot = getPageSlot(slotTime);

    const globalNumber = (globalSlot % 90) + 60; // 60–149
    const pageDelta = (pageSlot % 21) - 10; // -10 → +10

    return staticNumber * globalNumber + pageDelta;
  }, [slotTime, staticNumber]);
}
