import React from 'react';
import { createPortal } from 'react-dom';

import { TrashIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

interface DeleteCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  collectionName?: string;
  isDeleting?: boolean;
}

export function DeleteCollectionModal({
  isOpen,
  onClose,
  onConfirm,
  collectionName,
  isDeleting = false,
}: DeleteCollectionModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-black/5 bg-white p-6 shadow-2xl dark:border-white/5 dark:bg-[#111111]"
        >
          <div className="flex flex-col items-center text-center">
            {/* Red Warning Icon */}
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
              <TrashIcon className="h-7 w-7" />
            </div>

            <h3 className="text-xl font-bold text-black dark:text-white">Delete Collection</h3>

            <p className="mt-2 text-sm text-black/60 dark:text-white/60">
              Are you sure you want to delete{' '}
              {collectionName ? (
                <span className="font-semibold text-black dark:text-white">
                  &quot;{collectionName}&quot;
                </span>
              ) : (
                'this collection'
              )}
              ? This action cannot be undone.
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex w-full gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 rounded-xl border border-black/10 bg-transparent py-3 text-sm font-semibold text-black transition-all hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 active:scale-95 disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600"
              >
                {isDeleting && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                )}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
}
