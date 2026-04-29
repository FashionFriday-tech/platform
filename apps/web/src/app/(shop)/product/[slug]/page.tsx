import { type Metadata } from 'next';

import { getProductBySlug, getSimilarProducts } from '@/data/filter-engine';
import ProductPageMaster, { EditorialError } from '@/features/product';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

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

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return <EditorialError slug={slug} />;
  }

  const similarProducts = getSimilarProducts(product.category, product.id);

  return <ProductPageMaster product={product} similarProducts={similarProducts} />;
}
