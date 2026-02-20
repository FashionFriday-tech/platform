'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { DEFAULT_SETTINGS } from '@/config/default-settings.';

const STORAGE_KEY = 'app_settings';

type Settings = typeof DEFAULT_SETTINGS;

type SettingsContextType = {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const syncSettings = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          // FIX: Cast JSON.parse to Partial<Settings> to remove 'any'
          const parsed = JSON.parse(stored) as Partial<Settings>;

          setSettings((prev) => ({
            ...prev,
            ...parsed,
          }));
        }
      } catch (error) {
        console.error('Failed to load settings from storage:', error);
      }
    };

    syncSettings();
  }, []);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used inside SettingsProvider');
  }
  return ctx;
}
