import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AddCategoryProductsView } from '../../../../features/categories/components/AddCategoryProductsView';
import { type ProductCategory } from '../../../../features/categories/types';

interface AddCategoryProductsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface CategoryApiItem {
  id: string;
  name: string;
  slug: string;
  image?: string;
  gender: string;
  productCount?: number;
  _count?: { products?: number };
}

async function getCategoryBySlug(slug: string): Promise<ProductCategory | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/categories`,
      { cache: 'no-store' },
    );
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as { data?: CategoryApiItem[] } | CategoryApiItem[];
    const categoriesData = Array.isArray(data) ? data : (data.data ?? []);
    const apiCategory = categoriesData.find((c) => c.slug === slug);
    if (!apiCategory) {
      return null;
    }

    return {
      id: apiCategory.id,
      name: apiCategory.name,
      slug: apiCategory.slug,
      image: apiCategory.image ?? '',
      gender: (apiCategory.gender.charAt(0).toUpperCase() +
        apiCategory.gender.slice(1).toLowerCase()) as 'Men' | 'Women' | 'Unisex',
      productCount: apiCategory._count?.products ?? apiCategory.productCount ?? 0,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: AddCategoryProductsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await getCategoryBySlug(resolvedParams.slug);
  return {
    title: category
      ? `Add Products to ${category.name} | Fashion Friday Admin`
      : 'Category Not Found',
  };
}

export default async function AddCategoryProductsPage({ params }: AddCategoryProductsPageProps) {
  const resolvedParams = await params;
  const category = await getCategoryBySlug(resolvedParams.slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
      <AddCategoryProductsView category={category} />
    </div>
  );
}
