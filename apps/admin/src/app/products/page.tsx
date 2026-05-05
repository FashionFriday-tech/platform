import { ProductListView } from '@/features/products';

export default function ProductsPage() {
  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden p-6">
      <ProductListView />
    </div>
  );
}
