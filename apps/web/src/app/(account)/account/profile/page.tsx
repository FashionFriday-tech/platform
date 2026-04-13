'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  CameraIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  CloseIcon,
  GiftIcon,
  LoaderIcon,
  MapPinIcon,
  SaveIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon,
} from '@ff/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/lib/api-client';

// --- Types ---

interface ProfileSectionProps {
  title: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
  badge?: React.ReactNode;
}

interface ModernInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  actionLabel?: string;
  onAction?: () => Promise<void> | void;
  isLoading?: boolean;
  isVerified?: boolean;
  icon?: React.ReactNode;
}

// --- Sub-Components ---

const ProfileSection = ({ title, icon: Icon, children, badge }: ProfileSectionProps) => (
  <section className="bg-background-elevated border-border overflow-hidden rounded-4xl border shadow-sm">
    <div className="bg-background-muted border-border flex items-center justify-between gap-2 border-b px-6 py-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={18} className="text-foreground" />}
        <h3 className="text-foreground font-bold">{title}</h3>
      </div>
      {badge && (
        <div className="text-foreground border-foreground/20 flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium">
          {badge}
        </div>
      )}
    </div>
    <div className="p-6">{children}</div>
  </section>
);

export default function EcommerceProfile() {
  const { user, loading, updateProfile, refreshUser } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [completion] = useState(75);
  const [verifyingField, setVerifyingField] = useState<string | null>(null);
  const [verifiedStatus, setVerifiedStatus] = useState({
    phone: true,
    email: false,
  });

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpError, setOtpError] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dob: '',
    anniversary: '',
    gender: 'Male',
    stylePreference: ['Streetwear'],
    avatarUrl: '/images/placeholders/user.png',
    loyaltyPoints: 0,
  });

  // Calculate completion percentage
  const calculateCompletion = () => {
    const fields = [formData.name, formData.phone, formData.email, formData.dob, formData.avatarUrl];
    const filled = fields.filter((f) => !!f).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completionPercent = calculateCompletion();

  // Effect to sync user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        dob: '',
        anniversary: '',
        gender: 'Male',
        stylePreference: ['Streetwear'],
        avatarUrl: user.avatarUrl || '/images/placeholders/user.png',
        loyaltyPoints: user.loyaltyPoints || 0,
      });
      setVerifiedStatus({
        phone: user.isPhoneVerified ?? !!user.phone,
        email: user.isEmailVerified ?? false,
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderIcon className="animate-spin text-brand" size={40} />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleVerifyField = async (field: 'phone' | 'email') => {
    if (field === 'phone') {
      setVerifyingField(field);
      await new Promise((r) => setTimeout(r, 2000));
      setVerifiedStatus((p) => ({ ...p, [field]: true }));
      setVerifyingField(null);
      return;
    }

    if (field === 'email') {
      try {
        setVerifyingField(field);
        
        // Send OTP
        await authApi.sendEmailOtp();
        toast.info('OTP securely generated. Please check server console.');
        
        setShowOtpModal(true);
      } catch (error: any) {
        console.error('Email verification error:', error);
        toast.error(error.response?.data?.message || 'Failed to send OTP');
      } finally {
        setVerifyingField(null);
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasteData = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(pasteData)) return;

    const digits = pasteData.slice(0, 6).split('');
    const newOtp = [...otp];

    for (const [index, char] of digits.entries()) {
      if (index < 6) newOtp[index] = char;
    }

    setOtp(newOtp);
    setOtpError('');

    const nextIndex = digits.length >= 6 ? 5 : digits.length;
    otpInputRefs.current[nextIndex]?.focus();
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
    setOtpError('');
  };

  const submitOtpVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length < 6) {
      setOtpError('Please enter the 6-digit OTP');
      return;
    }

    try {
      setIsVerifyingOtp(true);
      await authApi.verifyEmailOtp(otpString);
      toast.success('Email verified successfully!');

      setVerifiedStatus((p) => ({ ...p, email: true }));
      await refreshUser();
      
      setShowOtpModal(false);
      setOtp(['', '', '', '', '', '']);
    } catch (error: any) {
      setOtpError(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen pb-10 transition-colors lg:pt-20">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* LEFT SIDEBAR */}
          <aside className="space-y-6 md:col-span-4">
            <div className="bg-background-elevated border-border relative overflow-hidden rounded-4xl border p-6 text-center shadow-sm">
              <div className="from-background-muted absolute top-0 left-0 z-0 h-24 w-full bg-linear-to-b to-transparent" />

              <div className="relative z-10">
                <button
                  type="button"
                  className="border-brand group relative mx-auto h-28 w-28 cursor-pointer rounded-full border-2 border-dashed p-1"
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-full">
                    <Image
                      src={formData.avatarUrl}
                      alt="Profile"
                      width={112}
                      height={112}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <CameraIcon className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="bg-brand text-brand-foreground border-background absolute right-0 bottom-0 rounded-full border-2 p-1.5">
                    <CameraIcon size={14} />
                  </div>
                </button>

                <h2 className="mt-4 text-lg font-bold">{formData.name}</h2>
                <p className="text-foreground-muted mb-4 text-xs font-bold tracking-widest uppercase">
                  {formData.loyaltyPoints} Loyalty Points
                </p>

                <div className="bg-background-muted rounded-4xl p-4 text-left">
                  <div className="mb-2 flex items-end justify-between">
                    <span className="text-xs font-bold tracking-tighter uppercase">
                      Profile Strength
                    </span>
                    <span className="text-sm font-bold">{completionPercent}%</span>
                  </div>
                  <div className="bg-border h-1.5 w-full rounded-full">
                    <div
                      className="bg-brand h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                </div>

                <Link href="/profile/addresses" className="group mt-4 block">
                  <div className="border-border bg-background hover:border-brand flex items-center justify-between rounded-3xl border p-3 px-4 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-background-muted group-hover:bg-brand group-hover:text-brand-foreground rounded-full p-2.5 transition-colors">
                        <MapPinIcon size={18} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-bold">My Addresses</h4>
                        <p className="text-foreground-subtle text-[10px]">
                          Manage delivery locations
                        </p>
                      </div>
                    </div>
                    <ChevronRightIcon
                      size={16}
                      className="text-foreground-subtle group-hover:text-brand"
                    />
                  </div>
                </Link>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={() => {
                  /* logic */
                }}
              />
            </div>
          </aside>

          {/* MAIN FORM */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsSaving(true);
              try {
                await updateProfile(formData);
                toast.success('Profile updated successfully');
              } catch (error) {
                console.error('Update error:', error);
                toast.error('Failed to update profile');
              } finally {
                setIsSaving(false);
              }
            }}
            className="space-y-6 md:col-span-8"
          >
            <ProfileSection
              title="Identity Details"
              icon={UserIcon}
              badge={
                <>
                  <ShieldCheckIcon size={14} /> Secure
                </>
              }
            >
              <div className="grid grid-cols-1 gap-6">
                <ModernInput
                  label="Full Name"
                  value={formData.name}
                  onChange={(v) => {
                    setFormData({ ...formData, name: v });
                  }}
                />
                <ModernInput
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(v) => {
                    setFormData({ ...formData, phone: v });
                  }}
                  actionLabel="Verify"
                  onAction={async () => {
                    await handleVerifyField('phone');
                  }}
                  isLoading={verifyingField === 'phone'}
                  isVerified={verifiedStatus.phone}
                />
                <ModernInput
                  label="Email Address"
                  value={formData.email}
                  onChange={(v) => {
                    setFormData({ ...formData, email: v });
                  }}
                  actionLabel="Verify"
                  onAction={async () => {
                    await handleVerifyField('email');
                  }}
                  isLoading={verifyingField === 'email'}
                  isVerified={verifiedStatus.email}
                />
              </div>
            </ProfileSection>

            <ProfileSection
              title="Personalize Your Feed"
              icon={SparklesIcon}
              badge="Recommendations"
            >
              <div className="space-y-6">
                <div>
                  <label className="text-foreground-subtle mb-3 block text-xs font-bold tracking-wider uppercase">
                    I shop for
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Male', 'Female', 'Other'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, gender: g });
                        }}
                        className={`rounded-4xl border py-3 text-sm font-medium transition-all ${
                          formData.gender === g
                            ? 'bg-brand text-brand-foreground border-brand scale-[1.02]'
                            : 'bg-background border-border text-foreground-muted hover:border-foreground-subtle'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-foreground-subtle mb-3 block text-xs font-bold tracking-wider uppercase">
                    My Style Vibe
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Casual', 'Formal', 'Streetwear', 'Minimalist', 'Vintage'].map((style) => {
                      const isSelected = formData.stylePreference.includes(style);
                      return (
                        <button
                          key={style}
                          type="button"
                          onClick={() => {
                            const newStyles = isSelected
                              ? formData.stylePreference.filter((s) => s !== style)
                              : [...formData.stylePreference, style];
                            setFormData({ ...formData, stylePreference: newStyles });
                          }}
                          className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-all ${
                            isSelected
                              ? 'bg-brand text-brand-foreground border-brand'
                              : 'text-foreground-muted border-border hover:border-brand'
                          }`}
                        >
                          {style}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <ModernInput
                    label="Date of Birth"
                    type="date"
                    value={formData.dob}
                    onChange={(v) => {
                      setFormData({ ...formData, dob: v });
                    }}
                    icon={<GiftIcon size={16} />}
                  />
                  <ModernInput
                    label="Anniversary"
                    type="date"
                    value={formData.anniversary}
                    onChange={(v) => {
                      setFormData({ ...formData, anniversary: v });
                    }}
                  />
                </div>
              </div>
            </ProfileSection>

            <div className="sticky bottom-16 z-20 flex w-full items-center justify-center pt-4 md:bottom-4">
              <div className="bg-foreground flex gap-3 rounded-4xl p-2 shadow-xl backdrop-blur-xl">
                <button
                  type="button"
                  className="text-background hover:bg-background rounded-4xl px-6 py-3 font-medium transition-colors"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-background text-foreground flex items-center gap-2 rounded-4xl px-8 py-3 font-semibold transition-all hover:opacity-90"
                >
                  {isSaving ? (
                    <LoaderIcon className="animate-spin" size={18} />
                  ) : (
                    <>
                      <SaveIcon size={18} /> Save All
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <AnimatePresence>
        {showOtpModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOtpModal(false)}
              className="bg-background/80 fixed inset-0 z-[100] backdrop-blur-xl"
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-background border-border fixed bottom-0 left-0 z-[110] w-full max-w-xl rounded-t-[3.5rem] border-t p-10 shadow-2xl lg:top-1/2 lg:left-1/2 lg:bottom-auto lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-[3rem] lg:border lg:p-12"
            >
              <div className="mb-8 flex items-start justify-between">
                <div className="bg-brand/10 text-brand rounded-3xl p-4">
                  <ShieldCheckIcon size={32} />
                </div>
                <button
                  onClick={() => setShowOtpModal(false)}
                  className="hover:bg-background-muted rounded-full p-2 transition-colors"
                >
                  <CloseIcon size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <h3 className="text-3xl font-black tracking-tighter uppercase italic">
                  Verify Email
                </h3>
                <p className="text-foreground-subtle text-[10px] leading-loose font-bold tracking-widest uppercase">
                  Please enter the 6-digit verification code sent to your email.
                </p>

                <div className="flex justify-center gap-2 sm:gap-4 py-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      ref={(el) => {
                        otpInputRefs.current[index] = el;
                      }}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[index] && index > 0) {
                          otpInputRefs.current[index - 1]?.focus();
                        }
                      }}
                      className={`h-11 w-11 text-xl sm:h-16 sm:w-16 sm:text-2xl rounded-full border-2 bg-transparent text-center font-bold text-foreground transition-all outline-none ${
                        otpError ? 'border-red-500' : 'border-border focus:border-brand'
                      }`}
                    />
                  ))}
                </div>

                <div className="h-4 text-center">
                  {otpError && (
                    <p className="animate-in fade-in text-[10px] font-bold tracking-widest text-red-500 uppercase">
                      {otpError}
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-4">
                  <button
                    onClick={submitOtpVerify}
                    disabled={isVerifyingOtp}
                    className="bg-brand text-brand-foreground w-full rounded-full py-5 text-[10px] font-black tracking-widest uppercase shadow-2xl transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isVerifyingOtp ? 'Verifying...' : 'Confirm OTP'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const ModernInput = ({
  label,
  value,
  onChange,
  type = 'text',
  actionLabel,
  onAction,
  isLoading,
  isVerified,
}: ModernInputProps) => (
  <div className="w-full space-y-1.5">
    <div className="flex justify-between">
      <label className="text-foreground-subtle text-xs font-bold tracking-wider uppercase">
        {label}
      </label>
      {isVerified && (
        <span className="text-brand flex items-center gap-1 text-[10px] font-bold">
          <CheckCircleIcon size={12} /> VERIFIED
        </span>
      )}
    </div>
    <div className="group relative">
      <input
        type={type}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        disabled={isVerified}
        className={`bg-background border-border text-foreground focus:ring-ring focus:border-brand w-full rounded-4xl border py-3.5 pl-4 text-sm transition-all outline-none focus:ring-1 ${actionLabel ? 'pr-28' : 'pr-4'} ${
          isVerified ? 'border-brand opacity-80' : ''
        }`}
      />
      {onAction && !isVerified && (
        <button
          type="button"
          onClick={() => {
            void onAction();
          }}
          disabled={isLoading ?? !value}
          className="bg-brand text-brand-foreground absolute top-1.5 right-1.5 bottom-1.5 min-w-20 rounded-3xl px-4 text-xs font-bold transition-all hover:opacity-90 disabled:opacity-30"
        >
          {isLoading ? <LoaderIcon className="animate-spin" size={14} /> : actionLabel}
        </button>
      )}
      {isVerified && (
        <CheckCircleIcon
          size={20}
          className="text-brand absolute top-1/2 right-4 -translate-y-1/2"
        />
      )}
    </div>
  </div>
);
