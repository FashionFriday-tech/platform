"use client";

import { useEffect, useState } from "react";
import { AddProductForm } from "@/features/products/components/AddProductForm";
import { fetchProductById } from "@/features/products/services/api";
import { type Product } from "@ff/schemas";
import { useParams } from "next/navigation";

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!productId) return;
      setIsLoading(true);
      try {
        const data = await fetchProductById(productId);
        if (data) {
          setProduct(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-black/10 dark:border-white/10 border-t-black dark:border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-black/50 dark:text-white/50">Could not load product details for editing.</p>
      </div>
    );
  }

  return <AddProductForm initialData={product} />;
}
