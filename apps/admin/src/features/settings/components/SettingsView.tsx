'use client';

import React, { useEffect, useState } from 'react';

import {
  BellIcon,
  ChevronRightIcon,
  PackageIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  ZapIcon,
} from '@ff/ui';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';
import { usePushNotifications } from '@/contexts/PushNotificationContext';

function MobileToggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-40 ${
        checked ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export function SettingsView() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const {
    permission,
    isEnabled,
    preferences,
    isInstallable,
    installPwaApp,
    activatePushNotifications,
    deactivatePushNotifications,
    togglePreference,
    sendTestNotification,
  } = usePushNotifications();

  const [isActivating, setIsActivating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isUnderMaintenance, setIsUnderMaintenance] = useState(false);
  const [isUpdatingMaintenance, setIsUpdatingMaintenance] = useState(false);

  const isGrantedAndEnabled = permission === 'granted' && isEnabled;

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';
        const res = await fetch(`${apiUrl}/maintenance`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setIsUnderMaintenance(Boolean(data.isUnderMaintenance));
        }
      } catch {
        // ignore
      }
    };
    void fetchMaintenance();
  }, []);

  const handleMaintenanceToggle = async () => {
    if (!isSuperAdmin) {
      toast.error('Permission denied: Only Super Admins can manage Maintenance Mode.');
      return;
    }

    const nextState = !isUnderMaintenance;
    setIsUpdatingMaintenance(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';
      const res = await fetch(`${apiUrl}/admin/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isUnderMaintenance: nextState }),
      });
      if (res.ok) {
        setIsUnderMaintenance(nextState);
        if (nextState) {
          toast.warning('Maintenance mode activated: Storefront is now closed to customers.');
        } else {
          toast.success('Maintenance mode deactivated: Storefront is now open to customers.');
        }
      } else {
        toast.error('Failed to update maintenance mode status.');
      }
    } catch {
      toast.error('Network error updating maintenance mode.');
    } finally {
      setIsUpdatingMaintenance(false);
    }
  };

  const handleMasterToggle = async () => {
    if (isGrantedAndEnabled) {
      deactivatePushNotifications();
    } else {
      setIsActivating(true);
      try {
        await activatePushNotifications();
      } finally {
        setIsActivating(false);
      }
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

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 py-6 sm:px-8">
      <div className="mx-auto w-full max-w-xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Settings
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Manage storefront maintenance mode and push notifications
          </p>
        </div>

        {/* Maintenance Mode Section */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-3">
            <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
              Storefront Status
            </span>
            {!isSuperAdmin && (
              <span className="text-[10px] font-bold text-amber-600 uppercase dark:text-amber-400">
                Super Admin Only
              </span>
            )}
          </div>
          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-white transition-colors ${
                    isUnderMaintenance ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                >
                  <ShieldCheckIcon className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Under Maintenance Mode
                  </span>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {isUnderMaintenance
                      ? 'Storefront is closed with maintenance screen'
                      : 'Storefront is live and open for customer orders'}
                  </p>
                </div>
              </div>
              <MobileToggle
                checked={isUnderMaintenance}
                onChange={handleMaintenanceToggle}
                disabled={!isSuperAdmin || isUpdatingMaintenance}
              />
            </div>
          </div>
          {isUnderMaintenance && (
            <p className="px-3 text-xs font-medium text-amber-600 dark:text-amber-400">
              ⚠️ Maintenance mode is active. Customers visiting the website will see the maintenance
              screen.
            </p>
          )}
        </div>

        {/* Master Notifications Toggle Group */}
        <div className="space-y-1.5">
          <span className="px-3 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
            Push Notifications
          </span>
          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white">
                  <BellIcon className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Allow Notifications
                  </span>
                </div>
              </div>
              <MobileToggle
                checked={isGrantedAndEnabled}
                onChange={handleMasterToggle}
                disabled={isActivating}
              />
            </div>
          </div>
          {permission === 'denied' && (
            <p className="px-3 text-xs text-red-500">
              Notifications are blocked in your browser settings. Please allow notifications to
              enable alerts.
            </p>
          )}
        </div>

        {/* Alert Categories (visible when allowed) */}
        {isGrantedAndEnabled && (
          <>
            {/* Order Alerts Section */}
            <div className="space-y-1.5">
              <span className="px-3 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                Order Alerts
              </span>
              <div className="divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs dark:divide-zinc-800 dark:border-zinc-800/80 dark:bg-zinc-900">
                {/* New Orders */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
                      <ShoppingBagIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        New Orders
                      </span>
                    </div>
                  </div>
                  <MobileToggle
                    checked={preferences.notifyNewOrders}
                    onChange={() => togglePreference('notifyNewOrders')}
                  />
                </div>

                {/* Order Status Updates */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white">
                      <PackageIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Order Status Updates
                      </span>
                    </div>
                  </div>
                  <MobileToggle
                    checked={preferences.notifyStatusChanges}
                    onChange={() => togglePreference('notifyStatusChanges')}
                  />
                </div>

                {/* Low Stock Alerts */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white">
                      <ZapIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Low Stock Alerts
                      </span>
                    </div>
                  </div>
                  <MobileToggle
                    checked={preferences.notifyStockAlerts}
                    onChange={() => togglePreference('notifyStockAlerts')}
                  />
                </div>
              </div>
            </div>

            {/* Sounds Section */}
            <div className="space-y-1.5">
              <span className="px-3 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                Sounds
              </span>
              <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500 text-white">
                      <BellIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Sounds & Chimes
                      </span>
                    </div>
                  </div>
                  <MobileToggle
                    checked={preferences.soundEnabled}
                    onChange={() => togglePreference('soundEnabled')}
                  />
                </div>
              </div>
            </div>

            {/* Test Action */}
            <div className="space-y-1.5">
              <span className="px-3 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                Test
              </span>
              <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900">
                <button
                  type="button"
                  onClick={handleTest}
                  disabled={isTesting}
                  className="flex w-full cursor-pointer items-center justify-between p-4 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {isTesting ? 'Sending test notification...' : 'Send Test Notification'}
                  </span>
                  <ChevronRightIcon className="h-4 w-4 text-zinc-400" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* PWA Install Option (only if installable by browser) */}
        {isInstallable && (
          <div className="space-y-1.5">
            <span className="px-3 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
              App
            </span>
            <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900">
              <button
                type="button"
                onClick={installPwaApp}
                className="flex w-full cursor-pointer items-center justify-between p-4 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Install Admin App
                </span>
                <ChevronRightIcon className="h-4 w-4 text-zinc-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
