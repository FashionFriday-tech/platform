import Footer from '@/components/layout/Footer';
import HomeFeedbackSection from '@/components/ui/sections/HomeFeedback';
import {
  CategoriesSection,
  CollectionsSection,
  Hero,
  InfluencerCarousel,
  PWAInstallSection,
  ShopByBrand,
  TrendingSection,
  WhyChooseUs,
} from '@/features/home';
import {
  getHomeBrands,
  getHomeCampaigns,
  getHomeCollections,
  getHomeReviews,
} from '@/features/home/services/queries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // Fetch all homepage data in parallel
  const [campaigns, collections, brands, reviews] = await Promise.all([
    getHomeCampaigns(),
    getHomeCollections(),
    getHomeBrands(),
    getHomeReviews(),
  ]);

  return (
    <main>
      <Hero initialCampaigns={campaigns} initialBrands={brands} />
      <CategoriesSection initialCampaigns={campaigns} />
      <CollectionsSection initialCollections={collections} />
      <TrendingSection initialCampaigns={campaigns} />
      <ShopByBrand initialBrands={brands} />
      <InfluencerCarousel initialCampaigns={campaigns} />
      <WhyChooseUs initialReviews={reviews} />
      <PWAInstallSection />
      <HomeFeedbackSection />
      <Footer />
    </main>
  );
}
