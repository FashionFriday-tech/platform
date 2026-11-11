'use client';

import React from 'react';
import { motion } from 'motion/react';

import { type ModelGroupDetail } from '../types';

interface RenameGroupModalProps {
  group: ModelGroupDetail | null;
  newGroupName: string;
  setNewGroupName: (val: string) => void;
  isRenaming: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function RenameGroupModal({
  group,
  newGroupName,
  setNewGroupName,
  isRenaming,
  onConfirm,
  onClose,
}: RenameGroupModalProps) {
  if (!group) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#141417]"
      >
        <h3 className="text-lg font-black text-black dark:text-white">
          Rename Product Group
        </h3>
        <p className="mt-1.5 text-xs text-black/60 dark:text-white/60">
          This will update the group slug on all{' '}
          <strong className="text-black dark:text-white">
            {group.count} product{group.count === 1 ? '' : 's'}
          </strong>{' '}
          in this group simultaneously.
        </p>

        <div className="mt-4 space-y-1.5">
          <label className="text-[11px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
            Group Identifier Slug
          </label>
          <input
            type="text"
            value={newGroupName}
            onChange={(e) =>
              setNewGroupName(
                e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^a-z0-9_-]+/g, ''),
              )
            }
            placeholder="e.g. nike-dunk-low"
            className="w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-sm font-semibold text-black lowercase transition-all outline-none focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/30"
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isRenaming}
            className="rounded-full border border-black/10 px-4 py-2 text-xs font-bold text-black/70 hover:bg-black/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isRenaming || !newGroupName.trim()}
            className="rounded-full bg-black px-5 py-2 text-xs font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-40 dark:bg-white dark:text-black"
          >
            {isRenaming ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

