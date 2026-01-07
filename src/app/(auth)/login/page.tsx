"use client";
import Link from "next/link";
import { ChevronRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { SocialButton, GoogleIcon, AppleIcon } from "../_components/AuthButtons";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Welcome Back</h1>
        <p className="text-zinc-400">
          New to Fashion Friday?{" "}
          <Link href="/register" className="text-white underline underline-offset-4">Sign up for free</Link>
        </p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="Email address"
          required
          className="block w-full rounded-full border-2 border-zinc-200 px-4 py-3 bg-transparent text-white focus:border-white focus:ring-0 transition-colors"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            className="block w-full rounded-full border-2 border-zinc-200 px-4 py-3 bg-transparent text-white focus:border-white focus:ring-0 transition-colors"
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3.5 text-zinc-400"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-zinc-400 hover:text-white">
            Forgot password?
          </Link>
        </div>

        <button className="w-full bg-white text-black font-bold py-4 rounded-full flex items-center justify-center group hover:bg-zinc-200 transition-all">
          Sign In <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-black px-2 text-zinc-500">Or continue with</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SocialButton icon={<GoogleIcon />} label="Google" />
          <SocialButton icon={<AppleIcon />} label="Apple" />
        </div>
      </form>
    </div>
  );
}