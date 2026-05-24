import Footer from '@/components/layout/Footer';
import Request from '@/components/ui/sections/Request';
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
      <Request />
      <Footer />
    </main>
  );
}
