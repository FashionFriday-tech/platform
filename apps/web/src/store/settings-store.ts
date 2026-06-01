import { create } from 'zustand';
import { DEFAULT_SETTINGS } from '@/config/default-settings.';

const STORAGE_KEY = 'app_settings';

type Settings = typeof DEFAULT_SETTINGS;

interface SettingsState {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  syncSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: DEFAULT_SETTINGS,

  syncSettings: () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<Settings>;
        set((state) => ({
          settings: { ...state.settings, ...parsed },
        }));
      }
    } catch {
      // Silent catch
    }
  },

  updateSettings: (updates) => {
    set((state) => {
      const nextSettings = { ...state.settings, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings));
      }
      return { settings: nextSettings };
    });
  },
}));
