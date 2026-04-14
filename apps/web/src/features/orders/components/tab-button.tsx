import React from 'react';

interface TabButtonProps {
  isActive: boolean;
  label: string;
  count?: number;
  onClick: () => void;
}

export function TabButton({ isActive, label, count, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex min-w-fit flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all sm:px-8 ${
        isActive
          ? 'bg-background text-foreground scale-[0.98] shadow-sm'
          : 'text-foreground-subtle hover:text-foreground'
      }`}
    >
      {label}
      {count !== undefined && (
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
            isActive
              ? 'bg-brand text-brand-foreground'
              : 'bg-background-elevated text-foreground-subtle border-border border'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
