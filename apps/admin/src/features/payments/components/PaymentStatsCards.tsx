'use client';

import React from 'react';

import {
  AlertCircleIcon,
  BanknoteIcon,
  CheckCircleIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
} from '@ff/ui';

import { type PaymentStatsResponse } from '../types';

interface PaymentStatsCardsProps {
  stats: PaymentStatsResponse | null;
  isLoading: boolean;
  onFilterExpiring?: () => void;
  onFilterAuthorized?: () => void;
}

function formatInr(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PaymentStatsCards({
  stats,
  isLoading,
  onFilterExpiring,
  onFilterAuthorized,
}: PaymentStatsCardsProps) {
  const summary = stats?.summary;

  if (isLoading && !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-3xl border border-black/5 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/[0.02]"
          />
        ))}
      </div>
    );
  }

  const gross = summary?.totalGrossVolume ?? 0;
  const captured = summary?.capturedVolume ?? 0;
  const authorized = summary?.authorizedVolume ?? 0;
  const refunded = summary?.refundedVolume ?? 0;
  const codPending = summary?.codPendingVolume ?? 0;
  const codAdvance = summary?.codAdvanceVolume ?? 0;
  const successRate = summary?.successRate ?? 0;
  const refundRate = summary?.refundRate ?? 0;
  const expiringCount = summary?.expiringAuthorizationsCount ?? 0;
  const authCount = summary?.authorizedCount ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {/* 1. Gross Volume */}
      <div className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white/80 p-5 shadow-xs backdrop-blur-xl transition-all duration-300 hover:border-black/15 hover:shadow-md dark:border-white/10 dark:bg-[#121212]/80 dark:hover:border-white/20">
        <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-violet-500/10 blur-2xl transition-all group-hover:scale-125 dark:bg-violet-500/15" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
            Gross Volume (GMV)
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
            <TrendingUpIcon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-black tracking-tight text-black dark:text-white">
            {formatInr(gross)}
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-black/50 dark:text-white/50">
            <span>{summary?.totalTransactions ?? 0} total transactions</span>
          </div>
        </div>
      </div>

      {/* 2. Captured & Settled */}
      <div className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white/80 p-5 shadow-xs backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30 hover:shadow-md dark:border-white/10 dark:bg-[#121212]/80 dark:hover:border-emerald-500/30">
        <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl transition-all group-hover:scale-125 dark:bg-emerald-500/15" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
              Captured & Settled
            </span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <CheckCircleIcon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-black tracking-tight text-emerald-700 dark:text-emerald-400">
            {formatInr(captured)}
          </p>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-600/90 dark:text-emerald-400/90">
              {successRate}% Success Rate
            </span>
            <span className="text-black/40 dark:text-white/40">
              {summary?.capturedCount ?? 0} settled
            </span>
          </div>
        </div>
      </div>

      {/* 3. Escrow / Authorized Hold */}
      <div
        onClick={onFilterAuthorized}
        className="group relative cursor-pointer overflow-hidden rounded-3xl border border-black/5 bg-white/80 p-5 shadow-xs backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 hover:shadow-md dark:border-white/10 dark:bg-[#121212]/80 dark:hover:border-amber-500/30"
      >
        <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-amber-500/10 blur-2xl transition-all group-hover:scale-125 dark:bg-amber-500/15" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
            Escrow Holds (₹0 Fee)
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <ShieldCheckIcon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-black tracking-tight text-amber-600 dark:text-amber-400">
            {formatInr(authorized)}
          </p>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="font-semibold text-black/60 dark:text-white/60">
              {authCount} on hold
            </span>
            {expiringCount > 0 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFilterExpiring?.();
                }}
                className="flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 font-bold text-red-600 transition-all hover:bg-red-500/25 dark:text-red-400"
              >
                <AlertCircleIcon className="h-3 w-3" />
                <span>{expiringCount} expiring</span>
              </button>
            ) : (
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                Safe window
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Total Refunds */}
      <div className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white/80 p-5 shadow-xs backdrop-blur-xl transition-all duration-300 hover:border-rose-500/30 hover:shadow-md dark:border-white/10 dark:bg-[#121212]/80 dark:hover:border-rose-500/30">
        <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-rose-500/10 blur-2xl transition-all group-hover:scale-125 dark:bg-rose-500/15" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
            Refunds & Disputes
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <RefreshCcwIcon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-black tracking-tight text-rose-600 dark:text-rose-400">
            {formatInr(refunded)}
          </p>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="font-semibold text-black/50 dark:text-white/50">
              {refundRate}% of GMV
            </span>
            <span className="text-black/40 dark:text-white/40">
              {summary?.refundedCount ?? 0} refunded
            </span>
          </div>
        </div>
      </div>

      {/* 5. COD Cashflow */}
      <div className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white/80 p-5 shadow-xs backdrop-blur-xl transition-all duration-300 hover:border-sky-500/30 hover:shadow-md dark:border-white/10 dark:bg-[#121212]/80 dark:hover:border-sky-500/30">
        <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-sky-500/10 blur-2xl transition-all group-hover:scale-125 dark:bg-sky-500/15" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
            COD Cashflow
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
            <BanknoteIcon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-black tracking-tight text-black dark:text-white">
            {formatInr(codAdvance)}
          </p>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="font-medium text-black/50 dark:text-white/50">Advance Deposit</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              +{formatInr(codPending)} Due
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
