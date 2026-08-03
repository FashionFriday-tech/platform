import React from 'react';

import { VerifiedUserIcon } from '@ff/ui';

interface ProfileSetupStepProps {
  profile: { name: string; email: string };
  setProfile: (p: { name: string; email: string }) => void;
  errors: Record<string, string>;
  clearError: (key: string) => void;
  phoneNumber: string;
}

export function ProfileSetupStep({
  profile,
  setProfile,
  errors,
  clearError,
  phoneNumber,
}: ProfileSetupStepProps) {
  const hasNameError = Boolean(errors.name);
  const hasEmailError = Boolean(errors.email);

  return (
    <div className="space-y-4">
      {/* Full Name Crossed Box Input */}
      <div>
        <div
          className={`group relative -skew-x-[8deg] rounded-lg border bg-zinc-950/80 transition-all ${
            hasNameError
              ? 'animate-shake border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              : 'border-zinc-800 focus-within:border-white focus-within:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:border-zinc-700'
          }`}
        >
          {/* Corner Crosshairs */}
          <span
            className={`pointer-events-none absolute -top-1 -left-1 font-mono text-[9px] leading-none transition-colors select-none ${
              hasNameError
                ? 'text-red-500'
                : 'text-zinc-600 group-focus-within:text-white group-hover:text-zinc-400'
            }`}
          >
            +
          </span>
          <span
            className={`pointer-events-none absolute -top-1 -right-1 font-mono text-[9px] leading-none transition-colors select-none ${
              hasNameError
                ? 'text-red-500'
                : 'text-zinc-600 group-focus-within:text-white group-hover:text-zinc-400'
            }`}
          >
            +
          </span>
          <span
            className={`pointer-events-none absolute -bottom-1 -left-1 font-mono text-[9px] leading-none transition-colors select-none ${
              hasNameError
                ? 'text-red-500'
                : 'text-zinc-600 group-focus-within:text-white group-hover:text-zinc-400'
            }`}
          >
            +
          </span>
          <span
            className={`pointer-events-none absolute -right-1 -bottom-1 font-mono text-[9px] leading-none transition-colors select-none ${
              hasNameError
                ? 'text-red-500'
                : 'text-zinc-600 group-focus-within:text-white group-hover:text-zinc-400'
            }`}
          >
            +
          </span>

          <input
            type="text"
            placeholder="FULL NAME"
            value={profile.name}
            onChange={(e) => {
              setProfile({ ...profile, name: e.target.value });
              clearError('name');
            }}
            className="w-full skew-x-[8deg] bg-transparent px-5 py-4 font-mono text-sm font-bold tracking-widest text-white placeholder-zinc-600 transition-all outline-none sm:text-base"
          />
        </div>
        <div className="mt-1.5 min-h-4 px-2">
          {errors.name && (
            <p className="animate-in fade-in flex items-center gap-1.5 text-[10px] font-black tracking-widest text-red-500 uppercase">
              <span>[!]</span>
              <span>{errors.name}</span>
            </p>
          )}
        </div>
      </div>

      {/* Email Address Crossed Box Input */}
      <div>
        <div
          className={`group relative -skew-x-[8deg] rounded-lg border bg-zinc-950/80 transition-all ${
            hasEmailError
              ? 'animate-shake border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              : 'border-zinc-800 focus-within:border-white focus-within:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:border-zinc-700'
          }`}
        >
          {/* Corner Crosshairs */}
          <span
            className={`pointer-events-none absolute -top-1 -left-1 font-mono text-[9px] leading-none transition-colors select-none ${
              hasEmailError
                ? 'text-red-500'
                : 'text-zinc-600 group-focus-within:text-white group-hover:text-zinc-400'
            }`}
          >
            +
          </span>
          <span
            className={`pointer-events-none absolute -top-1 -right-1 font-mono text-[9px] leading-none transition-colors select-none ${
              hasEmailError
                ? 'text-red-500'
                : 'text-zinc-600 group-focus-within:text-white group-hover:text-zinc-400'
            }`}
          >
            +
          </span>
          <span
            className={`pointer-events-none absolute -bottom-1 -left-1 font-mono text-[9px] leading-none transition-colors select-none ${
              hasEmailError
                ? 'text-red-500'
                : 'text-zinc-600 group-focus-within:text-white group-hover:text-zinc-400'
            }`}
          >
            +
          </span>
          <span
            className={`pointer-events-none absolute -right-1 -bottom-1 font-mono text-[9px] leading-none transition-colors select-none ${
              hasEmailError
                ? 'text-red-500'
                : 'text-zinc-600 group-focus-within:text-white group-hover:text-zinc-400'
            }`}
          >
            +
          </span>

          <input
            type="email"
            placeholder="EMAIL ADDRESS"
            value={profile.email}
            onChange={(e) => {
              setProfile({ ...profile, email: e.target.value });
              clearError('email');
            }}
            className="w-full skew-x-[8deg] bg-transparent px-5 py-4 font-mono text-sm font-bold tracking-widest text-white placeholder-zinc-600 transition-all outline-none sm:text-base"
          />
        </div>
        <div className="mt-1.5 min-h-4 px-2">
          {errors.email && (
            <p className="animate-in fade-in flex items-center gap-1.5 text-[10px] font-black tracking-widest text-red-500 uppercase">
              <span>[!]</span>
              <span>{errors.email}</span>
            </p>
          )}
        </div>
      </div>

      {/* Verified Phone Crossed Box Display */}
      <div className="pointer-events-none flex gap-2.5 opacity-70 select-none sm:gap-3">
        <div className="relative -skew-x-[8deg] rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-3.5 sm:px-4">
          <span className="absolute -top-1 -left-1 font-mono text-[9px] leading-none text-zinc-700">
            +
          </span>
          <span className="absolute -top-1 -right-1 font-mono text-[9px] leading-none text-zinc-700">
            +
          </span>
          <span className="absolute -bottom-1 -left-1 font-mono text-[9px] leading-none text-zinc-700">
            +
          </span>
          <span className="absolute -right-1 -bottom-1 font-mono text-[9px] leading-none text-zinc-700">
            +
          </span>
          <span className="skew-x-[8deg] text-xs font-black tracking-wider text-zinc-400 uppercase sm:text-sm">
            +91
          </span>
        </div>

        <div className="relative flex flex-1 -skew-x-[8deg] items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-5 py-3.5">
          <span className="absolute -top-1 -left-1 font-mono text-[9px] leading-none text-zinc-700">
            +
          </span>
          <span className="absolute -top-1 -right-1 font-mono text-[9px] leading-none text-zinc-700">
            +
          </span>
          <span className="absolute -bottom-1 -left-1 font-mono text-[9px] leading-none text-zinc-700">
            +
          </span>
          <span className="absolute -right-1 -bottom-1 font-mono text-[9px] leading-none text-zinc-700">
            +
          </span>

          <span className="skew-x-[8deg] font-mono text-sm font-bold tracking-widest text-zinc-300">
            {phoneNumber}
          </span>
          <div className="flex skew-x-[8deg] items-center gap-1 text-[10px] font-black tracking-widest text-emerald-400 uppercase">
            <VerifiedUserIcon className="text-base" />
            <span>VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
