import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CategoryDetailsView } from '../../../features/categories/components/CategoryDetailsView';
import { MOCK_CATEGORIES } from '../../../features/categories/types';

interface CategoryDetailsPageProps {
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

export async function generateMetadata({ params }: CategoryDetailsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  let category: CategoryApiItem | null = null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/categories`,
      { cache: 'no-store' },
    );
    const data = (await res.json()) as { data?: CategoryApiItem[] } | CategoryApiItem[];
    const categoriesData = Array.isArray(data) ? data : (data.data ?? []);
    category = categoriesData.find((c) => c.slug === resolvedParams.slug) ?? null;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
  return {
    title: category ? `${category.name} | Fashion Friday Admin` : 'Category Not Found',
  };
}

export default async function CategoryDetailsPage({ params }: CategoryDetailsPageProps) {
  const resolvedParams = await params;

  let category = null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/categories`,
      { cache: 'no-store' },
    );
    const data = (await res.json()) as { data?: CategoryApiItem[] } | CategoryApiItem[];
    const categoriesData = Array.isArray(data) ? data : (data.data ?? []);
    const apiCategory = categoriesData.find((c) => c.slug === resolvedParams.slug);

    if (apiCategory) {
      category = {
        id: apiCategory.id,
        name: apiCategory.name,
        slug: apiCategory.slug,
        image: apiCategory.image ?? '',
        gender: (apiCategory.gender.charAt(0).toUpperCase() +
          apiCategory.gender.slice(1).toLowerCase()) as 'Men' | 'Women' | 'Unisex',
        productCount: apiCategory._count?.products ?? apiCategory.productCount ?? 0,
      };
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
      <CategoryDetailsView initialCategory={category} />
    </div>
  );
}
