// app/cart/page.tsx
import { Header } from "@/components/layout/Header";
import CartItemCard from "@/components/sections/bag/BagItemCard";
import OrderSummary from "@/components/sections/bag/OrderSummary";
import { bagItems } from "@/data/bagItems";
import { Truck } from "lucide-react";
import Link from "next/link";

// Helper for scrollbar hiding
const globalStyles = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export default function CartPage() {
  const freeShippingThreshold = 5000;
  const currentTotal = 3798;
  const progress = Math.min((currentTotal / freeShippingThreshold) * 100, 100);
  const remaining = freeShippingThreshold - currentTotal;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-50/50 font-sans">
      <style>{globalStyles}</style>

      <main className="flex-1 w-full h-full overflow-y-auto hide-scrollbar">
        <div className="max-w-450 mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          
          <h1 className="text-3xl font-extrabold mb-8">Shopping Cart <span className="text-zinc-400 font-medium text-xl">({bagItems.length} items)</span></h1>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Left Column: Cart Items & Shipping Bar */}
            <div className="flex-1 space-y-6">
              {/* Cart Items List */}
              <div className="bg-white px-6 md:px-8 py-2 rounded-4xl border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                 {bagItems.length > 0 ? (
                    bagItems.map((item) => (
                        <CartItemCard key={item.id} item={item} />
                    ))
                 ) : (
                    <div className="py-12 text-center">
                        <p className="text-zinc-500 mb-4">Your cart is empty.</p>
                        <Link href="/shop" className="text-black font-bold underline">Continue Shopping</Link>
                    </div>
                 )}
              </div>

              {/* Optional: Cross-sell / Related */}
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4 ml-2">You might also like</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Placeholder for small product cards */}
                    {[1,2,3].map((i) => (
                        <div key={i} className="aspect-3/3.5 bg-zinc-200 rounded-2xl animate-pulse" />
                    ))}
                </div>
              </div>

            </div>

            {/* Right Column: Sticky Summary */}
            <div className="w-full lg:w-100 shrink-0">
               <OrderSummary />
            </div>

          </div>

          {/* Bottom Spacer */}
          <div className="h-24" />
        </div>
      </main>
    </div>
  );
}