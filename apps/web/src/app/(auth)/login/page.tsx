'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRightIcon, ArrowLeftIcon, VerifiedUserIcon } from '@ff/ui';
import Link from 'next/link';

export default function AuthPage() {
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'PROFILE'>('PHONE');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [profile, setProfile] = useState({ fullName: '', email: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const startTimer = () => setTimer(30);

  // --- NEW: PASTE LOGIC ---
  const handlePaste = (e: React.ClipboardEvent) => {
    const pasteData = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(pasteData)) {
      return;
    }

    const digits = pasteData.slice(0, 4).split('');
    const newOtp = [...otp];

    digits.forEach((char, index) => {
      if (index < 4) {
        newOtp[index] = char;
      }
    });

    setOtp(newOtp);
    clearError('otp');

    // Focus the last filled input or the 4th input
    const nextIndex = digits.length >= 4 ? 3 : digits.length;
    inputRefs.current[nextIndex]?.focus();
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (step === 'PHONE') {
      if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
        newErrors.phone = 'Enter a valid 10-digit WhatsApp number';
      }
    } else if (step === 'OTP') {
      if (otp.join('').length < 4) {
        newErrors.otp = 'Please enter the 4-digit code';
      }
    } else if (step === 'PROFILE') {
      if (!profile.fullName.trim()) {
        newErrors.name = 'Full name is required';
      } else if (!/^[a-zA-Z\s]+$/.test(profile.fullName)) {
        newErrors.name = 'Only letters are allowed.';
      } else if (profile.fullName.length > 25) {
        newErrors.name = 'Name cannot exceed 25 characters';
      } else if (profile.fullName.length < 4) {
        newErrors.name = 'Name is too short';
      }

      const emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9+_.-]+)@([A-Z0-9.-]+\.[A-Z]{2,})$/i;
      if (!profile.email) {
        newErrors.email = 'Email address is required';
      } else if (!emailRegex.test(profile.email)) {
        newErrors.email = 'Please enter a valid email format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) {
      return;
    }
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (step === 'PHONE') {
        setStep('OTP');
        startTimer();
      } else if (step === 'OTP') {
        setStep('PROFILE');
      } else {
        router.push('/');
      }
    }, 1000);
  };

  const handleResendOTP = () => {
    if (timer > 0) {
      return;
    }
    setOtp(['', '', '', '']);
    startTimer();
  };

  const clearError = (key: string) => {
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) {
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    clearError('otp');
  };

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

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {step === 'PHONE' && (
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
                  errors.phone
                    ? 'animate-shake border-red-500'
                    : 'border-zinc-800 focus:border-white'
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
        )}

        {step === 'OTP' && (
          <div className="mb-10 space-y-6">
            <div className="flex justify-center gap-4">
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
                  onPaste={index === 0 ? handlePaste : undefined} // Listen for paste on the first box
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !otp[index] && index > 0) {
                      inputRefs.current[index - 1]?.focus();
                    }
                  }}
                  className={`h-16 w-16 rounded-full border-2 bg-transparent text-center text-2xl font-black text-white transition-all outline-none ${
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
        )}

        {step === 'PROFILE' && (
          <div className="space-y-2">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Full Name"
                value={profile.fullName}
                onChange={(e) => {
                  setProfile({ ...profile, fullName: e.target.value });
                  clearError('name');
                }}
                className={`w-full rounded-full border-2 bg-transparent px-8 py-4 text-white transition-all outline-none ${
                  errors.name ? 'border-red-500' : 'border-zinc-800 focus:border-white'
                }`}
              />
              <div className="px-8">
                {errors.name && (
                  <p className="text-[10px] font-bold tracking-widest text-red-500 uppercase">
                    {errors.name}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="email"
                placeholder="Email Address"
                value={profile.email}
                onChange={(e) => {
                  setProfile({ ...profile, email: e.target.value });
                  clearError('email');
                }}
                className={`w-full rounded-full border-2 bg-transparent px-8 py-4 text-white transition-all outline-none ${
                  errors.email ? 'border-red-500' : 'border-zinc-800 focus:border-white'
                }`}
              />
              <div className="px-8">
                {errors.email && (
                  <p className="text-[10px] font-bold tracking-widest text-red-500 uppercase">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="pointer-events-none mb-10 flex gap-2 opacity-80">
              <div className="flex items-center justify-center rounded-full border-2 border-zinc-800 bg-zinc-900 px-4 text-sm font-bold text-white">
                +91
              </div>
              <div className="flex w-full items-center justify-between rounded-full border-2 border-zinc-800 px-8 py-4 text-white">
                {phoneNumber} <VerifiedUserIcon className="text-xl text-green-400" />
              </div>
            </div>
          </div>
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
