import CoverflowCarousel, { Product } from "../../ui/carousel/CoverflowCarousel";

// SIMULATED DATABASE FETCH
async function getTrendingProducts(): Promise<Product[]> {
  return [
    {
      id: 1,
      title: "The Roseline Ring",
      tag: "Rings",
      image: "/images/trending/1.png", 
    },
    {
      id: 2,
      title: "Zoe Link Earrings",
      tag: "Earrings",
      image: "/images/trending/2.png",
    },
    {
      id: 3,
      title: "The Hibiscus Ring II",
      tag: "Best Seller",
      image: "/images/trending/3.png",
    },
    {
      id: 4,
      title: "Chubby Gold Hoops",
      tag: "Hoops",
      image: "/images/trending/5.png",
    },
    {
      id: 5,
      title: "Serpent Chain",
      tag: "Necklaces",
      image: "/images/trending/6.png",
    },
    {
      id: 6,
      title: "Serpent Chain",
      tag: "Necklaces",
      image: "/images/trending/7.png",
    },
    {
      id: 7,
      title: "Chubby Gold Hoops",
      tag: "Hoops",
      image: "/images/trending/5.png",
    },
  ];
}

export default async function TrendingSection() {
  const products = await getTrendingProducts();

  return (
    // Dark background wrapper matching the reference
    <section className="w-full py-10 sm:py-20 overflow-hidden">
      <div className="container mx-auto px-4 text-center sm:mb-10">
        <h2 className="text-4xl md:text-7xl font-extrabold tracking-tight uppercase">
          Trending Now
        </h2>
        <p className="text-primary mt-4 max-w-md mx-auto">
            Discover the pieces everyone is talking about this season.
        </p>
      </div>

      {/* Pass data to the client component for animation */}
      <CoverflowCarousel products={products} />
      
    </section>
  );
}