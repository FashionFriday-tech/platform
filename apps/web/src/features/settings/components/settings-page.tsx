'use client';

import React from 'react';
import Link from 'next/link';

import {
  BellIcon,
  ChevronRightIcon,
  CreditCardIcon,
  LogOutIcon,
  MapPinIcon,
  MoonIcon,
  MousePointerIcon,
  Settings2Icon,
  ShieldCheckIcon,
  TrashIcon,
} from '@ff/ui';

import { AnimatedThemeToggler } from '@/components/ui/magicUi/animated-theme-toggler';

import { useSettingsFlow } from '../hooks/use-settings-flow';
import { DeleteAccountModal } from './delete-account-modal';
import { ProfileIdentity } from './profile-identity';
import { SettingLink } from './setting-link';
import { SettingToggle } from './setting-toggle';

export function SettingsPage() {
  const {
    router,
    user,
    isDeleting,
    showDeleteModal,
    setShowDeleteModal,
    notifications,
    scrollLevel,
    speedLabels,
    handleLogout,
    handleDeleteAccount,
    handleToggleNotification,
    handleUpdateScrollLevel,
    initials,
  } = useSettingsFlow();

  return (
    <div className="text-foreground min-h-screen bg-[#F9F9F9] pb-20 transition-colors duration-500 dark:bg-black">
      <main className="mx-auto max-w-2xl space-y-10 px-4 pt-12">
        {/* Profile Identity */}
        <ProfileIdentity
          initials={initials}
          user={user}
          onClick={() => {
            router.push('/account/profile');
          }}
        />

        {/* Interaction Group */}
        <div className="space-y-3">
          <p className="text-foreground-subtle px-6 text-[10px] font-black tracking-[0.3em] uppercase opacity-60">
            Interaction
          </p>
          <div className="bg-background border-border/40 divide-border/20 divide-y overflow-hidden rounded-4xl border shadow-sm">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4 text-left">
                <div className="bg-foreground text-background rounded-2xl p-3">
                  <MoonIcon size={20} />
                </div>
                <span className="text-sm font-black tracking-tight uppercase italic">
                  Dark Mode
                </span>
              </div>
              <AnimatedThemeToggler />
            </div>

            {/* 5-Stage Scroll Control */}
            <div className="space-y-8 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-left">
                  <div className="bg-foreground text-background rounded-2xl p-3">
                    <MousePointerIcon size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-black tracking-tight uppercase italic">
                      Auto-Scroll Level
                    </span>
                    <p className="text-foreground-subtle mt-1 text-[9px] font-bold tracking-widest uppercase">
                      Mechanical speed calibration
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 px-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={scrollLevel}
                  onChange={(e) => {
                    handleUpdateScrollLevel(Number(e.target.value));
                  }}
                  className="bg-foreground/10 accent-foreground h-1 w-full cursor-pointer appearance-none rounded-full"
                />
                <div className="flex justify-between px-1">
                  {speedLabels.map((label, i) => (
                    <div key={label} className="flex flex-col items-center gap-2">
                      <span
                        className={`text-[7px] font-black tracking-widest uppercase transition-opacity ${
                          scrollLevel === i + 1 ? 'opacity-100' : 'opacity-20'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="space-y-3">
          <p className="text-foreground-subtle px-6 text-[10px] font-black tracking-[0.3em] uppercase opacity-60">
            Notification
          </p>
          <div className="bg-background border-border/40 divide-border/20 divide-y overflow-hidden rounded-4xl border shadow-sm">
            <SettingToggle
              icon={<BellIcon size={20} />}
              label="Order Logistics"
              active={notifications.orders}
              onToggle={() => {
                handleToggleNotification('orders');
              }}
            />
            <SettingToggle
              icon={<Settings2Icon size={20} />}
              label="Exclusive Drops"
              active={notifications.promos}
              onToggle={() => {
                handleToggleNotification('promos');
              }}
            />
          </div>
        </div>

        {/* Logistics Group */}
        <div className="space-y-3">
          <p className="text-foreground-subtle px-6 text-[10px] font-black tracking-[0.3em] uppercase opacity-60">
            Logistics & Security
          </p>
          <div className="bg-background border-border/40 divide-border/20 divide-y overflow-hidden rounded-4xl border shadow-sm">
            <SettingLink icon={<MapPinIcon size={20} />} label="Shipping Addresses" />
            <SettingLink icon={<CreditCardIcon size={20} />} label="Stored Payment Assets" />
            <SettingLink icon={<ShieldCheckIcon size={20} />} label="Identity Verification" />
          </div>
        </div>

        {/* Destructive Options */}
        {user && (
          <div className="space-y-4 pt-4">
            <button
              onClick={handleLogout}
              className="bg-background border-border group flex w-full items-center justify-between rounded-4xl border p-4 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="bg-foreground/5 text-foreground group-hover:bg-foreground group-hover:text-background rounded-2xl p-3 transition-all">
                  <LogOutIcon size={20} />
                </div>
                <span className="text-sm font-black tracking-tight uppercase italic">Log Out</span>
              </div>
              <ChevronRightIcon size={18} className="opacity-20" />
            </button>

            <button
              onClick={() => {
                setShowDeleteModal(true);
              }}
              className="flex w-full items-center justify-center gap-3 rounded-4xl border border-red-500/20 bg-red-500/5 p-6 text-red-600 transition-all active:scale-[0.98]"
            >
              <TrashIcon size={18} />
              <span className="text-[10px] font-black tracking-widest uppercase">
                Delete Account
              </span>
            </button>
          </div>
        )}

        {/* Platform Info */}
        <div className="space-y-2 py-10 text-center opacity-30">
          <p className="text-[9px] font-black tracking-[0.5em] uppercase italic">
            Fashion Friday v1.0
          </p>
          <Link
            href="https://unity11-solutions.com"
            className="text-[8px] font-bold tracking-widest uppercase"
          >
            Engineered by Unity11
          </Link>
        </div>
      </main>

      {/* Account Deletion Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
        }}
        isDeleting={isDeleting}
        onDelete={handleDeleteAccount}
      />
    </div>
  );
}
