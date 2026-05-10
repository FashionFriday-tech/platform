import React from 'react';

export function OrderStatusTracker({ status }: { status: string }) {
  const isCancelledFlow = ['cancelled', 'refunding', 'refunded'].includes(status);
  const steps = isCancelledFlow 
    ? ['cancelled', 'refunding', 'refunded']
    : ['pending', 'inquiry', 'confirmed', 'shipped', 'delivered'];
  
  const currentStepIndex = steps.indexOf(status) >= 0 ? steps.indexOf(status) : 0;

  return (
    <div className="relative mt-2 flex w-full justify-between sm:mt-0">
      {/* Connecting Line background */}
      <div className="absolute left-0 top-3 h-0.5 w-full -translate-y-1/2 bg-black/10 dark:bg-white/10"></div>
      
      {/* Active Connecting Line */}
      <div 
        className="absolute left-0 top-3 h-0.5 -translate-y-1/2 bg-black transition-all duration-500 dark:bg-white"
        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
      ></div>

      {steps.map((step, idx) => {
        const isCompleted = idx <= currentStepIndex;
        const isActive = idx === currentStepIndex;
        return (
          <div key={step} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-500 ${isCompleted ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-200 dark:bg-gray-900/80'}`}>
               {isCompleted ? (
                 <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                 </svg>
               ) : (
                 <span className="h-1.5 w-1.5 rounded-full bg-black/20 dark:bg-white/20"></span>
               )}
            </div>
            <span className={`absolute top-8 text-center text-[10px] font-semibold capitalize transition-colors ${isActive ? 'text-black font-bold dark:text-white' : isCompleted ? 'text-black/70 dark:text-white/70' : 'text-black/40 dark:text-white/40'}`}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
