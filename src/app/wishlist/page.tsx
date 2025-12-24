// app/wishlist/page.tsx
import { Metadata } from "next";
import WishlistCard from "@/components/sections/wishlist/WishlistCard";
import EmptyWishlist from "@/components/sections/wishlist/EmptyWishlist";
import { Product } from "@/types/wishlist";

// SEO: Metadata Configuration
export const metadata: Metadata = {
  title: "My Wishlist | Fashion Brand",
  description:
    "View your saved favorite fashion items. Keep track of price drops and availability.",
  robots: "noindex, nofollow", // Usually wishlists are private/user-specific, so we don't index them.
};

// MOCK DATA (In production, fetch this from DB/API)
const wishlistItems: Product[] = [
  {
    id: "1",
    name: "Oversized Wool Blazer",
    category: "Outerwear",
    price: 189,
    originalPrice: 250,
    image:
      "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/a5d6c45d-49fa-4f41-805c-9eb0d02d0e82/NIKE+CORTEZ+SE.png",
    color: "Charcoal Grey",
    size: "M",
    inStock: true,
    slug: "oversized-wool-blazer",
  },
  {
    id: "2",
    name: "Pleated Midi Skirt",
    category: "Skirts",
    price: 85,
    image:
      "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/46ce62c0-c7ea-4184-831c-c31899257e9b/W+NIKE+AIR+MAX+MOTO+2K.png",
    color: "Cream",
    size: "S",
    inStock: true,
    slug: "pleated-midi-skirt",
  },
  {
    id: "3",
    name: "Leather Chelsea Boots",
    category: "Footwear",
    price: 210,
    image:
      "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/128904c9-6281-4d00-8ff0-ed791031c0bd/W+NIKE+AIR+MAX+MOTO+2K.png",
    color: "Black",
    size: "EU 39",
    inStock: false,
    slug: "leather-chelsea-boots",
  },
  {
    id: "4",
    name: "Oversized Wool Blazer",
    category: "Outerwear",
    price: 189,
    originalPrice: 250,
    image:
      "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/fc86b60b-1be1-4db2-9ca0-901b1889ba45/W+NIKE+AIR+MAX+MOTO+2K.png",
    color: "Charcoal Grey",
    size: "M",
    inStock: true,
    slug: "oversized-wool-blazer",
  },
];

export default function WishlistPage() {
  const hasItems = wishlistItems.length > 0;

  // SEO: Structured Data (ItemList Schema)
  // Even if page is noindex, structured data helps search engines understand the context if you choose to make public wishlists.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: wishlistItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: item.name,
        image: item.image,
        offers: {
          "@type": "Offer",
          price: item.price,
          priceCurrency: "USD",
          availability: item.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        },
      },
    })),
  };

  return (
    <main className="min-h-screen bg-white pb-20 pt-10 sm:pt-20">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 flex mt-6 flex-col items-center justify-between gap-4 border-b border-gray-100 pb-6 sm:flex-row">
          <h1 className="text-3xl font-bold tracking-wide text-gray-900 sm:text-4xl lg:text-5xl uppercase">
            Favorites
          </h1>

          {/* Optional: Sort/Filter Controls could go here */}
          {hasItems && (
            <div>
              <button className="text-sm font-medium text-gray-900 hover:text-gray-600">
                Remove all items
              </button>
              <p className="mt-2 text-gray-500">
                {wishlistItems.length}{" "}
                {wishlistItems.length === 1 ? "item" : "items"} saved for later
              </p>
            </div>
          )}
        </div>

        {/* Content Section */}
        {hasItems ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {wishlistItems.map((item) => (
              <WishlistCard key={item.id} product={item} />
            ))}
          </div>
        ) : (
          <EmptyWishlist />
        )}
      </div>
    </main>
  );
}
