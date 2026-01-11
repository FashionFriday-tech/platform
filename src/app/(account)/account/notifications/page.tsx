// app/notifications/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Tag, 
  Info, 
  Check, 
  Clock, 
  ChevronRight, 
  Bell 
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { IoIosArrowBack } from "react-icons/io";

// --- Utility for Tailwind classes ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type NotificationType = 'order' | 'promo' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'order', title: 'Order Shipped', message: 'Your order #FF-2025 has been shipped. Track your shipment now.', timestamp: '2 mins ago', isRead: false },
  { id: '2', type: 'promo', title: 'Flash Sale Alert', message: 'The Monochrome Collection is now 40% off. Limited time only.', timestamp: '1 hour ago', isRead: false },
  { id: '3', type: 'system', title: 'Password Updated', message: 'Your account security details were successfully updated.', timestamp: 'Yesterday', isRead: true },
  { id: '4', type: 'order', title: 'Order Delivered', message: 'Order #FF-2023 has been delivered at your doorstep.', timestamp: '2 days ago', isRead: true },
  { id: '5', type: 'promo', title: 'Back in Stock', message: 'The Oversized Linen Shirt (White) you liked is back in stock.', timestamp: '3 days ago', isRead: true }
];

// --- Sub-Components ---

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  const iconProps = "w-5 h-5 text-brand-foreground";
  switch (type) {
    case 'order': return <ShoppingBag className={iconProps} />;
    case 'promo': return <Tag className={iconProps} />;
    default: return <Info className={iconProps} />;
  }
};

const NotificationItem = ({ 
  notification, 
  onRead 
}: { 
  notification: Notification; 
  onRead: (id: string) => void; 
}) => {
  return (
    <div 
      onClick={() => onRead(notification.id)}
      className={cn(
        "group flex gap-4 p-5 border-b border-border transition-all duration-default ease-default cursor-pointer",
        "hover:bg-background-muted",
        !notification.isRead && "bg-background-muted/40"
      )}
    >
      {/* Icon Wrapper - Uses Brand Colors */}
      <div className="shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-brand">
        <NotificationIcon type={notification.type} />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-start">
          <h3 className={cn(
            "text-sm font-medium leading-none transition-colors",
            !notification.isRead ? "text-foreground font-bold" : "text-foreground-muted"
          )}>
            {notification.title}
          </h3>
          <span className="text-xs text-foreground-subtle flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {notification.timestamp}
          </span>
        </div>
        <p className="text-sm text-foreground-muted leading-relaxed pr-8">
          {notification.message}
        </p>
        
        {notification.type === 'order' && (
          <div className="pt-2 flex items-center text-xs font-semibold text-brand uppercase tracking-wider group-hover:underline">
            View Details <ChevronRight className="w-3 h-3 ml-1" />
          </div>
        )}
      </div>

      {/* Unread Dot - Uses Accent color */}
      {!notification.isRead && (
        <div className="w-2.5 h-2.5 rounded-full bg-accent mt-1.5 shrink-0 animate-pulse" />
      )}
    </div>
  );
};

// --- Main Page ---

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'orders' | 'promotions'>('all');
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  const markOneRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'orders') return n.type === 'order';
    if (activeTab === 'promotions') return n.type === 'promo';
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-default md:mt-20">
      
      {/* Header Section */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-1 -ml-1 hover:bg-background-muted rounded-full transition-colors">
                <IoIosArrowBack className='text-2xl text-foreground'/>
            </button>
            <h1 className="text-xl font-bold tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-brand text-brand-foreground text-[10px] font-bold px-3 py-1 rounded-full">
                {unreadCount} NEW
              </span>
            )}
          </div>
          
          <button 
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="text-xs font-medium text-foreground-subtle hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            Mark all read
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <nav className="w-full flex justify-between gap-6 overflow-x-auto no-scrollbar">
            {(['all', 'orders', 'promotions'] as const).map((id) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "w-full pb-3 text-sm text-center font-medium border-b-2 transition-all capitalize",
                  activeTab === id 
                    ? "border-brand text-foreground" 
                    : "border-transparent text-foreground-subtle hover:text-foreground-muted"
                )}
              >
                {id}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto pb-20">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-background-muted rounded-full flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-foreground-subtle" />
            </div>
            <h3 className="text-base font-semibold text-foreground">No notifications yet</h3>
            <p className="text-sm text-foreground-subtle mt-1 max-w-xs">
              We'll notify you when your orders are shipped or when we have special offers for you.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredNotifications.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onRead={markOneRead}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}