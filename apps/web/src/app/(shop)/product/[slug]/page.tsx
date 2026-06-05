import { type Metadata } from 'next';

import ProductPageMaster, {
  EditorialError,
  getProductBySlug,
  getSimilarProducts,
} from '@/features/product';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';
    // Pre-render the top 50 featured products to keep build times fast
    const res = await fetch(`${API_URL}/products/featured?take=50`);
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    const products = json.data || [];
    return products.map((p: any) => ({
      slug: p.slug,
    }));
  } catch (err) {
    console.error('Failed to generate static params for products:', err);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found | Fashion Friday' };
  }

  const title = product.marketing?.seoTitle || `${product.name} | Fashion Friday`;
  const description =
    product.marketing?.seoDescription ||
    product.description ||
    `Shop ${product.name} at Fashion Friday. Premium quality, best pricing, and fast delivery.`;
  const mainImage = product.media?.mainImage || '/images/placeholder.jpg';
  const pageUrl = `https://fashionfriday.in/product/${slug}`;
  const collections = product.marketing?.collections || [];
  const brand = Array.isArray(product.brand)
    ? product.brand[0]
    : (product.brand ?? 'Fashion Friday');

  return {
    title,
    description,
    keywords: [product.name, brand, product.categoryId, ...collections].filter(Boolean),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'Fashion Friday',
      type: 'website',
      images: [
        {
          url: mainImage,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [mainImage],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return <EditorialError slug={slug} />;
  }

  const similarProducts = await getSimilarProducts(product.categoryId, product.id);

  const brandName = Array.isArray(product.brand)
    ? product.brand[0]
    : product.brand || 'Fashion Friday';

  // JSON-LD Schema.org for Google Product Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [product.media.mainImage, ...product.media.liveImages].filter(Boolean),
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    offers: {
      '@type': 'Offer',
      url: `https://fashionfriday.in/product/${slug}`,
      priceCurrency: 'INR',
      price: product.price.sellingPrice,
      availability:
        product.inventory.totalStock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageMaster product={product} similarProducts={similarProducts} />
    </>
  );
}
