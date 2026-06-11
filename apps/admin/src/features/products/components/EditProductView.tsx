'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { type Product } from '@ff/schemas';

import { api } from '@/lib/api-client';

import { AddProductForm } from './AddProductForm';

interface EditProductViewProps {
  productId: string;
}

export function EditProductView({ productId }: EditProductViewProps) {
  const router = useRouter();
  const [product, setProduct] = useState<(Product & { sellerId?: string | null; category?: any }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!productId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const p = await api.get<any>(`/admin/products/${productId}`);

        if (!p || !p.id) {
          throw new Error('Product not found');
        }

        // Map the backend product response to Product schema shape
        const mappedProduct: Product & { sellerId?: string | null; category?: any } = {
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description ?? '',
          brand: Array.isArray(p.brand) && p.brand.length > 0 ? p.brand : p.brand ? [p.brand] : ['Generic'],
          status: p.status ?? 'DRAFT',
          categoryId: p.categoryId ?? '',
          sellerId: p.sellerId ?? p.seller?.id ?? null,
          gender: p.gender ?? 'UNISEX',
          price: {
            ogPrice: Number(p.ogPrice) || 0,
            sellingPrice: Number(p.sellingPrice) || 0,
            gettingPrice: Number(p.gettingPrice) || 0,
          },
          inventory: {
            totalStock: Number(p.totalStock) || 0,
          },
          media: {
            mainImage: p.mainImage ?? '',
            promoImage: p.promoImage ?? undefined,
            liveImages: Array.isArray(p.liveImages) ? p.liveImages : [],
            youtubeId: p.youtubeId ?? undefined,
          },
          attributes: {
            sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['Standard'],
            colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : ['Default'],
            quality: p.quality ?? 'UA',
          },
          marketing: {
            collections: Array.isArray(p.collections) ? p.collections : [],
            isFeatured: Boolean(p.isFeatured),
            seoTitle: p.seoTitle ?? '',
            seoDescription: p.seoDescription ?? '',
          },
          rating: {
            averageRating: Number(p.averageRating) || 4,
            totalReviews: Number(p.totalReviews) || 0,
          },
          liveMatrix: {
            liveWatching: Number(p.liveWatching) || 0,
            liveSold: Number(p.liveSold) || 0,
          },
          createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
          updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
          category: p.category,
        };

        if (isMounted) {
          setProduct(mappedProduct);
        }
      } catch (err: any) {
        console.error('Failed to load product details:', err);
        if (isMounted) {
          setError(err?.message ?? 'Failed to load product');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-black/10 border-t-black dark:border-white/10 dark:border-t-white" />
        <p className="mt-4 text-sm font-medium text-black/40 dark:text-white/40">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center rounded-3xl border border-black/5 bg-white/50 p-8 shadow-xl backdrop-blur-xl dark:border-white/5 dark:bg-black/50">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/30">
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-black text-black dark:text-white">Product Not Found</h2>
        <p className="mb-6 max-w-md text-center text-sm font-medium text-black/50 dark:text-white/50">
          Could not load the requested product for editing. It may have been deleted or the link is incorrect.
        </p>
        <button
          onClick={() => {
            router.push('/products');
          }}
          className="rounded-full bg-black px-6 py-3 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105 dark:bg-white dark:text-black"
        >
          Back to Inventory
        </button>
      </div>
    );
  }

  return <AddProductForm initialData={product} />;
}
