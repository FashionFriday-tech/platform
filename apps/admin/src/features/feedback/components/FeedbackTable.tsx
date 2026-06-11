'use client';

import React, { useState } from 'react';

import { type Feedback } from '@ff/schemas';
import { CalendarIcon, CloseIcon, InfoIcon, MailIcon } from '@ff/ui';

interface FeedbackTableProps {
  feedbackList: Feedback[];
  isLoading: boolean;
}

export function FeedbackTable({ feedbackList, isLoading }: FeedbackTableProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const getBadgeClass = (type: Feedback['type']) => {
    switch (type) {
      case 'issue':
        return 'bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-300 border border-red-500/20';
      case 'improvement':
        return 'bg-violet-500/10 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 border border-violet-500/20';
      case 'suggestion':
        return 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/20';
      case 'other':
      default:
        return 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/20';
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-slate-50/50 p-2.5 shadow-xs dark:border-white/10 dark:bg-black/20">
      <div className="scrollbar-hide flex-1 overflow-x-auto overflow-y-auto">
        <div className="flex min-w-[950px] flex-col gap-2.5 pb-2">
          {/* Header Tab - Fixed / Sticky on Top (Black in Light Mode) */}
          <div className="sticky top-0 z-20 pb-0.5">
            <div className="grid grid-cols-[minmax(160px,1.2fr)_minmax(130px,1fr)_minmax(200px,1.5fr)_minmax(280px,2.5fr)_minmax(110px,1fr)] items-center rounded-xl border border-black/10 bg-black px-6 py-3.5 text-white shadow-md backdrop-blur-md dark:border-white/10 dark:bg-white dark:text-black dark:shadow-sm">
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Submitted At
              </div>
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Type
              </div>
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Email Address
              </div>
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Description
              </div>
              <div className="text-right text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Actions
              </div>
            </div>
          </div>

          {/* Body Content */}
          {isLoading ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-black/10 bg-white shadow-xs dark:border-white/10 dark:bg-[#141417]">
              <div className="flex flex-col items-center justify-center gap-2 text-black/40 dark:text-white/40">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/10 border-t-black dark:border-white/10 dark:border-t-white" />
                <span>Loading feedback items...</span>
              </div>
            </div>
          ) : feedbackList.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-black/10 bg-white p-8 text-center shadow-xs dark:border-white/10 dark:bg-[#141417]">
              <InfoIcon className="h-8 w-8 text-black/30 dark:text-white/30" />
              <span className="text-base font-semibold text-black dark:text-white">
                No feedback found
              </span>
              <span className="text-xs text-black/50 dark:text-white/50">
                Adjust your search or filters to see more.
              </span>
            </div>
          ) : (
            feedbackList.map((item) => (
              <div
                key={item.id}
                className="group grid grid-cols-[minmax(160px,1.2fr)_minmax(130px,1fr)_minmax(200px,1.5fr)_minmax(280px,2.5fr)_minmax(110px,1fr)] items-center rounded-xl border border-black/5 bg-white px-6 py-3.5 text-black shadow-xs transition-all duration-200 hover:border-black/15 hover:shadow-md active:scale-[0.995] dark:border-white/10 dark:bg-[#141417] dark:text-white dark:shadow-sm dark:hover:border-white/20"
              >
                {/* Date */}
                <div className="flex items-center gap-2 pr-4 text-xs font-medium text-black/70 dark:text-white/70">
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                  <span>{formatDate(item.createdAt)}</span>
                </div>

                {/* Type */}
                <div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${getBadgeClass(item.type)}`}
                  >
                    {item.type}
                  </span>
                </div>

                {/* Email */}
                <div className="truncate pr-4 text-xs font-medium text-black/70 dark:text-white/70">
                  {item.email ? (
                    <div className="flex items-center gap-2 truncate">
                      <MailIcon className="h-4 w-4 opacity-55" />
                      <span className="truncate">{item.email}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-black/30 italic dark:text-white/30">
                      Anonymous
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="pr-4 text-xs text-black/70 dark:text-white/70">
                  <p className="line-clamp-2 max-w-md">{item.description}</p>
                </div>

                {/* Actions */}
                <div className="text-right">
                  <button
                    onClick={() => {
                      setSelectedFeedback(item);
                    }}
                    className="rounded-xl border border-black/10 px-3 py-1.5 text-xs font-semibold transition-all hover:bg-black hover:text-white dark:border-white/10 dark:hover:bg-white dark:hover:text-black"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl dark:border-white/5 dark:bg-[#111111]">
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-4 dark:border-white/5">
              <h3 className="text-lg font-black tracking-tight uppercase">Feedback Details</h3>
              <button
                onClick={() => {
                  setSelectedFeedback(null);
                }}
                className="rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/5"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${getBadgeClass(selectedFeedback.type)}`}
                >
                  {selectedFeedback.type}
                </span>
                <span className="flex items-center gap-1 text-xs text-black/50 dark:text-white/50">
                  <CalendarIcon className="h-4 w-4" />
                  {formatDate(selectedFeedback.createdAt)}
                </span>
              </div>

              <div>
                <h4 className="mb-1 text-xs font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                  Submitted By
                </h4>
                {selectedFeedback.email ? (
                  <a
                    href={`mailto:${selectedFeedback.email}`}
                    className="flex items-center gap-2 text-sm font-semibold text-teal-600 hover:underline dark:text-teal-400"
                  >
                    <MailIcon className="h-4 w-4" />
                    {selectedFeedback.email}
                  </a>
                ) : (
                  <span className="text-sm text-black/40 italic dark:text-white/40">
                    Anonymous customer
                  </span>
                )}
              </div>

              <div>
                <h4 className="mb-1 text-xs font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                  Feedback / Suggestion
                </h4>
                <div className="max-h-60 overflow-y-auto rounded-2xl border border-black/5 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/5">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-black/85 dark:text-white/85">
                    {selectedFeedback.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-black/5 px-6 py-4 dark:border-white/5">
              <button
                onClick={() => {
                  setSelectedFeedback(null);
                }}
                className="rounded-2xl bg-black px-5 py-2.5 text-xs font-black tracking-wider text-white uppercase transition-all hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
