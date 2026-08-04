'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { toast } from 'sonner';

import { useAuth, type User } from '@/contexts/AuthContext';

export type AuthStep = 'PHONE' | 'OTP';

export const SUPER_ADMIN_PHONE = '7558969093';

// Predefined registered administrator database
const ADMIN_DATABASE: Record<string, Omit<User, 'phone'>> = {
  '7558969093': {
    name: 'Super Admin',
    role: 'SUPER_ADMIN',
    initials: 'SA',
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
          newOtp[index] = char;
        }
      }

      setOtp(newOtp);
      clearError('otp');

      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    },
    [otp, clearError],
  );

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (step === 'PHONE') {
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      let hasAccess = cleanNumber === SUPER_ADMIN_PHONE || Boolean(ADMIN_DATABASE[cleanNumber]);
      if (!hasAccess && typeof window !== 'undefined') {
        try {
          const storedInvited = localStorage.getItem('ff_admin_invited_team');
          if (storedInvited) {
            const list = JSON.parse(storedInvited) as { phone?: string }[];
            if (list.some((m) => m.phone?.replace(/\D/g, '').endsWith(cleanNumber))) {
              hasAccess = true;
            }
          }
          if (!hasAccess) {
            const teamStored = localStorage.getItem('ff_admin_team_members');
            if (teamStored) {
              const teamList = JSON.parse(teamStored) as { phone?: string }[];
              if (teamList.some((m) => m.phone?.replace(/\D/g, '').endsWith(cleanNumber))) {
                hasAccess = true;
              }
            }
          }
        } catch {
          // ignore
        }
      }

      if (!/^[6-9]\d{9}$/.test(cleanNumber)) {
        newErrors.phone = 'Enter a valid 10-digit phone number';
      } else if (!hasAccess) {
        newErrors.phone = 'This phone number is not registered as an administrator.';
      }
    } else if (step === 'OTP') {
      const code = otp.join('');
      if (code.length < 6) {
        newErrors.otp = 'Please enter the 6-digit code';
      } else if (code !== '786786' && code !== '123456') {
        newErrors.otp = 'Incorrect verification code. Use 786786.';
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
        toast.success('Mock OTP code sent successfully! Use 786786 to verify.');
      } else if (step === 'OTP') {
        const cleanNumber = phoneNumber.replace(/\D/g, '');
        let adminInfo = ADMIN_DATABASE[cleanNumber];

        if (!adminInfo) {
          // Check dynamic invited team members stored via admin panel
          try {
            const storedInvited = localStorage.getItem('ff_admin_invited_team');
            if (storedInvited) {
              const list = JSON.parse(storedInvited) as any[];
              const found = list.find((m) => m.phone?.replace(/\D/g, '').endsWith(cleanNumber));
              if (found) {
                adminInfo = {
                  name: found.name || 'Team Member',
                  role: found.role || 'SALES_MANAGER',
                  initials: found.name
                    ? found.name
                        .split(' ')
                        .map((w: string) => w[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()
                    : 'TM',
                };
              }
            }
          } catch {
            // ignore
          }
        }

        // If phone number matches current super admin phone, always assign SUPER_ADMIN
        if (!adminInfo && cleanNumber === SUPER_ADMIN_PHONE) {
          adminInfo = {
            name: 'Super Admin',
            role: 'SUPER_ADMIN',
            initials: 'SA',
          };
        }

        if (adminInfo) {
          authLogin({
            ...adminInfo,
            phone: `+91 ${cleanNumber}`,
          });
          toast.success(`Welcome back, ${adminInfo.name}!`);
        } else {
          toast.error('Registered administrator or invited team phone number not found.');
        }
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
    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 500));
      setOtp(['', '', '', '', '', '']);
      startTimer();
      toast.success('OTP code resent successfully! Use 786786.');
    } catch {
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
