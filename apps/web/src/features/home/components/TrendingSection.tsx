import CoverflowCarousel, { Product } from "@/components/ui/carousel/CoverflowCarousel";
import { trendingProducts } from "@/data/trendingProducts";


export default async function TrendingSection() {

  return (
    // Dark background wrapper matching the reference
    <section className="w-full py-10 sm:py-20 overflow-hidden">
      <div className="container mx-auto px-4 text-center sm:mb-10">
        <h2 className="text-4xl md:text-7xl font-extrabold tracking-tight uppercase">
          Trending Now
        </h2>
        <p className="etxt-foreground-muted mt-4 max-w-md mx-auto">
            Discover the pieces everyone is talking about this season.
        </p>
      </div>

      <CoverflowCarousel products={trendingProducts} />
    </section>
  );
}