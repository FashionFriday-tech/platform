import React from 'react';
import Link from 'next/link';

import { HeartIcon } from '@ff/ui';

export function EmptyWishlist() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 rounded-full bg-gray-50 p-6">
        <HeartIcon size={48} className="text-gray-300" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">Your wishlist is empty</h2>
      <p className="mt-2 max-w-sm text-gray-500">
        Looks like you haven't found anything yet. Explore our latest collections to find your new
        look.
      </p>
      <Link
        href="/shop"
        className="mt-8 rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-gray-800"
      >
        Start Shopping
      </Link>
    </div>
  );
}
