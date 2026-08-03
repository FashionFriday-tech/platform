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
        <div className="group relative -skew-x-[12deg] rounded-md border border-zinc-800 bg-black px-4 py-3.5 transition-all duration-200 sm:-skew-x-[14deg] sm:rounded-lg sm:px-5 sm:py-4">
          <div className="flex skew-x-[12deg] items-center gap-1.5 text-xs font-black tracking-wider text-zinc-300 uppercase sm:skew-x-[14deg] sm:text-sm">
            <span>+91</span>
          </div>
        </div>

        {/* Phone Number Crossed Box Input */}
        <div
          className={`group relative flex-1 -skew-x-[12deg] rounded-md border bg-black transition-all duration-200 sm:-skew-x-[14deg] sm:rounded-lg ${
            hasError
              ? 'animate-shake border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              : 'border-zinc-800 focus-within:border-zinc-400 focus-within:ring-1 focus-within:ring-zinc-500 hover:border-zinc-700'
          }`}
        >
          <input
            type="tel"
            value={phoneNumber}
            maxLength={10}
            onChange={(e) => {
              setPhoneNumber(e.target.value.replace(/\D/g, ''));
              clearError('phone');
            }}
            placeholder="WHATSAPP NUMBER"
            className="w-full skew-x-[12deg] bg-transparent px-5 py-3.5 font-mono text-sm font-bold tracking-widest text-white placeholder-zinc-500 transition-all outline-none sm:skew-x-[14deg] sm:py-4 sm:text-base"
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
