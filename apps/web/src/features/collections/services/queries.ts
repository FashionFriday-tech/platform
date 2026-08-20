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
    // The backend might not have a /collections/:slug endpoint if it wasn't requested before.
    // If it does, we use it. If not, we can fetch all and find the one. 
    // Assuming /collections/:slug exists based on standard REST.
    const res = await fetch(`${API_URL}/collections/${encodeURIComponent(slug)}`, {
      next: { revalidate: 86400, tags: [`collection-${slug}`] },
    });
    
    if (res.ok) {
      return await res.json();
    }

    // Fallback: fetch all and find
    if (res.status === 404) {
      const all = await getAllCollections();
      const found = all.find((c) => c.slug === slug);
      return found || null;
    }

    return null;
  } catch (err) {
    console.error(`Failed to fetch collection ${slug}:`, err);
    return null;
  }
}
