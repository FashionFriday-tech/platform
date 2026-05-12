'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { type Product } from '@ff/schemas';

import { AddProductForm } from '@/features/products/components/AddProductForm';
import { fetchProductById } from '@/features/products/services/api';

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
        const data = await fetchProductById(productId);
        if (data) {
          // Map local product to schema product structure
          const mappedProduct: Product = {
            id: data.id,
            name: data.name,
            slug: data.seoSlug || data.name.toLowerCase().replace(/\s+/g, '-'),
            description: data.description || '',
            brand: data.brand ? [data.brand] : [],
            status: 'Published',
            category: 'Clothing',
            price: {
              basePrice: data.costPrice,
              sellingPrice: data.sellingPrice,
              ogPrice: data.originalPrice,
              discountPercentage: 0,
              currency: 'INR',
            },
            inventory: {
              sku: data.sku,
              barcode: '',
              totalStock: data.stock,
              availableStock: data.stock,
              trackInventory: true,
              lowStockThreshold: 10,
              allowBackorder: false,
            },
            media: {
              mainImage: data.imageUrl || '',
              gallery: data.images || [],
              videoUrl: data.videoLink,
            },
            attributes: {
              sizes: data.variants,
              colors: data.color ? [{ name: data.color, hex: '#000000' }] : [],
              materials: [],
              careInstructions: [],
              fit: 'Regular',
              style: '',
              quality: data.quality || 'Standard',
            },
            gender: (data.gender as any) || 'Unisex',
            marketing: {
              seoTitle: data.seoTitle || '',
              seoDescription: data.seoDesc || '',
              collections: data.tags || [],
              tags: data.tags || [],
              isFeatured: false,
              isNewArrival: false,
            },
            shipping: {
              weight: 0,
              dimensions: { length: 0, width: 0, height: 0, unit: 'cm' },
              isFragile: false,
              processingTime: '1-2 days',
            },
            variants: [],
            createdAt: new Date(data.dateAdded),
            updatedAt: new Date(),
          } as any;
          setProduct(mappedProduct);
        }
      } catch (err) {
        console.error(err);
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
