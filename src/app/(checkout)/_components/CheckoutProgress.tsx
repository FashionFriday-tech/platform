"use client";

import { Check } from "lucide-react";

interface CheckoutStagesProps {
  currentStage: number; // 1: Cart, 2: Review, 3: Payment
}

const stages = [
  { id: 1, name: "Bag" },
  { id: 2, name: "Review" },
  { id: 3, name: "Pay" },
];

export default function CheckoutStages({ currentStage }: CheckoutStagesProps) {
  return (
    <nav className="sticky z-60 top-20 w-full py-2 bg-background transition-colors border-b border-border/40">
      <div className="max-w-2xl mx-auto px-6 relative">
        
        {/* 1. The Background Connector Line (Centered) */}
        <div className="absolute top-2.5 left-12 right-12 h-0.5 bg-border rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand transition-all duration-700 ease-in-out" 
            style={{ 
              width: currentStage === 1 ? "0%" : currentStage === 2 ? "50%" : "100%" 
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
                <div className="relative flex items-center justify-center w-5 h-5 bg-background transition-transform duration-500">
                  
                  {/* Liquid Pulse Effect */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-foreground animate-ping duration-2000" />
                  )}
                  
                  {/* Circle Border/Background */}
                  <div
                    className={`
                      absolute inset-0 rounded-full transition-all duration-500 ease-in-out border-2 z-10
                      ${isActive ? "border-brand bg-background scale-110 shadow-[0_0_20px_rgba(var(--color-brand),0.3)]" : ""}
                      ${isCompleted ? "bg-brand border-brand" : "bg-background border-border"}
                    `}
                  />

                  {/* Stable Number/Icon */}
                  <span
                    className={`
                      relative z-20 text-xs font-black transition-colors duration-300
                      ${isActive ? "text-brand" : ""}
                      ${isCompleted ? "text-brand-foreground" : "text-foreground-subtle"}
                    `}
                  >
                    {isCompleted ? <Check size={14} strokeWidth={3} /> : stage.id}
                  </span>
                </div>

                {/* Stage Name */}
                <span
                  className={`
                    text-[10px] uppercase tracking-[0.2em] font-black transition-colors duration-500
                    ${isActive ? "text-foreground" : "text-foreground-subtle"}
                  `}
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