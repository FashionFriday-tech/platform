'use client';

import React from 'react';
import Image from 'next/image';

import { ArrowLeftIcon, ChevronRightIcon } from '@ff/ui';

import { useAuthFlow } from '../hooks/useAuthFlow';
import { OtpStep } from './OtpStep';
import { PhoneStep } from './PhoneStep';

export function LoginPage() {
  const {
    step,
    setStep,
    phoneNumber,
    setPhoneNumber,
    otp,
    errors,
    setErrors,
    loading,
    timer,
    inputRefs,
    handlePaste,
    handleNext,
    handleResendOTP,
    handleOtpChange,
    clearError,
  } = useAuthFlow();

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center overflow-y-auto bg-black p-6 text-white selection:bg-white selection:text-black">
      <div className="animate-in fade-in w-full max-w-md duration-500">
        {/* Logo and Brand Header */}
        <div className="pointer-events-none mb-10 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden">
            <Image
              src="/images/logos/ff-logo.png"
              alt="Fashion Friday Logo"
              width={25}
              height={25}
              className="invert"
            />
          </div>
          <span className="text-xs font-black tracking-[0.25em] text-zinc-400 uppercase">
            Fashion Friday Admin
          </span>
        </div>

        {/* Back Button */}
        {step !== 'PHONE' && (
          <button
            onClick={() => {
              setStep('PHONE');
              setErrors({});
            }}
            disabled={loading}
            className="mb-8 flex items-center text-[10px] font-bold tracking-widest text-zinc-500 uppercase transition-colors hover:text-white disabled:opacity-50"
          >
            <ArrowLeftIcon className="mr-2 h-3.5 w-3.5" />
            Change Number
          </button>
        )}

        {/* Dynamic Titles */}
        <div className="pointer-events-none mb-10 space-y-3">
          <h1 className="text-4xl font-black tracking-tight text-white uppercase">
            {step === 'PHONE' ? 'Admin Portal' : 'Confirm OTP'}
          </h1>
          <p className="text-sm leading-relaxed text-zinc-400">
            {step === 'PHONE'
              ? 'Enter your registered WhatsApp number to verify security access.'
              : `Enter the secure code sent to your WhatsApp No +91 ${phoneNumber.replace(/(\d{5})(\d{5})/, '$1 $2')}.`}
          </p>
        </div>

        {/* Form Container */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            handleNext();
          }}
          className="space-y-6"
        >
          {step === 'PHONE' ? (
            <PhoneStep
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              errors={errors}
              clearError={clearError}
            />
          ) : (
            <OtpStep
              otp={otp}
              errors={errors}
              timer={timer}
              inputRefs={inputRefs}
              handlePaste={handlePaste}
              handleOtpChange={handleOtpChange}
              handleResendOTP={handleResendOTP}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center rounded-full bg-white py-5 text-sm font-black tracking-widest text-black uppercase transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50"
          >
            <span>
              {loading ? 'Processing...' : step === 'PHONE' ? 'Continue' : 'Verify & Enter'}
            </span>
            {!loading && (
              <ChevronRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            )}
          </button>
        </form>

        {/* Footer Security Sign */}
        <div className="pointer-events-none mt-12 text-zinc-600">
          <p className="text-[10px] font-semibold tracking-widest uppercase">
            🔒 Connection is encrypted. Access restricted.
          </p>
        </div>
      </div>
    </div>
  );
}
