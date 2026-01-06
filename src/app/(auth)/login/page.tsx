"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image"; // Kept import, though using standard img for external URL simplicity
import Link from "next/link";
import { Eye, EyeOff, ChevronRight, Check } from "lucide-react";
import ImageCarousel from "@/components/ui/sections/ImageCarousel";

// Define metadata outside the component for SEO in Next.js App Router
// In a real app, this would be in a separate layout.tsx or handled via generateMetadata
const metadata = {
  title: "Secure Login | LUXE Fashion",
  description:
    "Join LUXE to unlock exclusive collections, personalized styling, and early access to drops.",
  openGraph: {
    title: "Join LUXE Fashion",
    description: "The new standard of modern luxury.",
    images: ["/your-og-image.jpg"],
  },
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Toggle variant for SEO and UX text
  const toggleVariant = () => setIsLogin(!isLogin);

  return (
    <div className="h-screen flex w-full text-white selection:bg-black selection:text-white items-center justify-center">
      <div className="bg-black  shadow-2xl overflow-hidden w-full h-full flex flex-col lg:flex-row p-4">
        {/* SECTION 1: CAROUSEL SIDE (Left Panel - Replaces Static Image) */}
        <div className="hidden lg:flex w-1/2 p-4">
          <ImageCarousel />
        </div>
        {/* SECTION 2: FORM SIDE (Right Panel - Existing Logic Preserved) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center relative">
          {/* Header & Toggle */}
          <div className="w-full max-w-lg space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-sm text-zinc-400">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  onClick={toggleVariant}
                  className="font-medium text-white underline underline-offset-4 hover:text-white/80 transition-colors"
                >
                  {isLogin ? "Sign up for free" : "Sign in"}
                </button>
              </p>
            </div>

            {/* Form */}
            <form
              className="mt-8 space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Name Field (Sign Up Only) */}
              {!isLogin && (
                <div className="group animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="Full Name"
                      className="block w-full rounded-full border-2 border-zinc-200 px-4 py-3 text-white placeholder:text-zinc-400 focus:border-white focus:ring-0 sm:text-sm transition-colors bg-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Email address"
                    className="block w-full rounded-full border-2 border-zinc-200 px-4 py-3 text-white placeholder:text-zinc-400 focus:border-white focus:ring-0 sm:text-sm transition-colors bg-transparent"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    placeholder="Password"
                    className="block w-full rounded-full border-2 border-zinc-200 px-4 py-3 text-white placeholder:text-zinc-400 focus:border-white focus:ring-0 sm:text-sm transition-colors bg-transparent pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-400 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {/* Password Requirements (Sign Up Only) */}
                {!isLogin && (
                  <div className="mt-3 flex gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Check size={12} className="text-green-500" /> 8+ chars
                    </span>
                    <span className="flex items-center gap-1">
                      <Check size={12} className="text-green-500" /> 1 number
                    </span>
                    <span className="flex items-center gap-1">
                      <Check size={12} className="text-green-500" /> 1 special
                      (@#$)
                    </span>
                  </div>
                )}
              </div>

              {/* Forgot Password (Login Only) */}
              {isLogin && (
                <div className="flex items-center justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-zinc-500 hover:text-white transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="group relative flex w-full justify-center items-center bg-white rounded-full px-6 py-4 text-sm font-bold text-black transition-all hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
              >
                {isLogin ? "Sign In" : "Create Account"}
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Social Login / Divider */}
              <div className="relative mt-4">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-zinc-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-black px-4 text-zinc-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <SocialButton icon={<GoogleIcon />} label="Google" />
                <SocialButton icon={<AppleIcon />} label="Apple" />
              </div>
            </form>
          </div>

          {/* Footer Links */}
          <p className="text-center text-xs text-zinc-400 mt-4">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-white">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-white">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

function SocialButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-3 border-2 border-zinc-200 bg-white rounded-full px-4 py-3 text-sm font-medium text-black hover:bg-zinc-50 hover:border-zinc-300 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-1 shadow-sm"
    >
      {icon}
      <span className="sr-only">Sign in with {label}</span>
      {label}
    </button>
  );
}

// Simple SVG Icons
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const AppleIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24.02-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.64 3.94-1.48 1.77.16 2.92 1.34 3.48 2.08-3.3 1.83-3.05 5.56.24 7.22-.67 1.79-1.57 3.38-2.74 4.41zM13.03 3.94c.12-1.83 1.62-3.17 3.44-2.94-.3 2.13-2.21 3.51-3.44 2.94z" />
  </svg>
);
