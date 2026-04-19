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
  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Full Name"
          value={profile.name}
          onChange={(e) => {
            setProfile({ ...profile, name: e.target.value });
            clearError('name');
          }}
          className={`w-full rounded-full border-2 bg-transparent px-8 py-4 text-white transition-all outline-none ${
            errors.name ? 'border-red-500' : 'border-zinc-800 focus:border-white'
          }`}
        />
        <div className="px-8">
          {errors.name && (
            <p className="text-[10px] font-bold tracking-widest text-red-500 uppercase">
              {errors.name}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <input
          type="email"
          placeholder="Email Address"
          value={profile.email}
          onChange={(e) => {
            setProfile({ ...profile, email: e.target.value });
            clearError('email');
          }}
          className={`w-full rounded-full border-2 bg-transparent px-8 py-4 text-white transition-all outline-none ${
            errors.email ? 'border-red-500' : 'border-zinc-800 focus:border-white'
          }`}
        />
        <div className="px-8">
          {errors.email && (
            <p className="text-[10px] font-bold tracking-widest text-red-500 uppercase">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="pointer-events-none mb-10 flex gap-2 opacity-80">
        <div className="flex items-center justify-center rounded-full border-2 border-zinc-800 bg-zinc-900 px-4 text-sm font-bold text-white">
          +91
        </div>
        <div className="flex w-full items-center justify-between rounded-full border-2 border-zinc-800 px-8 py-4 text-white">
          {phoneNumber} <VerifiedUserIcon className="text-xl text-green-400" />
        </div>
      </div>
    </div>
  );
}
