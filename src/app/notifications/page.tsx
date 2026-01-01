// app/notifications/page.tsx
'use client';

import React, { useState } from 'react';
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
  image?: string; // Optional: specific product image
  actionUrl?: string;
}

// --- Mock Data ---
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Order Shipped',
    message: 'Your order #FF-2025 has been shipped. Track your shipment now.',
    timestamp: '2 mins ago',
    isRead: false,
  },
  {
    id: '2',
    type: 'promo',
    title: 'Flash Sale Alert',
    message: 'The Monochrome Collection is now 40% off. Limited time only.',
    timestamp: '1 hour ago',
    isRead: false,
  },
  {
    id: '3',
    type: 'system',
    title: 'Password Updated',
    message: 'Your account security details were successfully updated.',
    timestamp: 'Yesterday',
    isRead: true,
  },
  {
    id: '4',
    type: 'order',
    title: 'Order Delivered',
    message: 'Order #FF-2023 has been delivered at your doorstep.',
    timestamp: '2 days ago',
    isRead: true,
  },
  {
    id: '5',
    type: 'promo',
    title: 'Back in Stock',
    message: 'The Oversized Linen Shirt (White) you liked is back in stock.',
    timestamp: '3 days ago',
    isRead: true,
  }
];

// --- Components ---

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case 'order':
      return <ShoppingBag className="w-5 h-5 text-white" />;
    case 'promo':
      return <Tag className="w-5 h-5 text-white" />;
    case 'system':
    default:
      return <Info className="w-5 h-5 text-white" />;
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
        "group flex gap-4 p-5 border-b border-neutral-100 transition-all duration-300 hover:bg-neutral-50 cursor-pointer",
        !notification.isRead && "bg-neutral-50/50"
      )}
    >
      {/* Icon Wrapper */}
      <div className={cn(
        "shrink-0 w-12 h-12 flex items-center justify-center rounded-full border transition-colors",
        !notification.isRead 
          ? "border-black bg-black" 
          : "border-black bg-black"
      )}>
        <NotificationIcon type={notification.type} />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-start">
          <h3 className={cn(
            "text-sm font-medium leading-none",
            !notification.isRead ? "text-black font-semibold" : "text-neutral-600"
          )}>
            {notification.title}
          </h3>
          <span className="text-xs text-neutral-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {notification.timestamp}
          </span>
        </div>
        <p className="text-sm text-neutral-500 leading-relaxed pr-8">
          {notification.message}
        </p>
        
        {/* Optional Action Hint */}
        {notification.type === 'order' && (
          <div className="pt-2 flex items-center text-xs font-semibold text-black uppercase tracking-wider group-hover:underline">
            View Details <ChevronRight className="w-3 h-3 ml-1" />
          </div>
        )}
      </div>

      {/* Unread Dot */}
      {!notification.isRead && (
        <div className="w-2 h-2 rounded-full bg-black mt-1.5 shrink-0 animate-pulse" />
      )}
    </div>
  );
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'orders' | 'promotions'>('all');
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markOneRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Filter Logic
  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'orders') return n.type === 'order';
    if (activeTab === 'promotions') return n.type === 'promo';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      
      {/* Header Section */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             {/* Simple Back button could go here */}
             <IoIosArrowBack className='text-2xl'/>
            <h1 className="text-xl font-bold tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount} NEW
              </span>
            )}
          </div>
          
          <button 
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="text-xs font-medium text-neutral-500 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            Mark all read
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <nav className="w-full flex justify-between gap-6 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All' },
              { id: 'orders', label: 'Orders' },
              { id: 'promotions', label: 'Promotions' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "w-full pb-3 text-sm text-center font-medium border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab.id 
                    ? "border-black text-black" 
                    : "border-transparent text-neutral-400 hover:text-neutral-600"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto pb-20">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-neutral-300" />
            </div>
            <h3 className="text-base font-semibold text-black">No notifications yet</h3>
            <p className="text-sm text-neutral-500 mt-1 max-w-xs">
              We'll notify you when your orders are shipped or when we have special offers for you.
            </p>
          </div>
        ) : (
          <div className="bg-white">
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