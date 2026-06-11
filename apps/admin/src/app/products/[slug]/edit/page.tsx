import { EditProductView } from '@/features/products/components/EditProductView';

interface EditProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { slug } = await params;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
      <EditProductView productId={slug} />
    </div>
  );
}
