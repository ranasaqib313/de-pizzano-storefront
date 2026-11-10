'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MENU_ITEMS, MENU_CATEGORIES } from '@/data/menu';
import { MenuItem, MenuCategoryId } from '@/types/menu';
import { ArtisanalCategoryBoard } from './ArtisanalCategoryBoard';
import { MenuCard } from '@/components/menu/MenuCard';
import { ProductDialog } from '@/components/menu/ProductDialog';

export function HomeProductFeed() {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryId>('all');
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  // Filter items based on active category
  const displayedItems = useMemo(() => {
    if (activeCategory === 'all') {
      // Show curated top items across categories (Featured + Bestsellers + Deals)
      return MENU_ITEMS.filter((item) => item.featured).slice(0, 12);
    }
    return MENU_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const categoryName = useMemo(() => {
    if (activeCategory === 'all') return 'Popular Dishes & Deals';
    const cat = MENU_CATEGORIES.find((c) => c.id === activeCategory);
    return cat ? cat.label : 'Menu Selection';
  }, [activeCategory]);

  return (
    <section aria-label="Menu Catalog" className="w-full pb-12 sm:pb-16 overflow-hidden">
      {/* Artisanal Category Board Navigation */}
      <ArtisanalCategoryBoard
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <h3 className="text-lg sm:text-xl font-black text-foreground font-display uppercase tracking-wider">
              {categoryName}
            </h3>
            <span className="text-xs font-bold text-muted-foreground bg-surface-elevated px-2.5 py-0.5 rounded-full border border-surface-border">
              {displayedItems.length} dishes
            </span>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-foreground transition-colors group self-start sm:self-auto"
          >
            <span>Browse Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        {displayedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {displayedItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                layout="grid"
                onSelect={(dish) => setSelectedProduct(dish)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface rounded-2xl border border-surface-border">
            <p className="text-muted text-sm">No items found in this section.</p>
          </div>
        )}
      </div>

      {/* Product Customization Modal when clicked */}
      {selectedProduct && (
        <ProductDialog
          item={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
