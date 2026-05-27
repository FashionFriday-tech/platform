import Footer from '@/components/layout/Footer';
import HomeFeedbackSection from '@/components/ui/sections/HomeFeedback';
import {
  BrandScroll,
  CategoriesSection,
  CollectionsSection,
  Hero,
  InfluencerCarousel,
  PWAInstallSection,
  ShopByBrand,
  TrendingSection,
  WhyChooseUs,
} from '@/features/home';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <BrandScroll />
      <CategoriesSection />
      <CollectionsSection />
      <TrendingSection />
      <ShopByBrand />
      <InfluencerCarousel />
      <WhyChooseUs />
      <PWAInstallSection />
      <HomeFeedbackSection />
      <Footer />
    </main>
  );
}
