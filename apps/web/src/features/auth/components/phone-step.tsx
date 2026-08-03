import React from 'react';

interface PhoneStepProps {
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  errors: Record<string, string>;
  clearError: (key: string) => void;
}

export function PhoneStep({ phoneNumber, setPhoneNumber, errors, clearError }: PhoneStepProps) {
  const hasError = Boolean(errors.phone);

  return (
    <div>
      <div className="flex gap-2.5 sm:gap-3">
        {/* Country Code Crossed Box */}
        <div className="group relative -skew-x-[8deg] rounded-lg border border-zinc-800 bg-zinc-950/90 px-3.5 py-4 transition-all sm:px-4">
          {/* Corner Crosshairs */}
          <span className="pointer-events-none absolute -top-1 -left-1 font-mono text-[9px] leading-none text-zinc-600 select-none">
            +
          </span>
          <span className="pointer-events-none absolute -top-1 -right-1 font-mono text-[9px] leading-none text-zinc-600 select-none">
            +
          </span>
          <span className="pointer-events-none absolute -bottom-1 -left-1 font-mono text-[9px] leading-none text-zinc-600 select-none">
            +
          </span>
          <span className="pointer-events-none absolute -right-1 -bottom-1 font-mono text-[9px] leading-none text-zinc-600 select-none">
            +
          </span>

          <div className="flex skew-x-[8deg] items-center gap-1.5 text-xs font-black tracking-wider text-zinc-300 uppercase sm:text-sm">
            <span>+91</span>
          </div>
        </div>

        {/* Phone Number Crossed Box Input */}
        <div
          className={`group relative flex-1 -skew-x-[8deg] rounded-lg border bg-zinc-950/80 transition-all ${
            hasError
              ? 'animate-shake border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              : 'border-zinc-800 focus-within:border-white focus-within:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:border-zinc-700'
          }`}
        >
          {/* Corner Crosshairs */}
          <span
            className={`pointer-events-none absolute -top-1 -left-1 font-mono text-[9px] leading-none transition-colors select-none ${
              hasError
                ? 'text-red-500'
                : 'text-zinc-600 group-focus-within:text-white group-hover:text-zinc-400'
            }`}
          >
            +
          </span>
          <span
            className={`pointer-events-none absolute -top-1 -right-1 font-mono text-[9px] leading-none transition-colors select-none ${
              hasError
                ? 'text-red-500'
                : 'text-zinc-600 group-focus-within:text-white group-hover:text-zinc-400'
            }`}
          >
            +
          </span>
          <span
            className={`pointer-events-none absolute -bottom-1 -left-1 font-mono text-[9px] leading-none transition-colors select-none ${
              hasError
                ? 'text-red-500'
                : 'text-zinc-600 group-focus-within:text-white group-hover:text-zinc-400'
            }`}
          >
            +
          </span>
          <span
            className={`pointer-events-none absolute -right-1 -bottom-1 font-mono text-[9px] leading-none transition-colors select-none ${
              hasError
                ? 'text-red-500'
                : 'text-zinc-600 group-focus-within:text-white group-hover:text-zinc-400'
            }`}
          >
            +
          </span>

          <input
            type="tel"
            value={phoneNumber}
            maxLength={10}
            onChange={(e) => {
              setPhoneNumber(e.target.value.replace(/\D/g, ''));
              clearError('phone');
            }}
            placeholder="WHATSAPP NUMBER"
            className="w-full skew-x-[8deg] bg-transparent px-5 py-4 font-mono text-sm font-bold tracking-widest text-white placeholder-zinc-600 transition-all outline-none sm:text-base"
          />
        </div>
      </div>

      <div className="mt-2 min-h-5 px-2">
        {errors.phone && (
          <p className="animate-in fade-in flex items-center gap-1.5 text-[10px] font-black tracking-widest text-red-500 uppercase">
            <span>[!]</span>
            <span>{errors.phone}</span>
          </p>
        )}
      </div>
    </div>
  );
}
