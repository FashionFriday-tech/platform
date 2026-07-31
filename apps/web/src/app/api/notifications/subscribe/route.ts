import { NextResponse } from 'next/server';

interface PushSubscriptionBody {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
  userId?: string | null;
}

// In-memory subscription storage as scalable cache; in production can sync with Postgres Device/Subscription table
const memorySubscriptions = new Map<string, PushSubscriptionBody>();

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PushSubscriptionBody;

    if (!body?.endpoint || !body?.keys?.p256dh || !body?.keys?.auth) {
      return NextResponse.json({ error: 'Invalid push subscription payload' }, { status: 400 });
    }

    // Store subscription safely indexed by endpoint
    memorySubscriptions.set(body.endpoint, {
      ...body,
      userId: body.userId || null,
    });

    return NextResponse.json({
      success: true,
      message: 'Push subscription registered successfully',
      count: memorySubscriptions.size,
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
      memorySubscriptions.delete(endpoint);
    }

    return NextResponse.json({
      success: true,
      message: 'Push subscription removed successfully',
    });
  } catch (error) {
    console.error('[Push Unsubscribe API] Error:', error);
    return NextResponse.json({ error: 'Failed to remove push subscription' }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({
    activeSubscriptions: memorySubscriptions.size,
    status: 'online',
  });
}
