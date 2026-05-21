import { type Product } from '../types';

export const mockProducts: Product[] = [];

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch('http://localhost:3002/admin/products');
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }
    const json = await res.json();
    const data = json.data || [];
    
    // Map backend product to frontend Product interface
    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      sku: p.id.substring(0, 8).toUpperCase(), // Assuming SKU is not directly available, use ID
      costPrice: Number(p.gettingPrice) || 0,
      originalPrice: Number(p.ogPrice || p.sellingPrice),
      sellingPrice: Number(p.sellingPrice) || 0,
      stock: Number(p.totalStock) || 0,
      maxStock: 1000,
      status: (p.status.charAt(0).toUpperCase() + p.status.slice(1).toLowerCase()) as any,
      categoryId: p.categoryId,
      category: p.category?.name || 'Unknown',
      store: 'Main Store', // Dummy store
      variants: p.sizes || [],
      sales: 0,
      dateAdded: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      imageUrl: p.mainImage,
      images: [p.mainImage, p.promoImage, ...(p.liveImages || [])].filter(Boolean),
      description: p.description,
      quality: p.quality,
      brand: p.brand ? p.brand[0] : undefined,
      gender: p.gender,
      seoTitle: p.seoTitle,
      seoDesc: p.seoDescription,
      seoSlug: p.slug,
      videoLink: p.youtubeId ? `https://www.youtube.com/embed/${p.youtubeId}` : undefined,
    }));
  } catch (err) {
    console.error('fetchProducts error:', err);
    return [];
  }
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  try {
    const res = await fetch(`http://localhost:3002/admin/products/${id}`);
    if (!res.ok) return undefined;
    const p = await res.json();
    
    return {
      id: p.id,
      name: p.name,
      sku: p.id.substring(0, 8).toUpperCase(),
      costPrice: Number(p.gettingPrice) || 0,
      originalPrice: Number(p.ogPrice || p.sellingPrice),
      sellingPrice: Number(p.sellingPrice) || 0,
      stock: Number(p.totalStock) || 0,
      maxStock: 1000,
      status: (p.status.charAt(0).toUpperCase() + p.status.slice(1).toLowerCase()) as any,
      categoryId: p.categoryId,
      category: p.category?.name || 'Unknown',
      store: 'Main Store',
      variants: p.sizes || [],
      sales: 0,
      dateAdded: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      imageUrl: p.mainImage,
      images: [p.mainImage, p.promoImage, ...(p.liveImages || [])].filter(Boolean),
      description: p.description,
      quality: p.quality,
      brand: p.brand ? p.brand[0] : undefined,
      gender: p.gender,
      seoTitle: p.seoTitle,
      seoDesc: p.seoDescription,
      seoSlug: p.slug,
      videoLink: p.youtubeId ? `https://www.youtube.com/embed/${p.youtubeId}` : undefined,
    };
  } catch (err) {
    console.error('fetchProductById error:', err);
    return undefined;
  }
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  // Update would go here, mapping frontend Product updates back to backend Payload.
  // The current AddProductForm does this on its own, so this might not be used.
  return data as Product;
}
