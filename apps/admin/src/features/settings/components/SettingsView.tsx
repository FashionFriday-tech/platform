'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import {
  BellIcon,
  BellOffIcon,
  CheckCircleIcon,
  CheckIcon,
  PackageIcon,
  SettingsIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  ZapIcon,
} from '@ff/ui';
import { motion } from 'motion/react';

import { useAuth } from '@/contexts/AuthContext';
import { usePushNotifications } from '@/contexts/PushNotificationContext';

export function SettingsView() {
  const { user } = useAuth();
  const {
    isSupported,
    permission,
    isEnabled,
    preferences,
    isInstallable,
    isInstalled,
    isIOS,
    installPwaApp,
    activatePushNotifications,
    deactivatePushNotifications,
    togglePreference,
    sendTestNotification,
  } = usePushNotifications();

  const [isActivating, setIsActivating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleActivate = async () => {
    setIsActivating(true);
    try {
      await activatePushNotifications();
    } finally {
      setIsActivating(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      await sendTestNotification();
    } finally {
      setIsTesting(false);
    }
  };

  const isGrantedAndEnabled = permission === 'granted' && isEnabled;

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-black uppercase sm:text-3xl dark:text-white">
            System Settings
          </h1>
          <p className="text-xs font-medium text-black/60 sm:text-sm dark:text-white/60">
            Configure live order push notifications, alert channels, and administrative preferences.
          </p>
        </div>

        <Link
          href="/notifications"
          className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-xs font-bold text-black shadow-xs transition-all hover:bg-black/5 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        >
          <BellIcon className="h-4 w-4" />
          <span>View Notification Center</span>
        </Link>
      </div>

      <div className="flex max-w-5xl flex-col gap-8">
        {/* =========================================================
            HERO CARD: PUSH NOTIFICATIONS
           ========================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-white via-slate-50 to-zinc-100 p-6 shadow-md sm:p-8 dark:border-white/10 dark:from-[#111115] dark:via-[#0c0c0e] dark:to-black dark:shadow-xl"
        >
          {/* Background Ambient Glow */}
          <div
            className={`pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl transition-opacity ${
              isGrantedAndEnabled ? 'bg-emerald-500/10' : 'bg-amber-500/10'
            }`}
          />

          {/* Top Status Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-colors ${
                  isGrantedAndEnabled
                    ? 'bg-emerald-500 text-white'
                    : 'bg-black text-white dark:bg-white dark:text-black'
                }`}
              >
                {isGrantedAndEnabled ? (
                  <BellIcon className="h-6 w-6" />
                ) : (
                  <BellOffIcon className="h-6 w-6" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-black uppercase sm:text-xl dark:text-white">
                  Push Notifications
                </h2>
                <p className="text-xs text-black/60 dark:text-white/60">
                  Real-time browser notifications for customer orders and inventory
                </p>
              </div>
            </div>

            {/* Status Pill Badge */}
            <div className="flex items-center gap-2">
              {isGrantedAndEnabled ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-bold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  <span>Active &amp; Listening</span>
                </div>
              ) : permission === 'denied' ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 font-mono text-[11px] font-bold tracking-wider text-red-600 uppercase dark:text-red-400">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Permission Blocked</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[11px] font-bold tracking-wider text-amber-700 uppercase dark:text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>Inactive</span>
                </div>
              )}
            </div>
          </div>

          {/* Description & Action Trigger */}
          <div className="mb-8 rounded-2xl border border-black/5 bg-white/60 p-5 backdrop-blur-sm dark:border-white/5 dark:bg-white/[0.02]">
            {isGrantedAndEnabled ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    Live Order Alerts are enabled on this device
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-black/60 dark:text-white/60">
                    Whenever a customer places an order or updates are made, you will receive an
                    instant desktop notification even when browsing other applications.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTest}
                    disabled={isTesting}
                    className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs font-bold text-black shadow-xs transition-all hover:bg-black/5 active:scale-95 disabled:opacity-50 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                  >
                    <ZapIcon className="h-4 w-4" />
                    <span>{isTesting ? 'Sending...' : 'Send Test Alert'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={deactivatePushNotifications}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-600 transition-all hover:bg-red-500/20 active:scale-95 dark:text-red-400"
                  >
                    <span>Pause Alerts</span>
                  </button>
                </div>
              </div>
            ) : permission === 'denied' ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                  Browser notification permissions were blocked
                </p>
                <p className="text-xs leading-relaxed text-black/60 dark:text-white/60">
                  To receive order alerts, click the lock or settings icon in your browser URL bar,
                  set <strong>Notifications</strong> to <strong>Allow</strong>, and refresh the
                  page.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    Stay updated when new orders are placed
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-black/60 dark:text-white/60">
                    Turn on push notifications to receive immediate audible and visual alerts on
                    your screen the moment a new purchase or update arrives.
                  </p>
                </div>

                {/* THE PRIMARY ACTIVATE BUTTON */}
                <button
                  type="button"
                  onClick={handleActivate}
                  disabled={isActivating || !isSupported}
                  className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-black px-6 py-3.5 text-xs font-black tracking-wider text-white uppercase shadow-lg transition-all hover:bg-zinc-800 hover:shadow-xl active:scale-95 disabled:opacity-50 sm:shrink-0 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  <BellIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span>{isActivating ? 'Activating...' : 'Activate Push Notifications'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Preferences Toggles List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
              Notification Preferences
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Toggle 1: New Orders */}
              <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/40 p-4 transition-colors hover:bg-white/80 dark:border-white/5 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-black dark:bg-white/5 dark:text-white">
                    <ShoppingBagIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-black dark:text-white">New Order Alerts</p>
                    <p className="text-[11px] text-black/50 dark:text-white/50">
                      Alert when customer checkouts occur
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => togglePreference('notifyNewOrders')}
                  disabled={!isGrantedAndEnabled}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-40 ${
                    preferences.notifyNewOrders && isGrantedAndEnabled
                      ? 'bg-black dark:bg-white'
                      : 'bg-black/20 dark:bg-white/20'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out dark:bg-black ${
                      preferences.notifyNewOrders && isGrantedAndEnabled
                        ? 'translate-x-5'
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Order Status Changes */}
              <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/40 p-4 transition-colors hover:bg-white/80 dark:border-white/5 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-black dark:bg-white/5 dark:text-white">
                    <PackageIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-black dark:text-white">Status Updations</p>
                    <p className="text-[11px] text-black/50 dark:text-white/50">
                      Alert on shipping &amp; delivery changes
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => togglePreference('notifyStatusChanges')}
                  disabled={!isGrantedAndEnabled}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-40 ${
                    preferences.notifyStatusChanges && isGrantedAndEnabled
                      ? 'bg-black dark:bg-white'
                      : 'bg-black/20 dark:bg-white/20'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out dark:bg-black ${
                      preferences.notifyStatusChanges && isGrantedAndEnabled
                        ? 'translate-x-5'
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3: Sound Alerts */}
              <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/40 p-4 transition-colors hover:bg-white/80 dark:border-white/5 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-black dark:bg-white/5 dark:text-white">
                    <ZapIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-black dark:text-white">
                      Audible Payment Chime
                    </p>
                    <p className="text-[11px] text-black/50 dark:text-white/50">
                      Play audio sound when alerts arrive
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => togglePreference('soundEnabled')}
                  disabled={!isGrantedAndEnabled}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-40 ${
                    preferences.soundEnabled && isGrantedAndEnabled
                      ? 'bg-black dark:bg-white'
                      : 'bg-black/20 dark:bg-white/20'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out dark:bg-black ${
                      preferences.soundEnabled && isGrantedAndEnabled
                        ? 'translate-x-5'
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 4: Stock & System Alerts */}
              <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/40 p-4 transition-colors hover:bg-white/80 dark:border-white/5 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-black dark:bg-white/5 dark:text-white">
                    <ShieldCheckIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-black dark:text-white">
                      Inventory &amp; System
                    </p>
                    <p className="text-[11px] text-black/50 dark:text-white/50">
                      Alert on low inventory thresholds
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => togglePreference('notifyStockAlerts')}
                  disabled={!isGrantedAndEnabled}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-40 ${
                    preferences.notifyStockAlerts && isGrantedAndEnabled
                      ? 'bg-black dark:bg-white'
                      : 'bg-black/20 dark:bg-white/20'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out dark:bg-black ${
                      preferences.notifyStockAlerts && isGrantedAndEnabled
                        ? 'translate-x-5'
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* =========================================================
            MOBILE STATUS BAR & PWA APP INSTALLATION CARD
           ========================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-[#111115]"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-sm dark:bg-white dark:text-black">
                <ZapIcon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-black uppercase dark:text-white">
                  Mobile Status Bar &amp; PWA Installation
                </h2>
                <p className="text-xs text-black/60 dark:text-white/60">
                  Receive background order alerts directly in your phone&apos;s status bar and lock
                  screen
                </p>
              </div>
            </div>

            {/* Install / Standalone Badge */}
            {isInstalled ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Installed as Standalone App</span>
              </div>
            ) : isInstallable ? (
              <button
                type="button"
                onClick={installPwaApp}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                <ZapIcon className="h-4 w-4" />
                <span>Install Mobile App (PWA)</span>
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Status Bar / Lock Screen Explainer */}
            <div className="flex flex-col justify-between rounded-2xl border border-black/5 bg-slate-50 p-5 dark:border-white/5 dark:bg-white/[0.02]">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-black dark:text-white">
                  <span>📱 Mobile Status Bar &amp; Lock Screen Alerts</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-black/70 dark:text-white/70">
                  When notifications are activated, push alerts automatically appear in your mobile
                  phone&apos;s <strong>top status bar</strong>, <strong>notification drawer</strong>
                  , and <strong>lock screen</strong> with custom sound and vibration.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckIcon className="h-3.5 w-3.5" />
                <span>Supports Android Chrome, Edge &amp; Desktop OS Notification Centers</span>
              </div>
            </div>

            {/* PWA Requirement & Installation Details */}
            <div className="flex flex-col justify-between rounded-2xl border border-black/5 bg-slate-50 p-5 dark:border-white/5 dark:bg-white/[0.02]">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-black dark:text-white">
                  <span>⚙️ Do You Need to Install the PWA?</span>
                </div>
                <div className="mt-2 space-y-2 text-xs leading-relaxed text-black/70 dark:text-white/70">
                  <p>
                    <strong>On Android:</strong> Not strictly required (browser notifications show
                    in the status bar), but installing the PWA prevents the phone OS from putting
                    the background tab to sleep and gives you the dedicated Admin app icon.
                  </p>
                  <p>
                    <strong>On iPhone / iOS:</strong> Apple <em>strictly requires</em> adding the
                    app to your Home Screen before enabling push notifications.
                  </p>
                </div>
              </div>

              {isIOS && !isInstalled && (
                <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
                  <span className="font-bold">iOS Setup:</span> In Safari, tap the{' '}
                  <strong>Share button (⎋)</strong> &rarr; tap{' '}
                  <strong>&ldquo;Add to Home Screen&rdquo;</strong> &rarr; open the FF Admin icon
                  from your home screen to activate push notifications.
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* =========================================================
            ADMIN PROFILE & SYSTEM CARD
           ========================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-[#111115]"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 text-black dark:bg-white/5 dark:text-white">
              <SettingsIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-black uppercase dark:text-white">
                Admin Station &amp; Device
              </h2>
              <p className="text-xs text-black/60 dark:text-white/60">
                Current session details and connected environment
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/5 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/[0.02]">
              <p className="text-[10px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                Operator
              </p>
              <p className="mt-1 text-sm font-bold text-black dark:text-white">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-xs text-black/60 dark:text-white/60">
                {user?.role?.replace('_', ' ') || 'Super Admin'}
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/[0.02]">
              <p className="text-[10px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                Push Channel Support
              </p>
              <p className="mt-1 text-sm font-bold text-black dark:text-white">
                {isSupported ? 'Supported' : 'Unavailable'}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                {isSupported
                  ? 'Service Worker & Web Notifications'
                  : 'Browser lacks notification API'}
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/[0.02]">
              <p className="text-[10px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                Background Polling
              </p>
              <p className="mt-1 text-sm font-bold text-black dark:text-white">
                {isGrantedAndEnabled ? '20s Real-Time Sync' : 'Standby'}
              </p>
              <p className="text-xs text-black/60 dark:text-white/60">
                Automatic customer order detection
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
