import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret') || request.headers.get('x-revalidate-secret');
    const tag = searchParams.get('tag');
    const path = searchParams.get('path') || '/';

    // 1. Guard against unauthorized requests
    const expectedSecret = process.env.REVALIDATION_SECRET || 'super-secret-token';
    if (secret !== expectedSecret) {
      return NextResponse.json({ message: 'Invalid revalidation secret' }, { status: 401 });
    }

    if (!tag) {
      return NextResponse.json({ message: 'Missing tag parameter' }, { status: 400 });
    }

    // 2. Perform cache revalidation
    revalidateTag(tag, 'max');

    // 3. Fire-and-forget cache warming
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://127.0.0.1:3000';
    const targetUrl = `${appUrl}${path.startsWith('/') ? path : '/' + path}`;
    
    // We run this asynchronously so we can return the response immediately
    fetch(targetUrl, { method: 'GET' }).catch((err) => {
      console.error('Cache warming fetch failed:', err);
    });

    return NextResponse.json({
      revalidated: true,
      tag,
      path,
      warmed: true,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Revalidation failed', error: error.message },
      { status: 500 }
    );
  }
}
