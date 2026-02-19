import CoverflowCarousel from '@/components/ui/carousel/CoverflowCarousel';
import { trendingProducts } from '@/data/trendingProducts';

export default function TrendingSection() {
  return (
    <section className="w-full overflow-hidden py-10 sm:py-20">
      <div className="container mx-auto px-4 text-center sm:mb-10">
        <h2 className="text-4xl font-extrabold tracking-tight uppercase md:text-7xl">
          Trending Now
        </h2>
        <p className="text-muted-foreground mx-auto mt-4 max-w-md">
          Discover the pieces everyone is talking about this season.
        </p>
      </div>

      <CoverflowCarousel products={trendingProducts} />
    </section>
  );
}
