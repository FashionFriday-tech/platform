'use client';

import { Toaster } from 'sonner';

export function AdminToaster() {
  return (
    <Toaster
      position="top-right"
      theme="system"
      toastOptions={{
        style: {
          background: '#09090b',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
        },
        classNames: {
          toast: 'group !bg-[#09090b] !text-white !border !border-white/15 !rounded-2xl !p-4',
          title: '!text-white !font-bold',
          description: '!text-white/70',
          actionButton: '!bg-white !text-black !font-bold',
          cancelButton: '!bg-white/10 !text-white',
          success: '!border-l-4 !border-l-emerald-500 [&_[data-icon]]:!text-emerald-400',
          error: '!border-l-4 !border-l-red-500 [&_[data-icon]]:!text-red-400',
          warning: '!border-l-4 !border-l-amber-500 [&_[data-icon]]:!text-amber-400',
          info: '!border-l-4 !border-l-blue-500 [&_[data-icon]]:!text-blue-400',
        },
      }}
    />
  );
}
