"use client";
import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";
import { SocialButton, GoogleIcon, AppleIcon } from "../_components/AuthButtons";

export default function RegisterPage() {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-500">
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Create Account</h1>
        <p className="text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-white underline underline-offset-4">Sign in</Link>
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <input type="text" placeholder="Full Name" required className="block w-full rounded-full border-2 border-zinc-200 px-4 py-3 bg-transparent text-white focus:border-white" />
        <input type="email" placeholder="Email address" required className="block w-full rounded-full border-2 border-zinc-200 px-4 py-3 bg-transparent text-white focus:border-white" />
        <input type="password" placeholder="Password" required className="block w-full rounded-full border-2 border-zinc-200 px-4 py-3 bg-transparent text-white focus:border-white" />
        
        <div className="flex gap-3 text-xs text-zinc-500 px-2">
          <span className="flex items-center gap-1"><Check size={12} className="text-green-500" /> 8+ chars</span>
          <span className="flex items-center gap-1"><Check size={12} className="text-green-500" /> 1 special</span>
        </div>

        <button className="w-full bg-white text-black font-bold py-4 rounded-full flex items-center justify-center group mt-4">
          Create Account <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Reuse the Social Dividers and Buttons from Login */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <SocialButton icon={<GoogleIcon />} label="Google" />
          <SocialButton icon={<AppleIcon />} label="Apple" />
        </div>
      </form>

      <p className="text-center text-[10px] text-zinc-500">
        By signing up, you agree to our <Link href="/terms" className="underline">Terms</Link> & <Link href="/privacy" className="underline">Privacy</Link>
      </p>
    </div>
  );
}