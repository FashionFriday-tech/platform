import { NextResponse } from 'next/server';

import { mapDbProductToSchema } from '@/features/product/utils/mapper';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    const take = parseInt(searchParams.get('take') || '24', 10);
    const brand = searchParams.get('brand') || undefined;
    const collection = searchParams.get('collection') || undefined;
    const category = searchParams.get('category') || undefined;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';

    let url = '';
    if (category && category !== 'all') {
      url = `${API_URL}/products/category/${encodeURIComponent(category)}?skip=${skip}&take=${take}`;
    } else {
      const queryParams = new URLSearchParams({
        skip: String(skip),
        take: String(take),
      });
      if (brand) {
        queryParams.set('brand', brand.trim());
      }
      if (collection) {
        queryParams.set('collection', collection.trim());
      }
      url = `${API_URL}/products?${queryParams.toString()}`;
    }

    const res = await fetch(url, {
      next: { revalidate: 30 },
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      return NextResponse.json(
        { data: [], meta: { total: 0, skip, take, hasMore: false } },
        { status: res.status },
      );
    }

    const json = (await res.json()) as { data?: unknown[]; meta?: { total?: number } };
    const rawList = Array.isArray(json.data)
      ? json.data
      : Array.isArray(json)
        ? (json as unknown[])
        : [];
    const total = typeof json.meta?.total === 'number' ? json.meta.total : rawList.length;
    const mapped = rawList.map((item) =>
      mapDbProductToSchema(item as Parameters<typeof mapDbProductToSchema>[0]),
    );

    return NextResponse.json({
      data: mapped,
      meta: {
        total,
        skip,
        take,
        page: Math.floor(skip / take) + 1,
        totalPages: Math.ceil(total / take),
        hasMore: skip + mapped.length < total,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/products route:', error);
    return NextResponse.json(
      { data: [], meta: { total: 0, skip: 0, take: 24, hasMore: false }, error: error?.message },
      { status: 500 },
    );
  }
}
