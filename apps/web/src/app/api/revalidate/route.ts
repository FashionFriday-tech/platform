import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { timingSafeEqual } from 'node:crypto';

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret') ?? request.headers.get('x-revalidate-secret');
    const tag = searchParams.get('tag');
    const path = searchParams.get('path') ?? '/';

    // 1. Guard against unauthorized requests
    const expectedSecret = process.env.REVALIDATION_SECRET ?? 'super-secret-token';
    if (!secret || !safeCompare(secret, expectedSecret)) {
      return NextResponse.json({ message: 'Invalid revalidation secret' }, { status: 401 });
    }

    if (!tag) {
      return NextResponse.json({ message: 'Missing tag parameter' }, { status: 400 });
    }

    // 2. Perform cache revalidation
    revalidateTag(tag, 'max');

    // 3. Fire-and-forget cache warming
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://127.0.0.1:3000';
    const targetUrl = `${appUrl}${path.startsWith('/') ? path : '/' + path}`;

    // We run this asynchronously so we can return the response immediately
    void fetch(targetUrl, { method: 'GET' }).catch((err: unknown) => {
      console.error('Cache warming fetch failed:', err);
    });

    return NextResponse.json({
      revalidated: true,
      tag,
      path,
      warmed: true,
      timestamp: Date.now(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Revalidation failed', error: message }, { status: 500 });
  }
}
