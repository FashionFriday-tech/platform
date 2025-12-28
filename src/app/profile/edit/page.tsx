"use client";

import { useState, useRef } from "react";
import Link from "next/link"; // Imported for navigation
import {
  Camera,
  User,
  Gift,
  Sparkles,
  Save,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MapPin, // Imported
  ChevronRight, // Imported
} from "lucide-react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";

// Types
interface UserProfile {
  name: string;
  phone: string;
  email: string;
  dob: string;
  anniversary: string;
  gender: string;
  stylePreference: string[];
  avatarUrl: string;
}

export default function EcommerceProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [completion, setCompletion] = useState(75);

  // State for individual field verification
  const [verifyingField, setVerifyingField] = useState<string | null>(null);
  const [verifiedStatus, setVerifiedStatus] = useState({
    phone: false,
    email: false,
  });

  const [formData, setFormData] = useState<UserProfile>({
    name: "Ajmal",
    phone: "7558969093",
    email: "ajmal@gmail.com",
    dob: "",
    anniversary: "",
    gender: "Male",
    stylePreference: ["Streetwear"],
    avatarUrl: "/images/model/aj.png",
  });

  // --- Handlers ---

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, avatarUrl: URL.createObjectURL(file) });
    }
  };

  const handleVerifyField = async (field: "phone" | "email") => {
    setVerifyingField(field);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setVerifiedStatus((prev) => ({ ...prev, [field]: true }));
    setVerifyingField(null);
    alert(`OTP sent to your ${field} successfully!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-20">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* LEFT SIDEBAR */}
          <aside className="md:col-span-4 space-y-6">
            <div className="bg-white rounded-4xl p-6 border border-gray-100 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-50 to-white z-0" />

              <div className="relative z-10">
                <div
                  className="relative mx-auto w-28 h-28 rounded-full p-1 border-2 border-dashed border-black cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <Image
                      src={formData.avatarUrl}
                      alt="Profile"
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-black text-white p-1.5 rounded-full border-2 border-white">
                    <Camera size={14} />
                  </div>
                </div>

                <h2 className="mt-4 font-bold text-gray-900 text-lg">
                  {formData.name}
                </h2>
                <p className="text-gray-500 text-sm mb-4">Gold Member</p>

                {/* Progress Bar */}
                <div className="bg-gray-50 rounded-4xl p-4 text-left">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-xs font-bold text-gray-900 uppercase">
                        Profile Strength
                      </span>
                      <p className="text-[10px] text-gray-500 leading-tight mt-0.5">
                        Complete to earn 50 pts
                      </p>
                    </div>
                    <span className="text-sm font-bold text-black">
                      {completion}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-black h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${completion}%` }}
                    ></div>
                  </div>
                </div>

                {/* --- NEW: Manage Addresses Button --- */}
                <Link href="/profile/addresses" className="block mt-4 group">
                    <div className="flex items-center justify-between p-3 px-4 rounded-3xl border border-gray-100 bg-white shadow-sm group-hover:border-black group-hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gray-50 rounded-full group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                <MapPin size={18} />
                            </div>
                            <div className="text-left">
                                <h4 className="font-bold text-sm text-gray-900">My Addresses</h4>
                                <p className="text-[10px] text-gray-500">Manage delivery locations</p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-black transition-colors" />
                    </div>
                </Link>

              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </aside>

          {/* MAIN FORM */}
          <form onSubmit={handleSubmit} className="md:col-span-8 space-y-6">
            
            {/* Section A: Identity with Verification Buttons */}
            <section className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-2">
                <div className="flex gap-2 justify-center items-center">
                  <User size={18} className="text-black" />
                  <h3 className="font-bold text-gray-900">Identity Details</h3>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-black  border border-black/20 px-3 py-1 rounded-full">
                  <ShieldCheck size={14} />
                  Secure Connection
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 gap-6">
                <ModernInput
                  label="Full Name"
                  value={formData.name}
                  onChange={(v: string) => setFormData({ ...formData, name: v })}
                  placeholder="Your Name"
                />

                <ModernInput
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(v: string) => setFormData({ ...formData, phone: v })}
                  type="tel"
                  placeholder="Mobile Number"
                  actionLabel="Verify"
                  onAction={() => handleVerifyField("phone")}
                  isLoading={verifyingField === "phone"}
                  isVerified={verifiedStatus.phone}
                />

                <ModernInput
                  label="Email Address"
                  value={formData.email}
                  onChange={(v: string) => setFormData({ ...formData, email: v })}
                  type="email"
                  placeholder="email@domain.com"
                  actionLabel="Verify"
                  onAction={() => handleVerifyField("email")}
                  isLoading={verifyingField === "email"}
                  isVerified={verifiedStatus.email}
                />
              </div>
            </section>

            {/* Section B: Personalization */}
            <section className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-black" />
                  <h3 className="font-bold text-gray-900">
                    Personalize Your Feed
                  </h3>
                </div>
                <span className="text-[10px] font-bold bg-white border text-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Improves Recommendations
                </span>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                    I shop for
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Male", "Female", "Other"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: g })}
                        className={`py-3 px-4 rounded-4xl text-sm font-medium border transition-all duration-200 flex items-center justify-center gap-2
                          ${
                            formData.gender === g
                              ? "bg-black text-white border-black shadow-md transform scale-[1.02]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                    My Style Vibe
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Casual", "Formal", "Streetwear", "Minimalist", "Vintage", "Bohemian",
                    ].map((style) => {
                      const isSelected = formData.stylePreference?.includes(style);
                      const toggleStyle = () => {
                        const currentStyles = formData.stylePreference || [];
                        const newStyles = isSelected
                          ? currentStyles.filter((s) => s !== style)
                          : [...currentStyles, style];
                        setFormData({ ...formData, stylePreference: newStyles });
                      };

                      return (
                        <button
                          key={style}
                          type="button"
                          onClick={toggleStyle}
                          className={`py-2 px-4 rounded-full text-sm font-medium border-2 transition-all
                            ${isSelected
                              ? " bg-black text-white ring-black"
                              : " text-gray-600 border-gray-200 hover:border-black"
                            }`}
                        >
                          {style}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <ModernInput
                    label="Date of Birth"
                    value={formData.dob}
                    onChange={(v: string) => setFormData({ ...formData, dob: v })}
                    type="date"
                    icon={<Gift size={16} className="text-black" />}
                  />
                  <ModernInput
                    label="Anniversary"
                    value={formData.anniversary}
                    onChange={(v: string) => setFormData({ ...formData, anniversary: v })}
                    type="date"
                  />
                </div>
              </div>
            </section>

            {/* Action Bar */}
            <div className="flex w-full items-center justify-center gap-4 pt-4 sticky bottom-4 z-20">
              <div className="backdrop-blur-xl bg-white/80 p-2 rounded-4xl shadow-xl border border-gray-200/50 flex gap-3">
                <button
                  type="button"
                  className="px-6 py-3 rounded-4xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  onClick={() => window.history.back()}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 rounded-4xl bg-black text-white font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-black/20 flex items-center gap-2 active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <Save size={18} /> Save All
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

// --- UPDATED SPECIALIZED INPUT COMPONENT ---
interface ModernInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  isLoading?: boolean;
  isVerified?: boolean;
}

const ModernInput = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
  actionLabel,
  onAction,
  isLoading = false,
  isVerified = false,
}: ModernInputProps) => (
  <div className="space-y-1.5 w-full">
    <div className="flex justify-between">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      {isVerified && (
        <div className="flex items-center gap-1 text-[10px] font-bold text-black  px-2 rounded-full">
          <CheckCircle2 size={12} /> VERIFIED
        </div>
      )}
      {icon && !isVerified && <div className="text-xs">{icon}</div>}
    </div>

    <div className="relative group">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isVerified}
        className={`w-full border border-gray-200 text-gray-900 text-sm rounded-4xl pl-4 py-3.5 outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-400
          ${actionLabel ? "pr-28" : "pr-4"} 
          ${isVerified && "border-black text-black"}
        `}
        placeholder={placeholder}
      />

      {onAction && !isVerified && (
        <button
          type="button"
          onClick={onAction}
          disabled={isLoading || !value}
          className="absolute right-1.5 top-1.5 bottom-1.5 bg-black text-white text-xs font-bold px-4 rounded-3xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center min-w-20"
        >
          {isLoading ? <Loader2 className="animate-spin" size={14} /> : actionLabel}
        </button>
      )}

      {isVerified && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-black">
           <CheckCircle2 size={20}  />
        </div>
      )}
    </div>
  </div>
);