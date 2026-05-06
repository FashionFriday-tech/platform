import { notFound } from 'next/navigation';
import { MOCK_CATEGORIES } from '../../../../features/categories/types';
import { AddCategoryProductsView } from '../../../../features/categories/components/AddCategoryProductsView';
import { Metadata } from 'next';

interface AddCategoryProductsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: AddCategoryProductsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = MOCK_CATEGORIES.find(c => c.slug === resolvedParams.slug);
  return {
    title: category ? `Add Products to ${category.name} | Fashion Friday Admin` : 'Category Not Found',
  };
}

export default async function AddCategoryProductsPage({ params }: AddCategoryProductsPageProps) {
  const resolvedParams = await params;
  const category = MOCK_CATEGORIES.find(c => c.slug === resolvedParams.slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden p-6">
      <AddCategoryProductsView category={category} />
    </div>
  );
}
