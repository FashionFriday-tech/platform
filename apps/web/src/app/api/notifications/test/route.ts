import { NextResponse } from 'next/server';

import {
  broadcastWebPush,
  pushSubscriptionsStore,
} from '@/features/notifications/services/push-sender';

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Use defaults if empty body
    }

    const payload = {
      title: body.title || 'Fashion Friday Exclusive Drop',
      body:
        body.body ||
        'Air Jordan 4 Retro "Bred Reimagined" is now live on Fashion Friday. Tap to explore!',
      url: body.url || '/account/notifications',
      icon: body.icon || '/icons/icon-192.png',
      badge: body.badge || '/favicon-48x48.png',
      id: `test-push-${Date.now()}`,
    };

    const count = pushSubscriptionsStore.count();
    if (count === 0) {
      return NextResponse.json({
        success: false,
        message: 'No devices currently subscribed to push notifications.',
        activeSubscribers: 0,
      });
    }

    const stats = await broadcastWebPush(payload);

    return NextResponse.json({
      success: true,
      message: `Push notification dispatched to ${stats.sent} devices (${stats.failed} failed)`,
      stats,
    });
  } catch (error) {
    console.error('[Push Test API] Error:', error);
    return NextResponse.json({ error: 'Failed to broadcast push notification' }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({
    subscribersCount: pushSubscriptionsStore.count(),
    ready: true,
  });
}
