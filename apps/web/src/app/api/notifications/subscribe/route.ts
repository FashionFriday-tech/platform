import { NextResponse } from 'next/server';

import {
  type PushSubscriptionRecord,
  pushSubscriptionsStore,
} from '@/features/notifications/services/push-sender';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      endpoint: string;
      expirationTime?: number | null;
      keys: {
        p256dh: string;
        auth: string;
      };
      userId?: string | null;
    };

    if (!body?.endpoint || !body?.keys?.p256dh || !body?.keys?.auth) {
      return NextResponse.json({ error: 'Invalid push subscription payload' }, { status: 400 });
    }

    const record: PushSubscriptionRecord = {
      endpoint: body.endpoint,
      expirationTime: body.expirationTime ?? null,
      keys: body.keys,
      userId: body.userId || null,
      createdAt: new Date().toISOString(),
    };

    pushSubscriptionsStore.add(record);

    return NextResponse.json({
      success: true,
      message: 'Push subscription registered successfully',
      count: pushSubscriptionsStore.count(),
    });
  } catch (error) {
    console.error('[Push Subscription API] Error:', error);
    return NextResponse.json({ error: 'Failed to register push subscription' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { endpoint } = (await req.json()) as { endpoint?: string };

    if (endpoint) {
      pushSubscriptionsStore.remove(endpoint);
    }

    return NextResponse.json({
      success: true,
      message: 'Push subscription removed successfully',
      count: pushSubscriptionsStore.count(),
    });
  } catch (error) {
    console.error('[Push Unsubscribe API] Error:', error);
    return NextResponse.json({ error: 'Failed to remove push subscription' }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({
    activeSubscriptions: pushSubscriptionsStore.count(),
    status: 'online',
  });
}
