import { ProductListView } from "@/features/products";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col min-h-0">
      <ProductListView />
    </div>
  );
}
