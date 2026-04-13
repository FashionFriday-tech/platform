'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  AlertTriangleIcon,
  BellIcon,
  ChevronRightIcon,
  CloseIcon,
  CreditCardIcon,
  LogOutIcon,
  MapPinIcon,
  MoonIcon,
  MousePointerIcon,
  Settings2Icon,
  ShieldCheckIcon,
  TrashIcon,
} from '@ff/ui';
import { AnimatePresence, motion } from 'framer-motion';

import { AnimatedThemeToggler } from '@/components/ui/magicUi/animated-theme-toggler';
import { useSettings } from '@/context/SettingsContext';
import { authApi } from '@/lib/api-client';
import { toast } from 'sonner';

export default function SettingsPage() {
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notifications, setNotifications] = useState({
    orders: true,
    promos: true,
  });

  const { settings, updateSettings } = useSettings();
  const scrollLevel = settings.autoScrollLevel;

  const speedLabels = ['Lvl 1', 'Lvl 2', 'Lvl 3', 'Lvl 4', 'Lvl 5'];
  const handleLogout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      toast.success('Logged out successfully');
      router.push('/login');
    }
  };

  return (
    <div className="text-foreground min-h-screen bg-[#F9F9F9] pb-20 transition-colors duration-500 dark:bg-black">
      <main className="mx-auto max-w-2xl space-y-10 px-4 pt-12">
        {/* Profile Identity */}
        <section
          onClick={() => {
            router.push('/account/profile');
          }}
          className="bg-background border-border/40 flex cursor-pointer items-center gap-5 rounded-[2.5rem] border p-8 shadow-sm"
        >
          <div className="bg-foreground text-background flex h-20 w-20 items-center justify-center rounded-full text-3xl font-black uppercase italic">
            AF
          </div>
          <div className="flex-1">
            <h2 className="text-xl leading-none font-black tracking-tight uppercase italic">
              Ajmal Faris
            </h2>
            <p className="text-foreground-subtle mt-2 text-[10px] font-bold tracking-widest uppercase opacity-60">
              ajmalfaris@gmail.com
            </p>
          </div>
          <ChevronRightIcon size={20} className="text-foreground-subtle/30" />
        </section>

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
                    updateSettings({
                      autoScrollLevel: Number(e.target.value),
                    });
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
                setNotifications({
                  ...notifications,
                  orders: !notifications.orders,
                });
              }}
            />
            <SettingToggle
              icon={<Settings2Icon size={20} />}
              label="Exclusive Drops"
              active={notifications.promos}
              onToggle={() => {
                setNotifications({
                  ...notifications,
                  promos: !notifications.promos,
                });
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
            <span className="text-[10px] font-black tracking-widest uppercase">Delete Account</span>
          </button>
        </div>

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
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowDeleteModal(false);
              }}
              className="bg-background/80 fixed inset-0 z-100 backdrop-blur-xl"
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-background border-border fixed bottom-0 z-110 w-full max-w-xl rounded-t-[3.5rem] border-t p-10 shadow-2xl lg:bottom-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-[3rem] lg:border lg:p-12"
            >
              <div className="mb-8 flex items-start justify-between">
                <div className="rounded-3xl bg-red-600 p-4 text-white shadow-xl shadow-red-600/20">
                  <AlertTriangleIcon size={32} />
                </div>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                  }}
                  className="hover:bg-muted rounded-full p-2 transition-colors"
                >
                  <CloseIcon size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <h3 className="text-3xl font-black tracking-tighter uppercase italic">
                  Permanent Wipe
                </h3>
                <p className="text-foreground-subtle text-[10px] leading-loose font-bold tracking-widest uppercase">
                  Deleting your account will purge all personal data from the **Fashion Friday**
                  database. This is an irreversible action that clears:
                </p>

                <ul className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
                  {[
                    'Complete Order History',
                    'Stored Referral Credits',
                    'Verified Shipping Addresses',
                    'Stored Payment Methods',
                    'Wishlists & Favorites',
                    'Phone & KYC Verification',
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-[9px] font-black tracking-widest text-red-600/60 uppercase"
                    >
                      <div className="h-1 w-1 rounded-full bg-red-600" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="space-y-3 pt-8">
                  <button className="w-full rounded-full bg-red-600 py-5 text-[10px] font-black tracking-widest text-white uppercase shadow-2xl shadow-red-600/30 transition-all active:scale-95">
                    I Understand, Delete All Data
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                    }}
                    className="bg-foreground text-background w-full rounded-full py-5 text-[10px] font-black tracking-widest uppercase"
                  >
                    Cancel & Protect My Account
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Monochrome Components ---

interface SettingToggleProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onToggle: () => void;
}

function SettingToggle({ icon, label, active, onToggle }: SettingToggleProps) {
  return (
    <div className="flex cursor-pointer items-center justify-between p-6" onClick={onToggle}>
      <div className="flex items-center gap-4 text-left">
        <div className="bg-foreground text-background rounded-2xl p-3 transition-all">{icon}</div>
        <span className="text-sm font-black tracking-tight uppercase italic">{label}</span>
      </div>
      <div
        className={`flex h-7 w-12 items-center rounded-full px-1.5 transition-all ${
          active ? 'bg-foreground' : 'bg-foreground/10'
        }`}
      >
        <motion.div
          animate={{ x: active ? 20 : 0 }}
          className="bg-background h-4 w-4 rounded-full shadow-sm"
        />
      </div>
    </div>
  );
}

interface SettingLinkProps {
  icon: React.ReactNode;
  label: string;
}

function SettingLink({ icon, label }: SettingLinkProps) {
  return (
    <div className="hover:bg-foreground/5 group flex cursor-pointer items-center justify-between p-6 text-left transition-colors">
      <div className="flex items-center gap-4">
        <div className="bg-foreground text-background rounded-2xl p-3">{icon}</div>
        <span className="text-sm font-black tracking-tight uppercase italic transition-transform group-hover:translate-x-1">
          {label}
        </span>
      </div>
      <ChevronRightIcon size={18} className="text-foreground-subtle/30" />
    </div>
  );
}
