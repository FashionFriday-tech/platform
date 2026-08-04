import { ProductDetailView } from '@/features/products/components/ProductDetailView';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div className="animate-in fade-in flex h-full w-full flex-col p-3 duration-700 sm:p-4 md:p-6">
      <ProductDetailView productId={slug} />
    </div>
  );
}
