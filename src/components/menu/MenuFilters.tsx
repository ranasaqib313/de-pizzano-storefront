'use client';

import React from 'react';
import { MenuCategoryId, MenuCategory } from '@/types/menu';
import { cn } from '@/lib/utils';

interface MenuFiltersProps {
  categories: MenuCategory[];
  activeCategory: MenuCategoryId;
  onSelectCategory: (category: MenuCategoryId) => void;
  totalCount: number;
}

export function MenuFilters({
  categories,
  activeCategory,
  onSelectCategory,
  totalCount,
}: MenuFiltersProps) {
  return (
    <nav
      aria-label="Menu Categories"
      className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar"
    >
      {/* "All" Filter Button */}
      <button
        type="button"
        onClick={() => onSelectCategory('all')}
        className={cn(
          'shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 border select-none',
          activeCategory === 'all'
            ? 'bg-primary text-white border-primary shadow-glow-red scale-[1.02]'
            : 'bg-surface/80 text-muted-light border-surface-border hover:bg-surface hover:text-white'
        )}
      >
        <span>All Items</span>
        <span
          className={cn(
            'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
            activeCategory === 'all'
              ? 'bg-white/20 text-white'
              : 'bg-surface-elevated text-muted'
          )}
        >
          {totalCount}
        </span>
      </button>

      {/* Specific Categories */}
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={cn(
              'shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 border select-none',
              isActive
                ? 'bg-primary text-white border-primary shadow-glow-red scale-[1.02]'
                : 'bg-surface/80 text-muted-light border-surface-border hover:bg-surface hover:text-white'
            )}
          >
            <span>{cat.label}</span>
            <span
              className={cn(
                'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-surface-elevated text-muted'
              )}
            >
              {cat.itemCount}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
