'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  CloseIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  FacebookIcon,
  GiftIcon,
  InstagramIcon,
  LoaderIcon,
  LockIcon,
  SendIcon,
  SparklesIcon,
  TrophyIcon,
  TwitterIcon,
  YoutubeIcon,
} from '@ff/ui';

// --- Types ---
type ClaimStatus = 'idle' | 'pending' | 'approved';

interface SocialTask {
  id: string;
  platform: string;
  profileUrl: string;
  icon: React.ReactNode;
  rewardAmount: number;
  status: ClaimStatus;
  actionLabel: string;
  placeholder: string;
  cardStyle: string;
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
    id: 'soc-1',
    platform: 'Instagram',
    profileUrl: 'https://instagram.com',
    icon: <InstagramIcon size={32} />,
    rewardAmount: 50,
    status: 'idle',
    actionLabel: 'Follow us',
    placeholder: 'Your Instagram Handle',
    cardStyle: 'bg-gradient-to-bl from-[#833ab4] via-[#fd1d1d] to-[#fcb045]',
  },
  {
    id: 'soc-2',
    platform: 'Twitter',
    profileUrl: 'https://twitter.com',
    icon: <TwitterIcon size={32} />,
    rewardAmount: 50,
    status: 'idle',
    actionLabel: 'Follow us',
    placeholder: 'Your X Handle',
    cardStyle: 'bg-gradient-to-tr from-blue-600 to-blue-400',
  },
  {
    id: 'soc-3',
    platform: 'YouTube',
    profileUrl: 'https://youtube.com',
    icon: <YoutubeIcon size={32} />,
    rewardAmount: 100,
    status: 'idle',
    actionLabel: 'Subscribe',
    placeholder: 'Your Channel Name',
    cardStyle: 'bg-gradient-to-tr from-red-600 to-red-900',
  },
  {
    id: 'soc-4',
    platform: 'Facebook',
    profileUrl: 'https://facebook.com',
    icon: <FacebookIcon size={32} />,
    rewardAmount: 50,
    status: 'idle',
    actionLabel: 'Follow us',
    placeholder: 'Your Facebook Profile URL',
    cardStyle: 'bg-gradient-to-br from-[#1877F2] to-[#0F5BD8]',
  },
];

const initialMilestones: Milestone[] = [
  {
    id: 'mile-1',
    title: 'Silver Member',
    targetAmount: 5000,
    currentAmount: 5000,
    rewardAmount: 500,
    imageUrl:
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'mile-2',
    title: 'Gold Elite',
    targetAmount: 10000,
    currentAmount: 3250,
    rewardAmount: 1500,
    imageUrl:
      'https://images.unsplash.com/photo-1628527304948-06157ee3c8a6?q=80&w=800&auto=format&fit=crop',
  },
];

export default function RewardsPage() {
  const [socials, setSocials] = useState(initialSocialTasks);
  const [selectedTask, setSelectedTask] = useState<SocialTask | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletBalance] = useState(150);

  // --- Modal Logic ---
  const openClaimModal = (task: SocialTask) => {
    if (task.status === 'idle') {
      setSelectedTask(task);
      setUsernameInput('');
    }
  };

  /**
   * FIX: handleSubmit is now a synchronous wrapper around the async logic
   * to satisfy @typescript-eslint/no-misused-promises
   */
  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();

    const performSubmit = async () => {
      if (!usernameInput.trim() || !selectedTask) {
        return;
      }

      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSocials((prev) =>
        prev.map((task) => (task.id === selectedTask.id ? { ...task, status: 'pending' } : task)),
      );

      setIsSubmitting(false);
      setSelectedTask(null);
    };

    void performSubmit();
  };

  return (
    <div className="bg-background text-foreground min-h-screen font-sans">
      <main className="mx-auto max-w-6xl px-4 py-20 pb-32">
        {/* --- HERO SECTION --- */}
        <div className="mb-16 flex flex-col items-center justify-between pt-10 md:mb-24 md:flex-row">
          <div className="mb-8 text-center md:text-left">
            <h1 className="from-foreground mb-4 bg-linear-to-b to-zinc-400 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent uppercase md:text-6xl">
              Members Club
            </h1>
            <p className="mx-auto max-w-md text-sm text-zinc-500 md:mx-0 md:text-base">
              Exclusive rewards for our most loyal customers. Collect cards, unlock value.
            </p>
          </div>

          {/* Hero Wallet Card */}
          <div className="bg-background text-foreground group border-foreground/10 relative flex aspect-[1.58/1] w-full max-w-md flex-col justify-between overflow-hidden rounded-4xl border p-6 shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-transform duration-500 hover:scale-[1.02] md:p-8">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay" />

            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-background text-foreground flex h-8 w-8 items-center justify-center rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  <SparklesIcon size={16} />
                </div>
                <span className="text-sm font-bold tracking-[0.2em] uppercase opacity-90">
                  Fashion Card
                </span>
              </div>
              <CreditCardIcon className="opacity-50" />
            </div>

            <div className="relative z-10">
              <p className="mb-2 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                Available Credits
              </p>
              <h2 className="text-foreground text-5xl font-bold tracking-tight drop-shadow-lg md:text-6xl">
                ₹{walletBalance}
              </h2>
            </div>

            <div className="relative z-10 flex items-end justify-between">
              <div>
                <p className="mb-0.5 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                  Card Holder
                </p>
                <p className="text-sm font-medium text-zinc-300">AJMAL</p>
              </div>
              <p className="font-mono text-xs tracking-widest opacity-50">**** 8829</p>
            </div>
          </div>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="space-y-16">
          <section>
            <div className="mb-8 flex items-center gap-3 px-2">
              <div className="rounded-full bg-white p-2 text-black">
                <GiftIcon size={20} />
              </div>
              <h2 className="text-2xl font-bold">Social Gift Cards</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {socials.map((task) => (
                <div
                  key={task.id}
                  className={`group relative flex aspect-[1.58/1] w-full flex-col justify-between overflow-hidden rounded-4xl p-6 text-white ${
                    task.cardStyle
                  } ${
                    task.status === 'approved'
                      ? 'cursor-not-allowed opacity-50 grayscale'
                      : 'hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]'
                  } transition-all duration-500`}
                >
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="rounded-xl border border-white/10 bg-black/20 p-2.5 backdrop-blur-md">
                      {task.icon}
                    </div>
                    <span className="text-3xl font-bold tracking-tight drop-shadow-md">
                      ₹{task.rewardAmount}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <p className="mb-1 text-[10px] font-medium tracking-widest uppercase opacity-80">
                      Task
                    </p>
                    <h3 className="text-xl leading-tight font-bold">{task.actionLabel}</h3>
                  </div>

                  <div className="relative z-10 mt-2 flex items-center justify-between">
                    {task.status === 'pending' && (
                      <div className="inline-flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/20 px-3 py-1.5 text-xs font-bold text-yellow-200 backdrop-blur-md">
                        <ClockIcon size={12} className="animate-pulse" /> Pending
                      </div>
                    )}
                    {task.status === 'approved' && (
                      <div className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                        <CheckCircleIcon size={12} /> Claimed
                      </div>
                    )}

                    {task.status === 'idle' && (
                      <div className="flex w-full items-center gap-2">
                        <Link
                          href={task.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-white/10 bg-white/10 p-2.5 text-white backdrop-blur-md transition-colors hover:bg-white/20"
                        >
                          <ExternalLinkIcon size={16} />
                        </Link>

                        <button
                          onClick={() => openClaimModal(task)}
                          className="flex flex-1 items-center justify-center gap-1 rounded-full bg-white py-2.5 text-xs font-bold text-black shadow-lg transition-colors hover:bg-zinc-200"
                        >
                          Claim <ChevronRightIcon size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-8 flex items-center gap-3 px-2">
              <div className="bg-foreground text-background rounded-full p-2">
                <TrophyIcon size={20} />
              </div>
              <h2 className="text-2xl font-bold">Shopping Milestones</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {initialMilestones.map((milestone) => {
                const progress = Math.min(
                  (milestone.currentAmount / milestone.targetAmount) * 100,
                  100,
                );
                const isUnlocked = progress >= 100;

                return (
                  <div
                    key={milestone.id}
                    className="border-foreground/10 group relative aspect-[1.58/1] w-full overflow-hidden rounded-4xl border"
                  >
                    <Image
                      src={milestone.imageUrl}
                      alt={milestone.title}
                      fill
                      className="object-cover opacity-60 grayscale transition-all duration-700 group-hover:opacity-80 group-hover:grayscale-0"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                    {/* FIX: Corrected foregroiund typo to foreground */}
                    <div className="from-background/80 via-foreground/50 absolute inset-0 bg-linear-to-t to-transparent" />

                    <div className="text-foreground absolute inset-0 flex flex-col justify-between p-6">
                      <div className="flex items-start justify-between">
                        <div
                          className={`rounded-md border px-3 py-1 text-[10px] font-bold tracking-widest uppercase backdrop-blur-md ${
                            isUnlocked
                              ? 'bg-foreground text-background border-foreground'
                              : 'bg-background/50 text-foreground border-foreground/20'
                          }`}
                        >
                          {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                        </div>
                        <div className="text-right">
                          <span className="block text-2xl leading-none font-bold">
                            ₹{milestone.rewardAmount}
                          </span>
                          <span className="text-[9px] tracking-wide uppercase opacity-70">
                            Credit
                          </span>
                        </div>
                      </div>

                      <div className="translate-y-2 transform text-center transition-transform group-hover:translate-y-0">
                        {!isUnlocked && <LockIcon className="mx-auto mb-2 opacity-50" size={24} />}
                        <h3 className="text-xl font-bold tracking-tight">{milestone.title}</h3>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold tracking-wider uppercase opacity-80">
                          <span>Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="bg-foreground/20 h-2 w-full overflow-hidden rounded-full backdrop-blur-sm">
                          <div
                            className="bg-foreground h-full shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-[10px] opacity-60">
                            Spent ₹{milestone.currentAmount} / ₹{milestone.targetAmount}
                          </p>
                          {isUnlocked && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-green-400">
                              Active <CheckCircleIcon size={10} />
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

      {/* --- CLAIM MODAL --- */}
      {selectedTask && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="bg-background/30 absolute inset-0 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedTask(null)}
          />

          <div className="bg-background relative w-full max-w-sm rounded-3xl p-8 shadow-2xl">
            <button
              onClick={() => setSelectedTask(null)}
              className="hover:text-foreground absolute top-4 right-4 p-2 text-zinc-500 transition-colors"
            >
              <CloseIcon size={20} />
            </button>

            <div className="mb-6 text-center">
              <div
                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg ${selectedTask.cardStyle}`}
              >
                {selectedTask.icon}
              </div>
              <h3 className="text-xl font-bold">Claim ₹{selectedTask.rewardAmount}</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Enter your username. We will verify that you followed our profile.
              </p>
            </div>

            <form onSubmit={handleSubmitClaim} className="space-y-4">
              <div className="space-y-2 text-left">
                <label className="ml-1 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                  Your Handle
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder={selectedTask.placeholder}
                  className="bg-background focus:ring-foreground focus:border-foreground text-foreground w-full rounded-xl border border-zinc-800 px-4 py-4 text-sm font-medium transition-all outline-none placeholder:text-zinc-700 focus:ring-1"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !usernameInput.trim()}
                className="bg-foreground text-background flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold transition-all hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <LoaderIcon size={16} className="animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    <SendIcon size={16} /> Submit Request
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
