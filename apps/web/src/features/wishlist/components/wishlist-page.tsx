'use client';

import React from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { useWishlist } from '../hooks/use-wishlist';
import { EmptyWishlist } from './empty-wishlist';
import { WishlistCard } from './wishlist-card';

import { HamburgerMenuIcon, MenuIcon } from '@ff/ui';

export function WishlistPage() {
  const { wishlistItems, hasItems, itemCount, removeFromWishlist } = useWishlist();
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [layoutMode, setLayoutMode] = React.useState<'list' | 'grid'>('list');

  const categories = React.useMemo(() => {
    const cats = new Set<string>();
    wishlistItems.forEach((item) => {
      if (item.category) cats.add(item.category);
      else cats.add('Apparel');
    });
    return ['All', ...Array.from(cats).sort()];
  }, [wishlistItems]);

  const filteredItems = React.useMemo(() => {
    if (selectedCategory === 'All') return wishlistItems;
    return wishlistItems.filter((item) => (item.category || 'Apparel') === selectedCategory);
  }, [wishlistItems, selectedCategory]);

  return (
    <main className="bg-background text-foreground min-h-screen md:pt-20">
      <div className="sticky top-[3.5rem] md:top-[5rem] z-40 bg-background/95 pb-4 pt-2 backdrop-blur-xl">
        {/* Header Section */}
        <header className="border-foreground/10 right-0 left-0 rounded-4xl border-b px-2">
          <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
            {/* Left: Title + Count */}
            <div className="flex items-center gap-2">
              <h1 className="text-lg uppercase">Favorite Items</h1>
            </div>

            {/* Right: Layout Toggle + Count */}
            <div className="flex items-center gap-4">
              <div className="bg-background-muted flex items-center rounded-full p-1">
                <button
                  onClick={() => setLayoutMode('list')}
                  className={`rounded-full p-1.5 transition-colors ${
                    layoutMode === 'list' ? 'bg-foreground text-background shadow-sm' : 'text-foreground-subtle hover:text-foreground'
                  }`}
                  aria-label="List View"
                >
                  <HamburgerMenuIcon size={14} />
                </button>
                <button
                  onClick={() => setLayoutMode('grid')}
                  className={`rounded-full p-1.5 transition-colors ${
                    layoutMode === 'grid' ? 'bg-foreground text-background shadow-sm' : 'text-foreground-subtle hover:text-foreground'
                  }`}
                  aria-label="Grid View"
                >
                  <MenuIcon size={14} />
                </button>
              </div>
              <span className="px-2 py-0.5 text-3xl">
                {itemCount} <span className="text-sm">Items</span>
              </span>
            </div>
          </div>
        </header>

        {/* Categories Filter */}
        {hasItems && (
          <div className="hide-scrollbar mx-auto mt-4 flex max-w-7xl gap-2 overflow-x-auto px-4 sm:px-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  selectedCategory === cat
                    ? 'bg-foreground text-background'
                    : 'bg-background-muted text-foreground border-border hover:bg-background-muted/80 border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mx-auto px-4 pt-4 pb-24 sm:px-8">
        {/* Content Section */}
        <AnimatePresence mode="wait">
          {hasItems ? (
            filteredItems.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={
                  layoutMode === 'list'
                    ? "grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-3 xl:gap-x-10"
                    : "grid grid-cols-1 gap-4 md:grid-cols-3 xl:gap-6"
                }
              >
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  >
                    <WishlistCard
                      product={item}
                      layoutMode={layoutMode}
                      onRemove={(id) => {
                        void removeFromWishlist(id);
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
                <p className="text-foreground-subtle text-sm uppercase tracking-widest">No items in this category.</p>
              </motion.div>
            )
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
