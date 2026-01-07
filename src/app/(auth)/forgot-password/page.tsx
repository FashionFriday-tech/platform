"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ChevronRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setEmailSent(true);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back to Login Link */}
      <Link 
        href="/login" 
        className="group mb-8 flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Login
      </Link>

      {!emailSent ? (
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">
              Reset Password
            </h1>
            <p className="text-zinc-400">
              Enter the email associated with your account and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-zinc-500" />
              </div>
              <input
                type="email"
                required
                placeholder="Email address"
                className="block w-full rounded-full border-2 border-zinc-200 bg-transparent px-12 py-4 text-white placeholder:text-zinc-500 focus:border-white focus:ring-0 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center items-center bg-white rounded-full px-6 py-4 text-sm font-bold text-black transition-all hover:bg-white/90 disabled:opacity-50"
            >
              {loading ? "Sending link..." : "Send Reset Link"}
              {!loading && (
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              )}
            </button>
          </form>
        </div>
      ) : (
        /* SUCCESS STATE */
        <div className="text-center lg:text-left space-y-6 animate-in zoom-in-95 duration-300">
          <div className="flex justify-center lg:justify-start">
            <div className="bg-white/10 p-4 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Check your email</h1>
            <p className="text-zinc-400">
              We have sent a password reset link to your email. Please check your inbox (and spam folder).
            </p>
          </div>
          <button 
            onClick={() => setEmailSent(false)}
            className="text-sm font-bold text-white underline underline-offset-4"
          >
            Didn&apos;t get the email? Try again
          </button>
        </div>
      )}
    </div>
  );
}