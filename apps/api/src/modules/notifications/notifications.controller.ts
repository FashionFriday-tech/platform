import { Body, Controller, Delete, Get, Post } from '@nestjs/common';

import { NotificationsService, PushSubscriptionData } from './notifications.service';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Subscribe customer device
   */
  @Post('notifications/subscribe')
  subscribeCustomer(@Body() body: any) {
    const sub: PushSubscriptionData = {
      endpoint: body.endpoint,
      expirationTime: body.expirationTime,
      keys: body.keys,
      userId: body.userId || null,
      userRole: 'CUSTOMER',
    };
    return this.notificationsService.subscribe(sub);
  }

  @Delete('notifications/subscribe')
  unsubscribeCustomer(@Body() body: { endpoint?: string }) {
    if (body?.endpoint) {
      return this.notificationsService.unsubscribe(body.endpoint);
    }
    return { success: false, message: 'Endpoint is required' };
  }

  /**
   * Subscribe admin device
   */
  @Post('admin/notifications/subscribe')
  subscribeAdmin(@Body() body: any) {
    const sub: PushSubscriptionData = {
      endpoint: body.endpoint,
      expirationTime: body.expirationTime,
      keys: body.keys,
      userId: body.userId || null,
      userRole: body.userRole || 'ADMIN',
    };
    return this.notificationsService.subscribe(sub);
  }

  @Delete('admin/notifications/subscribe')
  unsubscribeAdmin(@Body() body: { endpoint?: string }) {
    if (body?.endpoint) {
      return this.notificationsService.unsubscribe(body.endpoint);
    }
    return { success: false, message: 'Endpoint is required' };
  }

  /**
   * Dispatch test push alert for admin
   */
  @Post('admin/notifications/test')
  async testAdminPush(@Body() body: any) {
    const title = body?.title || '🔔 Admin Test Push Alert';
    const message =
      body?.body ||
      'Push notification service is live! You will receive instant notifications for new orders even with the browser closed.';

    return this.notificationsService.broadcast(
      {
        title,
        body: message,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        url: '/orders',
        id: `test-${Date.now()}`,
      },
      { role: 'ADMIN' },
    );
  }

  /**
   * Dispatch test push alert for customers
   */
  @Post('notifications/test')
  async testCustomerPush(@Body() body: any) {
    const title = body?.title || '⚡ Exclusive Drop Alert';
    const message = body?.body || 'New limited arrivals just dropped at Fashion Friday!';

    return this.notificationsService.broadcast(
      {
        title,
        body: message,
        icon: '/icons/icon-192.png',
        badge: '/favicon-48x48.png',
        url: '/account/notifications',
        id: `test-${Date.now()}`,
      },
      { role: 'CUSTOMER' },
    );
  }

  @Get('notifications/subscriptions')
  getSubscriptionsCount() {
    return this.notificationsService.getSubscriptionsCount();
  }
}
