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
    <div className="animate-in fade-in w-full duration-700">
      {step !== 'PHONE' && (
        <button
          onClick={() => {
            setStep(step === 'OTP' ? 'PHONE' : 'OTP');
            setErrors({});
          }}
          className="mb-8 flex items-center text-[10px] font-bold tracking-widest text-zinc-500 uppercase transition-colors hover:text-white"
        >
          <ArrowLeftIcon size={14} className="mr-2" />
          {step === 'OTP' ? 'Change Number' : 'Back to OTP'}
        </button>
      )}

      <div className="mb-10 space-y-3">
        <h1 className="text-4xl font-black tracking-tight text-white uppercase">
          {step === 'PHONE' && 'Join the Club'}
          {step === 'OTP' && 'Confirm OTP'}
          {step === 'PROFILE' && 'Welcome'}
        </h1>
        <p className="text-sm leading-relaxed text-zinc-400">
          {step === 'PHONE' && 'Enter your WhatsApp to receive a login code.'}
          {step === 'OTP' && `Enter the secure code sent to your WhatsApp No +91 ${phoneNumber}.`}
          {step === 'PROFILE' && 'Please provide your details to finalize your account.'}
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

        <button
          onClick={handleNext}
          disabled={loading}
          className="group mt-2 flex w-full items-center justify-center rounded-full bg-white py-5 text-sm font-black tracking-widest text-black uppercase transition-all hover:bg-zinc-200 disabled:opacity-50"
        >
          {loading ? 'Processing...' : step === 'PROFILE' ? 'Start Shopping!' : 'Continue'}
          {!loading && (
            <ChevronRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          )}
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
