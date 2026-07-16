import { create } from 'zustand';

interface PinLockState {
  isLocked: boolean;
  hasPin: boolean;
  isSetupMode: boolean;
  failedAttempts: number;
  lockedUntil: number | null;
  lock: () => void;
  unlock: () => void;
  setHasPin: (hasPin: boolean) => void;
  setSetupMode: (isSetup: boolean) => void;
  recordFailedAttempt: () => void;
  resetFailedAttempts: () => void;
}

export const usePinLockStore = create<PinLockState>((set, get) => ({
  isLocked: false,
  hasPin: false,
  isSetupMode: false,
  failedAttempts: 0,
  lockedUntil: null,

  lock: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('ff_admin_pin_unlocked');
    }
    // If rate-limited, ensure still locked
    const now = Date.now();
    const { lockedUntil } = get();
    if (lockedUntil && now < lockedUntil) {
      set({ isLocked: true });
      return;
    }
    set({ isLocked: true });
  },

  unlock: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ff_admin_pin_unlocked', 'true');
    }
    set({ isLocked: false, failedAttempts: 0, lockedUntil: null });
  },

  setHasPin: (hasPin) => {
    set({ hasPin });
  },
  setSetupMode: (isSetupMode) => {
    set({ isSetupMode });
  },

  recordFailedAttempt: () => {
    const attempts = get().failedAttempts + 1;
    if (attempts >= 5) {
      // Lock for 5 minutes after 5 consecutive failed attempts
      set({
        failedAttempts: attempts,
        lockedUntil: Date.now() + 5 * 60 * 1000,
      });
    } else {
      set({ failedAttempts: attempts });
    }
  },

  resetFailedAttempts: () => {
    set({ failedAttempts: 0, lockedUntil: null });
  },
}));
