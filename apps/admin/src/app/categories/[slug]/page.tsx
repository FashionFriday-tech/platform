import { notFound } from 'next/navigation';
import { MOCK_CATEGORIES } from '../../../features/categories/types';
import { CategoryDetailsView } from '../../../features/categories/components/CategoryDetailsView';
import { Metadata } from 'next';

interface CategoryDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryDetailsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = MOCK_CATEGORIES.find(c => c.slug === resolvedParams.slug);
  return {
    title: category ? `${category.name} | Fashion Friday Admin` : 'Category Not Found',
  };
}

export default async function CategoryDetailsPage({ params }: CategoryDetailsPageProps) {
  const resolvedParams = await params;
  const category = MOCK_CATEGORIES.find(c => c.slug === resolvedParams.slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden p-6">
      <CategoryDetailsView initialCategory={category} />
    </div>
  );
}
