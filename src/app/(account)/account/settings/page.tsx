"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  MousePointer2,
  Moon,
  User,
  ShieldCheck,
  LogOut,
  ChevronRight,
  CreditCard,
  MapPin,
  Settings2,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/magicUi/animated-theme-toggler";

export default function SettingsPage() {
  const [scrollLevel, setScrollLevel] = useState(3); // Default to Stage 3
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notifications, setNotifications] = useState({
    orders: true,
    promos: false,
  });

  const speedLabels = ["Static", "Relaxed", "Standard", "Aggressive", "Turbo"];

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-black text-foreground transition-colors duration-500 pb-20">
      <main className="mx-auto max-w-2xl px-4 pt-12 space-y-10">
        {/* Profile Identity */}
        <section className="bg-background rounded-[2.5rem] p-8 flex items-center gap-5 shadow-sm border border-border/40">
          <div className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center text-background text-3xl font-black italic uppercase">
            AF
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black tracking-tight leading-none italic uppercase">
              Ajmal Faris
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle mt-2 opacity-60">
              Captain @ Unity11
            </p>
          </div>
          <ChevronRight size={20} className="text-foreground-subtle/30" />
        </section>

        {/* Interaction Group */}
        <div className="space-y-3">
          <p className="px-6 text-[10px] font-black uppercase tracking-[0.3em] text-foreground-subtle opacity-60">
            Interaction
          </p>
          <div className="bg-background rounded-[2rem] overflow-hidden border border-border/40 shadow-sm divide-y divide-border/20">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 rounded-2xl bg-foreground text-background">
                  <Moon size={20} />
                </div>
                <span className="text-sm font-black uppercase tracking-tight italic">
                  Dark Mode
                </span>
              </div>
              <AnimatedThemeToggler />
            </div>

            {/* 5-Stage Scroll Control */}
            <div className="p-6 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-3 rounded-2xl bg-foreground text-background">
                    <MousePointer2 size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-black uppercase tracking-tight italic">
                      Auto-Browse Level
                    </span>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-foreground-subtle mt-1">
                      Mechanical speed calibration
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-black italic uppercase tracking-widest px-4 py-1.5 bg-foreground text-background rounded-full">
                  Lvl {scrollLevel}
                </span>
              </div>

              <div className="px-2 space-y-4">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={scrollLevel}
                  onChange={(e) => setScrollLevel(parseInt(e.target.value))}
                  className="w-full h-1 bg-foreground/10 rounded-full appearance-none cursor-pointer accent-foreground"
                />
                <div className="flex justify-between px-1">
                  {speedLabels.map((label, i) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className={`w-1 h-1 rounded-full ${
                          scrollLevel === i + 1
                            ? "bg-foreground"
                            : "bg-foreground/20"
                        }`}
                      />
                      <span
                        className={`text-[7px] font-black uppercase tracking-widest transition-opacity ${
                          scrollLevel === i + 1 ? "opacity-100" : "opacity-20"
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
          <p className="px-6 text-[10px] font-black uppercase tracking-[0.3em] text-foreground-subtle opacity-60">
            Notification Settings
          </p>
          <div className="bg-background rounded-[2rem] overflow-hidden border border-border/40 shadow-sm divide-y divide-border/20">
            <SettingToggle
              icon={<Bell size={20} />}
              label="Order Logistics"
              active={notifications.orders}
              onToggle={() =>
                setNotifications({
                  ...notifications,
                  orders: !notifications.orders,
                })
              }
            />
            <SettingToggle
              icon={<Settings2 size={20} />}
              label="Exclusive Drops"
              active={notifications.promos}
              onToggle={() =>
                setNotifications({
                  ...notifications,
                  promos: !notifications.promos,
                })
              }
            />
          </div>
        </div>

        {/* Logistics Group */}
        <div className="space-y-3">
          <p className="px-6 text-[10px] font-black uppercase tracking-[0.3em] text-foreground-subtle opacity-60">
            Logistics & Security
          </p>
          <div className="bg-background rounded-[2rem] overflow-hidden border border-border/40 shadow-sm divide-y divide-border/20">
            <SettingLink
              icon={<MapPin size={20} />}
              label="Shipping Directories"
            />
            <SettingLink
              icon={<CreditCard size={20} />}
              label="Stored Payment Assets"
            />
            <SettingLink
              icon={<ShieldCheck size={20} />}
              label="Identity Verification"
            />
          </div>
        </div>

        {/* Destructive Options */}
        <div className="pt-4 space-y-4">
          <button className="w-full p-6 rounded-[2rem] bg-background border border-border flex items-center justify-between group active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 rounded-2xl bg-foreground/5 text-foreground group-hover:bg-foreground group-hover:text-background transition-all">
                <LogOut size={20} />
              </div>
              <span className="text-sm font-black uppercase tracking-tight italic">
                Sign Out of Session
              </span>
            </div>
            <ChevronRight size={18} className="opacity-20" />
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full p-6 rounded-[2rem] bg-red-500/5 border border-red-500/20 text-red-600 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
          >
            <Trash2 size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Wipe Account Data
            </span>
          </button>
        </div>

        {/* Platform Info */}
        <div className="py-10 text-center space-y-2 opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.5em] italic">
            Fashion Friday v1.0
          </p>
          <p className="text-[8px] font-bold uppercase tracking-widest">
            Engineered by Unity11
          </p>
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
              onClick={() => setShowDeleteModal(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[100]"
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-0 lg:bottom-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 w-full max-w-xl bg-background border-t lg:border border-border rounded-t-[3.5rem] lg:rounded-[3rem] p-10 lg:p-12 z-[110] shadow-2xl"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-red-600 text-white rounded-3xl shadow-xl shadow-red-600/20">
                  <AlertTriangle size={32} />
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <h3 className="text-3xl font-black uppercase tracking-tighter italic">
                  Permanent Wipe
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle leading-loose">
                  Deleting your account will purge all personal data from the
                  **Fashion Friday** database. This is an irreversible action
                  that clears:
                </p>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                  {[
                    "Complete Order History",
                    "Stored Referral Credits",
                    "Verified Shipping Addresses",
                    "Stored Payment Methods",
                    "Wishlists & Favorites",
                    "Phone & KYC Verification",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-red-600/60"
                    >
                      <div className="w-1 h-1 bg-red-600 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="pt-8 space-y-3">
                  <button className="w-full py-5 rounded-full bg-red-600 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-red-600/30 active:scale-95 transition-all">
                    I Understand, Delete All Data
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="w-full py-5 rounded-full bg-foreground text-background font-black uppercase tracking-widest text-[10px]"
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

function SettingToggle({ icon, label, active, onToggle }: any) {
  return (
    <div
      className="p-6 flex items-center justify-between cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex items-center gap-4 text-left">
        <div className="p-3 rounded-2xl bg-foreground text-background transition-all">
          {icon}
        </div>
        <span className="text-sm font-black uppercase tracking-tight italic">
          {label}
        </span>
      </div>
      <div
        className={`w-12 h-7 rounded-full transition-all flex items-center px-1.5 ${
          active ? "bg-foreground" : "bg-foreground/10"
        }`}
      >
        <motion.div
          animate={{ x: active ? 20 : 0 }}
          className="w-4 h-4 rounded-full bg-background shadow-sm"
        />
      </div>
    </div>
  );
}

function SettingLink({ icon, label }: any) {
  return (
    <div className="p-6 flex items-center justify-between cursor-pointer group hover:bg-foreground/5 transition-colors text-left">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-foreground text-background">
          {icon}
        </div>
        <span className="text-sm font-black uppercase tracking-tight italic group-hover:translate-x-1 transition-transform">
          {label}
        </span>
      </div>
      <ChevronRight size={18} className="text-foreground-subtle/30" />
    </div>
  );
}
