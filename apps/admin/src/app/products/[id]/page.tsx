import { ProductDetailView } from "@/features/products/components/ProductDetailView";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  return (
    <div className="w-full h-full flex flex-col p-6 animate-in fade-in duration-700">
      <ProductDetailView productId={id} />
    </div>
  );
}
