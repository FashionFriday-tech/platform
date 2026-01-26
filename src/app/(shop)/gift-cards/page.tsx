"use client";

import { useState } from "react";
import {
  Instagram,
  Twitter,
  Youtube,
  Gift,
  CheckCircle2,
  Sparkles,
  Trophy,
  CreditCard,
  Clock,
  X,
  Loader2,
  Send,
  Lock,
  ExternalLink,
  ChevronRight,
  Wallet,
  Facebook,
} from "lucide-react";
import { Header } from "@/components/layout/Header";

// --- Types ---
type ClaimStatus = "idle" | "pending" | "approved";

interface SocialTask {
  id: string;
  platform: string;
  profileUrl: string; // URL to your social profile
  icon: React.ReactNode;
  rewardAmount: number;
  status: ClaimStatus;
  actionLabel: string;
  placeholder: string;
  cardStyle: string; // CSS for the specific brand gradient
}

interface Milestone {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  rewardAmount: number;
  imageUrl: string;
}

// --- Mock Data ---
const initialSocialTasks: SocialTask[] = [
  {
    id: "soc-1",
    platform: "Instagram",
    profileUrl: "https://instagram.com",
    icon: <Instagram size={32} />,
    rewardAmount: 50,
    status: "idle",
    actionLabel: "Follow us",
    placeholder: "Your Instagram Handle",
    // Instagram Gradient
    cardStyle: "bg-gradient-to-bl from-[#833ab4] via-[#fd1d1d] to-[#fcb045]",
  },
  {
    id: "soc-2",
    platform: "Twitter",
    profileUrl: "https://twitter.com",
    icon: <Twitter size={32} />,
    rewardAmount: 50,
    status: "idle",
    actionLabel: "Follow us",
    placeholder: "Your X Handle",
    // X / Twitter Dark Blue
    cardStyle: "bg-gradient-to-tr from-blue-600 to-black",
  },
  {
    id: "soc-3",
    platform: "YouTube",
    profileUrl: "https://youtube.com",
    icon: <Youtube size={32} />,
    rewardAmount: 100,
    status: "idle",
    actionLabel: "Subscribe",
    placeholder: "Your Channel Name",
    // YouTube Red
    cardStyle: "bg-gradient-to-tr from-red-600 to-red-900",
  },
{
  id: "soc-4",
  platform: "Facebook",
  profileUrl: "https://facebook.com",
  icon: <Facebook size={32} />,
  rewardAmount: 50,
  status: "idle",
  actionLabel: "Follow us",
  placeholder: "Your Facebook Profile URL",
  cardStyle: "bg-gradient-to-br from-[#1877F2] to-[#0F5BD8]",
},
];

const initialMilestones: Milestone[] = [
  {
    id: "mile-1",
    title: "Silver Member",
    targetAmount: 5000,
    currentAmount: 5000,
    rewardAmount: 500,
    imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "mile-2",
    title: "Gold Elite",
    targetAmount: 10000,
    currentAmount: 3250,
    rewardAmount: 1500,
    imageUrl: "https://images.unsplash.com/photo-1628527304948-06157ee3c8a6?q=80&w=800&auto=format&fit=crop",
  },
];

export default function RewardsPage() {
  const [socials, setSocials] = useState(initialSocialTasks);
  const [selectedTask, setSelectedTask] = useState<SocialTask | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletBalance] = useState(150);

  // --- Modal Logic ---
  const openClaimModal = (task: SocialTask) => {
    if (task.status === "idle") {
      setSelectedTask(task);
      setUsernameInput("");
    }
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSocials((prev) =>
      prev.map((task) =>
        task.id === selectedTask?.id ? { ...task, status: "pending" } : task
      )
    );

    setIsSubmitting(false);
    setSelectedTask(null);
  };

  return (
    <div className="min-h-screen bg-black font-sans text-white selection:bg-white selection:text-black">
      <main className="max-w-6xl mx-auto px-4 py-20 pb-32">
        
        {/* --- HERO SECTION: WALLET CARD --- */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 md:mb-24 pt-10">
          
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter mb-4 bg-linear-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              MEMBERS CLUB
            </h1>
            <p className="text-zinc-500 text-sm md:text-base max-w-md mx-auto">
              Exclusive rewards for our most loyal customers. Collect cards, unlock value.
            </p>
          </div>

          {/* The Hero Wallet Card */}
          <div className="relative w-full max-w-md aspect-[1.58/1] bg-zinc-900 rounded-4xl p-6 md:p-8 text-white shadow-[0_0_50px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col justify-between group border border-white/10 transition-transform hover:scale-[1.02] duration-500">
             
             {/* Textures */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay" />
             <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-linear-to-br from-transparent via-white/5 to-transparent rotate-45 pointer-events-none" />

             {/* Card Top */}
             <div className="relative z-10 flex justify-between items-start">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black shadow-[0_0_15px_white]">
                      <Sparkles size={16} />
                   </div>
                   <span className="font-bold text-sm tracking-[0.2em] opacity-90">BLACK CARD</span>
                </div>
                <CreditCard className="opacity-50" />
             </div>

             {/* Card Middle */}
             <div className="relative z-10">
                <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-2">Available Credits</p>
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
                   ₹{walletBalance}
                </h2>
             </div>

             {/* Card Bottom */}
             <div className="relative z-10 flex justify-between items-end">
                <div>
                   <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Card Holder</p>
                   <p className="font-medium text-sm text-zinc-300">AJMAL</p>
                </div>
                <p className="font-mono text-xs opacity-50 tracking-widest">**** 8829</p>
             </div>
          </div>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="space-y-16">
            
            {/* 1. SOCIAL GIFT CARDS */}
            <section>
              <div className="flex items-center gap-3 mb-8 px-2">
                <div className="p-2 bg-white rounded-full text-black">
                   <Gift size={20} />
                </div>
                <h2 className="text-2xl font-bold">Social Gift Cards</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {socials.map((task) => (
                  <div 
                    key={task.id} 
                    className={`relative w-full aspect-[1.58/1] rounded-4xl p-6 shadow-2xl text-white flex flex-col justify-between overflow-hidden group 
                    ${task.cardStyle} 
                    ${task.status === "approved" ? "grayscale opacity-50" : "hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]"} transition-all duration-500`}
                  >
                    {/* Top Row: Icon & Amount */}
                    <div className="relative z-10 flex justify-between items-start">
                       <div className="bg-black/20 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                          {task.icon}
                       </div>
                       <span className="font-bold text-3xl tracking-tight drop-shadow-md">₹{task.rewardAmount}</span>
                    </div>

                    {/* Middle Row: Label */}
                    <div className="relative z-10">
                       <p className="text-[10px] font-medium uppercase tracking-widest opacity-80 mb-1">Task</p>
                       <h3 className="text-xl font-bold leading-tight">{task.actionLabel}</h3>
                    </div>

                    {/* Bottom Row: Actions */}
                    <div className="relative z-10 flex items-center justify-between mt-2">
                       {/* STATUS BADGES */}
                       {task.status === "pending" && (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 text-yellow-200 text-xs font-bold rounded-lg backdrop-blur-md border border-yellow-500/30">
                             <Clock size={12} className="animate-pulse" /> Pending
                          </div>
                       )}
                       {task.status === "approved" && (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/40 text-white text-xs font-bold rounded-lg backdrop-blur-md border border-white/20">
                             <CheckCircle2 size={12} /> Claimed
                          </div>
                       )}

                       {/* ACTION BUTTONS (Only if Idle) */}
                       {task.status === "idle" && (
                         <div className="flex items-center gap-2 w-full">
                            {/* 1. Visit Profile Button */}
                            <a 
                              href={task.profileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors border border-white/10 text-white"
                              title="Go to Profile"
                            >
                               <ExternalLink size={16} />
                            </a>

                            {/* 2. Claim Button */}
                            <button 
                              onClick={() => openClaimModal(task)}
                              className="flex-1 py-2.5 bg-white text-black text-xs font-bold rounded-full hover:bg-zinc-200 transition-colors shadow-lg flex items-center justify-center gap-1"
                            >
                               Claim <ChevronRight size={12} />
                            </button>
                         </div>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. SHOPPING MILESTONES */}
            <section>
              <div className="flex items-center gap-3 mb-8 px-2">
                <div className="p-2 bg-white rounded-full text-black">
                   <Trophy size={20} />
                </div>
                <h2 className="text-2xl font-bold">Shopping Milestones</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {initialMilestones.map((milestone) => {
                  const progress = Math.min((milestone.currentAmount / milestone.targetAmount) * 100, 100);
                  const isUnlocked = progress >= 100;
                  
                  return (
                    <div key={milestone.id} className="relative w-full aspect-[1.58/1] rounded-4xl overflow-hidden shadow-2xl border border-white/10 group">
                       
                       {/* Background Image */}
                       <img 
                         src={milestone.imageUrl} 
                         alt={milestone.title} 
                         className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700"
                       />
                       {/* Dark Overlay Gradient */}
                       <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

                       {/* Card Content */}
                       <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                          
                          {/* Top */}
                          <div className="flex justify-between items-start">
                             <div className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border backdrop-blur-md
                                ${isUnlocked ? "bg-white text-black border-white" : "bg-black/50 text-white border-white/20"}`}>
                                {isUnlocked ? "UNLOCKED" : "LOCKED"}
                             </div>
                             <div className="text-right">
                                <span className="block font-bold text-2xl leading-none">₹{milestone.rewardAmount}</span>
                                <span className="text-[9px] uppercase tracking-wide opacity-70">Credit</span>
                             </div>
                          </div>

                          {/* Middle */}
                          <div className="text-center transform translate-y-2 group-hover:translate-y-0 transition-transform">
                             {!isUnlocked && <Lock className="mx-auto mb-2 opacity-50" size={24} />}
                             <h3 className="font-bold text-xl tracking-tight">{milestone.title}</h3>
                          </div>

                          {/* Bottom: Progress Bar Integration */}
                          <div className="space-y-2">
                             <div className="flex justify-between text-[10px] font-bold opacity-80 uppercase tracking-wider">
                                <span>Progress</span>
                                <span>{Math.round(progress)}%</span>
                             </div>
                             
                             {/* The Progress Bar */}
                             <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden backdrop-blur-sm">
                                <div 
                                   className="bg-white h-full shadow-[0_0_15px_white]"
                                   style={{ width: `${progress}%` }}
                                />
                             </div>
                             
                             <div className="flex justify-between items-center mt-1">
                                <p className="text-[10px] opacity-60">
                                   Spent ₹{milestone.currentAmount} / ₹{milestone.targetAmount}
                                </p>
                                {isUnlocked && (
                                   <span className="text-[10px] font-bold text-green-400 flex items-center gap-1">
                                      Active <CheckCircle2 size={10} />
                                   </span>
                                )}
                             </div>
                          </div>
                       </div>
                    </div>
                  );
                })}
              </div>
            </section>

        </div>
      </main>

      {/* --- CLAIM VERIFICATION MODAL (Dark Mode) --- */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in"
             onClick={() => setSelectedTask(null)}
           />

           {/* Modal Content */}
           <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200 text-white">
              <button 
                 onClick={() => setSelectedTask(null)}
                 className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"
              >
                 <X size={20} />
              </button>

              <div className="text-center mb-6">
                 <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-4 ${selectedTask.cardStyle}`}>
                    {selectedTask.icon}
                 </div>
                 <h3 className="text-xl font-bold">Claim ₹{selectedTask.rewardAmount}</h3>
                 <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                    Enter your username. We will verify that you followed our profile.
                 </p>
              </div>

              <form onSubmit={handleSubmitClaim} className="space-y-4">
                 <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Your Handle</label>
                    <input 
                       type="text" 
                       value={usernameInput}
                       onChange={(e) => setUsernameInput(e.target.value)}
                       placeholder={selectedTask.placeholder}
                       className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-4 outline-none focus:ring-1 focus:ring-white focus:border-white transition-all font-medium text-sm text-white placeholder:text-zinc-700"
                       autoFocus
                    />
                 </div>

                 <button 
                    type="submit"
                    disabled={isSubmitting || !usernameInput.trim()}
                    className="w-full py-4 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {isSubmitting ? (
                       <><Loader2 size={16} className="animate-spin" /> Verifying...</>
                    ) : (
                       <><Send size={16} /> Submit Request</>
                    )}
                 </button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}