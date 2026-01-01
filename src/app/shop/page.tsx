import Link from "next/link";
import { Header } from "@/components/layout/Header";

const categories = [
  { name: "Sneakers", category: "sneakers", imageBg: "/images/store/sneakers.png" },
  { name: "Watches", category: "watches", imageBg: "/images/store/watches.png" },
  { name: "Cloths", category: "cloths", imageBg: "/images/store/cloths.png" },
  { name: "Slippers", category: "slippers", imageBg: "/images/store/slippers.png" },
  { name: "Accessories", category: "accessories", imageBg: "/images/store/accessories.png" },
];

export default function StoreLandingPage() {
  return (
    <>
      <Header />

      <div className="min-h-screen pb-20 sm:py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {categories.map((category, index) => (
            <Link
              key={category.category}
              href={`/shop/${category.category}`}
              className={`group relative flex
          ${
            index % 2 === 0
              ? "justify-start sm:justify-normal"
              : "justify-end sm:justify-normal"
          }
        `}
            >
              <div
                className={`w-[95%] sm:w-full aspect-3/2 overflow-hidden relative
                     transition-opacity group-hover:opacity-90 bg-cover bg-center ${index % 2 === 0 ? "rounded-r-4xl" : "rounded-l-4xl"}`}
                style={{ backgroundImage: `url(${category.imageBg})` }}
              />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
