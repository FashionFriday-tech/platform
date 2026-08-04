'use client';

import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { toast } from 'sonner';

import { useNotifications } from '@/features/notifications';
import { api } from '@/lib/api-client';

import { useAuth } from './AuthContext';

export type PushPermission = 'default' | 'granted' | 'denied' | 'unsupported';

export interface PushNotificationPreferences {
  notifyNewOrders: boolean;
  notifyStatusChanges: boolean;
  notifyStockAlerts: boolean;
  soundEnabled: boolean;
}

interface PushNotificationContextType {
  isSupported: boolean;
  permission: PushPermission;
  isEnabled: boolean;
  preferences: PushNotificationPreferences;
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  installPwaApp: () => Promise<void>;
  activatePushNotifications: () => Promise<boolean>;
  deactivatePushNotifications: () => void;
  togglePreference: (key: keyof PushNotificationPreferences) => void;
  sendTestNotification: () => void;
  sendPushAlert: (
    title: string,
    options: {
      body: string;
      url?: string;
      category?: 'orders' | 'inventory' | 'customers' | 'system';
      priority?: 'low' | 'medium' | 'high';
    },
  ) => void;
}

const PushNotificationContext = createContext<PushNotificationContextType | undefined>(undefined);

const PREFS_STORAGE_KEY = 'ff_admin_push_prefs';
const ENABLED_STORAGE_KEY = 'ff_admin_push_enabled';
const KNOWN_ORDERS_KEY = 'ff_admin_known_orders';

const DEFAULT_PREFERENCES: PushNotificationPreferences = {
  notifyNewOrders: true,
  notifyStatusChanges: true,
  notifyStockAlerts: true,
  soundEnabled: true,
};

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  'BB5oiIrq0hFGGMW6lA8Vam2ZacfQMP40nWibMle_pxhGU5UMZDhJDo4yaVQIekosLuVP7qmlO0RPHknD5JafvTg';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Web Audio API chime synthesizer: Crisp instant payment/order chime with reused context
let cachedAudioCtx: AudioContext | null = null;

function playNotificationChime() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) {
      return;
    }

    if (!cachedAudioCtx || cachedAudioCtx.state === 'closed') {
      cachedAudioCtx = new AudioCtx();
    }
    const ctx = cachedAudioCtx;
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1318.51, now); // E6
    osc1.frequency.exponentialRampToValueAtTime(1975.53, now + 0.08); // B6

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(659.25, now); // E5

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.45);
  } catch {
    // Audio context may be restricted by browser gesture policies
  }
}

export function PushNotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<PushPermission>('default');
  const [isEnabled, setIsEnabled] = useState(false);
  const [preferences, setPreferences] = useState<PushNotificationPreferences>(DEFAULT_PREFERENCES);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const deferredPromptRef = useRef<any>(null);

  const knownOrderIdsRef = useRef<Set<string>>(new Set());
  const orderStatusesRef = useRef<Map<string, string>>(new Map());
  const isInitialFetchRef = useRef(true);

  // Initialize permission, preferences, and PWA install detection
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const supported = 'Notification' in window;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
    } else {
      setPermission('unsupported');
    }

    // Check if running as standalone installed PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    // Check if on iOS device
    const ua = window.navigator.userAgent.toLowerCase();
    const isAppleMobile = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isAppleMobile);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      deferredPromptRef.current = null;
      toast.success('Fashion Friday Admin App installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    try {
      const storedPrefs = localStorage.getItem(PREFS_STORAGE_KEY);
      if (storedPrefs) {
        setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(storedPrefs) });
      }

      const storedEnabled = localStorage.getItem(ENABLED_STORAGE_KEY);
      if (storedEnabled !== null) {
        setIsEnabled(storedEnabled === 'true' && Notification.permission === 'granted');
      }

      const storedKnown = localStorage.getItem(KNOWN_ORDERS_KEY);
      if (storedKnown) {
        const arr = JSON.parse(storedKnown) as string[];
        if (Array.isArray(arr)) {
          knownOrderIdsRef.current = new Set(arr);
        }
      }
    } catch {
      // Storage read error
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Sync push subscription with backend API
  const syncPushSubscriptionWithBackend = useCallback(
    async (sub: PushSubscription) => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        await fetch(`${apiUrl}/admin/notifications/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...sub.toJSON(),
            userId: (user as any)?.id || user?.phone || user?.name,
            userRole: user?.role || 'SUPER_ADMIN',
          }),
        });
        console.log('[Push] Admin push subscription registered with backend API');
      } catch (err: unknown) {
        console.warn('[Push] Backend sync error:', err);
      }
    },
    [user?.name, user?.phone, user?.role],
  );

  // Auto-sync active push subscription on mount if permission is granted
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      Notification.permission === 'granted'
    ) {
      void (async () => {
        try {
          const reg = await navigator.serviceWorker.register('/sw.js');
          if (reg && 'pushManager' in reg) {
            let sub = await reg.pushManager.getSubscription();
            if (!sub) {
              const convertedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
              sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedKey,
              });
            }
            if (sub) {
              void syncPushSubscriptionWithBackend(sub);
            }
          }
        } catch (err) {
          console.warn('[Push] Auto-subscribe error:', err);
        }
      })();
    }
  }, [syncPushSubscriptionWithBackend]);

  // Ensure service worker is registered
  const registerServiceWorker = useCallback(async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return null;
    }
    try {
      return await navigator.serviceWorker.register('/sw.js');
    } catch (err) {
      console.warn('[Push] ServiceWorker registration warning:', err);
      return null;
    }
  }, []);

  // Send native / service worker push notification
  const sendPushAlert = useCallback(
    (
      title: string,
      options: {
        body: string;
        url?: string;
        category?: 'orders' | 'inventory' | 'customers' | 'system';
        priority?: 'low' | 'medium' | 'high';
      },
    ) => {
      if (typeof window === 'undefined') {
        return;
      }

      // Role-based notification routing:
      // Product Manager: ONLY receives product & inventory related alerts
      // Sales Manager: ONLY receives sales & orders related alerts
      // Super Admin: receives EVERY message and alert across all departments
      const userRole = user?.role || 'SUPER_ADMIN';
      const category = options.category || 'orders';

      if (userRole === 'PRODUCT_MANAGER') {
        if (category !== 'inventory') {
          return;
        }
      } else if (userRole === 'SALES_MANAGER') {
        if (category !== 'orders' && category !== 'customers') {
          return;
        }
      }

      // Play audio chime if enabled
      if (preferences.soundEnabled) {
        playNotificationChime();
      }

      // Add to in-app notification center
      addNotification({
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title,
        description: options.body,
        category: options.category || 'orders',
        priority: options.priority || 'high',
        timestamp: 'Just now',
        read: false,
        actionUrl: options.url || '/orders',
        actionLabel: 'View Details',
      });

      if (!('Notification' in window) || Notification.permission !== 'granted') {
        return;
      }

      const notificationOptions: NotificationOptions = {
        body: options.body,
        icon: '/icons/ff_admin_app_icon.png',
        badge: '/icons/icon-192.png',
        tag: `ff-admin-${Date.now()}`,
        data: { url: options.url || '/orders' },
      };

      // Mobile status bar, vibration pattern, and persistence enhancements
      (notificationOptions as any).vibrate = [200, 100, 200];
      (notificationOptions as any).requireInteraction = true;
      (notificationOptions as any).actions = [
        { action: 'open', title: 'View Details' },
        { action: 'dismiss', title: 'Dismiss' },
      ];

      // Dispatch to Service Worker or browser Notification asynchronously without blocking UI
      void (async () => {
        try {
          if ('serviceWorker' in navigator) {
            const swReady = Promise.race([
              navigator.serviceWorker.ready,
              new Promise<null>((r) =>
                setTimeout(() => {
                  r(null);
                }, 800),
              ),
            ]);
            const reg = await swReady;
            if (reg && 'showNotification' in reg) {
              await reg.showNotification(title, notificationOptions);
              return;
            }
          }
        } catch {
          // Fall back to direct Notification
        }

        try {
          const notif = new Notification(title, notificationOptions);
          notif.onclick = () => {
            window.focus();
            if (options.url) {
              window.location.href = options.url;
            }
          };
        } catch (err) {
          console.warn('[Push] Direct notification fallback error:', err);
        }
      })();
    },
    [addNotification, preferences.soundEnabled, user?.role],
  );

  // Trigger PWA install dialog
  const installPwaApp = useCallback(async () => {
    if (!deferredPromptRef.current) {
      if (isIOS) {
        toast.info(
          'On iPhone/iPad: Tap the Safari Share button ⎋, then select "Add to Home Screen".',
          { duration: 5000 },
        );
      } else {
        toast.info('App installation prompt is not available or already installed on this device.');
      }
      return;
    }

    try {
      deferredPromptRef.current.prompt();
      const choiceResult = await deferredPromptRef.current.userChoice;
      if (choiceResult?.outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        deferredPromptRef.current = null;
        toast.success('Fashion Friday Admin App added to your device!');
      }
    } catch (err) {
      console.warn('[PWA] Install prompt error:', err);
    }
  }, [isIOS]);

  // Activate push notifications (optimistic & non-blocking)
  const activatePushNotifications = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.error('Browser push notifications are not supported on this device.');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        setIsEnabled(true);
        localStorage.setItem(ENABLED_STORAGE_KEY, 'true');
        toast.success('Push notifications activated successfully!');

        // Run background tasks without blocking UI: Register SW, subscribe PushManager, and sync with backend
        void (async () => {
          try {
            const reg = await registerServiceWorker();
            if (reg && 'pushManager' in reg) {
              let sub = await reg.pushManager.getSubscription();
              if (!sub) {
                const convertedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
                sub = await reg.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: convertedKey,
                });
              }
              if (sub) {
                await syncPushSubscriptionWithBackend(sub);
              }
            }
          } catch (err) {
            console.warn('[Push] Registration/subscription error:', err);
          }
        })();

        if (preferences.soundEnabled) {
          playNotificationChime();
        }
        sendPushAlert('🔔 Push Notifications Activated', {
          body: 'You will now receive real-time push alerts whenever new orders and updates occur.',
          url: '/orders',
          category: 'system',
          priority: 'medium',
        });
        return true;
      } else if (result === 'denied') {
        setIsEnabled(false);
        localStorage.setItem(ENABLED_STORAGE_KEY, 'false');
        toast.error('Notification permission was blocked in your browser settings.');
        return false;
      } else {
        return false;
      }
    } catch (err) {
      console.error('[Push] Failed to request notification permission:', err);
      toast.error('Failed to request notification permission.');
      return false;
    }
  }, [registerServiceWorker, sendPushAlert, preferences.soundEnabled, syncPushSubscriptionWithBackend]);

  // Deactivate push notifications
  const deactivatePushNotifications = useCallback(() => {
    setIsEnabled(false);
    try {
      localStorage.setItem(ENABLED_STORAGE_KEY, 'false');
    } catch {
      // ignore
    }
    toast.info('Push notifications have been paused.');
  }, []);

  // Toggle preferences (instant & synchronous)
  const togglePreference = useCallback((key: keyof PushNotificationPreferences) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  // Send manual test notification (instant non-blocking feedback)
  const sendTestNotification = useCallback(() => {
    if (permission !== 'granted') {
      toast.error('Please activate push notifications first.');
      return;
    }

    toast.success('Test alert dispatched!');

    const userRole = user?.role || 'SUPER_ADMIN';
    let alertTitle = '👑 Super Admin Alert: New Order #ORD-9999';
    let alertBody = 'Rohan placed an order for ₹6,499. Super Admin executive stream active.';
    let alertUrl = '/orders';
    let alertCategory: 'orders' | 'inventory' | 'customers' | 'system' = 'orders';

    if (userRole === 'PRODUCT_MANAGER') {
      alertTitle = '🔥 Low Stock Alert: Silk Oversized Shirt';
      alertBody = 'SKU: FFS-091 inventory reached 2 units. Re-order threshold reached.';
      alertUrl = '/products';
      alertCategory = 'inventory';
    } else if (userRole === 'SALES_MANAGER') {
      alertTitle = '🔥 Sales Alert: New Order #ORD-9999';
      alertBody = 'Rohan placed an order for ₹6,499 (2 items). Payment verified via UPI.';
      alertUrl = '/orders';
      alertCategory = 'orders';
    }

    sendPushAlert(alertTitle, {
      body: alertBody,
      url: alertUrl,
      category: alertCategory,
      priority: 'high',
    });

    // Trigger real backend web push test so OS background notification arrives even if app is closed/minimized
    void (async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        await fetch(`${apiUrl}/admin/notifications/test`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: alertTitle,
            body: alertBody,
            url: alertUrl,
          }),
        });
      } catch (err) {
        console.warn('[Push] Backend test trigger error:', err);
      }
    })();
  }, [permission, sendPushAlert, user?.role]);

  // Live Background Order Watcher (polls every 20 seconds when enabled & logged in)
  useEffect(() => {
    if (!user || !isEnabled || permission !== 'granted') {
      return;
    }
    // Product Managers do not receive sales/order alerts
    if (user.role === 'PRODUCT_MANAGER') {
      return;
    }

    let isCancelled = false;

    const checkOrders = async () => {
      try {
        const data = await api.get<any[]>('/orders/admin', { cache: 'no-store' });
        if (isCancelled || !Array.isArray(data)) {
          return;
        }

        // Initial fetch: seed existing orders without notifying
        if (isInitialFetchRef.current) {
          isInitialFetchRef.current = false;
          data.forEach((o) => {
            if (o.id) {
              knownOrderIdsRef.current.add(o.id);
              orderStatusesRef.current.set(o.id, (o.status || 'pending').toLowerCase());
            }
          });
          try {
            localStorage.setItem(
              KNOWN_ORDERS_KEY,
              JSON.stringify(Array.from(knownOrderIdsRef.current)),
            );
          } catch {
            // ignore
          }
          return;
        }

        // Subsequent polls: check for brand new orders
        for (const order of data) {
          if (!order.id) {
            continue;
          }

          // 1. New Order Detected
          if (!knownOrderIdsRef.current.has(order.id)) {
            knownOrderIdsRef.current.add(order.id);
            orderStatusesRef.current.set(order.id, (order.status || 'pending').toLowerCase());

            try {
              localStorage.setItem(
                KNOWN_ORDERS_KEY,
                JSON.stringify(Array.from(knownOrderIdsRef.current)),
              );
            } catch {
              // ignore
            }

            if (preferences.notifyNewOrders) {
              const orderNum = order.orderNumber || order.id.slice(0, 8);
              const customerName = order.user?.name || order.customer?.name || 'Customer';
              const amount = Number(order.finalAmount || order.totalAmount || 0).toLocaleString(
                'en-IN',
              );
              const itemCount = order.items?.length || 1;

              sendPushAlert(`🔥 New Order #${orderNum}!`, {
                body: `${customerName} placed an order for ₹${amount} (${itemCount} item${itemCount > 1 ? 's' : ''}).`,
                url: '/orders',
                category: 'orders',
                priority: 'high',
              });
            }
          } else {
            // 2. Status Change Detected on existing order
            const previousStatus = orderStatusesRef.current.get(order.id);
            const currentStatus = (order.status || 'pending').toLowerCase();

            if (previousStatus && previousStatus !== currentStatus) {
              orderStatusesRef.current.set(order.id, currentStatus);

              if (preferences.notifyStatusChanges) {
                const orderNum = order.orderNumber || order.id.slice(0, 8);
                sendPushAlert(`📦 Order #${orderNum} Updated`, {
                  body: `Status changed from ${previousStatus.toUpperCase()} to ${currentStatus.toUpperCase()}.`,
                  url: '/orders',
                  category: 'orders',
                  priority: 'medium',
                });
              }
            }
          }
        }
      } catch (err) {
        console.warn('[Push] Order watcher polling error:', err);
      }
    };

    // Run initial check
    void checkOrders();

    // Poll every 20 seconds
    const interval = setInterval(() => {
      void checkOrders();
    }, 20000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [
    user,
    isEnabled,
    permission,
    preferences.notifyNewOrders,
    preferences.notifyStatusChanges,
    sendPushAlert,
  ]);

  return (
    <PushNotificationContext.Provider
      value={{
        isSupported,
        permission,
        isEnabled,
        preferences,
        isInstallable,
        isInstalled,
        isIOS,
        installPwaApp,
        activatePushNotifications,
        deactivatePushNotifications,
        togglePreference,
        sendTestNotification,
        sendPushAlert,
      }}
    >
      {children}
    </PushNotificationContext.Provider>
  );
}

export function usePushNotifications() {
  const context = useContext(PushNotificationContext);
  if (!context) {
    throw new Error('usePushNotifications must be used within a PushNotificationProvider');
  }
  return context;
}
