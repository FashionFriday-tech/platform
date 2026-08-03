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
    <div className="animate-in fade-in w-full py-2 duration-500">
      {step !== 'PHONE' && (
        <button
          onClick={() => {
            setStep(step === 'OTP' ? 'PHONE' : 'OTP');
            setErrors({});
          }}
          className="group mb-4 flex items-center text-[10px] font-black tracking-widest text-zinc-500 uppercase transition-colors hover:text-white"
        >
          <ArrowLeftIcon
            size={14}
            className="mr-2 transition-transform group-hover:-translate-x-1"
          />
          {step === 'OTP' ? 'Change Number' : 'Back to OTP'}
        </button>
      )}

      <div className="mb-6 space-y-1.5">
        <div className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="font-mono text-[9px] font-black tracking-[0.3em] text-zinc-500 uppercase">
            {step === 'PHONE' && 'Step 01 / Phone Authorization'}
            {step === 'OTP' && 'Step 02 / OTP Verification'}
            {step === 'PROFILE' && 'Step 03 / Profile Finalization'}
          </span>
        </div>

        <h1 className="text-2xl font-black tracking-tight text-white uppercase sm:text-3xl">
          {step === 'PHONE' && 'Join the Club'}
          {step === 'OTP' && 'Confirm OTP'}
          {step === 'PROFILE' && 'Welcome'}
        </h1>
        <p className="text-xs leading-relaxed text-zinc-400">
          {step === 'PHONE' &&
            'Enter your WhatsApp number to receive an instant authentication code.'}
          {step === 'OTP' &&
            `Enter the 6-digit code sent to your WhatsApp number +91 ${phoneNumber}.`}
          {step === 'PROFILE' && 'Provide your profile details to finalize your membership.'}
        </p>
      </div>

      <form
        className="space-y-3.5"
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

        {/* Crossed Box Action Button matching Homepage */}
        <button
          type="button"
          onClick={handleNext}
          disabled={loading}
          className="group relative mt-3 flex w-full -skew-x-[12deg] items-center justify-center rounded-md border border-white bg-white py-3.5 text-xs font-black tracking-[0.25em] text-black uppercase transition-all duration-200 hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 sm:-skew-x-[14deg] sm:rounded-lg sm:py-4 sm:text-sm"
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

        {step !== 'OTP' && (
          <div className="mt-5 space-y-1 text-center">
            <p className="text-[10px] leading-relaxed tracking-widest text-zinc-600 uppercase">
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
