'use client';

import React from 'react';
import { SearchIcon, RefreshCcwIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';
import { useFeedback } from '../hooks/useFeedback';
import { FeedbackTable } from './FeedbackTable';
import { CustomSelect } from '../../../components/ui/CustomSelect';

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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 shrink-0">
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-[#111111]">
          <span className="text-xs font-bold uppercase tracking-wider text-black/45 dark:text-white/45">
            Total Submissions
          </span>
          <h3 className="mt-1 text-2xl font-black">{totalCount}</h3>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-[#111111]">
          <span className="text-xs font-bold uppercase tracking-wider text-red-500/80 dark:text-red-400">
            Issues / Bugs
          </span>
          <h3 className="mt-1 text-2xl font-black text-red-600 dark:text-red-400">{issueCount}</h3>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-[#111111]">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500/80 dark:text-emerald-400">
            Suggestions
          </span>
          <h3 className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">{suggestionCount}</h3>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-[#111111]">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-500/80 dark:text-violet-400">
            Improvements
          </span>
          <h3 className="mt-1 text-2xl font-black text-violet-600 dark:text-violet-400">{improvementCount}</h3>
        </div>
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2.5 pr-4 pl-11 text-sm text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222222] dark:focus:ring-white/5"
            />
          </div>

          <div className="flex items-center gap-3">
            <CustomSelect
              options={TYPE_OPTIONS}
              value={selectedType}
              onChange={(val) => setSelectedType(val)}
              className="z-50 w-44"
            />

            <button
              onClick={refreshFeedback}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/10 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5 transition-all"
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
