'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface MaintenanceState {
  isUnderMaintenance: boolean;
  message?: string;
  updatedAt?: string;
}

const TAPE_SEGMENTS = [
  '⚠️ UNDER MAINTENANCE',
  'VAULT TEMPORARILY LOCKED',
  'FASHION FRIDAY',
  'SYSTEM UPGRADE',
  'DROP PREPARATION',
  '⚠️ UNDER MAINTENANCE',
  'VAULT TEMPORARILY LOCKED',
  'FASHION FRIDAY',
  'SYSTEM UPGRADE',
  'DROP PREPARATION',
  '⚠️ UNDER MAINTENANCE',
  'VAULT TEMPORARILY LOCKED',
  'FASHION FRIDAY',
  'SYSTEM UPGRADE',
  'DROP PREPARATION',
  '⚠️ UNDER MAINTENANCE',
  'VAULT TEMPORARILY LOCKED',
  'FASHION FRIDAY',
  'SYSTEM UPGRADE',
  'DROP PREPARATION',
];

function CautionTape({
  rotateClass,
  reverseMarquee = false,
}: {
  rotateClass: string;
  reverseMarquee?: boolean;
}) {
  return (
    <div
      className={`pointer-events-none absolute top-1/2 -left-[45vw] w-[190vw] -translate-y-1/2 shadow-[0_20px_45px_rgba(0,0,0,0.8)] select-none ${rotateClass}`}
    >
      {/* Top hazard hatched stripe */}
      <div
        className="h-2.5 w-full"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-45deg, #000 0, #000 10px, #facc15 10px, #facc15 20px)',
        }}
      />

      {/* Yellow vinyl caution tape with repeating bold labels */}
      <div className="flex h-11 w-full items-center overflow-hidden bg-[#facc15] px-2 font-mono text-xs font-black tracking-widest text-black uppercase sm:h-13 sm:text-sm">
        <div
          className={`flex shrink-0 items-center gap-6 whitespace-nowrap will-change-transform ${
            reverseMarquee
              ? 'animate-[marquee-reverse_35s_linear_infinite]'
              : 'animate-[marquee_35s_linear_infinite]'
          }`}
        >
          {TAPE_SEGMENTS.map((text, idx) => (
            <span key={`tape-1-${idx}`} className="inline-flex items-center gap-6">
              <span>{text}</span>
              <span className="text-black/60">•</span>
            </span>
          ))}
        </div>
        <div
          className={`flex shrink-0 items-center gap-6 whitespace-nowrap will-change-transform ${
            reverseMarquee
              ? 'animate-[marquee-reverse_35s_linear_infinite]'
              : 'animate-[marquee_35s_linear_infinite]'
          }`}
          aria-hidden="true"
        >
          {TAPE_SEGMENTS.map((text, idx) => (
            <span key={`tape-2-${idx}`} className="inline-flex items-center gap-6">
              <span>{text}</span>
              <span className="text-black/60">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Bottom hazard hatched stripe */}
      <div
        className="h-2.5 w-full"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-45deg, #000 0, #000 10px, #facc15 10px, #facc15 20px)',
        }}
      />
    </div>
  );
}

export function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

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
      setMaintenance({ isUnderMaintenance: false });
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check bypass parameter or session token
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

    // Re-check periodically every 20 seconds
    const interval = setInterval(() => {
      void checkMaintenance();
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  // Lock body scrolling when maintenance is active so page cannot scroll up and down
  useEffect(() => {
    if (maintenance.isUnderMaintenance && !isBypassed) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [maintenance.isUnderMaintenance, isBypassed]);

  // If user navigates or attempts to visit any page other than home, redirect to home page
  useEffect(() => {
    if (maintenance.isUnderMaintenance && !isBypassed && pathname !== '/') {
      router.replace('/');
    }
  }, [maintenance.isUnderMaintenance, isBypassed, pathname, router]);

  const handleManualRefresh = async () => {
    setIsChecking(true);
    await checkMaintenance();
    setIsChecking(false);
  };

  if (maintenance.isUnderMaintenance && !isBypassed) {
    return (
      <div className="relative h-screen max-h-screen w-screen overflow-hidden">
        {/* Background Layer: Visible Underlying Website UI (Frozen & Dimmed) */}
        <div
          className="pointer-events-none h-screen max-h-screen w-full overflow-hidden blur-[4px] brightness-[0.4] filter select-none dark:brightness-[0.25]"
          aria-hidden="true"
        >
          {children}
        </div>

        {/* Fixed 100vh Maintenance Overlay */}
        <div className="fixed inset-0 z-[9999] flex h-screen max-h-screen w-screen items-center justify-center overflow-hidden bg-black/45 backdrop-blur-[2px]">
          {/* Crossed Caution Belts in 'X' Cross Pattern */}
          <CautionTape rotateClass="-rotate-[16deg]" />
          <CautionTape rotateClass="rotate-[16deg]" reverseMarquee />

          {/* Centered Pop-up Modal Box */}
          <div className="relative z-30 mx-4 w-full max-w-md rounded-3xl border border-white/20 bg-zinc-950/95 p-6 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:p-8">
            {/* Ambient gold glow in popup */}
            <div className="pointer-events-none absolute -top-16 -left-16 h-36 w-36 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 -bottom-16 h-36 w-36 rounded-full bg-amber-500/20 blur-3xl" />

            {/* Status Pill Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 font-mono text-[10px] font-bold tracking-widest text-amber-400 uppercase sm:text-[11px]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
              <span>Under Scheduled Maintenance</span>
            </div>

            {/* Brand Title */}
            <div className="mb-2">
              <span className="font-mono text-[11px] font-black tracking-[0.25em] text-zinc-400 uppercase">
                Fashion Friday
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-xl font-black tracking-tight text-white uppercase sm:text-2xl">
              The Vault Is Temporarily Closed
            </h2>

            {/* Description */}
            <p className="mt-3 text-xs leading-relaxed text-zinc-300 sm:text-sm">
              {maintenance.message ||
                "We're currently tuning our servers and loading the vault for our next exclusive drop. We'll be back online shortly."}
            </p>

            {/* Action Buttons inside Pop-up */}
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isChecking}
                className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-white px-5 text-xs font-bold tracking-wider text-black uppercase transition hover:bg-zinc-200 active:scale-95 disabled:opacity-50 sm:w-auto"
              >
                {isChecking ? 'Checking Status...' : 'Check Status'}
              </button>

              <a
                href="https://wa.me/919995551234?text=Hi%20Fashion%20Friday%20Team%2C%20inquiring%20about%20the%20store%20maintenance."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 text-xs font-bold tracking-wider text-white uppercase transition hover:bg-white/10 active:scale-95 sm:w-auto"
              >
                WhatsApp Concierge
              </a>
            </div>

            {/* Footer Assurance */}
            <p className="mt-6 font-mono text-[10px] text-zinc-500">
              🔒 All existing orders, balances &amp; accounts remain secure.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
