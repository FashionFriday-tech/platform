'use client';

import React, { useEffect, useState } from 'react';

interface MaintenanceState {
  isUnderMaintenance: boolean;
  message?: string;
  updatedAt?: string;
}

export function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const [maintenance, setMaintenance] = useState<MaintenanceState>({
    isUnderMaintenance: false,
  });
  const [isBypassed, setIsBypassed] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkMaintenance = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const res = await fetch(`${apiUrl}/maintenance`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setMaintenance(data);
      }
    } catch {
      // Default to allowing access if API is unreachable
      setMaintenance({ isUnderMaintenance: false });
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check bypass parameter or session
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('bypass') === 'true' || urlParams.get('preview') === 'superadmin') {
      sessionStorage.setItem('ff_maintenance_bypass', 'true');
      setIsBypassed(true);
      return;
    }

    if (sessionStorage.getItem('ff_maintenance_bypass') === 'true') {
      setIsBypassed(true);
      return;
    }

    void checkMaintenance();

    // Check every 30 seconds
    const interval = setInterval(() => {
      void checkMaintenance();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setIsChecking(true);
    await checkMaintenance();
    setIsChecking(false);
  };

  if (maintenance.isUnderMaintenance && !isBypassed) {
    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black px-4 py-12 text-white selection:bg-white selection:text-black">
        {/* Ambient street glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-rose-500/10 blur-[140px]" />

        {/* Content Box */}
        <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center text-center">
          {/* Status Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 font-mono text-[11px] font-bold tracking-widest text-amber-400 uppercase">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
            <span>Under Scheduled Maintenance</span>
          </div>

          {/* Brand Logo / Wordmark */}
          <div className="mb-4">
            <span className="font-mono text-xs font-black tracking-[0.3em] text-zinc-500 uppercase">
              Fashion Friday
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl font-black tracking-tight text-white uppercase sm:text-4xl lg:text-5xl">
            The Vault Is Temporarily Closed
          </h1>

          {/* Description */}
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
            {maintenance.message ||
              "We're currently upgrading the Fashion Friday platform for our next exclusive drop. We'll be back online shortly."}
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isChecking}
              className="inline-flex h-12 cursor-pointer items-center justify-center rounded-xl bg-white px-6 text-xs font-bold tracking-wider text-black uppercase transition hover:bg-zinc-200 active:scale-95 disabled:opacity-50"
            >
              {isChecking ? 'Checking Status...' : 'Check Status'}
            </button>

            <a
              href="https://wa.me/919995551234?text=Hi%20Fashion%20Friday%20Team%2C%20inquiring%20about%20the%20store%20maintenance."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-xs font-bold tracking-wider text-white uppercase transition hover:bg-white/10 active:scale-95"
            >
              WhatsApp Concierge
            </a>
          </div>

          {/* Footer Note */}
          <p className="mt-10 font-mono text-[11px] text-zinc-600">
            All pending orders and member accounts are safe and secure.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
