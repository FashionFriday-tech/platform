import React from 'react';

interface OtpStepProps {
  otp: string[];
  errors: Record<string, string>;
  timer: number;
  inputRefs: React.RefObject<(HTMLInputElement | null)[]>;
  handlePaste: (e: React.ClipboardEvent) => void;
  handleOtpChange: (index: number, value: string) => void;
  handleResendOTP: () => void;
}

export function OtpStep({
  otp,
  errors,
  timer,
  inputRefs,
  handlePaste,
  handleOtpChange,
  handleResendOTP,
}: OtpStepProps) {
  return (
    <div className="mb-10 space-y-6">
      <div className="flex justify-center gap-1 sm:gap-3 md:gap-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            onPaste={index === 0 ? handlePaste : undefined}
            onChange={(e) => {
              handleOtpChange(index, e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !otp[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
              }
            }}
            className={`h-9 w-9 rounded-full border-2 bg-transparent text-center text-base font-bold text-white transition-all outline-none sm:h-14 sm:w-14 sm:text-xl md:h-16 md:w-16 md:text-2xl ${
              errors.otp ? 'border-red-500' : 'border-zinc-800 focus:border-white'
            }`}
          />
        ))}
      </div>

      <div className="h-6 text-center">
        {errors.otp ? (
          <p className="animate-in fade-in text-[10px] font-bold tracking-widest text-red-500 uppercase">
            {errors.otp}
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={timer > 0}
            className={`font-bold tracking-[0.2em] uppercase ${
              timer > 0
                ? 'cursor-not-allowed text-lg text-zinc-200'
                : 'text-[10px] text-white underline underline-offset-4'
            }`}
          >
            {timer > 0 ? (
              <span>
                00 : {timer < 10 ? `0${timer}` : timer}
                <span className="text-[10px]">s</span>
              </span>
            ) : (
              'Resend via WhatsApp'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
