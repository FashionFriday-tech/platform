"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  CameraIcon,
  UserIcon,
  GiftIcon,
  SparklesIcon,
  SaveIcon,
  LoaderIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  MapPinIcon,
  ChevronRightIcon,
} from "@ff/ui";
import Image from "next/image";

// --- Sub-Components (DRY Optimization) ---

const ProfileSection = ({ title, icon: Icon, children, badge }: any) => (
  <section className="bg-background-elevated rounded-4xl border border-border shadow-sm overflow-hidden">
    <div className="bg-background-muted px-6 py-4 border-b border-border flex items-center justify-between gap-2">
      <div className="flex gap-2 items-center">
        {Icon && <Icon size={18} className="text-foreground" />}
        <h3 className="font-bold text-foreground">{title}</h3>
      </div>
      {badge && (
        <div className="flex items-center gap-1 text-xs font-medium text-foreground border border-foreground/20 px-3 py-1 rounded-full">
          {badge}
        </div>
      )}
    </div>
    <div className="p-6">{children}</div>
  </section>
);

export default function EcommerceProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [completion, setCompletion] = useState(75);
  const [verifyingField, setVerifyingField] = useState<string | null>(null);
  const [verifiedStatus, setVerifiedStatus] = useState({
    phone: false,
    email: false,
  });

  const [formData, setFormData] = useState({
    name: "Ajmal",
    phone: "7558969093",
    email: "ajmal@gmail.com",
    dob: "",
    anniversary: "",
    gender: "Male",
    stylePreference: ["Streetwear"],
    avatarUrl: "/images/model/aj.png",
  });

  const handleVerifyField = async (field: "phone" | "email") => {
    setVerifyingField(field);
    await new Promise((r) => setTimeout(r, 2000));
    setVerifiedStatus((p) => ({ ...p, [field]: true }));
    setVerifyingField(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-10 lg:pt-20 transition-colors">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* LEFT SIDEBAR */}
          <aside className="md:col-span-4 space-y-6">
            <div className="bg-background-elevated rounded-4xl p-6 border border-border shadow-sm text-center relative overflow-hidden">
              {/* Decorative Header */}
              <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-background-muted to-transparent z-0" />

              <div className="relative z-10">
                <div
                  className="relative mx-auto w-28 h-28 rounded-full p-1 border-2 border-dashed border-brand cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <Image
                      src={formData.avatarUrl}
                      alt="Profile"
                      width={112}
                      height={112}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <CameraIcon className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-brand text-brand-foreground p-1.5 rounded-full border-2 border-background">
                    <CameraIcon size={14} />
                  </div>
                </div>

                <h2 className="mt-4 font-bold text-lg">{formData.name}</h2>
                <p className="text-foreground-muted text-sm mb-4">
                  Gold Member
                </p>

                {/* Progress Bar */}
                <div className="bg-background-muted rounded-4xl p-4 text-left">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold uppercase tracking-tighter">
                      Profile Strength
                    </span>
                    <span className="text-sm font-bold">{completion}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5">
                    <div
                      className="bg-brand h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>

                {/* Address Link */}
                <Link href="/profile/addresses" className="block mt-4 group">
                  <div className="flex items-center justify-between p-3 px-4 rounded-3xl border border-border bg-background hover:border-brand hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-background-muted rounded-full group-hover:bg-brand group-hover:text-brand-foreground transition-colors">
                        <MapPinIcon size={18} />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-sm">My Addresses</h4>
                        <p className="text-[10px] text-foreground-subtle">
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
                onChange={(e) => {
                  /* logic */
                }}
              />
            </div>
          </aside>

          {/* MAIN FORM */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="md:col-span-8 space-y-6"
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
                  onChange={(v: string) =>
                    setFormData({ ...formData, name: v })
                  }
                />
                <ModernInput
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(v: string) =>
                    setFormData({ ...formData, phone: v })
                  }
                  actionLabel="Verify"
                  onAction={() => handleVerifyField("phone")}
                  isLoading={verifyingField === "phone"}
                  isVerified={verifiedStatus.phone}
                />
                <ModernInput
                  label="Email Address"
                  value={formData.email}
                  onChange={(v: string) =>
                    setFormData({ ...formData, email: v })
                  }
                  actionLabel="Verify"
                  onAction={() => handleVerifyField("email")}
                  isLoading={verifyingField === "email"}
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
                  <label className="text-xs font-bold text-foreground-subtle uppercase tracking-wider mb-3 block">
                    I shop for
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Male", "Female", "Other"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: g })}
                        className={`py-3 rounded-4xl text-sm font-medium border transition-all ${
                          formData.gender === g
                            ? "bg-brand text-brand-foreground border-brand scale-[1.02]"
                            : "bg-background border-border text-foreground-muted hover:border-foreground-subtle"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground-subtle uppercase tracking-wider mb-3 block">
                    My Style Vibe
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Casual",
                      "Formal",
                      "Streetwear",
                      "Minimalist",
                      "Vintage",
                    ].map((style) => {
                      const isSelected = formData.stylePreference.includes(
                        style
                      );
                      return (
                        <button
                          key={style}
                          type="button"
                          className={`py-2 px-4 rounded-full text-sm font-medium border-2 transition-all ${
                            isSelected
                              ? "bg-brand text-brand-foreground border-brand"
                              : "text-foreground-muted border-border hover:border-brand"
                          }`}
                        >
                          {style}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ModernInput
                    label="Date of Birth"
                    type="date"
                    value={formData.dob}
                    onChange={(v: string) =>
                      setFormData({ ...formData, dob: v })
                    }
                    icon={<GiftIcon size={16} />}
                  />
                  <ModernInput
                    label="Anniversary"
                    type="date"
                    value={formData.anniversary}
                    onChange={(v: string) =>
                      setFormData({ ...formData, anniversary: v })
                    }
                  />
                </div>
              </div>
            </ProfileSection>

            {/* Sticky Action Bar */}
            <div className="flex w-full items-center justify-center pt-4 sticky bottom-16 md:bottom-4 z-20">
              <div className="backdrop-blur-xl bg-foreground p-2 rounded-4xl shadow-xl flex gap-3">
                <button
                  type="button"
                  className="px-6 py-3 rounded-4xl font-medium text-background hover:bg-background transition-colors"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 rounded-4xl bg-background text-foreground font-semibold hover:opacity-90 transition-all flex items-center gap-2"
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

// --- REFACTORED INPUT ---
const ModernInput = ({
  label,
  value,
  onChange,
  type = "text",
  actionLabel,
  onAction,
  isLoading,
  isVerified,
  icon,
}: any) => (
  <div className="space-y-1.5 w-full">
    <div className="flex justify-between">
      <label className="text-xs font-bold text-foreground-subtle uppercase tracking-wider">
        {label}
      </label>
      {isVerified && (
        <span className="text-[10px] font-bold text-brand flex items-center gap-1">
          <CheckCircleIcon size={12} /> VERIFIED
        </span>
      )}
    </div>
    <div className="relative group">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isVerified}
        className={`w-full bg-background border border-border text-foreground text-sm rounded-4xl pl-4 py-3.5 outline-none focus:ring-1 focus:ring-ring focus:border-brand transition-all
          ${actionLabel ? "pr-28" : "pr-4"} ${
          isVerified && "border-brand opacity-80"
        }`}
      />
      {onAction && !isVerified && (
        <button
          onClick={onAction}
          disabled={isLoading || !value}
          className="absolute right-1.5 top-1.5 bottom-1.5 bg-brand text-brand-foreground text-xs font-bold px-4 rounded-3xl hover:opacity-90 disabled:opacity-30 transition-all min-w-20"
        >
          {isLoading ? (
            <LoaderIcon className="animate-spin" size={14} />
          ) : (
            actionLabel
          )}
        </button>
      )}
      {isVerified && (
        <CheckCircleIcon
          size={20}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-brand"
        />
      )}
    </div>
  </div>
);
