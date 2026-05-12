import { ProductDetailView } from '@/features/products/components/ProductDetailView';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  return (
    <div className="animate-in fade-in flex h-full w-full flex-col p-6 duration-700">
      <ProductDetailView productId={id} />
    </div>
  );
}
