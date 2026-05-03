import React from "react";

export const LabelWithTick = ({ label, status, subtitle, rightElement }: { label: string, status: "default" | "valid" | "empty" | "error", subtitle?: string, rightElement?: React.ReactNode }) => {
  const iconColor = status === "valid" ? "text-[#22c55e]" : status === "default" ? "text-[#3b82f6]" : status === "error" ? "text-red-500" : "text-black/20 dark:text-white/20";
  return (
    <div className={subtitle ? "mb-3" : "mb-2"}>
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center space-x-2">
          <label className="block text-sm font-bold text-black/90 dark:text-white/90 leading-none">{label}</label>
          {status === "error" ? (
            <svg className={`w-4 h-4 transition-colors duration-300 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className={`w-4 h-4 transition-colors duration-300 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </div>
        {rightElement && <div>{rightElement}</div>}
      </div>
      {subtitle && <span className="block text-[11px] font-medium text-black/40 dark:text-white/40 mt-1 leading-none">{subtitle}</span>}
    </div>
  );
};
