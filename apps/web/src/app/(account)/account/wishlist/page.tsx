"use client";

import { motion, AnimatePresence } from "framer-motion";
import { WishlistCard, EmptyWishlist } from "@/features/wishlist";
import { Product } from "@/types/wishlist";

// MOCK DATA (In production, fetch this from your store/API)
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
    name: "Technical Windbreaker",
    category: "Outerwear",
    price: 145,
    originalPrice: 190,
    image:
      "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/fc86b60b-1be1-4db2-9ca0-901b1889ba45/W+NIKE+AIR+MAX+MOTO+2K.png",
    color: "Deep Navy",
    size: "L",
    inStock: true,
    slug: "technical-windbreaker",
  },
];

export default function WishlistPage() {
  const hasItems = wishlistItems.length > 0;

  // SEO: Structured Data (ItemList Schema)
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
    <main className="min-h-screen bg-background text-foreground md:pt-20">
      {/* Header Section */}
      <header className="left-0 right-0 z-40 border-b rounded-4xl px-2 border-foreground/10 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-md px-4 h-14 flex items-center justify-between">
          {/* Left: Title + Count */}
          <div className="flex items-center gap-2">
            <h1 className="text-lg  uppercase">
              Wishlist
            </h1>
          </div>

          {/* Right: Favorite Icon */}
           <span className="text-3xl px-2 py-0.5">
              {wishlistItems.length} <span className="text-sm">Items</span>
            </span> 
        </div>
      </header>
      <div className="mx-auto px-4 pt-8 pb-24 sm:px-8 sm:pt-16">
        {/* Content Section */}
        <AnimatePresence mode="wait">
          {hasItems ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
              }}
              className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-x-10"
            >
              {wishlistItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <WishlistCard product={item} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <EmptyWishlist />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
