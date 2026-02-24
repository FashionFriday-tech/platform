'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  CameraIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  GiftIcon,
  LoaderIcon,
  MapPinIcon,
  SaveIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon,
} from '@ff/ui';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading] = useState(false);
  const [completion] = useState(75);
  const [verifyingField, setVerifyingField] = useState<string | null>(null);
  const [verifiedStatus, setVerifiedStatus] = useState({
    phone: false,
    email: false,
  });

  const [formData, setFormData] = useState({
    name: 'Ajmal',
    phone: '7558969093',
    email: 'ajmal@gmail.com',
    dob: '',
    anniversary: '',
    gender: 'Male',
    stylePreference: ['Streetwear'],
    avatarUrl: '/images/model/aj.png',
  });

  const handleVerifyField = async (field: 'phone' | 'email') => {
    setVerifyingField(field);
    await new Promise((r) => setTimeout(r, 2000));
    setVerifiedStatus((p) => ({ ...p, [field]: true }));
    setVerifyingField(null);
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
                <p className="text-foreground-muted mb-4 text-sm">Gold Member</p>

                <div className="bg-background-muted rounded-4xl p-4 text-left">
                  <div className="mb-2 flex items-end justify-between">
                    <span className="text-xs font-bold tracking-tighter uppercase">
                      Profile Strength
                    </span>
                    <span className="text-sm font-bold">{completion}%</span>
                  </div>
                  <div className="bg-border h-1.5 w-full rounded-full">
                    <div
                      className="bg-brand h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${completion}%` }}
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
            onSubmit={(e) => {
              e.preventDefault();
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
                  disabled={loading}
                  className="bg-background text-foreground flex items-center gap-2 rounded-4xl px-8 py-3 font-semibold transition-all hover:opacity-90"
                >
                  {loading ? (
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
          disabled={isLoading || !value}
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
