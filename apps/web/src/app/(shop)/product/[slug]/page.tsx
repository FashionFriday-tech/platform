import { Metadata } from 'next';
import { getProductBySlug, getSimilarProducts } from '@/data/filter-engine';
import ProductPageMaster from '@/features/product';
import EditorialError from '@/features/product/components/editorial-error';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // params MUST be awaited in Next.js 15
  const { slug } = await params;

  // REMOVED await: getProductBySlug is synchronous
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
  // params MUST be awaited in Next.js 15
  const { slug } = await params;

  // REMOVED await: This is a synchronous lookup in your dummy data
  const product = getProductBySlug(slug);

  // 2. High-end Error Handling
  if (!product) {
    return <EditorialError slug={slug} />;
  }

  // 3. REMOVED await: Logic moved to synchronous execution
  const similarProducts = getSimilarProducts(product.category, product.id);

  return <ProductPageMaster product={product} similarProducts={similarProducts} />;
}
