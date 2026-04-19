import React, { useState } from 'react';
import Image from 'next/image';

import { ChevronRightIcon } from '@ff/ui';

import { cn } from '@/lib/utils';

interface SubWalletCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  action: string;
  color?: string;
}

export function SubWalletCard({ label, value, icon, description, action }: SubWalletCardProps) {
  const [openWallet, setOpenWallet] = useState(false);

  return (
    <div
      onClick={() => {
        setOpenWallet(!openWallet);
      }}
      className="bg-background border-border hover:border-foreground/20 group relative flex h-72 cursor-pointer flex-col justify-between rounded-[3.5rem] border p-8 shadow-sm"
    >
      <div
        className={cn(
          'border-border bg-foreground absolute left-0 z-20 w-full rounded-4xl border-t py-20 transition-all duration-300',
          openWallet ? '-top-6' : 'top-6',
        )}
      >
        <h3 className="text-background absolute top-5 right-5 mb-2 text-3xl font-semibold tracking-tighter italic">
          {value}
        </h3>
        <Image
          src="/images/wallet/chip.png"
          alt="Card chip"
          width={48}
          height={48}
          className="absolute top-6 left-6 h-auto w-12"
        />
      </div>
      <div className="border-border bg-background absolute top-14 right-2 left-2 z-40 w-auto rounded-4xl border-t-2 border-dashed py-20" />
      <div className="border-border bg-background absolute top-12 left-0 z-30 w-full rounded-4xl border-t py-20" />

      <div className="z-50 pt-12">
        <div className="text-foreground flex items-center justify-between">
          <div className="bg-foreground/5 text-foreground group-hover:bg-foreground group-hover:text-background rounded-[1.25rem] p-4 transition-all duration-700">
            {icon}
          </div>
          <p className="text-sm font-black tracking-widest uppercase">{label}</p>
          <div className="p-4">
            <ChevronRightIcon
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </div>
        </div>
      </div>

      <div className="border-border flex items-center justify-between border-t pt-6">
        <p className="max-w-40 text-[10px] leading-tight font-bold uppercase italic opacity-30">
          {description}
        </p>
        <button className="text-foreground text-[10px] font-black tracking-widest uppercase underline underline-offset-8 transition-colors">
          {action}
        </button>
      </div>
    </div>
  );
}
