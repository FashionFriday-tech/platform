'use client';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { toast } from 'sonner';

import {
  sendOtpAction,
  signupAction,
  verifyOtpAction,
} from '@/features/auth/services/auth.actions';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';

export type AuthStep = 'PHONE' | 'OTP' | 'PROFILE';

export function useAuthFlow() {
  const [step, setStep] = useState<AuthStep>('PHONE');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [otpToken, setOtpToken] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/account';

  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.loading);
  const authLogin = useAuthStore((state) => state.login);

  const [resendCount, setResendCount] = useState(1);

  // Timer interval countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  // Handle automatic redirect if logged in
  useEffect(() => {
    if (user && !authLoading) {
      console.log('[AuthFlow] User already logged in, redirecting to:', redirectUrl);
      router.replace(redirectUrl);
    }
  }, [user, authLoading, router, redirectUrl]);

  const startTimer = useCallback((customSeconds?: number) => {
    if (typeof customSeconds === 'number' && customSeconds > 0) {
      setTimer(customSeconds);
      return;
    }
    setTimer(60);
  }, []);

  const clearError = useCallback((key: string) => {
    setErrors((prev) => {
      if (Object.prototype.hasOwnProperty.call(prev, key)) {
        const { [key]: _, ...next } = prev;
        return next;
      }
      return prev;
    });
  }, []);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
      if (!pasteData) {
        return;
      }

      const digits = pasteData.split('');
      setOtp((prev) => {
        const nextOtp = [...prev];
        for (let i = 0; i < 6; i++) {
          nextOtp[i] = i < digits.length ? digits[i] : '';
        }
        return nextOtp;
      });
      clearError('otp');

      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    },
    [clearError],
  );

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (step === 'PHONE') {
      if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
        newErrors.phone = 'Enter a valid 10-digit WhatsApp number';
      }
    } else if (step === 'OTP') {
      const code = otp.join('');
      if (code.length < 6) {
        newErrors.otp = 'Please enter the 6-digit code';
      }
    } else {
      if (!profile.name.trim()) {
        newErrors.name = 'Full name is required';
      } else if (!/^[\sA-Za-z]+$/.test(profile.name)) {
        newErrors.name = 'Only letters are allowed.';
      } else if (profile.name.length > 25) {
        newErrors.name = 'Name cannot exceed 25 characters';
      } else if (profile.name.length < 4) {
        newErrors.name = 'Name is too short';
      }

      const emailRegex = /^(?!\.)(?!.*\.\.)([\w+.-]+)@([\d.a-z-]+\.[a-z]{2,})$/i;
      if (!profile.email) {
        newErrors.email = 'Email address is required';
      } else if (!emailRegex.test(profile.email)) {
        newErrors.email = 'Please enter a valid email format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [step, phoneNumber, otp, profile]);

  const handleNext = useCallback(async () => {
    if (!validate()) {
      return;
    }
    setLoading(true);

    try {
      if (step === 'PHONE') {
        const res = await sendOtpAction(phoneNumber);
        setStep('OTP');
        setResendCount(1);
        startTimer(res.cooldownSeconds || 60);
        toast.success('Verification code sent to your WhatsApp!');
      } else if (step === 'OTP') {
        const response = await verifyOtpAction(phoneNumber, otp.join(''));
        setOtpToken(response.otpToken);

        if (response.isNewUser) {
          setStep('PROFILE');
        } else {
          if (response.accessToken && response.refreshToken && response.user) {
            console.log('[AuthFlow] Login successful, saving tokens...');
            if (typeof window !== 'undefined') {
              localStorage.setItem('accessToken', response.accessToken);
              localStorage.setItem('refreshToken', response.refreshToken);
            }
            authLogin(response.user);
            void useCartStore.getState().syncWithServer(true);
            void useWishlistStore.getState().syncWithServer(true);
            toast.success('Login successful!');
            router.replace(redirectUrl);
          } else {
            toast.error('Invalid response from server');
          }
        }
      } else {
        const response = await signupAction(phoneNumber, profile.name, profile.email, otpToken);
        console.log('[AuthFlow] Signup successful, saving tokens...');
        if (response.accessToken && response.refreshToken) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
          }
        }
        authLogin(response.user);
        void useCartStore.getState().syncWithServer(true);
        void useWishlistStore.getState().syncWithServer(true);
        toast.success('Welcome to Fashion Friday!');
        router.replace(redirectUrl);
      }
    } catch (error: unknown) {
      console.error('[AuthFlow] Auth Error:', error);
      const err = error as Error;
      const message = err.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [
    step,
    phoneNumber,
    otp,
    profile,
    otpToken,
    validate,
    startTimer,
    authLogin,
    router,
    redirectUrl,
  ]);

  const handleResendOTP = useCallback(async () => {
    if (timer > 0) {
      return;
    }
    setLoading(true);
    try {
      const res = await sendOtpAction(phoneNumber);
      setOtp(['', '', '', '', '', '']);
      const nextCount = resendCount + 1;
      setResendCount(nextCount);
      const cooldown =
        res.cooldownSeconds ||
        (nextCount === 1 ? 60 : nextCount === 2 ? 300 : nextCount === 3 ? 600 : 3600);
      setTimer(cooldown);
      toast.success('Verification code resent to your WhatsApp!');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message =
        err.response?.data?.message || (error instanceof Error ? error.message : 'Failed to resend OTP');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, timer, resendCount]);

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      const cleanValue = value.replace(/\D/g, '');
      if (!cleanValue) {
        setOtp((prev) => {
          const nextOtp = [...prev];
          nextOtp[index] = '';
          return nextOtp;
        });
        return;
      }

      // If user pasted or inserted multiple digits from keyboard clipboard/autofill (e.g. "123456")
      if (cleanValue.length > 1) {
        const digits = cleanValue.slice(0, 6).split('');
        setOtp((prev) => {
          const nextOtp = [...prev];
          for (let i = 0; i < 6; i++) {
            nextOtp[i] = i < digits.length ? digits[i] : '';
          }
          return nextOtp;
        });
        clearError('otp');
        const nextIndex = Math.min(digits.length, 5);
        inputRefs.current[nextIndex]?.focus();
        return;
      }

      // Single digit input
      setOtp((prev) => {
        const nextOtp = [...prev];
        nextOtp[index] = cleanValue;
        return nextOtp;
      });
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
      clearError('otp');
    },
    [clearError],
  );

  return {
    step,
    setStep,
    phoneNumber,
    setPhoneNumber,
    otp,
    setOtp,
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
  };
}
