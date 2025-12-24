import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, AlertCircle, HeartMinus } from "lucide-react";
import { Product } from "@/types/wishlist";
import { cn } from "@/lib/utils";

interface WishlistCardProps {
  product: Product;
}

export default function WishlistCard({ product }: WishlistCardProps) {
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <article className="group relative flex flex-col gap-4 border-b border-gray-100 pb-6 sm:border-none sm:pb-0">
      {/* Image Container */}
      <div className="relative aspect-3/3.5 overflow-hidden rounded-4xl bg-gray-100">
        <Link href={`/product/${product.slug}`}>
          <img
            src={product.image}
            alt={`View details of ${product.name}`}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            //   width={100}
            //   height={100}
          />
        </Link>

        {/* Stock Error State */}
        {!product.inStock && (
          <div className="absolute w-full h-full flex justify-center items-center top-0 right-0 mt-1 gap-1 text-xs font-medium text-black bg-white/50 ">
            <div className="flex justify-center items-center gap-2 text-xl uppercase border px-2 backdrop-blur-sm rounded-full font-semibold">
              <AlertCircle size={18} />
              Out of Stock
            </div>
          </div>
        )}

        {/* Remove Button - Top Right */}
        <button
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-gray-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-red-50 hover:text-red-500"
          aria-label="Remove from favorites"
        >
          <HeartMinus size={18} />
        </button>

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-md bg-black px-2 py-1 text-xs font-semibold text-white">
            -{discount}%
          </span>
        )}

        {/* Quick Add (Desktop Hover) */}
        {product.inStock && (
          <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hidden sm:block">
            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-semibold text-black shadow-lg hover:bg-black hover:text-white">
              <ShoppingBag size={16} />
              Add to Bag
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
              <Link href={`/product/${product.slug}`}>{product.name}</Link>
            </h3>
            <p className="text-sm text-gray-500">
              {product.category} • {product.color}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">${product.price}</p>
            {product.originalPrice && (
              <p className="text-sm text-gray-400 line-through">
                ${product.originalPrice}
              </p>
            )}
          </div>
        </div>

        {/* Stock Status & Mobile Actions */}
        <div className="w-full border rounded-full mt-2 py-1 flex items-center justify-center sm:hidden">
          <button className="text-sm font-semibold underline decoration-gray-300 underline-offset-4">
            Move to Bag
          </button>
        </div>
      </div>
    </article>
  );
}
