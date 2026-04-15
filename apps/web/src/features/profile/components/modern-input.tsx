import React from 'react';

import { CheckCircleIcon, LoaderIcon } from '@ff/ui';

interface ModernInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  actionLabel?: string;
  onAction?: () => Promise<void> | void;
  isLoading?: boolean;
  isVerified?: boolean;
  icon?: React.ReactNode;
}

export const ModernInput = ({
  label,
  value,
  onChange,
  type = 'text',
  actionLabel,
  onAction,
  isLoading,
  isVerified,
}: ModernInputProps) => (
  <div className="w-full space-y-1.5">
    <div className="flex justify-between">
      <label className="text-foreground-subtle text-xs font-bold tracking-wider uppercase">
        {label}
      </label>
      {isVerified && (
        <span className="text-brand flex items-center gap-1 text-[10px] font-bold">
          <CheckCircleIcon size={12} /> VERIFIED
        </span>
      )}
    </div>
    <div className="group relative">
      <input
        type={type}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        disabled={isVerified}
        className={`bg-background border-border text-foreground focus:ring-ring focus:border-brand w-full rounded-4xl border py-3.5 pl-4 text-sm transition-all outline-none focus:ring-1 ${actionLabel ? 'pr-28' : 'pr-4'} ${
          isVerified ? 'border-brand opacity-80' : ''
        }`}
      />
      {onAction && !isVerified && (
        <button
          type="button"
          onClick={() => {
            void onAction();
          }}
          disabled={isLoading ?? !value}
          className="bg-brand text-brand-foreground absolute top-1.5 right-1.5 bottom-1.5 min-w-20 rounded-3xl px-4 text-xs font-bold transition-all hover:opacity-90 disabled:opacity-30"
        >
          {isLoading ? <LoaderIcon className="animate-spin" size={14} /> : actionLabel}
        </button>
      )}
      {isVerified && (
        <CheckCircleIcon
          size={20}
          className="text-brand absolute top-1/2 right-4 -translate-y-1/2"
        />
      )}
    </div>
  </div>
);
