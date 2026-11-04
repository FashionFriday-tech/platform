'use client';

import React, { useEffect, useState } from 'react';

import { CloseIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { type Color, type CreateColorInput } from '../types';

interface AddColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (color: CreateColorInput) => Promise<unknown>;
  initialData?: Color | null;
  defaultName?: string;
  defaultHex?: string;
  isSaving: boolean;
}

export function AddColorModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultName = '',
  defaultHex = '#000000',
  isSaving,
}: AddColorModalProps) {
  const [name, setName] = useState('');
  const [hex, setHex] = useState('#000000');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData && initialData.id) {
      setName(initialData.name);
      setHex(initialData.hex.startsWith('#') ? initialData.hex : `#${initialData.hex}`);
    } else {
      setName(defaultName || initialData?.name || '');
      const initialHex = defaultHex || initialData?.hex || '#000000';
      setHex(initialHex.startsWith('#') ? initialHex : `#${initialHex}`);
    }
    setError(null);
  }, [initialData, defaultName, defaultHex, isOpen]);

  if (!isOpen) {
    return null;
  }

  const isValidHex = (val: string) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    let cleanHex = hex.trim();

    if (!cleanName) {
      setError('Please provide a color name.');
      return;
    }

    if (!cleanHex.startsWith('#')) {
      cleanHex = `#${cleanHex}`;
    }

    if (!isValidHex(cleanHex)) {
      setError('Please provide a valid 3 or 6 digit hex color (e.g. #000000).');
      return;
    }

    setError(null);
    try {
      await onSave({
        name: cleanName,
        hex: cleanHex.toUpperCase(),
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to save color.');
    }
  };

  const handleHexChange = (val: string) => {
    setHex(val);
    if (error) {
      setError(null);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-black/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#141417]"
        >
          {/* Header */}
          <div className="mb-6 flex items-center justify-between border-b border-black/5 pb-4 dark:border-white/5">
            <div>
              <h2 className="text-xl font-bold text-black dark:text-white">
                {initialData?.id ? 'Edit Color' : 'Add New Color'}
              </h2>
              <p className="text-xs text-black/50 dark:text-white/50">
                {initialData?.id
                  ? 'Update color name and hex code'
                  : 'Add a new color to your product catalog'}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-black/60 transition-colors hover:bg-black/10 hover:text-black dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Live Preview Card */}
            <div className="flex items-center gap-4 rounded-2xl border border-black/5 bg-black/[0.02] p-4 dark:border-white/5 dark:bg-white/[0.02]">
              <div
                className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-black/10 shadow-inner dark:border-white/10"
                style={{ backgroundColor: isValidHex(hex) ? hex : '#000000' }}
              >
                <input
                  type="color"
                  value={isValidHex(hex) ? hex : '#000000'}
                  onChange={(e) => handleHexChange(e.target.value.toUpperCase())}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  title="Click to pick color"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-black truncate dark:text-white">
                  {name.trim() || 'Color Name'}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs font-semibold text-black/60 uppercase dark:text-white/60">
                    {isValidHex(hex) ? hex.toUpperCase() : '#------'}
                  </span>
                  <span className="text-[11px] text-black/40 dark:text-white/40">
                    (Click swatch to pick)
                  </span>
                </div>
              </div>
            </div>

            {/* Color Name Input */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-black/70 uppercase tracking-wider dark:text-white/70">
                Color Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. Royal Blue, Emerald Green"
                className="w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-sm font-medium text-black outline-none transition-all focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/30"
              />
            </div>

            {/* HEX Input with native picker */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-black/70 uppercase tracking-wider dark:text-white/70">
                Hex Code
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={hex}
                  onChange={(e) => handleHexChange(e.target.value)}
                  placeholder="#000000"
                  className="w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-sm font-mono font-medium text-black uppercase outline-none transition-all focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/30"
                />
                <div className="absolute right-2.5 flex items-center gap-1.5">
                  <div
                    className="relative h-6 w-6 rounded-lg border border-black/15 shadow-inner dark:border-white/15"
                    style={{ backgroundColor: isValidHex(hex) ? hex : '#000000' }}
                  >
                    <input
                      type="color"
                      value={isValidHex(hex) ? hex : '#000000'}
                      onChange={(e) => handleHexChange(e.target.value.toUpperCase())}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-medium text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/5 dark:border-white/5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="rounded-full px-5 py-2.5 text-xs font-bold text-black/60 transition-colors hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-full bg-black px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black"
              >
                {isSaving ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white dark:border-black/20 dark:border-t-black" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{initialData ? 'Save Changes' : 'Create Color'}</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
