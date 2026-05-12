'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  if (!user) {
    return null;
  }

  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateUser({ avatar: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveName = () => {
    if (editName.trim()) {
      updateUser({ name: editName.trim() });
    }
    setIsEditingName(false);
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden p-6">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-white to-white dark:from-indigo-900/20 dark:via-[#0a0a0a] dark:to-[#0a0a0a]" />

      <div className="flex flex-1 flex-col overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
        <div className="flex flex-1 flex-col overflow-hidden p-10">
          <div className="relative mb-8 flex shrink-0 items-end justify-between">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
              {/* Avatar Section */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-20 blur-md transition-opacity duration-500 group-hover:opacity-40" />
                <div
                  className="group relative flex h-32 w-32 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-[3px] border-white/80 bg-zinc-100 text-4xl font-bold text-black shadow-xl transition-all duration-300 hover:scale-[1.02] dark:border-white/10 dark:bg-zinc-900 dark:text-white"
                  onClick={handleAvatarClick}
                  title="Change Profile Picture"
                >
                  {user.avatar ? (
                    <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                  ) : (
                    user.initials
                  )}

                  {/* Hover Overlay for Avatar */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                    <svg
                      className="h-8 w-8 scale-75 text-white transition-transform duration-300 group-hover:scale-100"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Name & Role Section */}
              <div className="flex flex-col justify-center">
                {isEditingName ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => {
                        setEditName(e.target.value);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && saveName()}
                      className="rounded-xl border border-black/20 bg-white/50 px-4 py-2 text-3xl font-extrabold text-black shadow-inner backdrop-blur-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-white/20 dark:bg-black/50 dark:text-white"
                      autoFocus
                    />
                    <button
                      onClick={saveName}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 hover:bg-indigo-700"
                      title="Save"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setEditName(user.name);
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-black transition-all hover:scale-105 hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                      title="Cancel"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h1 className="bg-gradient-to-br from-zinc-900 to-zinc-500 bg-clip-text text-4xl font-extrabold text-transparent dark:from-white dark:to-zinc-400">
                      {user.name}
                    </h1>
                    <button
                      onClick={() => {
                        setIsEditingName(true);
                      }}
                      className="rounded-full p-2 text-black/30 transition-all hover:bg-black/5 hover:text-indigo-600 dark:text-white/30 dark:hover:bg-white/10 dark:hover:text-indigo-400"
                      title="Edit Name"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                <div className="mt-2 inline-flex w-fit items-center rounded-full border border-black/5 bg-black/[0.03] px-3 py-1 dark:border-white/5 dark:bg-white/[0.03]">
                  <p className="text-sm font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
                    {user.role.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-1">
              <button
                onClick={() => {
                  logout();
                }}
                className="group flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-3 text-xs font-black tracking-widest text-red-600 uppercase transition-all duration-300 hover:bg-red-600 hover:text-white active:scale-[0.98] dark:border-red-500/10 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
              >
                Log Out
              </button>
            </div>
          </div>

          {/* Two-Column Layout */}
          <div className="grid flex-1 gap-8 overflow-hidden md:grid-cols-2">
            {/* Left Column */}
            <div className="scrollbar-hide flex flex-col overflow-y-auto rounded-3xl border border-white/60 bg-white/40 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/20">
              <h3 className="mb-6 flex items-center gap-3 text-xs font-bold tracking-widest text-black/40 uppercase dark:text-white/40">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                Account Information
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold tracking-wider text-black/40 uppercase dark:text-white/40">
                    Email Address
                  </label>
                  <p className="text-lg font-medium text-black dark:text-white">
                    {user.name.split(' ')[0].toLowerCase()}@fashionfriday.com
                  </p>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold tracking-wider text-black/40 uppercase dark:text-white/40">
                    Contact Number
                  </label>
                  <p className="text-lg font-medium text-black dark:text-white">
                    {user.phone || '+1 (555) 000-0000'}
                  </p>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold tracking-wider text-black/40 uppercase dark:text-white/40">
                    Role Access
                  </label>
                  <div className="inline-flex items-center text-lg font-medium text-black dark:text-white">
                    {user.role.replace('_', ' ')}
                  </div>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold tracking-wider text-black/40 uppercase dark:text-white/40">
                    Account Status
                  </label>
                  <div className="flex items-center gap-2.5 text-lg font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </span>
                    Active
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Recent Activities */}
            <div className="flex flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/40 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/20">
              <h3 className="mb-6 flex shrink-0 items-center gap-3 text-xs font-bold tracking-widest text-black/40 uppercase dark:text-white/40">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                My Recent Activities
              </h3>

              <div className="scrollbar-hide relative flex flex-1 flex-col gap-8 overflow-y-auto pr-4 before:absolute before:top-2 before:left-[19px] before:h-[calc(100%-16px)] before:w-[2px] before:bg-gradient-to-b before:from-indigo-500/30 before:via-purple-500/20 before:to-transparent">
                {[
                  {
                    title: 'Updated profile picture',
                    time: 'Just now',
                    icon: (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    ),
                    color: 'text-blue-500',
                    bg: 'bg-blue-500/10',
                  },
                  {
                    title: 'Approved Order #4829',
                    time: '2 hours ago',
                    icon: (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    ),
                    color: 'text-emerald-500',
                    bg: 'bg-emerald-500/10',
                  },
                  {
                    title: 'Changed notification preferences',
                    time: 'Yesterday',
                    icon: (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    ),
                    color: 'text-zinc-500',
                    bg: 'bg-zinc-500/10',
                  },
                  {
                    title: 'Updated Fall Collection',
                    time: '2 days ago',
                    icon: (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      />
                    ),
                    color: 'text-purple-500',
                    bg: 'bg-purple-500/10',
                  },
                  {
                    title: 'Reviewed analytics dashboard',
                    time: '3 days ago',
                    icon: (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    ),
                    color: 'text-indigo-500',
                    bg: 'bg-indigo-500/10',
                  },
                  {
                    title: 'Logged in',
                    time: '1 week ago',
                    icon: (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    ),
                    color: 'text-zinc-500',
                    bg: 'bg-zinc-500/10',
                  },
                ].map((activity, i) => (
                  <div
                    key={i}
                    className="group/item relative z-10 flex shrink-0 gap-6 transition-all duration-300 hover:translate-x-1"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm ring-4 ring-white transition-colors duration-300 dark:ring-[#1a1a1a] ${activity.bg} ${activity.color}`}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        {activity.icon}
                      </svg>
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <p className="text-sm font-semibold text-black transition-colors duration-300 group-hover/item:text-indigo-600 dark:text-white dark:group-hover/item:text-indigo-400">
                        {activity.title}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-black/50 dark:text-white/50">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
