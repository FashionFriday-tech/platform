'use client';

import React from 'react';
import Link from 'next/link';

import { ArrowLeftIcon, ChevronRightIcon } from '@ff/ui';

import { useAuthFlow } from '../hooks/use-auth-flow';
import { OtpStep } from './otp-step';
import { PhoneStep } from './phone-step';
import { ProfileSetupStep } from './profile-setup-step';

export function AuthPage() {
  const {
    step,
    setStep,
    phoneNumber,
    setPhoneNumber,
    otp,
    profile,
    setProfile,
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
    <div className="animate-in fade-in flex w-full flex-col justify-center px-1 py-2 duration-500 select-none sm:px-2">
      {/* 1. Back Navigation Bar */}
      <div className="mb-2 flex h-6 items-center">
        {step !== 'PHONE' ? (
          <button
            type="button"
            onClick={() => {
              setStep(step === 'OTP' ? 'PHONE' : 'OTP');
              setErrors({});
            }}
            className="group flex items-center text-[10px] font-black tracking-widest text-zinc-500 uppercase transition-colors hover:text-white"
          >
            <ArrowLeftIcon
              size={14}
              className="mr-2 transition-transform group-hover:-translate-x-1"
            />
            {step === 'OTP' ? 'Change Number' : 'Back to OTP'}
          </button>
        ) : (
          <div className="h-6" aria-hidden="true" />
        )}
      </div>

      {/* 2. Header Slot with Hype Streetwear Copy */}
      <div className="mb-6 space-y-1.5">
        <div className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="font-mono text-[9px] font-black tracking-[0.3em] text-zinc-500 uppercase">
            {step === 'PHONE' && 'Step 01 // VIP Drop Access'}
            {step === 'OTP' && 'Step 02 // Pass Verification'}
            {step === 'PROFILE' && 'Step 03 // VIP Setup'}
          </span>
        </div>

        <h1 className="text-2xl font-black tracking-tight text-white uppercase sm:text-3xl">
          {step === 'PHONE' && 'Get on the Guestlist'}
          {step === 'OTP' && 'Confirm Your Pass'}
          {step === 'PROFILE' && 'Welcome to the Vault'}
        </h1>
        <p className="text-xs leading-relaxed text-zinc-400">
          {step === 'PHONE' &&
            'Drop access starts here. Enter your WhatsApp number to unlock secret Friday drops, member pricing & instant order tracking.'}
          {step === 'OTP' &&
            `Enter the 6-digit access code sent to your WhatsApp number +91 ${phoneNumber}.`}
          {step === 'PROFILE' &&
            'Finalize your profile details to unlock your bespoke sizing, rewards & member privileges.'}
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* 3. Step Container (Centered, unclipped crossed design) */}
        <div className="flex min-h-[120px] flex-col justify-center">
          {step === 'PHONE' && (
            <PhoneStep
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              errors={errors}
              clearError={clearError}
            />
          )}

          {step === 'OTP' && (
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

          {step === 'PROFILE' && (
            <ProfileSetupStep
              profile={profile}
              setProfile={setProfile}
              errors={errors}
              clearError={clearError}
              phoneNumber={phoneNumber}
            />
          )}
        </div>

        {/* 4. Crossed Box Action Button matching Homepage (Unclipped padding) */}
        <div className="px-1.5">
          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="group relative flex w-full -skew-x-[12deg] items-center justify-center rounded-md border border-white bg-white py-3.5 text-xs font-black tracking-[0.25em] text-black uppercase shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-200 hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 sm:-skew-x-[14deg] sm:rounded-lg sm:py-4 sm:text-sm"
          >
            <span className="flex skew-x-[12deg] items-center justify-center gap-1.5 sm:skew-x-[14deg]">
              <span>
                {loading ? 'Processing...' : step === 'PROFILE' ? 'Start Shopping!' : 'Continue'}
              </span>
              {!loading && (
                <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              )}
            </span>
          </button>
        </div>

        {/* 5. Legal Terms Footer */}
        <div className="mt-5 text-center">
          <p className="text-[10px] leading-relaxed tracking-widest text-zinc-600 uppercase">
            By continuing, you agree to our <br />
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 underline underline-offset-4 transition-colors hover:text-white"
            >
              Terms of Service
            </Link>
            <span className="mx-2">&</span>
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 underline underline-offset-4 transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
