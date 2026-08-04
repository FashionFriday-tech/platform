import { ProductListView } from '@/features/products';

export default function ProductsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4 md:p-6">
      <ProductListView />
    </div>
  );
}
