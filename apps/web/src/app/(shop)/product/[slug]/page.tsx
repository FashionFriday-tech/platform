// src/app/product/[slug]/page.tsx
import { Metadata } from "next";
import { getProductBySlug, getSimilarProducts } from "@/data/filter-engine";
import ProductPageMaster from "@/features/product";
import EditorialError from "@/features/product/components/editorial-error";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Premium ${product.attributes.quality} Store`,
    description: product.marketing.seoDescription,
    openGraph: {
      title: product.name,
      description: product.marketing.seoDescription,
      images: [{ url: product.media.mainImage }],
    },
    alternates: {
      canonical: `https://fashionfriday.in/product/${slug}`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  // 2. High-end Error Handling
  if (!product) {
    return <EditorialError slug={slug} />;
  }

  // 3. Data Fetching with exclusion logic (Fixes TS Error 2554)
  const similarProducts = await getSimilarProducts(product.category);

  return (
    <ProductPageMaster product={product} similarProducts={similarProducts} />
  );
}
