import { ArrowRight, Tag } from "lucide-react";

export default function OrderSummary() {
  // Dummy calculations
  const subtotal = 3798;
  const discount = 500;
  const shipping = 0; // Free
  const total = subtotal - discount + shipping;

  return (
    <div className="bg-white p-6 md:p-8 rounded-4xl border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24">
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>

      {/* Calculations */}
      <div className="space-y-4 mb-6 text-sm text-zinc-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium text-zinc-900">₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span className="font-medium">- ₹{discount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="font-medium text-zinc-900">Free</span>
        </div>
      </div>

      <div className="border-t border-zinc-100 my-4 pt-4">
        <div className="flex justify-between items-end">
          <span className="font-bold text-lg">Total</span>
          <span className="font-extrabold text-2xl">₹{total.toLocaleString()}</span>
        </div>
        <p className="text-xs text-zinc-400 mt-1">Inclusive of all taxes</p>
      </div>

      {/* Promo Code Input */}
      <div className="relative mb-6">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
          <Tag size={16} />
        </div>
        <input 
          type="text" 
          placeholder="Promo Code" 
          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-10 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border border-zinc-100 hover:bg-zinc-50 transition-colors">
            APPLY
        </button>
      </div>

      {/* Checkout Button */}
      <button className="w-full group bg-black text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-[0.98]">
        Checkout
        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
      </button>

      {/* Security Badge */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-400">
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span>Secure Checkout</span>
      </div>
    </div>
  );
}