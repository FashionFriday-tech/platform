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
    <div className="animate-in fade-in w-full py-6 duration-700">
      {step !== 'PHONE' && (
        <button
          onClick={() => {
            setStep(step === 'OTP' ? 'PHONE' : 'OTP');
            setErrors({});
          }}
          className="group mb-8 flex items-center text-[10px] font-black tracking-widest text-zinc-500 uppercase transition-colors hover:text-white"
        >
          <ArrowLeftIcon
            size={14}
            className="mr-2 transition-transform group-hover:-translate-x-1"
          />
          {step === 'OTP' ? 'Change Number' : 'Back to OTP'}
        </button>
      )}

      <div className="mb-8 space-y-2">
        <div className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="font-mono text-[9px] font-black tracking-[0.3em] text-zinc-500 uppercase">
            {step === 'PHONE' && 'Step 01 / Phone Authorization'}
            {step === 'OTP' && 'Step 02 / OTP Verification'}
            {step === 'PROFILE' && 'Step 03 / Profile Finalization'}
          </span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white uppercase sm:text-4xl">
          {step === 'PHONE' && 'Join the Club'}
          {step === 'OTP' && 'Confirm OTP'}
          {step === 'PROFILE' && 'Welcome'}
        </h1>
        <p className="text-xs leading-relaxed text-zinc-400 sm:text-sm">
          {step === 'PHONE' &&
            'Enter your WhatsApp number to receive an instant authentication code.'}
          {step === 'OTP' &&
            `Enter the 6-digit code sent to your WhatsApp number +91 ${phoneNumber}.`}
          {step === 'PROFILE' && 'Provide your profile details to finalize your membership.'}
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
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

        {/* Crossed Box Action Button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={loading}
          className="group relative mt-4 flex w-full -skew-x-[8deg] items-center justify-center rounded-lg border border-white bg-white py-4.5 text-xs font-black tracking-[0.25em] text-black uppercase transition-all hover:bg-zinc-200 active:scale-[0.99] disabled:opacity-50 sm:text-sm"
        >
          {/* Corner Crosshairs */}
          <span className="pointer-events-none absolute -top-1 -left-1 font-mono text-[9px] leading-none text-zinc-400 select-none">
            +
          </span>
          <span className="pointer-events-none absolute -top-1 -right-1 font-mono text-[9px] leading-none text-zinc-400 select-none">
            +
          </span>
          <span className="pointer-events-none absolute -bottom-1 -left-1 font-mono text-[9px] leading-none text-zinc-400 select-none">
            +
          </span>
          <span className="pointer-events-none absolute -right-1 -bottom-1 font-mono text-[9px] leading-none text-zinc-400 select-none">
            +
          </span>

          <span className="flex skew-x-[8deg] items-center justify-center gap-1.5">
            <span>
              {loading ? 'Processing...' : step === 'PROFILE' ? 'Start Shopping!' : 'Continue'}
            </span>
            {!loading && (
              <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            )}
          </span>
        </button>

        {step !== 'OTP' && (
          <div className="mt-8 space-y-2 text-center">
            <p className="text-[10px] leading-loose tracking-widest text-zinc-600 uppercase">
              By continuing, you agree to our <br />
              <Link
                href="/terms"
                className="text-zinc-400 underline underline-offset-4 transition-colors hover:text-white"
              >
                Terms of Service
              </Link>
              <span className="mx-2">&</span>
              <Link
                href="/privacy"
                className="text-zinc-400 underline underline-offset-4 transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
