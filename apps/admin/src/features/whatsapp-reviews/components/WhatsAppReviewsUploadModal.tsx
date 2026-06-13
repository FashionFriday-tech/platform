'use client';

import React from 'react';
import { AlertCircleIcon, CheckCircleIcon, CloseIcon } from '@ff/ui';

export interface UploadItemProgress {
  id: string;
  file: File;
  previewUrl: string;
  fileName: string;
  fileSize: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

interface WhatsAppReviewsUploadModalProps {
  isOpen: boolean;
  items: UploadItemProgress[];
  isUploading: boolean;
  onClose: () => void;
  onRetryFailed?: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function WhatsAppReviewsUploadModal({
  isOpen,
  items,
  isUploading,
  onClose,
  onRetryFailed,
}: WhatsAppReviewsUploadModalProps) {
  if (!isOpen || items.length === 0) {
    return null;
  }

  const total = items.length;
  const completed = items.filter((i) => i.status === 'success').length;
  const failed = items.filter((i) => i.status === 'error').length;
  const allFinished = !isUploading && (completed + failed === total);
  const percent = total > 0 ? Math.round(((completed + failed) / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl transition-all duration-300 dark:border-white/10 dark:bg-[#111111]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-colors ${
                allFinished && failed === 0
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : failed > 0
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {allFinished && failed === 0 ? (
                <CheckCircleIcon className="h-6 w-6 text-emerald-500" />
              ) : (
                <svg
                  className={`h-5 w-5 ${isUploading ? 'animate-bounce' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              )}
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-black uppercase dark:text-white">
                {allFinished
                  ? failed === 0
                    ? 'Upload Complete'
                    : 'Upload Finished with Issues'
                  : `Uploading ${total} Reviews`}
              </h3>
              <p className="text-xs font-medium text-black/50 dark:text-white/50">
                {allFinished
                  ? `${completed} saved to Cloudflare R2${failed > 0 ? `, ${failed} failed` : ''}`
                  : 'Saving directly to Cloudflare R2 bucket'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="rounded-full p-2 text-black/40 transition-colors hover:bg-black/5 hover:text-black disabled:opacity-30 dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
            title={isUploading ? 'Upload in progress...' : 'Close'}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Real-time Progress Bar */}
        <div className="border-b border-black/5 bg-black/[0.02] px-6 py-4 dark:border-white/5 dark:bg-white/[0.02]">
          <div className="mb-2 flex items-center justify-between text-xs font-bold">
            <span className="text-black/70 dark:text-white/70">
              {completed} of {total} uploaded {failed > 0 && `(${failed} failed)`}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400">{percent}%</span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
            <div
              className={`h-full transition-all duration-300 ease-out ${
                failed > 0
                  ? 'bg-gradient-to-r from-emerald-500 to-amber-500'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Live List of Upload Items */}
        <div className="scrollbar-thin max-h-72 overflow-y-auto p-6 space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center justify-between gap-3 rounded-2xl border p-2.5 transition-all ${
                item.status === 'uploading'
                  ? 'border-emerald-500/40 bg-emerald-500/5 shadow-sm ring-1 ring-emerald-500/30 dark:border-emerald-400/40 dark:bg-emerald-400/5'
                  : item.status === 'success'
                    ? 'border-black/5 bg-black/[0.01] dark:border-white/5 dark:bg-white/[0.01]'
                    : item.status === 'error'
                      ? 'border-red-500/30 bg-red-500/5 dark:border-red-500/30 dark:bg-red-500/5'
                      : 'border-black/5 bg-transparent dark:border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Thumbnail Preview */}
                <div className="relative h-12 w-10 flex-shrink-0 overflow-hidden rounded-xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt={item.fileName}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* File Details */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-black dark:text-white">
                    {index + 1}. {item.fileName}
                  </p>
                  <p className="text-[10px] text-black/40 dark:text-white/40">
                    {formatFileSize(item.fileSize)}
                  </p>
                  {item.errorMessage && (
                    <p className="mt-0.5 text-[10px] font-semibold text-red-500 line-clamp-1">
                      {item.errorMessage}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex-shrink-0">
                {item.status === 'pending' && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-semibold text-black/50 dark:bg-white/5 dark:text-white/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-black/30 dark:bg-white/30" />
                    Queued
                  </span>
                )}

                {item.status === 'uploading' && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                    <svg
                      className="h-3.5 w-3.5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Uploading...
                  </span>
                )}

                {item.status === 'success' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Saved ✓
                  </span>
                )}

                {item.status === 'error' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-1 text-[11px] font-bold text-red-600 dark:text-red-400">
                    <AlertCircleIcon className="h-3.5 w-3.5" />
                    Failed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info & action */}
        <div className="border-t border-black/5 bg-black/[0.02] p-5 dark:border-white/5 dark:bg-white/[0.02]">
          {isUploading ? (
            <div className="flex items-center justify-between text-xs text-black/60 dark:text-white/60">
              <span className="flex items-center gap-2 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Uploading to Cloudflare R2... Please keep this window open.
              </span>
            </div>
          ) : (
            <div className="flex gap-3">
              {failed > 0 && onRetryFailed && (
                <button
                  type="button"
                  onClick={onRetryFailed}
                  className="flex-1 rounded-2xl border border-black/10 py-3 text-xs font-black tracking-wider text-black uppercase transition-all hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                >
                  Retry Failed ({failed})
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-2xl bg-black py-3 text-xs font-black tracking-wider text-white uppercase shadow-lg transition-all hover:bg-black/90 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
