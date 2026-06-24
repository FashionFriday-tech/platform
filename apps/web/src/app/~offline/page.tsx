'use client';

import Image from 'next/image';

import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto max-w-3xl space-y-10">
        <div className="bg-muted/50 mx-auto flex h-24 w-24 items-center justify-center rounded-full backdrop-blur-sm">
          <WifiOff className="text-muted-foreground h-10 w-10" />
        </div>

        <div className="space-y-4">
          <h1 className="text-foreground text-4xl font-extrabold tracking-tight sm:text-6xl">
            You are offline.
          </h1>
          <p className="text-muted-foreground text-xl">
            Please connect to the internet to shop our latest collections.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"
              alt="Fashion Model 1"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800"
              alt="Fashion Model 2"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="pt-8">
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-10 py-4 text-lg font-medium transition-transform hover:scale-105 active:scale-95"
          >
            Retry Connection
          </button>
        </div>
      </div>
    </div>
  );
}
