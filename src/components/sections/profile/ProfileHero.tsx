import { Crown, Gift, ShieldCheck } from "lucide-react";
import { userData } from "@/data/profile";

export default function ProfileHero() {
  const progressPercentage = (userData.loyaltyPoints / userData.pointsToNextTier) * 100;

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-white p-8 md:p-12">
      {/* Subtle background pattern underneath */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] " />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-zinc-400">{userData.name}</span>
          </h1>
          <p className="text-zinc-400">Manage your account and view your tier status.</p>
        </div>
         {/* Brand Mark */}
        <div className="mt-6 md:mt-0 flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
            <span className="font-black tracking-wider text-lg">{userData.tierName}</span>
            <Crown size={20} className="text-yellow-200" />
        </div>
      </div>

      {/* Benefits Icons */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-zinc-300">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-xl"><Crown size={20} /></div>
          <span className="text-sm font-medium leading-tight">Unlock exclusive <br/> {userData.tierName} Club access</span>
        </div>
         <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-xl"><ShieldCheck size={20} /></div>
          <span className="text-sm font-medium leading-tight">Assured cashback <br/> on every order</span>
        </div>
         <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-xl"><Gift size={20} /></div>
          <span className="text-sm font-medium leading-tight">Win free gifts <br/> for order streaks</span>
        </div>
      </div>

      {/* Modern Progress Bar */}
      <div className="relative z-10">
        <div className="flex justify-between text-sm mb-3 font-medium text-zinc-300">
            <span>Current Points: {userData.loyaltyPoints}</span>
            <span className="text-white">Goal: {userData.pointsToNextTier}</span>
        </div>
        <div className="h-5 bg-zinc-800/50 border border-white/10 rounded-full overflow-hidden p-1 backdrop-blur-sm">
          <div
            className="h-full bg-linear-to-r from-zinc-200 via-white to-zinc-200 rounded-full transition-all duration-1000 ease-out relative overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            style={{ width: `${progressPercentage}%` }}
          >
              {/* Shine effect on bar */}
              <div className="absolute inset-0 bg-linear-to-b from-white/40 to-transparent"></div>
          </div>
        </div>
        <p className="mt-4 text-sm text-zinc-400">
          Shop ₹{userData.pointsToNextTier - userData.loyaltyPoints} more to become an X member.{" "}
          <a href="#" className="text-white underline underline-offset-4 hover:text-zinc-200 transition-colors">
            More Details
          </a>
        </p>
      </div>
    </div>
  );
}