'use client';

import React from 'react';
import {
  Flame,
  Sparkles,
  Pizza,
  Crown,
  Sandwich,
  UtensilsCrossed,
  CupSoda,
} from 'lucide-react';
import { MenuCategoryId } from '@/types/menu';
import { cn } from '@/lib/utils';

interface ArtisanalCategoryBoardProps {
  activeCategory: MenuCategoryId;
  onSelectCategory: (category: MenuCategoryId) => void;
}

interface CategoryCard {
  id: MenuCategoryId;
  title: string;
  subtitle: string;
  count: number;
  icon: React.ElementType;
}

const CATEGORY_CARDS: CategoryCard[] = [
  {
    id: 'all',
    title: 'Chef Picks',
    subtitle: 'Trending & Bestsellers',
    count: 50,
    icon: Flame,
  },
  {
    id: 'pizza-deals',
    title: 'Pizza Deals',
    subtitle: 'Combos with Drinks',
    count: 10,
    icon: Sparkles,
  },
  {
    id: 'pizza-flavours',
    title: 'Pizza Flavours',
    subtitle: 'Small, Reg & Large',
    count: 24,
    icon: Pizza,
  },
  {
    id: 'special-flavours',
    title: 'Stuffed Crust',
    subtitle: 'Creamy Shawarma & More',
    count: 4,
    icon: Crown,
  },
  {
    id: 'sandwiches',
    title: 'Sandwiches',
    subtitle: 'Toasted Club & Mexican',
    count: 2,
    icon: Sandwich,
  },
  {
    id: 'pasta-fries',
    title: 'Pasta & Fries',
    subtitle: 'Lasagne & Pizza Fries',
    count: 3,
    icon: UtensilsCrossed,
  },
  {
    id: 'sides',
    title: 'Sides & Extras',
    subtitle: 'Wings, Breads & Drinks',
    count: 7,
    icon: CupSoda,
  },
];

/**
 * De Pizzano Artisanal Category Board
 * An independent, card-based category exploration system replacing
 * generic flat chip rails with tactile, visual food tiles.
 */
export function ArtisanalCategoryBoard({
  activeCategory,
  onSelectCategory,
}: ArtisanalCategoryBoardProps) {
  return (
    <div className="w-full py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Subtitle */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-secondary" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Select Category to Filter Kitchen Menu
          </span>
        </div>

        {/* Scrollable / Responsive Category Cards Board */}
        <div
          role="tablist"
          aria-label="Menu Categories"
          className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar snap-x"
        >
          {CATEGORY_CARDS.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={cn(
                  'group flex-shrink-0 snap-start flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary select-none',
                  isSelected
                    ? 'bg-gradient-to-r from-primary to-primary-hover border-primary text-white shadow-glow-red scale-[1.02]'
                    : 'bg-surface hover:bg-surface-elevated border-surface-border hover:border-secondary/50 text-foreground'
                )}
              >
                {/* Category Icon */}
                <div
                  className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center transition-colors',
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-surface-elevated text-secondary group-hover:bg-secondary group-hover:text-neutral-950'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Category Text & Count */}
                <div className="flex flex-col min-w-0 pr-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold font-display uppercase tracking-wider whitespace-nowrap">
                      {cat.title}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-bold px-1.5 py-0.2 rounded-md',
                        isSelected
                          ? 'bg-black/30 text-white'
                          : 'bg-surface-elevated text-muted-foreground border border-surface-border'
                      )}
                    >
                      {cat.count}
                    </span>
                  </div>
                  <span
                    className={cn(
                      'text-[10px] truncate max-w-[130px]',
                      isSelected ? 'text-white/90' : 'text-muted-foreground'
                    )}
                  >
                    {cat.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
