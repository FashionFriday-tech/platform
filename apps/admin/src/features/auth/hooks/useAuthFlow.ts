// eslint-disable-next-line unicorn/filename-case
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { toast } from 'sonner';

import { useAuth, type User } from '@/contexts/AuthContext';

export type AuthStep = 'PHONE' | 'OTP';

// Predefined registered administrator database
const ADMIN_DATABASE: Record<string, Omit<User, 'phone'>> = {
  '9999999999': {
    name: 'Jimmy Sullivan',
    role: 'SUPER_ADMIN',
    initials: 'JS',
  },
  '8888888888': {
    name: 'Sarah Chen',
    role: 'PRODUCT_MANAGER',
    initials: 'SC',
  },
  '7777777777': {
    name: 'Alex Mercer',
    role: 'SALES_MANAGER',
    initials: 'AM',
  },
};

export function useAuthFlow() {
  const [step, setStep] = useState<AuthStep>('PHONE');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { login: authLogin } = useAuth();

  // Handle countdown interval
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
          // eslint-disable-next-line security/detect-object-injection
          newOtp[index] = char;
        }
      }

      setOtp(newOtp);
      clearError('otp');

      const nextIndex = Math.min(digits.length, 5);
      // eslint-disable-next-line security/detect-object-injection
      inputRefs.current[nextIndex]?.focus();
    },
    [otp, clearError],
  );

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (step === 'PHONE') {
      if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
        newErrors.phone = 'Enter a valid 10-digit phone number';
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, security/detect-object-injection
      } else if (!ADMIN_DATABASE[phoneNumber]) {
        newErrors.phone = 'This phone number is not registered as an administrator.';
      }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (step === 'OTP') {
      const code = otp.join('');
      if (code.length < 6) {
        newErrors.otp = 'Please enter the 6-digit code';
      } else if (code !== '123456') {
        newErrors.otp = 'Incorrect verification code. Use 123456.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [step, phoneNumber, otp]);

  const handleNext = useCallback(async () => {
    if (!validate()) {
      return;
    }
    setLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      if (step === 'PHONE') {
        setStep('OTP');
        startTimer();
        toast.success('Mock OTP code sent successfully! Use 123456 to verify.');
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      } else if (step === 'OTP') {
        // eslint-disable-next-line security/detect-object-injection
        const adminInfo = ADMIN_DATABASE[phoneNumber];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (adminInfo) {
          authLogin({
            ...adminInfo,
            phone: `+91 ${phoneNumber}`,
          });
          toast.success(`Welcome back, ${adminInfo.name}!`);
        } else {
          toast.error('Registered administrator not found.');
        }
      }
    } catch (error: unknown) {
      console.error('Auth Error:', error);
      const err = error as Error;
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, phoneNumber, otp, validate, startTimer, authLogin]);

  const handleResendOTP = useCallback(async () => {
    if (timer > 0) {
      return;
    }
    setLoading(true);
    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 500));
      setOtp(['', '', '', '', '', '']);
      startTimer();
      toast.success('OTP code resent successfully! Use 123456.');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  }, [timer, startTimer]);

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      if (isNaN(Number(value))) {
        return;
      }
      setOtp((prev) => {
        const nextOtp = [...prev];
        // eslint-disable-next-line security/detect-object-injection
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
