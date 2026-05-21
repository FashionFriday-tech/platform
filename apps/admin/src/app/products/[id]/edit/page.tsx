'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { type Product } from '@ff/schemas';

import { AddProductForm } from '@/features/products/components/AddProductForm';

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!productId) {
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:3002/admin/products/${productId}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const p = await res.json();

        // Pass the raw API response mapped directly to the Product schema shape
        // so no data is lost or misaligned (especially images).
        const mappedProduct: Product = {
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description || '',
          brand: p.brand || [],
          status: p.status || 'DRAFT',
          category: p.category || 'CLOTHING',
          gender: p.gender || 'UNISEX',
          price: {
            ogPrice: Number(p.ogPrice) || 0,
            sellingPrice: Number(p.sellingPrice) || 0,
            gettingPrice: Number(p.gettingPrice) || 0,
          },
          inventory: {
            totalStock: Number(p.totalStock) || 0,
          },
          media: {
            mainImage: p.mainImage || '',
            promoImage: p.promoImage || undefined,
            liveImages: p.liveImages || [],
            youtubeId: p.youtubeId || undefined,
          },
          attributes: {
            sizes: p.sizes || [],
            colors: p.colors || [],
            quality: p.quality || 'UA',
          },
          marketing: {
            collections: p.collections || [],
            isFeatured: p.isFeatured || false,
            seoTitle: p.seoTitle || '',
            seoDescription: p.seoDescription || '',
          },
          rating: {
            averageRating: p.averageRating || 4,
            totalReviews: p.totalReviews || 0,
          },
          liveMatrix: {
            liveWatching: p.liveWatching || 0,
            liveSold: p.liveSold || 0,
          },
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        } as any;

        setProduct(mappedProduct);
      } catch (err) {
        console.error("DEBUG ERROR fetchProductById:", err);
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
