'use client';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

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

  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.loading);
  const authLogin = useAuthStore((state) => state.login);

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
      router.replace('/account');
    }
  }, [user, authLoading, router]);

  const startTimer = useCallback(() => {
    setTimer(30);
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
      const pasteData = e.clipboardData.getData('text').trim();
      if (!/^\d+$/.test(pasteData)) {
        return;
      }

      const digits = pasteData.slice(0, 6).split('');
      const newOtp = [...otp];

      for (const [index, char] of digits.entries()) {
        if (index < 6) {
          newOtp[index] = char;
        }
      }

      setOtp(newOtp);
      clearError('otp');

      const nextIndex = digits.length >= 6 ? 5 : digits.length;
      inputRefs.current[nextIndex]?.focus();
    },
    [otp, clearError],
  );

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (step === 'PHONE') {
      if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
        newErrors.phone = 'Enter a valid 10-digit WhatsApp number';
      }
    } else if (step === 'OTP') {
      if (otp.join('').length < 6) {
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
        await sendOtpAction(phoneNumber);
        setStep('OTP');
        startTimer();
        toast.success('OTP sent successfully!');
      } else if (step === 'OTP') {
        const response = await verifyOtpAction(phoneNumber, otp.join(''));
        setOtpToken(response.otpToken);

        if (response.isNewUser) {
          setStep('PROFILE');
        } else {
          if (response.accessToken && response.refreshToken && response.user) {
            authLogin(response.user);
            void useCartStore.getState().syncWithServer(true);
            void useWishlistStore.getState().syncWithServer(true);
            toast.success('Login successful!');
          } else {
            toast.error('Invalid response from server');
          }
        }
      } else {
        const response = await signupAction(phoneNumber, profile.name, profile.email, otpToken);
        authLogin(response.user);
        void useCartStore.getState().syncWithServer(true);
        void useWishlistStore.getState().syncWithServer(true);
        toast.success('Welcome to Fashion Friday!');
      }
    } catch (error: unknown) {
      console.error('Auth Error:', error);
      const err = error as Error;
      const message = err.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [step, phoneNumber, otp, profile, otpToken, validate, startTimer, authLogin]);

  const handleResendOTP = useCallback(async () => {
    if (timer > 0) {
      return;
    }
    setLoading(true);
    try {
      await sendOtpAction(phoneNumber);
      setOtp(['', '', '', '', '', '']);
      startTimer();
      toast.success('OTP resent successfully!');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Failed to resend OTP';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, timer, startTimer]);

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      if (isNaN(Number(value))) {
        return;
      }
      setOtp((prev) => {
        const nextOtp = [...prev];
        nextOtp[index] = value.substring(value.length - 1);
        return nextOtp;
      });
      if (value && index < 5) {
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
