'use client';

import React from 'react';

import { CheckIcon } from '@ff/ui';

interface CheckoutStagesProps {
  currentStage: number; // 1: Cart, 2: Review, 3: Payment
}

const stages = [
  { id: 1, name: 'Bag' },
  { id: 2, name: 'Review' },
  { id: 3, name: 'Pay' },
];

export function CheckoutProgress({ currentStage }: CheckoutStagesProps) {
  return (
    <nav className="border-border bg-background w-full border-b py-4 transition-colors">
      <div className="relative mx-auto max-w-4xl px-6">
        {/* 1. The Background Connector Line (Centered) */}
        <div className="bg-border absolute top-2.5 right-12 left-12 h-0.5 overflow-hidden rounded-full">
          <div
            className="bg-brand h-full transition-all duration-700 ease-in-out"
            style={{
              width: currentStage === 1 ? '0%' : currentStage === 2 ? '50%' : '100%',
            }}
          />
        </div>

        {/* 2. The Stages Icons & Names */}
        <div className="relative flex items-center justify-between gap-4">
          {stages.map((stage) => {
            const isCompleted = currentStage > stage.id;
            const isActive = currentStage === stage.id;

            return (
              <div key={stage.id} className="flex flex-col items-center gap-3">
                <div className="bg-background relative flex h-5 w-5 items-center justify-center transition-transform duration-500">
                  {/* Liquid Pulse Effect */}
                  {isActive && (
                    <span className="bg-foreground absolute inset-0 animate-ping rounded-full duration-2000" />
                  )}

                  {/* Circle Border/Background */}
                  <div
                    className={`absolute inset-0 z-10 rounded-full border-2 transition-all duration-500 ease-in-out ${isActive ? 'border-brand bg-foreground scale-110 shadow-[0_0_20px_rgba(var(--color-brand),0.3)]' : ''} ${isCompleted ? 'bg-brand border-brand' : 'bg-background border-border'} `}
                  />

                  {/* Stable Number/Icon */}
                  <span
                    className={`relative z-20 text-xs font-black transition-colors duration-300 ${isCompleted ? 'text-brand-foreground' : isActive ? 'text-background' : 'text-foreground-subtle'} `}
                  >
                    {isCompleted ? <CheckIcon size={14} /> : stage.id}
                  </span>
                </div>

                {/* Stage Name */}
                <span
                  className={`text-[10px] font-black tracking-[0.2em] uppercase transition-colors duration-500 ${isActive ? 'text-foreground' : 'text-foreground-subtle'} `}
                >
                  {stage.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
