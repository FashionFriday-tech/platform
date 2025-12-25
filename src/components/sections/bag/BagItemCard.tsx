"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, X } from "lucide-react";
import  {BagItem, bagItems}  from "@/data/bagItems";

interface BagItemCardProps {
  item: BagItem;
}

export default function BagItemCard({ item }: BagItemCardProps) {
  return (
    <div className="group flex gap-4 py-6 border-b border-zinc-100 last:border-0">
      {/* Product Image */}
      <div className="relative w-24 md:w-42 aspect-3/3.5 shrink-0 overflow-hidden rounded-2xl bg-zinc-100">
        <img
          src={item.image}
          alt={item.name}
          
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            !item.inStock ? "opacity-50 grayscale" : ""
          }`}
        />
        {!item.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <span className="bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-zinc-900 line-clamp-2">{item.name}</h3>
            <p className="text-sm text-zinc-500 mt-1">
              {item.color} / {item.size}
            </p>
          </div>
          <button 
            className="text-zinc-400 hover:text-red-500 transition-colors p-2 -mr-2"
            aria-label="Remove item"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex justify-between items-end mt-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-zinc-50 rounded-full px-3 py-1.5 border border-zinc-200/50">
            <button 
                disabled={!item.inStock || item.quantity <= 1}
                className="p-1 text-zinc-500 hover:text-black disabled:opacity-30 transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
            <button 
                disabled={!item.inStock}
                className="p-1 text-zinc-500 hover:text-black disabled:opacity-30 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Pricing */}
          <div className="text-right">
             {item.originalPrice && (
                <span className="block text-xs text-zinc-400 line-through">
                  ₹{item.originalPrice.toLocaleString()}
                </span>
             )}
            <span className="font-bold text-lg">
              ₹{(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}