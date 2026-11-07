'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Flame, Sparkles, Pizza, Crown, Sandwich, Soup, Drumstick } from 'lucide-react';
import { MenuCategoryId } from '@/types/menu';
import { cn } from '@/lib/utils';

export interface CategoryPillItem {
  id: MenuCategoryId;
  label: string;
  count?: number;
  icon?: React.ElementType;
}

export const HOME_CATEGORY_PILLS: CategoryPillItem[] = [
  { id: 'all', label: 'Trending', icon: Flame, count: 50 },
  { id: 'pizza-deals', label: 'Pizza Deals', icon: Sparkles, count: 10 },
  { id: 'pizza-flavours', label: 'Pizza Flavours', icon: Pizza, count: 24 },
  { id: 'special-flavours', label: 'Special Flavours', icon: Crown, count: 4 },
  { id: 'sandwiches', label: 'Sandwiches', icon: Sandwich, count: 2 },
  { id: 'pasta-fries', label: 'Pasta & Fries', icon: Soup, count: 3 },
  { id: 'sides', label: 'Sides', icon: Drumstick, count: 7 },
];

interface HomeCategoryPillsProps {
  activeCategory: MenuCategoryId;
  onSelectCategory: (categoryId: MenuCategoryId) => void;
}

export function HomeCategoryPills({ activeCategory, onSelectCategory }: HomeCategoryPillsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -250 : 250;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 my-4 select-none overflow-hidden">
      <div className="relative flex items-center">
        {/* Left Scroll Button */}
        <button
          type="button"
          onClick={() => scroll('left')}
          aria-label="Scroll categories left"
          className="hidden sm:flex absolute -left-3 z-10 w-8 h-8 rounded-full bg-surface border border-surface-border text-white items-center justify-center shadow-lg hover:bg-surface-elevated hover:scale-105 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Pills Row */}
        <div
          ref={scrollRef}
          role="tablist"
          aria-label="Menu Categories"
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth w-full"
        >
          {HOME_CATEGORY_PILLS.map((pill) => {
            const Icon = pill.icon || Pizza;
            const isActive = activeCategory === pill.id;

            return (
              <button
                key={pill.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => onSelectCategory(pill.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 border select-none',
                  isActive
                    ? 'bg-secondary text-background border-secondary font-black shadow-glow-gold scale-[1.02]'
                    : 'bg-surface border-surface-border text-muted-light hover:text-white hover:bg-surface-elevated hover:border-surface-highlight'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4',
                    isActive ? 'text-background' : 'text-secondary'
                  )}
                />
                <span>{pill.label}</span>
                {pill.count && (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5',
                      isActive
                        ? 'bg-background/20 text-background'
                        : 'bg-surface-elevated text-muted'
                    )}
                  >
                    {pill.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        <button
          type="button"
          onClick={() => scroll('right')}
          aria-label="Scroll categories right"
          className="hidden sm:flex absolute -right-3 z-10 w-8 h-8 rounded-full bg-surface border border-surface-border text-white items-center justify-center shadow-lg hover:bg-surface-elevated hover:scale-105 transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
