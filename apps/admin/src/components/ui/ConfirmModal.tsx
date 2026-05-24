import React from 'react';
import { CloseIcon } from '@ff/ui';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#111111] border border-black/5 dark:border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-black dark:text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/5 text-black/60 dark:text-white/60"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-sm text-black/60 dark:text-white/60 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/5 border border-black/10 dark:border-white/10"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-red-600 shadow-md shadow-red-500/10"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
