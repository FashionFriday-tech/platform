import React from 'react';
import Image from 'next/image';

interface Props {
  user: any;
  isEditingName: boolean;
  setIsEditingName: (val: boolean) => void;
  editName: string;
  setEditName: (val: string) => void;
  saveName: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleAvatarClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  logout: () => void;
}

export function ProfileHeader({
  user,
  isEditingName, setIsEditingName,
  editName, setEditName,
  saveName,
  fileInputRef, handleAvatarClick, handleFileChange,
  logout
}: Props) {
  return (
    <div className="relative mb-8 flex shrink-0 items-end justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center gap-8">
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
              <svg className="h-8 w-8 text-white scale-75 transition-transform duration-300 group-hover:scale-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
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
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveName()}
                className="rounded-xl border border-black/20 bg-white/50 backdrop-blur-sm px-4 py-2 text-3xl font-extrabold text-black shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-white/20 dark:bg-black/50 dark:text-white"
                autoFocus
              />
              <button onClick={saveName} className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700 hover:scale-105" title="Save">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button onClick={() => { setIsEditingName(false); setEditName(user.name); }} className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-black transition-all hover:bg-black/10 hover:scale-105 dark:bg-white/10 dark:text-white dark:hover:bg-white/20" title="Cancel">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h1 className="bg-gradient-to-br from-zinc-900 to-zinc-500 bg-clip-text text-4xl font-extrabold text-transparent dark:from-white dark:to-zinc-400">{user.name}</h1>
              <button onClick={() => setIsEditingName(true)} className="rounded-full p-2 text-black/30 transition-all hover:bg-black/5 hover:text-indigo-600 dark:text-white/30 dark:hover:bg-white/10 dark:hover:text-indigo-400" title="Edit Name">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          )}
          <div className="mt-2 inline-flex items-center rounded-full border border-black/5 bg-black/[0.03] px-3 py-1 w-fit dark:border-white/5 dark:bg-white/[0.03]">
            <p className="text-sm font-bold tracking-wider text-black/60 dark:text-white/60 uppercase">
              {user.role.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-1">
        <button
          onClick={() => logout()}
          className="group flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-3 text-xs font-black tracking-widest text-red-600 uppercase transition-all duration-300 hover:bg-red-600 hover:text-white dark:border-red-500/10 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white active:scale-[0.98]"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
