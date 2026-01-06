"use client";

import {
  HelpCircle,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";

// --- Types ---
interface RefundItem {
  id: string;
  transactionId: string;
  orderId: string;
  productName: string;
  productImage: string;
  variant: string;
  amount: string;
  refundDate: string;
  reason: string;
}

// --- Mock Data (Updated to reflect "Out of Stock" logic) ---
const refundData: RefundItem[] = [
  {
    id: "REF-001",
    transactionId: "TXN_8839201",
    orderId: "#ORD-9928",
    productName: "Oversized Cotton T-Shirt",
    productImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=100&auto=format&fit=crop",
    variant: "Black / L",
    amount: "₹1,299",
    refundDate: "Oct 24, 2024",
    reason: "Exchange item out of stock",
  },
  {
    id: "REF-002",
    transactionId: "TXN_7748291",
    orderId: "#ORD-9930",
    productName: "Slim Fit Chinos",
    productImage: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=100&auto=format&fit=crop",
    variant: "Beige / 32",
    amount: "₹2,499",
    refundDate: "Oct 26, 2024",
    reason: "Exchange unavailable (Size OOS)",
  },
  {
    id: "REF-003",
    transactionId: "TXN_5543219",
    orderId: "#ORD-9999",
    productName: "Denim Jacket",
    productImage: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=100&auto=format&fit=crop",
    variant: "Blue / M",
    amount: "₹3,200",
    refundDate: "Oct 28, 2024",
    reason: "Inventory mismatch during exchange",
  },
];

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-20 md:pb-20 sm:pt-24">
        
        {/* Page Header & FAQ Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Refund History
            </h1>
            <p className="text-zinc-500 mt-2 max-w-lg">
              Below is a list of refunds processed for items where an exchange was not possible due to stock unavailability.
            </p>
          </div>
          
          {/* Refund FAQ Button */}
          <button className="group flex items-center gap-3 px-6 py-3 bg-white border border-zinc-200 rounded-full text-sm font-medium hover:border-black transition-all shadow-sm active:scale-95">
             <div className="p-1.5 bg-zinc-100 rounded-full group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                <HelpCircle size={18} />
             </div>
             <span>Refund Policy & FAQs</span>
          </button>
        </div>

        {/* --- DESKTOP TABLE VIEW --- */}
        <div className="hidden md:block bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100 text-xs uppercase tracking-wider text-zinc-500">
                <th className="px-6 py-5 font-bold">Product Details</th>
                <th className="px-6 py-5 font-bold">Transaction Info</th>
                <th className="px-6 py-5 font-bold">Reason for Refund</th>
                <th className="px-6 py-5 font-bold text-right">Amount Refunded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {refundData.length > 0 ? (
                refundData.map((refund) => (
                  <tr key={refund.id} className="group hover:bg-zinc-50/30 transition-colors">
                    {/* Product Col */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                          <img src={refund.productImage} alt={refund.productName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-zinc-900">{refund.productName}</p>
                          <p className="text-xs text-zinc-500">{refund.variant}</p>
                        </div>
                      </div>
                    </td>

                    {/* Transaction Col */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-zinc-900">{refund.transactionId}</span>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <span>Order: {refund.orderId}</span>
                            <span>•</span>
                            <span>{refund.refundDate}</span>
                        </div>
                      </div>
                    </td>

                    {/* Reason Col */}
                    <td className="px-6 py-5">
                       <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-100 text-orange-800">
                          <AlertCircle size={14} />
                          <span className="text-xs font-medium">{refund.reason}</span>
                       </div>
                    </td>

                    {/* Amount Col */}
                    <td className="px-6 py-5 text-right">
                      <span className="text-base font-bold text-zinc-900">{refund.amount}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={4} className="px-6 py-16 text-center text-zinc-500">
                      <div className="flex flex-col items-center gap-3">
                         <div className="p-3 bg-zinc-100 rounded-full">
                            <FileText size={24} className="text-zinc-400"/>
                         </div>
                         <p>No refund history found.</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- MOBILE CARD VIEW --- */}
        <div className="md:hidden space-y-4">
          {refundData.length > 0 ? (
            refundData.map((refund) => (
              <div key={refund.id} className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">
                
                {/* Header: Date & ID */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-zinc-100">
                   <span className="text-xs font-bold bg-zinc-100 px-2 py-1 rounded-md text-zinc-600">
                      {refund.refundDate}
                   </span>
                   <span className="text-xs text-zinc-400">{refund.transactionId}</span>
                </div>

                {/* Body: Product */}
                <div className="flex gap-4 mb-4">
                   <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                      <img src={refund.productImage} alt={refund.productName} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex flex-col justify-center">
                      <h3 className="font-bold text-sm text-zinc-900">{refund.productName}</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">{refund.variant}</p>
                   </div>
                </div>

                {/* Footer: Amount & Reason */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-50/50 border border-orange-100">
                        <AlertCircle size={16} className="text-orange-700 shrink-0" />
                        <p className="text-xs font-medium text-orange-800">{refund.reason}</p>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-xs text-zinc-500">Refund Amount</span>
                        <span className="text-lg font-bold text-zinc-900">{refund.amount}</span>
                    </div>
                </div>

              </div>
            ))
          ) : (
             <div className="py-12 text-center text-zinc-500 bg-white rounded-3xl border border-zinc-200">
                No refund history found.
             </div>
          )}
        </div>

      </main>
    </div>
  );
}