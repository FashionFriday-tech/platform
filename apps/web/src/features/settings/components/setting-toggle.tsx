'use client';

import React from 'react';

import { motion } from 'motion/react';

interface SettingToggleProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  active: boolean;
  loading?: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export function SettingToggle({
  icon,
  label,
  description,
  active,
  loading = false,
  disabled = false,
  onToggle,
}: SettingToggleProps) {
  const isInteractive = !loading && !disabled;

  return (
    <div
      role="switch"
      aria-checked={active}
      tabIndex={isInteractive ? 0 : -1}
      onKeyDown={(e) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onToggle();
        }
      }}
      className={`flex items-center justify-between p-6 transition-opacity select-none ${
        isInteractive ? 'hover:bg-foreground/[0.02] cursor-pointer' : 'cursor-wait opacity-60'
      }`}
      onClick={() => {
        if (isInteractive) {
          onToggle();
        }
      }}
    >
      <div className="flex items-center gap-4 text-left">
        <div className="bg-foreground text-background rounded-2xl p-3 transition-all">{icon}</div>
        <div>
          <span className="text-sm font-black tracking-tight uppercase italic">{label}</span>
          {description && (
            <p className="text-foreground-subtle text-[9px] font-bold tracking-widest uppercase">
              {description}
            </p>
          )}
        </div>
      </div>

      <div
        className={`flex h-7 w-12 items-center rounded-full px-1.5 transition-all ${
          active ? 'bg-foreground' : 'bg-foreground/10'
        } ${loading ? 'animate-pulse' : ''}`}
      >
        <motion.div
          animate={{ x: active ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="bg-background flex h-4 w-4 items-center justify-center rounded-full shadow-sm"
        >
          {loading && (
            <span className="border-foreground inline-block h-2 w-2 animate-spin rounded-full border-1 border-t-transparent" />
          )}
        </motion.div>
      </div>
    </div>
  );
}
