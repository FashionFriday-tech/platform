import { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryClient from "./_components/Client"; // Ensure this matches your Client Component file name
import { CategorySlug } from "@/data/store-data";

// 1. Define Props with Promise
type Props = {
  params: Promise<{ category: string }>;
};

// 2. Fix generateMetadata (Must await params)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params; // <--- AWAIT HERE

  if (!category) return { title: "Category Not Found" };

  const title = category.charAt(0).toUpperCase() + category.slice(1);

  return {
    title: `Shop Best ${title} Online at Fashion Friday`,
    description: `Discover our exclusive collection of ${category}. Top brands, best prices, and wide variety of styles available now.`,
    // Open Graph for Social Media Sharing
    openGraph: {
      title: `Shop ${title} | Fashion Friday`,
      description: `Explore the best collection of ${category} at Fashion Friday.`,
      type: "website",
    },
  };
}

// 3. Fix Page Component (Must await params)
export default async function CategoryPage({ params }: Props) {
  const { category } = await params; // <--- AWAIT HERE

  const validCategories: CategorySlug[] = [
    "sneakers",
    "watches",
    "cloths",
    "slippers",
    "accessories",
  ];

  // Case-insensitive check
  if (!validCategories.includes(category.toLowerCase() as CategorySlug)) {
    notFound();
  }

  // Pass the raw string to client, let client handle specific types if needed
  return <CategoryClient category={category as CategorySlug} />;
}
