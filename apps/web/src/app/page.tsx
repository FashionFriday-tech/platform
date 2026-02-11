import Footer from "@/components/layout/Footer";
import Request from "@/components/ui/sections/Request";

import {
  Hero,
  BrandScroll,
  CaegoriesSection,
  TrendingSection,
  ShopByBrand,
  InfluencerCarousel,
  WhyChooseUs,
  PWAInstallSection,
} from "@/features/home";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <BrandScroll />
      <CaegoriesSection />
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
