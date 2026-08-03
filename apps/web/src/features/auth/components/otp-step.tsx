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
  const hasError = Boolean(errors.otp);

  return (
    <div className="mb-8 space-y-6">
      {/* Significantly increased OTP box size with Crossed Box design */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
        {otp.map((digit, index) => {
          const isFilled = Boolean(digit);

          return (
            <div
              key={index}
              className={`group relative -skew-x-[8deg] rounded-lg border transition-all ${
                hasError
                  ? 'animate-shake border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                  : isFilled
                    ? 'border-zinc-500 bg-zinc-900/90'
                    : 'border-zinc-800 bg-zinc-950/80 focus-within:border-white focus-within:bg-zinc-900 focus-within:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:border-zinc-700'
              }`}
            >
              {/* Corner Crosshairs */}
              <span
                className={`pointer-events-none absolute -top-1 -left-1 font-mono text-[8px] leading-none transition-colors select-none sm:text-[9px] ${
                  hasError
                    ? 'text-red-500'
                    : 'text-zinc-600 group-focus-within:text-white group-hover:text-zinc-400'
                }`}
              >
                +
              </span>
              <span
                className={`pointer-events-none absolute -top-1 -right-1 font-mono text-[8px] leading-none transition-colors select-none sm:text-[9px] ${
                  hasError
                    ? 'text-red-500'
                    : 'text-zinc-600 group-focus-within:text-white group-hover:text-zinc-400'
                }`}
              >
                +
              </span>
              <span
                className={`pointer-events-none absolute -bottom-1 -left-1 font-mono text-[8px] leading-none transition-colors select-none sm:text-[9px] ${
                  hasError
                    ? 'text-red-500'
                    : 'text-zinc-600 group-focus-within:text-white group-hover:text-zinc-400'
                }`}
              >
                +
              </span>
              <span
                className={`pointer-events-none absolute -right-1 -bottom-1 font-mono text-[8px] leading-none transition-colors select-none sm:text-[9px] ${
                  hasError
                    ? 'text-red-500'
                    : 'text-zinc-600 group-focus-within:text-white group-hover:text-zinc-400'
                }`}
              >
                +
              </span>

              <input
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
                className="h-14 w-11 skew-x-[8deg] bg-transparent text-center font-mono text-2xl font-black text-white outline-none sm:h-18 sm:w-14 sm:text-3xl md:h-20 md:w-16"
              />
            </div>
          );
        })}
      </div>

      <div className="min-h-6 text-center">
        {errors.otp ? (
          <p className="animate-in fade-in flex items-center justify-center gap-1.5 text-[10px] font-black tracking-widest text-red-500 uppercase">
            <span>[!]</span>
            <span>{errors.otp}</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={timer > 0}
            className={`font-bold tracking-[0.2em] uppercase transition-all ${
              timer > 0
                ? 'cursor-not-allowed font-mono text-base text-zinc-400'
                : 'text-[10px] text-white underline underline-offset-4 hover:text-zinc-300'
            }`}
          >
            {timer > 0 ? (
              <span className="inline-flex items-center gap-1.5">
                <span>00 : {timer < 10 ? `0${timer}` : timer}</span>
                <span className="font-sans text-[10px] tracking-widest text-zinc-500">
                  RESEND IN
                </span>
              </span>
            ) : (
              'Resend Code via WhatsApp'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
