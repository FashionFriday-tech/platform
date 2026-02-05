import { MOCK_PRODUCTS, CategorySlug } from "@/data/store-data";
import CatalogueClient from "@/features/catalogue";
import { notFound } from "next/navigation";

// Define the shape of params based on your folder name [category]
interface Props {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: Props) {
  // 1. Await params to access the dynamic segment
  const resolvedParams = await params;
  const categoryName = resolvedParams.category;

  // 2. Filter products belonging to this specific category
  const categoryProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === categoryName
  );

  // 3. Security check: If category doesn't exist in our data enum
  const validCategories = ['sneakers', 'watches', 'cloths', 'slippers', 'accessories'];
  
  if (!validCategories.includes(categoryName)) {
    return notFound();
  }

  return (
    <CatalogueClient 
      type="category"
      title={categoryName}
      categorySlug={categoryName as CategorySlug}
      initialProducts={categoryProducts}
    />
  );
}