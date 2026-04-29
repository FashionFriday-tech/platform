'use client';

import React from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { wishlistItems } from '../data';
import { EmptyWishlist } from './empty-wishlist';
import { WishlistCard } from './wishlist-card';

export function WishlistPage() {
  const hasItems = wishlistItems.length > 0;

  return (
    <main className="bg-background text-foreground min-h-screen md:pt-20">
      {/* Header Section */}
      <header className="border-foreground/10 bg-background/80 right-0 left-0 z-40 rounded-4xl border-b px-2 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
          {/* Left: Title + Count */}
          <div className="flex items-center gap-2">
            <h1 className="text-lg uppercase">Wishlist</h1>
          </div>

          {/* Right: Favorite Icon */}
          <span className="px-2 py-0.5 text-3xl">
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <EmptyWishlist />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
