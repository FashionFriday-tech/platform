import { MOCK_PRODUCTS, CategorySlug } from "@/data/store-data";
import CatalogueClient from "@/features/catalogue";
import { notFound } from "next/navigation";

// Next.js 15+ logic: params is a Promise
interface Props {
  params: Promise<{ brand: string }>; 
}

export default async function BrandPage({ params }: Props) {
  // 1. Await the params to get the brand name safely
  const resolvedParams = await params;
  
  // Folder [brand] ആണെങ്കിൽ resolvedParams.brand എന്ന് ഉപയോഗിക്കുക
  const brandName = resolvedParams.brand;

  if (!brandName) return notFound();

  // 2. Filter products with safety checks
  const brandProducts = MOCK_PRODUCTS.filter(
    (p) => p.brand?.toLowerCase() === brandName.toLowerCase()
  );

  // 3. Determine initial sidebar context
  const contextCategory = brandProducts[0]?.category || "sneakers";

  return (
    <CatalogueClient
      type="brand"
      title={brandName}
      categorySlug={contextCategory as CategorySlug}
      initialProducts={brandProducts}
    />
  );
}