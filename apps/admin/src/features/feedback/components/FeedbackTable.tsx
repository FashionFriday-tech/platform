'use client';

import React, { useState } from 'react';
import { type Feedback } from '@ff/schemas';
import { MailIcon, CalendarIcon, CloseIcon, InfoIcon } from '@ff/ui';

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
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white dark:border-white/5 dark:bg-[#111111]">
      <div className="scrollbar-hide flex-1 overflow-auto">
        <table className="relative w-full text-left text-sm text-black dark:text-white">
          <thead className="sticky top-0 z-30 border-b border-black/5 bg-[#f8f9fa] text-xs font-medium text-black/60 uppercase dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white/60">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Submitted At</th>
              <th className="px-6 py-4 whitespace-nowrap">Type</th>
              <th className="px-6 py-4 whitespace-nowrap">Email Address</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-black/40 dark:text-white/40">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/10 border-t-black dark:border-white/10 dark:border-t-white" />
                    <span>Loading feedback items...</span>
                  </div>
                </td>
              </tr>
            ) : feedbackList.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-black/40 dark:text-white/40">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <InfoIcon className="h-8 w-8 text-black/30 dark:text-white/30" />
                    <span className="text-base font-semibold">No feedback found</span>
                    <span className="text-xs">Adjust your search or filters to see more.</span>
                  </div>
                </td>
              </tr>
            ) : (
              feedbackList.map((item) => (
                <tr
                  key={item.id}
                  className="group relative transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-black/60 dark:text-white/60">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 opacity-50" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${getBadgeClass(item.type)}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black/70 dark:text-white/70">
                    {item.email ? (
                      <div className="flex items-center gap-2">
                        <MailIcon className="h-4 w-4 opacity-55" />
                        <span>{item.email}</span>
                      </div>
                    ) : (
                      <span className="italic text-black/30 dark:text-white/30 text-xs">Anonymous</span>
                    )}
                  </td>
                  <td className="px-6 py-4 max-w-md">
                    <p className="line-clamp-2 text-black/70 dark:text-white/70 text-sm">
                      {item.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedFeedback(item)}
                      className="rounded-xl border border-black/10 px-3 py-1.5 text-xs font-semibold hover:bg-black hover:text-white transition-all dark:border-white/10 dark:hover:bg-white dark:hover:text-black"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl dark:border-white/5 dark:bg-[#111111]">
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-4 dark:border-white/5">
              <h3 className="text-lg font-black uppercase tracking-tight">Feedback Details</h3>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/5"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${getBadgeClass(selectedFeedback.type)}`}>
                  {selectedFeedback.type}
                </span>
                <span className="text-xs text-black/50 dark:text-white/50 flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  {formatDate(selectedFeedback.createdAt)}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40 mb-1">
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
                  <span className="italic text-sm text-black/40 dark:text-white/40">Anonymous customer</span>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40 mb-1">
                  Feedback / Suggestion
                </h4>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5 border border-black/5 dark:border-white/5 max-h-60 overflow-y-auto">
                  <p className="text-sm leading-relaxed text-black/85 dark:text-white/85 whitespace-pre-wrap">
                    {selectedFeedback.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-black/5 px-6 py-4 dark:border-white/5">
              <button
                onClick={() => setSelectedFeedback(null)}
                className="rounded-2xl bg-black px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-black/80 transition-all dark:bg-white dark:text-black dark:hover:bg-white/80"
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
