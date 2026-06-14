'use client';

import React from 'react';

import {
  ActivityIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  MessageSquareIcon,
  RefreshCcwIcon,
  SearchIcon,
} from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { CustomSelect } from '../../../components/ui/CustomSelect';
import { useFeedback } from '../hooks/useFeedback';
import { FeedbackTable } from './FeedbackTable';

const TYPE_OPTIONS = [
  { label: 'All Types', value: 'all' },
  { label: 'Issues', value: 'issue' },
  { label: 'Improvements', value: 'improvement' },
  { label: 'Suggestions', value: 'suggestion' },
  { label: 'Others', value: 'other' },
];

export default function FeedbackFeature() {
  const {
    feedbackList,
    filteredFeedbackList,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    refreshFeedback,
  } = useFeedback();

  // Compute metrics
  const totalCount = feedbackList.length;
  const issueCount = feedbackList.filter((f) => f.type === 'issue').length;
  const suggestionCount = feedbackList.filter((f) => f.type === 'suggestion').length;
  const improvementCount = feedbackList.filter((f) => f.type === 'improvement').length;

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      {/* Stats Cards */}
      <div className="scrollbar-hide flex w-full shrink-0 gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0">
        {[
          {
            name: 'Total Submissions',
            value: totalCount,
            subLabel: 'ALL ENTRIES',
            dotColor: 'bg-blue-400',
            icon: MessageSquareIcon,
            typeKey: 'all',
          },
          {
            name: 'Issues / Bugs',
            value: issueCount,
            subLabel: 'REPORTS',
            dotColor: 'bg-rose-400',
            icon: AlertCircleIcon,
            typeKey: 'issue',
          },
          {
            name: 'Suggestions',
            value: suggestionCount,
            subLabel: 'USER IDEAS',
            dotColor: 'bg-emerald-400',
            icon: CheckCircleIcon,
            typeKey: 'suggestion',
          },
          {
            name: 'Improvements',
            value: improvementCount,
            subLabel: 'ENHANCEMENTS',
            dotColor: 'bg-purple-400',
            icon: ActivityIcon,
            typeKey: 'improvement',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            onClick={() => {
              setSelectedType(stat.typeKey);
            }}
            className="group relative flex min-w-[200px] shrink-0 cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black via-[#0d0d10] to-[#1c1c24] px-4 py-3 text-white shadow-lg sm:min-w-0 sm:shrink dark:border-black/10 dark:bg-white dark:from-white dark:via-[#fafafa] dark:to-[#f0f0f0] dark:text-black dark:shadow-sm"
          >
            {/* Subtle Ambient Glow & Watermark Icon */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <stat.icon className="absolute -right-2 -bottom-2 h-16 w-16 text-white/[0.04] dark:text-black/[0.04]" />
              <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/[0.03] blur-xl dark:bg-black/[0.02]" />
            </div>

            {/* Top Row: Title & Mini Icon Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <dt className="text-[11px] font-bold tracking-wider text-white/70 uppercase dark:text-black/60">
                {stat.name}
              </dt>
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-md dark:bg-black/5 dark:text-black">
                <stat.icon className="h-3 w-3" />
              </div>
            </div>

            {/* Bottom Row: Metric & Subtitle with Dot */}
            <div className="relative z-10 mt-2 flex items-baseline justify-between gap-2">
              <dd className="text-2xl font-black tracking-tight text-white md:text-3xl dark:text-black">
                {stat.value}
              </dd>
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${stat.dotColor}`} />
                <span className="text-[9px] font-bold tracking-widest text-white/40 uppercase dark:text-black/40">
                  {stat.subLabel}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {/* Controls Row */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-50 flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5 dark:bg-[#111111]"
        >
          <div className="relative max-w-md flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <SearchIcon className="h-4 w-4 text-black/30 dark:text-white/30" />
            </div>
            <input
              type="text"
              placeholder="Search by email or description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2.5 pr-4 pl-11 text-sm text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222222] dark:focus:ring-white/5"
            />
          </div>

          <div className="flex items-center gap-3">
            <CustomSelect
              options={TYPE_OPTIONS}
              value={selectedType}
              onChange={(val) => {
                setSelectedType(val);
              }}
              className="z-50 w-44"
            />

            <button
              onClick={refreshFeedback}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/10 transition-all hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
              title="Refresh"
            >
              <RefreshCcwIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </motion.div>

        {/* Table container */}
        <AnimatePresence mode="wait">
          <motion.div
            key="feedback-table-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="min-h-0 flex-1"
          >
            <FeedbackTable feedbackList={filteredFeedbackList} isLoading={isLoading} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
