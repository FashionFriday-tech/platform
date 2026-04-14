import React from 'react';

import { ShoppingBagIcon, TagIcon } from '@ff/ui';

import { type Notification } from '../types';

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { type, title, timestamp, message } = notification;
  return (
    <div className="flex gap-4 p-5">
      <div className="bg-foreground text-background flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
        {type === 'order' ? <ShoppingBagIcon size={25} /> : <TagIcon size={25} />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate text-[14px] font-semibold">{title}</h3>
          <span className="text-foreground/40 shrink-0 text-[10px] font-medium uppercase">
            {timestamp}
          </span>
        </div>
        <p className="text-foreground/60 mt-0.5 line-clamp-2 text-[13px] leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}
