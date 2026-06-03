'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { type Product } from '@ff/schemas';

import { AddProductForm } from '@/features/products/components/AddProductForm';

export default function EditProductPage() {
  const params = useParams();
  const productId = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!productId) {
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/products/${productId}`,
        );
        if (!res.ok) {
          throw new Error('Failed to fetch product');
        }
        const p = (await res.json()) as {
          id: string;
          name: string;
          slug: string;
          description?: string;
          brand?: string[];
          status?: 'PENDING' | 'DRAFT' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED';
          categoryId?: string;
          gender?: 'MEN' | 'WOMEN' | 'UNISEX';
          gettingPrice?: number;
          ogPrice?: number;
          sellingPrice?: number;
          totalStock?: number;
          mainImage?: string;
          promoImage?: string;
          liveImages?: string[];
          youtubeId?: string;
          sizes?: string[];
          colors?: string[];
          quality?:
            | 'UA'
            | 'SEMI_UA'
            | '10A'
            | '7A'
            | '7AA'
            | 'STANDARD'
            | 'SURPLUS'
            | 'PREMIUM'
            | 'LUXURY';
          collections?: string[];
          isFeatured?: boolean;
          seoTitle?: string;
          seoDescription?: string;
          averageRating?: number;
          totalReviews?: number;
          liveWatching?: number;
          liveSold?: number;
          createdAt?: string;
          updatedAt?: string;
        };

        // Pass the raw API response mapped directly to the Product schema shape
        // so no data is lost or misaligned (especially images).
        const mappedProduct: Product = {
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description ?? '',
          brand: p.brand && p.brand.length > 0 ? p.brand : ['Generic'],
          status: p.status ?? 'DRAFT',
          categoryId: p.categoryId ?? '00000000-0000-0000-0000-000000000000',
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
            liveImages: p.liveImages ?? [],
            youtubeId: p.youtubeId ?? undefined,
          },
          attributes: {
            sizes: p.sizes && p.sizes.length > 0 ? p.sizes : ['Standard'],
            colors: p.colors && p.colors.length > 0 ? p.colors : ['Default'],
            quality: p.quality ?? 'UA',
          },
          marketing: {
            collections: p.collections ?? [],
            isFeatured: p.isFeatured ?? false,
            seoTitle: p.seoTitle ?? '',
            seoDescription: p.seoDescription ?? '',
          },
          rating: {
            averageRating: p.averageRating ?? 4,
            totalReviews: p.totalReviews ?? 0,
          },
          liveMatrix: {
            liveWatching: p.liveWatching ?? 0,
            liveSold: p.liveSold ?? 0,
          },
          createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
          updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        };

        setProduct(mappedProduct);
      } catch (err) {
        console.error('DEBUG ERROR fetchProductById:', err);
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex flex-1 justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-black/10 border-t-black dark:border-white/10 dark:border-t-white" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-20">
        <h2 className="mb-2 text-2xl font-bold">Product Not Found</h2>
        <p className="text-black/50 dark:text-white/50">
          Could not load product details for editing.
        </p>
      </div>
    );
  }

  return <AddProductForm initialData={product} />;
}
