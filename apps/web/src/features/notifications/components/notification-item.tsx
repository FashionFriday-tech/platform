'use client';

import React from 'react';
import Link from 'next/link';

import { ShoppingBagIcon, TagIcon } from '@ff/ui';

import { type Notification } from '../types';

interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: string) => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const { id, type, title, timestamp, message, link, isRead, badge } = notification;

  const content = (
    <div
      onClick={() => {
        onRead?.(id);
      }}
      className={`group hover:bg-foreground/[0.03] active:bg-foreground/[0.06] relative flex cursor-pointer gap-4 p-5 transition-colors duration-200 ${
        !isRead ? 'bg-foreground/[0.02]' : ''
      }`}
    >
      {/* Icon Avatar with subtle unread indicator dot */}
      <div className="relative shrink-0">
        <div className="bg-foreground text-background flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105">
          {type === 'order' ? <ShoppingBagIcon size={22} /> : <TagIcon size={22} />}
        </div>
        {!isRead && (
          <span
            className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-black"
            title="Unread notification"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <h3
              className={`truncate text-[14px] ${
                !isRead ? 'text-foreground font-bold' : 'text-foreground/90 font-semibold'
              }`}
            >
              {title}
            </h3>
            {badge && (
              <span className="bg-foreground/10 text-foreground/70 shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] font-black tracking-wider uppercase">
                {badge}
              </span>
            )}
          </div>
          <span className="text-foreground/40 shrink-0 text-[10px] font-medium tracking-wide uppercase">
            {timestamp}
          </span>
        </div>
        <p className="text-foreground/60 mt-0.5 line-clamp-2 text-[13px] leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );

  if (link) {
    return (
      <Link href={link} className="block outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
