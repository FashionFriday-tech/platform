import React from 'react';

const STEP_LABELS: Record<string, string> = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  processing: 'Placed Order',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export function OrderStatusTracker({ status }: { status: string }) {
  const normalizedStatus = (status || '').toLowerCase().trim();
  const isCancelledFlow = ['cancelled', 'refunding', 'refunded'].includes(normalizedStatus);
  const steps = isCancelledFlow
    ? ['cancelled', 'refunded']
    : ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

  const matchedIndex = steps.indexOf(normalizedStatus);
  const currentStepIndex = matchedIndex >= 0 ? matchedIndex : 0;
  const progressPercent = steps.length > 1 ? (currentStepIndex / (steps.length - 1)) * 100 : 100;

  return (
    <div className="relative mt-2 flex w-full flex-col sm:mt-0">
      <div className="relative flex w-full items-center justify-between">
        {/* Connecting Line background */}
        <div className="absolute top-3.5 left-4 right-4 h-0.5 -translate-y-1/2 bg-zinc-200 dark:bg-zinc-800" />

        {/* Active Connecting Line */}
        <div
          className="absolute top-3.5 left-4 h-0.5 -translate-y-1/2 bg-emerald-500 transition-all duration-500"
          style={{ width: `calc(${progressPercent}% - 2rem * ${(progressPercent / 100).toFixed(2)})` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isActive = idx === currentStepIndex;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                    : isActive
                      ? 'bg-black text-white ring-4 ring-black/10 dark:bg-white dark:text-black dark:ring-white/20'
                      : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600'
                }`}
              >
                {isCompleted ? (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : isActive ? (
                  <span className="h-2 w-2 rounded-full bg-white dark:bg-black animate-pulse" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                )}
              </div>
              <span
                className={`mt-2 text-center text-[11px] whitespace-nowrap transition-colors ${
                  isActive
                    ? 'font-extrabold text-black dark:text-white bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full'
                    : isCompleted
                      ? 'font-bold text-emerald-600 dark:text-emerald-400'
                      : 'font-medium text-zinc-400 dark:text-zinc-500'
                }`}
              >
                {STEP_LABELS[step] ?? step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
