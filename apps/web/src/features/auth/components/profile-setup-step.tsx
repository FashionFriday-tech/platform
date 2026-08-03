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
    <div className="space-y-3.5">
      {/* Full Name Crossed Box Input */}
      <div>
        <div
          className={`group relative -skew-x-[12deg] rounded-md border bg-black transition-all duration-200 sm:-skew-x-[14deg] sm:rounded-lg ${
            hasNameError
              ? 'animate-shake border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              : 'border-zinc-800 focus-within:border-zinc-400 focus-within:ring-1 focus-within:ring-zinc-500 hover:border-zinc-700'
          }`}
        >
          <input
            type="text"
            placeholder="FULL NAME"
            value={profile.name}
            onChange={(e) => {
              setProfile({ ...profile, name: e.target.value });
              clearError('name');
            }}
            className="w-full skew-x-[12deg] bg-transparent px-5 py-3.5 font-mono text-sm font-bold tracking-widest text-white placeholder-zinc-500 transition-all outline-none sm:skew-x-[14deg] sm:py-4 sm:text-base"
          />
        </div>
        <div className="mt-1 min-h-4 px-2">
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
          className={`group relative -skew-x-[12deg] rounded-md border bg-black transition-all duration-200 sm:-skew-x-[14deg] sm:rounded-lg ${
            hasEmailError
              ? 'animate-shake border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              : 'border-zinc-800 focus-within:border-zinc-400 focus-within:ring-1 focus-within:ring-zinc-500 hover:border-zinc-700'
          }`}
        >
          <input
            type="email"
            placeholder="EMAIL ADDRESS"
            value={profile.email}
            onChange={(e) => {
              setProfile({ ...profile, email: e.target.value });
              clearError('email');
            }}
            className="w-full skew-x-[12deg] bg-transparent px-5 py-3.5 font-mono text-sm font-bold tracking-widest text-white placeholder-zinc-500 transition-all outline-none sm:skew-x-[14deg] sm:py-4 sm:text-base"
          />
        </div>
        <div className="mt-1 min-h-4 px-2">
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
        <div className="relative -skew-x-[12deg] rounded-md border border-zinc-800 bg-black px-4 py-3 sm:-skew-x-[14deg] sm:rounded-lg sm:px-5 sm:py-3.5">
          <span className="skew-x-[12deg] text-xs font-black tracking-wider text-zinc-400 uppercase sm:skew-x-[14deg] sm:text-sm">
            +91
          </span>
        </div>

        <div className="relative flex flex-1 -skew-x-[12deg] items-center justify-between rounded-md border border-zinc-800 bg-black px-5 py-3 sm:-skew-x-[14deg] sm:rounded-lg sm:py-3.5">
          <span className="skew-x-[12deg] font-mono text-sm font-bold tracking-widest text-zinc-300 sm:skew-x-[14deg]">
            {phoneNumber}
          </span>
          <div className="flex skew-x-[12deg] items-center gap-1 text-[10px] font-black tracking-widest text-emerald-400 uppercase sm:skew-x-[14deg]">
            <VerifiedUserIcon className="text-base" />
            <span>VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
