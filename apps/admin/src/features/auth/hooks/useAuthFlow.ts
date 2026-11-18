'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { toast } from 'sonner';

import { type Role, useAuth, type User } from '@/contexts/AuthContext';

export type AuthStep = 'PHONE' | 'OTP';

export function useAuthFlow() {
  const [step, setStep] = useState<AuthStep>('PHONE');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { login: authLogin } = useAuth();

  const [resendCount, setResendCount] = useState(1);

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
      const cleanNumber = phoneNumber.replace(/\D/g, '').slice(-10);
      if (!/^[6-9]\d{9}$/.test(cleanNumber)) {
        newErrors.phone = 'Enter a valid 10-digit phone number';
      }
    } else if (step === 'OTP') {
      const code = otp.join('');
      if (code.length < 6) {
        newErrors.otp = 'Please enter the 6-digit code';
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

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      (typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
        ? 'https://api.fashionfriday.in'
        : 'http://localhost:3002');
    const cleanNumber = phoneNumber.replace(/\D/g, '').slice(-10);

    try {
      if (step === 'PHONE') {
        const res = await fetch(`${apiUrl}/auth/admin/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: cleanNumber }),
        });

        if (!res.ok) {
          const errData = (await res.json().catch(() => ({}))) as { message?: string };
          const errorMsg = errData.message || 'Failed to send WhatsApp verification code';
          setErrors({ phone: errorMsg });
          toast.error(errorMsg);
          return;
        }

        const data = (await res.json().catch(() => ({}))) as { cooldownSeconds?: number };
        setStep('OTP');
        setResendCount(1);
        startTimer(data.cooldownSeconds || 60);
        toast.success('Verification code sent to your WhatsApp!');
      } else if (step === 'OTP') {
        const enteredOtp = otp.join('');

        const verifyRes = await fetch(`${apiUrl}/auth/admin/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: cleanNumber, otp: enteredOtp }),
        });

        if (!verifyRes.ok) {
          const errData = (await verifyRes.json().catch(() => ({}))) as { message?: string };
          const errorMsg =
            errData.message || 'Invalid verification code. Please check your WhatsApp.';
          setErrors({ otp: errorMsg });
          toast.error(errorMsg);
          return;
        }

        const authData = (await verifyRes.json().catch(() => ({}))) as {
          accessToken?: string;
          refreshToken?: string;
          user?: {
            id?: string;
            name?: string;
            email?: string;
            role?: string;
            position?: string;
            phone?: string;
            avatar?: string;
            adminMeta?: {
              position?: string;
            };
          };
        };

        if (typeof window !== 'undefined') {
          if (authData.accessToken) {
            localStorage.setItem('adminAccessToken', authData.accessToken);
            localStorage.setItem('accessToken', authData.accessToken);
          }
          if (authData.refreshToken) {
            localStorage.setItem('adminRefreshToken', authData.refreshToken);
          }
          sessionStorage.setItem('ff_admin_pin_unlocked', 'true');
          localStorage.setItem(
            'ff_admin_pin_unlocked_until',
            String(Date.now() + 180 * 24 * 60 * 60 * 1000),
          );
        }

        const authUser = authData.user;
        if (!authUser) {
          throw new Error('No user data returned from authentication service');
        }

        const candidateRole = authUser.position || authUser.adminMeta?.position || authUser.role;

        const mappedRole: Role =
          candidateRole === 'SUPER_ADMIN' ||
          candidateRole === 'PRODUCT_MANAGER' ||
          candidateRole === 'SALES_MANAGER' ||
          candidateRole === 'SALES_ADMIN'
            ? candidateRole
            : authUser.role === 'SUPER_ADMIN'
              ? 'SUPER_ADMIN'
              : 'SALES_MANAGER';

        const initials = (authUser.name || 'Admin')
          .split(' ')
          .filter(Boolean)
          .map((w: string) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

        const adminInfo: User = {
          name: authUser.name || 'Admin',
          role: mappedRole,
          initials: initials || 'AD',
          phone: `+91 ${cleanNumber}`,
          email: authUser.email,
          avatar: authUser.avatar,
        };

        authLogin(adminInfo);
        toast.success(`Welcome back, ${adminInfo.name}!`);
      }
    } catch (error: unknown) {
      console.error('Auth Error:', error);
      const err = error as Error;
      toast.error(err.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [step, phoneNumber, otp, validate, startTimer, authLogin]);

  const handleResendOTP = useCallback(async () => {
    if (timer > 0) {
      return;
    }
    setLoading(true);
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      (typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
        ? 'https://api.fashionfriday.in'
        : 'http://localhost:3002');
    const cleanNumber = phoneNumber.replace(/\D/g, '').slice(-10);

    try {
      const res = await fetch(`${apiUrl}/auth/admin/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanNumber }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to resend OTP');
      }

      const data = (await res.json().catch(() => ({}))) as { cooldownSeconds?: number };
      setOtp(['', '', '', '', '', '']);
      const nextCount = resendCount + 1;
      setResendCount(nextCount);
      const cooldown =
        data.cooldownSeconds ||
        (nextCount === 1 ? 60 : nextCount === 2 ? 300 : nextCount === 3 ? 600 : 3600);
      setTimer(cooldown);
      toast.success('Verification code resent to your WhatsApp!');
    } catch (err: unknown) {
      const e = err as Error;
      toast.error(e.message || 'Failed to resend OTP');
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

      // If user pasted or inserted multiple digits from keyboard clipboard/autofill
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

      // Single digit
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
