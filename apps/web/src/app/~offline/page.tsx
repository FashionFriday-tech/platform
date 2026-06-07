'use client';

import Image from 'next/image';
import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-center">
      <div className="mx-auto max-w-3xl space-y-10">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted/50 backdrop-blur-sm">
          <WifiOff className="h-10 w-10 text-muted-foreground" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
            You are offline.
          </h1>
          <p className="text-xl text-muted-foreground">
            Please connect to the internet to shop our latest collections.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-12">
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
            onClick={() => window.location.reload()}
            className="rounded-full bg-foreground px-10 py-4 text-lg font-medium text-background transition-transform hover:scale-105 hover:bg-foreground/90 active:scale-95"
          >
            Retry Connection
          </button>
        </div>
      </div>
    </div>
  );
}
