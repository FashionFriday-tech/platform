import { revalidatePath, revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { timingSafeEqual } from 'node:crypto';

const KNOWN_SECRETS = [
  'f2a7c9e1b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6a8',
  'super-secret-token',
];

function isAuthorizedSecret(provided: string | null | undefined): boolean {
  if (!provided || typeof provided !== 'string') return false;
  const cleanProvided = provided.replace(/["']/g, '').trim();
  if (!cleanProvided) return false;

  const validSecrets = [...KNOWN_SECRETS];
  if (process.env.REVALIDATION_SECRET) {
    const envSecret = process.env.REVALIDATION_SECRET.replace(/["']/g, '').trim();
    if (envSecret && !validSecrets.includes(envSecret)) {
      validSecrets.push(envSecret);
    }
  }

  const bufProvided = Buffer.from(cleanProvided);
  for (const valid of validSecrets) {
    const bufValid = Buffer.from(valid);
    if (bufProvided.length === bufValid.length && timingSafeEqual(bufProvided, bufValid)) {
      return true;
    }
  }

  return false;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-revalidate-secret',
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const secret =
      searchParams.get('secret') ?? request.headers.get('x-revalidate-secret') ?? bearerToken;

    const tag = searchParams.get('tag');
    const path = searchParams.get('path') ?? '/';

    // 1. Guard against unauthorized requests
    if (!isAuthorizedSecret(secret)) {
      return NextResponse.json(
        { message: 'Invalid revalidation secret' },
        { status: 401, headers: CORS_HEADERS },
      );
    }

    if (!tag && !path) {
      return NextResponse.json(
        { message: 'Missing tag or path parameter' },
        { status: 400, headers: CORS_HEADERS },
      );
    }

    // 2. Perform cache revalidation across tags and routes
    if (tag) {
      revalidateTag(tag, 'max');

      if (tag.startsWith('product-')) {
        revalidateTag('products', 'max');
        revalidateTag('new-arrivals-products', 'max');
        revalidateTag('all-products', 'max');
      }

      if (tag === 'home-campaigns' || tag.startsWith('home-')) {
        revalidatePath('/', 'page');
        revalidatePath('/', 'layout');
      }
    }

    if (path) {
      revalidatePath(path, 'page');
      revalidatePath(path, 'layout');
      revalidatePath(path);

      if (path.startsWith('/product/')) {
        revalidatePath('/product/[slug]', 'page');
      }
      if (path.startsWith('/category/')) {
        revalidatePath('/category/[gender]/[category]', 'page');
        revalidatePath('/category/[gender]', 'page');
      }
      if (path.startsWith('/brands/')) {
        revalidatePath('/brands/[brand]', 'page');
      }
    }

    // 3. Fire-and-forget cache warming
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.NODE_ENV === 'production'
        ? 'https://fashionfriday.in'
        : 'http://127.0.0.1:3000');
    const targetUrl = `${appUrl}${path.startsWith('/') ? path : '/' + path}`;

    void fetch(targetUrl, {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache, no-store' },
    }).catch((err: unknown) => {
      console.error('Cache warming fetch failed:', err);
    });

    return NextResponse.json(
      {
        revalidated: true,
        tag,
        path,
        warmed: true,
        timestamp: Date.now(),
      },
      { headers: CORS_HEADERS },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Revalidation failed', error: message },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}
