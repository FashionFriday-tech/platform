import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import webpush from 'web-push';

import { PrismaService } from '../../database/prisma.service';

export interface PushSubscriptionData {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
  userId?: string | null;
  userRole?: string;
  createdAt?: string;
}

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  id?: string;
  data?: Record<string, any>;
}

export interface CustomNotification {
  id: string;
  title: string;
  message: string;
  type: 'promo' | 'order' | 'announcement' | 'system';
  target: 'ALL' | 'CUSTOMERS' | 'ADMIN' | string;
  userId?: string | null;
  targetUserName?: string | null;
  linkUrl?: string | null;
  badge?: string | null;
  createdAt: string;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private subscriptions = new Map<string, PushSubscriptionData>();
  private customNotifications: CustomNotification[] = [];
  private readonly storageFilePath: string;
  private readonly customNotifFilePath: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const dataDir = path.join(process.cwd(), '.data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch {
        // Fallback to current directory if permission issue
      }
    }
    this.storageFilePath = path.join(dataDir, 'push_subscriptions.json');
    this.customNotifFilePath = path.join(dataDir, 'custom_notifications.json');
  }

  onModuleInit() {
    this.initWebPush();
    this.loadSubscriptions();
    this.loadCustomNotifications();
  }

  private initWebPush() {
    const publicKey =
      this.configService.get<string>('VAPID_PUBLIC_KEY') ||
      this.configService.get<string>('NEXT_PUBLIC_VAPID_PUBLIC_KEY') ||
      'BB5oiIrq0hFGGMW6lA8Vam2ZacfQMP40nWibMle_pxhGU5UMZDhJDo4yaVQIekosLuVP7qmlO0RPHknD5JafvTg';

    const privateKey =
      this.configService.get<string>('VAPID_PRIVATE_KEY') ||
      '3pvwKuGD0M0JNr-BjIGhRUz0xajhKpVpVH7FOlGr2NE';

    const subject =
      this.configService.get<string>('VAPID_SUBJECT') || 'mailto:support@fashionfriday.in';

    try {
      webpush.setVapidDetails(subject, publicKey, privateKey);
      this.logger.log('[NotificationsService] Web Push VAPID configuration initialized');
    } catch (err: unknown) {
      this.logger.error('[NotificationsService] Failed to set VAPID details:', err);
    }
  }

  private loadSubscriptions() {
    try {
      if (fs.existsSync(this.storageFilePath)) {
        const raw = fs.readFileSync(this.storageFilePath, 'utf-8');
        const list: PushSubscriptionData[] = JSON.parse(raw);
        if (Array.isArray(list)) {
          list.forEach((sub) => {
            if (sub?.endpoint && sub?.keys) {
              this.subscriptions.set(sub.endpoint, sub);
            }
          });
          this.logger.log(
            `[NotificationsService] Loaded ${this.subscriptions.size} push subscriptions from storage`,
          );
        }
      }
    } catch (err: unknown) {
      this.logger.warn('[NotificationsService] Could not load stored subscriptions:', err);
    }
  }

  private persistSubscriptions() {
    try {
      const list = Array.from(this.subscriptions.values());
      fs.writeFileSync(this.storageFilePath, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err: unknown) {
      this.logger.warn('[NotificationsService] Could not persist subscriptions to file:', err);
    }
  }

  private loadCustomNotifications() {
    try {
      if (fs.existsSync(this.customNotifFilePath)) {
        const raw = fs.readFileSync(this.customNotifFilePath, 'utf-8');
        const list: CustomNotification[] = JSON.parse(raw);
        if (Array.isArray(list)) {
          this.customNotifications = list;
          this.logger.log(
            `[NotificationsService] Loaded ${this.customNotifications.length} custom notifications from storage`,
          );
        }
      }
    } catch (err: unknown) {
      this.logger.warn('[NotificationsService] Could not load custom notifications:', err);
    }
  }

  private persistCustomNotifications() {
    try {
      fs.writeFileSync(
        this.customNotifFilePath,
        JSON.stringify(this.customNotifications, null, 2),
        'utf-8',
      );
    } catch (err: unknown) {
      this.logger.warn('[NotificationsService] Could not persist custom notifications:', err);
    }
  }

  /**
   * Register or update a push subscription
   */
  subscribe(sub: PushSubscriptionData) {
    if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
      return { success: false, message: 'Invalid subscription data' };
    }

    const existing = this.subscriptions.get(sub.endpoint);
    const updated: PushSubscriptionData = {
      ...sub,
      userId: sub.userId ?? existing?.userId ?? null,
      userRole: sub.userRole ?? existing?.userRole ?? 'CUSTOMER',
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };

    this.subscriptions.set(sub.endpoint, updated);
    this.persistSubscriptions();

    const assignedRole = updated.userRole || 'CUSTOMER';
    this.logger.log(
      `[NotificationsService] Push subscription added/updated: role=${assignedRole}, total=${this.subscriptions.size}`,
    );

    return {
      success: true,
      message: 'Subscription registered successfully',
      totalSubscriptions: this.subscriptions.size,
    };
  }

  /**
   * Remove an unsubscribed endpoint
   */
  unsubscribe(endpoint: string) {
    const deleted = this.subscriptions.delete(endpoint);
    if (deleted) {
      this.persistSubscriptions();
      this.logger.log(
        `[NotificationsService] Push subscription removed. Remaining: ${this.subscriptions.size}`,
      );
    }
    return { success: true, remaining: this.subscriptions.size };
  }

  /**
   * Send a Web Push message to a single subscription
   */
  async sendToSubscription(
    sub: PushSubscriptionData,
    payload: PushPayload,
  ): Promise<{ success: boolean; statusCode?: number; error?: string }> {
    try {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.keys.p256dh,
          auth: sub.keys.auth,
        },
      };

      const result = await webpush.sendNotification(
        pushSubscription,
        JSON.stringify({
          title: payload.title,
          body: payload.body,
          icon: payload.icon || '/icons/icon-192.png',
          badge: payload.badge || '/favicon-48x48.png',
          url: payload.url || '/',
          id: payload.id || `push-${Date.now()}`,
          data: payload.data || {},
        }),
      );

      return { success: true, statusCode: result.statusCode };
    } catch (err: any) {
      const statusCode = err?.statusCode;
      if (statusCode === 404 || statusCode === 410) {
        // Expired or unregistered subscription
        this.unsubscribe(sub.endpoint);
      }
      return {
        success: false,
        statusCode,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  /**
   * Broadcast push notification to subscribers, optionally filtered by user role or userId
   */
  async broadcast(
    payload: PushPayload,
    filter?: { role?: string; userId?: string },
  ): Promise<{ total: number; sent: number; failed: number }> {
    let targets = Array.from(this.subscriptions.values());

    if (filter?.role) {
      const roleUpper = filter.role.toUpperCase();
      targets = targets.filter((sub) => {
        const subRole = (sub.userRole || 'CUSTOMER').toUpperCase();
        if (roleUpper === 'ADMIN') {
          return (
            subRole === 'ADMIN' ||
            subRole === 'SUPER_ADMIN' ||
            subRole === 'SALES_MANAGER' ||
            subRole === 'PRODUCT_MANAGER'
          );
        }
        return subRole === roleUpper;
      });
    }

    if (filter?.userId) {
      targets = targets.filter((sub) => sub.userId === filter.userId);
    }

    if (targets.length === 0) {
      this.logger.log(
        `[NotificationsService] Broadcast: 0 matching subscribers for filter`,
        filter,
      );
      return { total: 0, sent: 0, failed: 0 };
    }

    let sent = 0;
    let failed = 0;

    await Promise.allSettled(
      targets.map(async (sub) => {
        const res = await this.sendToSubscription(sub, payload);
        if (res.success) {
          sent++;
        } else {
          failed++;
        }
      }),
    );

    this.logger.log(
      `[NotificationsService] Broadcast complete: sent=${sent}, failed=${failed}, total=${targets.length}`,
    );

    return { total: targets.length, sent, failed };
  }

  /**
   * Send custom notification composed by an admin to users
   */
  async sendCustomNotification(dto: {
    title: string;
    message: string;
    type?: 'promo' | 'order' | 'announcement' | 'system';
    target?: 'ALL' | 'CUSTOMERS' | 'ADMIN' | string;
    userId?: string | null;
    targetUserName?: string | null;
    linkUrl?: string | null;
    badge?: string | null;
    sendPush?: boolean;
  }) {
    const id = `notif-custom-${Date.now()}`;
    const newNotif: CustomNotification = {
      id,
      title: dto.title.trim(),
      message: dto.message.trim(),
      type: dto.type || 'promo',
      target: dto.target || 'CUSTOMERS',
      userId: dto.userId || null,
      targetUserName: dto.targetUserName || null,
      linkUrl: dto.linkUrl?.trim() || null,
      badge: dto.badge?.trim() || 'ANNOUNCEMENT',
      createdAt: new Date().toISOString(),
    };

    // Prepend to array and persist
    this.customNotifications.unshift(newNotif);
    this.persistCustomNotifications();

    let pushResult: any = { skipped: true };

    if (dto.sendPush !== false) {
      const pushPayload: PushPayload = {
        title: newNotif.title,
        body: newNotif.message,
        icon: '/icons/icon-192.png',
        badge: '/favicon-48x48.png',
        url: newNotif.linkUrl || '/account/notifications',
        id,
      };

      if (newNotif.target === 'ALL' || newNotif.target === 'CUSTOMERS') {
        pushResult = await this.broadcast(pushPayload, { role: 'CUSTOMER' });
      } else if (newNotif.target === 'ADMIN') {
        pushResult = await this.broadcast(pushPayload, { role: 'ADMIN' });
      } else if (newNotif.userId) {
        pushResult = await this.broadcast(pushPayload, { userId: newNotif.userId });
      }
    }

    this.logger.log(
      `[NotificationsService] Custom notification created & dispatched: ID=${id}, target=${newNotif.target}`,
    );

    return {
      success: true,
      notification: newNotif,
      pushResult,
    };
  }

  /**
   * Retrieve active custom notifications for a customer (used by Web Storefront)
   */
  getNotificationsForUser(userId?: string): Array<{
    id: string;
    type: 'promo' | 'order';
    title: string;
    message: string;
    createdAt: string;
    timestamp: string;
    link?: string;
    badge?: string;
    isRead: boolean;
  }> {
    return this.customNotifications
      .filter((n) => {
        if (n.target === 'ALL' || n.target === 'CUSTOMERS') return true;
        if (userId && n.userId === userId) return true;
        return false;
      })
      .map((n) => ({
        id: n.id,
        type: n.type === 'order' ? 'order' : 'promo',
        title: n.title,
        message: n.message,
        createdAt: n.createdAt,
        timestamp: timeAgo(new Date(n.createdAt)),
        link: n.linkUrl || undefined,
        badge: n.badge || (n.type === 'promo' ? 'PROMO' : 'ALERT'),
        isRead: false,
      }));
  }

  /**
   * Retrieve REAL live notifications for Admin panel (zero dummy data)
   */
  async getAdminNotifications() {
    try {
      const [recentOrders, recentUsers, recentReviews] = await Promise.all([
        // 1. Real orders
        this.prisma.db.order.findMany({
          take: 15,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            orderNumber: true,
            finalAmount: true,
            status: true,
            createdAt: true,
            shippingAddress: true,
            user: { select: { name: true } },
          },
        }),
        // 2. Real user signups
        this.prisma.db.user.findMany({
          take: 8,
          where: { role: 'CUSTOMER' },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            phone: true,
            createdAt: true,
          },
        }),
        // 3. Real customer reviews
        this.prisma.db.review
          .findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              rating: true,
              comment: true,
              createdAt: true,
              user: { select: { name: true } },
              product: { select: { name: true } },
            },
          })
          .catch(() => []),
      ]);

      const items: Array<{
        id: string;
        title: string;
        description: string;
        category: 'orders' | 'inventory' | 'customers' | 'system';
        priority: 'low' | 'medium' | 'high';
        timestamp: string;
        rawDate: string;
        read: boolean;
        actionUrl?: string;
        actionLabel?: string;
      }> = [];

      // Add real orders
      recentOrders.forEach((ord) => {
        const addr = ord.shippingAddress as Record<string, any> | null;
        const name = ord.user?.name || addr?.fullName || 'Customer';
        const amt = Number(ord.finalAmount || 0).toLocaleString('en-IN');
        const st = ord.status.toUpperCase();

        items.push({
          id: `order-notif-${ord.id}`,
          title: `Order #${ord.orderNumber} ${st === 'PENDING' ? 'Placed' : st}`,
          description: `Order received from ${name} for ₹${amt}. Current status: ${st}.`,
          category: 'orders',
          priority: st === 'PENDING' ? 'high' : 'medium',
          timestamp: timeAgo(ord.createdAt),
          rawDate: ord.createdAt.toISOString(),
          read: st !== 'PENDING',
          actionUrl: `/orders`,
          actionLabel: 'View Order',
        });
      });

      // Add real user signups
      recentUsers.forEach((usr) => {
        items.push({
          id: `user-notif-${usr.id}`,
          title: 'New Customer Registered',
          description: `${usr.name || 'A customer'} registered with phone ${usr.phone || 'N/A'}.`,
          category: 'customers',
          priority: 'low',
          timestamp: timeAgo(usr.createdAt),
          rawDate: usr.createdAt.toISOString(),
          read: true,
          actionUrl: '/customers',
          actionLabel: 'View Customers',
        });
      });

      // Add real reviews
      recentReviews.forEach((rev: any) => {
        items.push({
          id: `review-notif-${rev.id}`,
          title: `New ${rev.rating}★ Review Submitted`,
          description: `${rev.user?.name || 'Customer'} reviewed "${rev.product?.name || 'Product'}": "${rev.comment || 'Verified purchase'}"`,
          category: 'customers',
          priority: rev.rating >= 4 ? 'medium' : 'high',
          timestamp: timeAgo(rev.createdAt),
          rawDate: rev.createdAt.toISOString(),
          read: true,
          actionUrl: '/reviews',
          actionLabel: 'View Review',
        });
      });

      // Add custom notifications sent by team
      this.customNotifications.forEach((c) => {
        const targetLabel =
          c.target === 'CUSTOMERS'
            ? 'All Customers'
            : c.target === 'ALL'
              ? 'All Users'
              : c.targetUserName || 'Specific User';

        items.push({
          id: c.id,
          title: `[Sent] ${c.title}`,
          description: `${c.message} (Target: ${targetLabel})`,
          category: c.type === 'order' ? 'orders' : 'system',
          priority: 'medium',
          timestamp: timeAgo(new Date(c.createdAt)),
          rawDate: c.createdAt,
          read: true,
          actionUrl: c.linkUrl || undefined,
          actionLabel: c.linkUrl ? 'View Link' : undefined,
        });
      });

      // Sort all notifications by most recent date
      items.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());

      return items;
    } catch (err: any) {
      this.logger.error(`[NotificationsService] Failed to get admin notifications: ${err.message}`);
      return [];
    }
  }

  /**
   * Delete custom notification
   */
  deleteCustomNotification(id: string) {
    const idx = this.customNotifications.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.customNotifications.splice(idx, 1);
      this.persistCustomNotifications();
      return { success: true };
    }
    return { success: false, message: 'Notification not found' };
  }

  /**
   * List users for admin to select recipient
   */
  async getUsersList() {
    return this.prisma.db.user.findMany({
      where: { role: 'CUSTOMER' },
      take: 50,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
      },
    });
  }

  /**
   * Dispatch push notification when an order is created:
   * 1. To ALL Admin subscribers (instant order alert with details).
   * 2. To the Customer (order confirmation & tracking link).
   */
  async notifyNewOrder(order: any) {
    const orderNumber = order.orderNumber || order.id || 'ORDER';
    const amount = Number(order.finalAmount || order.totalAmount || 0).toLocaleString('en-IN');
    const itemCount = Array.isArray(order.items) ? order.items.length : 1;
    const customerName =
      order.shippingAddress?.fullName || order.user?.name || order.customer?.name || 'Customer';

    this.logger.log(
      `[NotificationsService] Dispatching new order push notifications for #${orderNumber}`,
    );

    // 1. Send push to Admins
    const adminPayload: PushPayload = {
      title: `🔥 New Order #${orderNumber}!`,
      body: `${customerName} placed an order for ₹${amount} (${itemCount} item${itemCount > 1 ? 's' : ''}). Tap to view.`,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      url: `/orders`,
      id: `admin-order-${order.id}-${Date.now()}`,
      data: {
        orderId: order.id,
        orderNumber,
        category: 'orders',
      },
    };

    // 2. Send push to Customer
    const customerPayload: PushPayload = {
      title: `🛍️ Order Confirmed #${orderNumber}`,
      body: `Thank you for your order! ₹${amount} confirmed. We are preparing your shipment. Tap to track.`,
      icon: '/icons/icon-192.png',
      badge: '/favicon-48x48.png',
      url: '/account/orders',
      id: `cust-order-${order.id}-${Date.now()}`,
      data: {
        orderId: order.id,
        orderNumber,
      },
    };

    const promises: Promise<any>[] = [this.broadcast(adminPayload, { role: 'ADMIN' })];
    if (order.userId) {
      promises.push(this.broadcast(customerPayload, { userId: order.userId }));
    }

    await Promise.allSettled(promises);
  }

  /**
   * Dispatch push notification when an order status updates (e.g. SHIPPED, DELIVERED)
   */
  async notifyOrderStatus(order: any) {
    if (!order?.userId) {
      return;
    }

    const orderNumber = order.orderNumber || order.id || 'ORDER';
    const status = (order.status || 'UPDATED').toUpperCase();

    const customerPayload: PushPayload = {
      title: `📦 Order #${orderNumber} ${status}`,
      body: `Your order #${orderNumber} status changed to ${status}. Tap to track delivery details.`,
      icon: '/icons/icon-192.png',
      badge: '/favicon-48x48.png',
      url: '/account/orders',
      id: `order-status-${order.id}-${Date.now()}`,
      data: {
        orderId: order.id,
        orderNumber,
        status,
      },
    };

    await this.broadcast(customerPayload, { userId: order.userId });
  }

  getSubscriptionsCount() {
    let adminCount = 0;
    let customerCount = 0;

    this.subscriptions.forEach((sub) => {
      const role = (sub.userRole || 'CUSTOMER').toUpperCase();
      if (role === 'CUSTOMER') {
        customerCount++;
      } else {
        adminCount++;
      }
    });

    return {
      total: this.subscriptions.size,
      adminCount,
      customerCount,
    };
  }
}
