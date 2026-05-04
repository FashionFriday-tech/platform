import React from 'react';

export const LabelWithTick = ({
  label,
  status,
  subtitle,
  rightElement,
}: {
  label: string;
  status: 'default' | 'valid' | 'empty' | 'error';
  subtitle?: string;
  rightElement?: React.ReactNode;
}) => {
  const iconColor =
    status === 'valid'
      ? 'text-[#22c55e]'
      : status === 'default'
        ? 'text-[#3b82f6]'
        : status === 'error'
          ? 'text-red-500'
          : 'text-black/20 dark:text-white/20';
  return (
    <div className={subtitle ? 'mb-3' : 'mb-2'}>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-2">
          <label className="block text-sm leading-none font-bold text-black/90 dark:text-white/90">
            {label}
          </label>
          {status === 'error' ? (
            <svg
              className={`h-4 w-4 transition-colors duration-300 ${iconColor}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className={`h-4 w-4 transition-colors duration-300 ${iconColor}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          )}
        </div>
        {rightElement && <div>{rightElement}</div>}
      </div>
      {subtitle && (
        <span className="mt-1 block text-[11px] leading-none font-medium text-black/40 dark:text-white/40">
          {subtitle}
        </span>
      )}
    </div>
  );
};
