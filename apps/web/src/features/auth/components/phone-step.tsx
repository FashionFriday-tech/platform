import React from 'react';

interface PhoneStepProps {
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  errors: Record<string, string>;
  clearError: (key: string) => void;
}

export function PhoneStep({ phoneNumber, setPhoneNumber, errors, clearError }: PhoneStepProps) {
  return (
    <div>
      <div className="flex gap-2">
        <div className="flex items-center justify-center rounded-full border-2 border-zinc-800 bg-zinc-900 px-4 text-sm font-bold text-zinc-400">
          +91
        </div>
        <input
          type="tel"
          value={phoneNumber}
          maxLength={10}
          onChange={(e) => {
            setPhoneNumber(e.target.value.replace(/\D/g, ''));
            clearError('phone');
          }}
          placeholder="WhatsApp Number"
          className={`block w-full rounded-full border-2 bg-transparent px-6 py-4 text-white transition-all outline-none ${
            errors.phone ? 'animate-shake border-red-500' : 'border-zinc-800 focus:border-white'
          }`}
        />
      </div>
      <div className="mt-2 h-4 px-6">
        {errors.phone && (
          <p className="text-[10px] font-bold tracking-widest text-red-500 uppercase">
            {errors.phone}
          </p>
        )}
      </div>
    </div>
  );
}
