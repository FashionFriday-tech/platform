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
    <div className="space-y-2.5">
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
            className="w-full skew-x-[12deg] bg-transparent px-4 py-2.5 font-mono text-xs font-bold tracking-widest text-white placeholder-zinc-500 transition-all outline-none sm:skew-x-[14deg] sm:px-5 sm:py-3 sm:text-sm"
          />
        </div>
        {hasNameError && (
          <div className="mt-1 px-2">
            <p className="animate-in fade-in flex items-center gap-1.5 text-[9px] font-black tracking-widest text-red-500 uppercase">
              <span>[!]</span>
              <span>{errors.name}</span>
            </p>
          </div>
        )}
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
            className="w-full skew-x-[12deg] bg-transparent px-4 py-2.5 font-mono text-xs font-bold tracking-widest text-white placeholder-zinc-500 transition-all outline-none sm:skew-x-[14deg] sm:px-5 sm:py-3 sm:text-sm"
          />
        </div>
        {hasEmailError && (
          <div className="mt-1 px-2">
            <p className="animate-in fade-in flex items-center gap-1.5 text-[9px] font-black tracking-widest text-red-500 uppercase">
              <span>[!]</span>
              <span>{errors.email}</span>
            </p>
          </div>
        )}
      </div>

      {/* Verified Phone Indicator */}
      <div className="flex items-center justify-between px-1 text-[9px] font-black tracking-widest text-zinc-500 uppercase sm:text-[10px]">
        <span>WHATSAPP: +91 {phoneNumber}</span>
        <span className="flex items-center gap-1 text-emerald-400">
          <VerifiedUserIcon className="text-xs" /> VERIFIED
        </span>
      </div>
    </div>
  );
}
