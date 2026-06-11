import type { CollectionItem } from '../types';

export async function getAllCollections(): Promise<CollectionItem[]> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';
    const res = await fetch(`${API_URL}/collections`, {
      next: { revalidate: 86400, tags: ['collections'] },
    });
    if (!res.ok) {
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch collections:', err);
    return [];
  }
}

export async function getCollectionBySlug(slug: string): Promise<CollectionItem | null> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';
    const decodedSlug = decodeURIComponent(slug).trim();

    // 1. Try direct API endpoint
    try {
      const res = await fetch(`${API_URL}/collections/${encodeURIComponent(decodedSlug)}`, {
        next: { revalidate: 86400, tags: [`collection-${decodedSlug.toLowerCase()}`] },
      });

      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Ignore and proceed to fallbacks
    }

    // 2. Fallback: fetch all and find by slug or name
    const all = await getAllCollections();
    const clean = (s: string) => s?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
    const target = clean(decodedSlug);
    const found = all.find((c) => clean(c.slug) === target || clean(c.name) === target);
    if (found) {
      return found;
    }

    // 3. Fallback: Check if products exist for this collection in the products database
    try {
      const prodRes = await fetch(
        `${API_URL}/products?collection=${encodeURIComponent(decodedSlug)}&take=10`,
        {
          next: { revalidate: 86400, tags: [`collection-products-${decodedSlug.toLowerCase()}`] },
        },
      );
      if (prodRes.ok) {
        const json = await prodRes.json();
        const items = json.data || [];
        const matching = items.filter((p: any) => {
          const colList: string[] = p.collections || [];
          return colList.some((c) => clean(c) === target);
        });

        if (matching.length > 0) {
          const first = matching[0];
          const rawName =
            (first.collections as string[])?.find((c) => clean(c) === target) ||
            decodedSlug
              .split('-')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(' ');

          return {
            id: decodedSlug,
            name: rawName,
            slug: decodedSlug.toLowerCase(),
            image: first.mainImage || '',
            productCount: matching.length,
          };
        }
      }
    } catch {
      // Ignore
    }

    return null;
  } catch (err) {
    console.error(`Failed to fetch collection ${slug}:`, err);
    return null;
  }
}
