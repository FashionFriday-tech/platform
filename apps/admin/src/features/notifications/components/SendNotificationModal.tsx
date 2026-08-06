'use client';

import React, { useEffect, useState } from 'react';

import { BellIcon, CheckIcon, UsersIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { type SendNotificationPayload, type TargetUser } from '../types';

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (payload: SendNotificationPayload) => Promise<{ success: boolean; message?: string }>;
  isSending: boolean;
}

export function SendNotificationModal({
  isOpen,
  onClose,
  onSend,
  isSending,
}: SendNotificationModalProps) {
  const [targetType, setTargetType] = useState<'CUSTOMERS' | 'USER' | 'ADMIN'>('CUSTOMERS');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<'promo' | 'announcement' | 'order' | 'system'>('promo');
  const [linkUrl, setLinkUrl] = useState('');
  const [badge, setBadge] = useState('DROP LIVE');
  const [sendPush, setSendPush] = useState(true);

  // Users for specific targeting
  const [users, setUsers] = useState<TargetUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<TargetUser | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    if (isOpen && targetType === 'USER' && users.length === 0) {
      setIsLoadingUsers(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      fetch(`${apiUrl}/admin/notifications/users`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data)) setUsers(data);
        })
        .catch(() => {})
        .finally(() => setIsLoadingUsers(false));
    }
  }, [isOpen, targetType, users.length]);

  if (!isOpen) return null;

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    if (targetType === 'USER' && !selectedUser) {
      alert('Please select a recipient user');
      return;
    }

    const payload: SendNotificationPayload = {
      title: title.trim(),
      message: message.trim(),
      type: category,
      target: targetType === 'USER' ? (selectedUser?.id ?? 'USER') : targetType,
      userId: targetType === 'USER' ? selectedUser?.id : null,
      targetUserName: targetType === 'USER' ? selectedUser?.name : null,
      linkUrl: linkUrl.trim() || null,
      badge: badge.trim() || null,
      sendPush,
    };

    const res = await onSend(payload);
    if (res.success) {
      setTitle('');
      setMessage('');
      setLinkUrl('');
      setSelectedUser(null);
      onClose();
    } else {
      alert(res.message || 'Failed to send notification');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm dark:bg-black/70"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl sm:rounded-3xl dark:border-white/10 dark:bg-[#121212]"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-black/5 p-4 sm:p-6 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6a4fbb]/10 text-[#6a4fbb] dark:bg-[#6a4fbb]/20">
                <BellIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-black sm:text-lg dark:text-white">
                  Send Custom Notification
                </h2>
                <p className="text-xs text-black/50 dark:text-white/50">
                  Deliver in-app alerts and real-time push messages to users
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-black/40 hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form Body */}
          <form
            onSubmit={handleSubmit}
            className="scrollbar-hide flex-1 space-y-4 overflow-y-auto p-4 sm:space-y-5 sm:p-6"
          >
            {/* Target Audience Selector */}
            <div>
              <label className="mb-2 block text-xs font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
                Target Audience
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'CUSTOMERS', label: 'All Customers', icon: '👥' },
                  { id: 'USER', label: 'Specific User', icon: '👤' },
                  { id: 'ADMIN', label: 'Admins Only', icon: '🛡️' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setTargetType(opt.id as any);
                    }}
                    className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-2.5 text-center transition-all sm:p-3 ${
                      targetType === opt.id
                        ? 'border-[#6a4fbb] bg-[#6a4fbb]/10 text-[#6a4fbb] shadow-sm'
                        : 'border-black/5 bg-[#f8f9fa] text-black/70 hover:bg-black/5 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white/70'
                    }`}
                  >
                    <span className="text-base">{opt.icon}</span>
                    <span className="text-xs font-bold">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* If Specific User Selected */}
            {targetType === 'USER' && (
              <div className="rounded-xl border border-black/5 bg-[#f8f9fa] p-3 dark:border-white/5 dark:bg-[#1a1a1a]">
                <label className="mb-1.5 block text-xs font-semibold text-black/70 dark:text-white/70">
                  Select Recipient Customer
                </label>
                {selectedUser ? (
                  <div className="flex items-center justify-between rounded-lg border border-black/10 bg-white p-2.5 dark:border-white/10 dark:bg-[#222]">
                    <div>
                      <p className="text-xs font-bold text-black dark:text-white">
                        {selectedUser.name}
                      </p>
                      <p className="text-[11px] text-black/40 dark:text-white/40">
                        {selectedUser.phone || selectedUser.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedUser(null)}
                      className="text-xs font-bold text-red-500 hover:underline"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="Search customer by name or phone..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="mb-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-xs text-black outline-none focus:border-[#6a4fbb] dark:border-white/10 dark:bg-[#222] dark:text-white"
                    />
                    <div className="max-h-36 overflow-y-auto space-y-1">
                      {isLoadingUsers ? (
                        <p className="p-2 text-xs text-black/40 dark:text-white/40">Loading users...</p>
                      ) : filteredUsers.length === 0 ? (
                        <p className="p-2 text-xs text-black/40 dark:text-white/40">No matching customers found</p>
                      ) : (
                        filteredUsers.map((u) => (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => setSelectedUser(u)}
                            className="flex w-full items-center justify-between rounded-lg p-2 text-left text-xs transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                          >
                            <span className="font-bold text-black dark:text-white">{u.name}</span>
                            <span className="text-[11px] text-black/40 dark:text-white/40">
                              {u.phone || u.email}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notification Title */}
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ⚡ Exclusive Flash Drop: 25% Off"
                className="w-full rounded-xl border border-black/10 bg-[#f8f9fa] px-3.5 py-2.5 text-xs text-black placeholder-black/30 transition-all outline-none focus:border-[#6a4fbb] focus:bg-white sm:text-sm dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:bg-[#222]"
              />
            </div>

            {/* Notification Message */}
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your announcement or promotion message here..."
                className="w-full rounded-xl border border-black/10 bg-[#f8f9fa] p-3 text-xs text-black placeholder-black/30 transition-all outline-none focus:border-[#6a4fbb] focus:bg-white sm:text-sm dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:bg-[#222]"
              />
            </div>

            {/* Category and Badge Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-black/10 bg-[#f8f9fa] px-3 py-2 text-xs font-semibold text-black outline-none focus:border-[#6a4fbb] sm:text-sm dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white"
                >
                  <option value="promo">Promo & Drops</option>
                  <option value="announcement">Announcement</option>
                  <option value="order">Order Update</option>
                  <option value="system">System Notice</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
                  Badge Tag
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. DROP LIVE, OFFER, ALERT"
                  className="w-full rounded-xl border border-black/10 bg-[#f8f9fa] px-3 py-2 text-xs font-mono text-black uppercase outline-none focus:border-[#6a4fbb] sm:text-sm dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white"
                />
              </div>
            </div>

            {/* Action Link URL */}
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
                Action Link URL (Optional)
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="e.g. /collections/sneakers or /products/nike-air"
                className="w-full rounded-xl border border-black/10 bg-[#f8f9fa] px-3.5 py-2 text-xs text-black placeholder-black/30 outline-none focus:border-[#6a4fbb] sm:text-sm dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white"
              />
            </div>

            {/* Web Push Notification Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-black/5 bg-[#f8f9fa] p-3 sm:p-4 dark:border-white/5 dark:bg-[#1a1a1a]">
              <div>
                <p className="text-xs font-bold text-black sm:text-sm dark:text-white">
                  Send Push Notification
                </p>
                <p className="text-[11px] text-black/50 dark:text-white/50">
                  Dispatches an instant device notification to subscribers even when browser is closed
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSendPush(!sendPush)}
                className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors focus:outline-none ${
                  sendPush ? 'bg-emerald-500' : 'bg-zinc-600'
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                    sendPush ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSending}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-black/5 disabled:opacity-50 dark:text-white dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !message.trim() || isSending}
                className="flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-black/90 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                {isSending && (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white dark:border-black/20 dark:border-t-black" />
                )}
                <span>{isSending ? 'Sending...' : 'Send Notification'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
