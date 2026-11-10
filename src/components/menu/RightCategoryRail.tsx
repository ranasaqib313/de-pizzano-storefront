'use client';

import React from 'react';
import { MenuCategory, MenuCategoryId } from '@/types/menu';
import { cn } from '@/lib/utils';
import {
  Flame,
  Sparkles,
  Pizza,
  Crown,
  Sandwich,
  Soup,
  Drumstick,
  UtensilsCrossed,
  Layers,
} from 'lucide-react';

interface RightCategoryRailProps {
  categories: MenuCategory[];
  activeCategory: MenuCategoryId;
  onSelectCategory: (category: MenuCategoryId) => void;
  totalCount: number;
}

function getCategoryIcon(id: string) {
  switch (id) {
    case 'all':
      return Flame;
    case 'pizza-deals':
      return Sparkles;
    case 'pizza-flavours':
      return Pizza;
    case 'special-flavours':
      return Crown;
    case 'sandwiches':
      return Sandwich;
    case 'pasta-fries':
      return Soup;
    case 'sides':
      return Drumstick;
    default:
      return UtensilsCrossed;
  }
}

export function RightCategoryRail({
  categories,
  activeCategory,
  onSelectCategory,
  totalCount,
}: RightCategoryRailProps) {
  const AllIcon = getCategoryIcon('all');

  return (
    <aside
      aria-label="Menu Category Navigation"
      className="w-full bg-surface/90 border border-surface-border rounded-3xl p-4 backdrop-blur-md shadow-card space-y-2 select-none"
    >
      {/* Category Rail Header */}
      <div className="flex items-center justify-between pb-3 px-2 border-b border-surface-border/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-foreground font-display uppercase tracking-wider">
              Category Rail
            </h3>
            <span className="text-[10px] text-muted-foreground block -mt-0.5">
              Quick Menu Jump
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold text-secondary bg-surface-elevated px-2 py-0.5 rounded-full border border-surface-border">
          {totalCount} Items
        </span>
      </div>

      {/* Category Navigation Items List */}
      <nav className="flex flex-col gap-1.5 pt-1">
        {/* All Items Button */}
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={cn(
            'group relative w-full text-left px-3.5 py-3 rounded-2xl transition-all duration-200 flex items-center justify-between border cursor-pointer',
            activeCategory === 'all'
              ? 'bg-gradient-to-r from-primary via-primary to-primary-hover text-white border-primary shadow-glow-red scale-[1.02]'
              : 'bg-surface-elevated/40 text-muted-foreground border-surface-border/60 hover:bg-surface-elevated hover:text-foreground hover:border-secondary/40'
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center transition-colors shrink-0',
                activeCategory === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-surface text-secondary group-hover:text-foreground'
              )}
            >
              <AllIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold block leading-tight">
                All Dishes
              </span>
              <span
                className={cn(
                  'text-[10px] block',
                  activeCategory === 'all' ? 'text-white/80' : 'text-muted-foreground'
                )}
              >
                Entire De Pizzano Menu
              </span>
            </div>
          </div>

          <span
            className={cn(
              'text-[11px] font-extrabold px-2 py-0.5 rounded-full shrink-0',
              activeCategory === 'all'
                ? 'bg-white text-primary font-black shadow-sm'
                : 'bg-surface border border-surface-border text-muted-foreground group-hover:text-foreground'
            )}
          >
            {totalCount}
          </span>
        </button>

        {/* Specific Categories */}
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const CatIcon = getCategoryIcon(cat.id);

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                'group relative w-full text-left px-3.5 py-3 rounded-2xl transition-all duration-200 flex items-center justify-between border cursor-pointer',
                isActive
                  ? 'bg-gradient-to-r from-primary via-primary to-primary-hover text-white border-primary shadow-glow-red scale-[1.02]'
                  : 'bg-surface-elevated/40 text-muted-foreground border-surface-border/60 hover:bg-surface-elevated hover:text-foreground hover:border-secondary/40'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center transition-colors shrink-0',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-surface text-secondary group-hover:text-foreground'
                  )}
                >
                  <CatIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold block leading-tight">
                    {cat.label}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] block truncate max-w-[130px]',
                      isActive ? 'text-white/80' : 'text-muted-foreground'
                    )}
                  >
                    {cat.id === 'pizza-deals'
                      ? 'Value Bundles & Drinks'
                      : cat.id === 'pizza-flavours'
                      ? 'Small, Regular & Large'
                      : cat.id === 'special-flavours'
                      ? 'Stuffed Crust Specials'
                      : cat.id === 'sandwiches'
                      ? 'Club & Canzone'
                      : cat.id === 'pasta-fries'
                      ? 'Pasta, Lasagna, Fries'
                      : 'Wings, Nuggets, Bread'}
                  </span>
                </div>
              </div>

              <span
                className={cn(
                  'text-[11px] font-extrabold px-2 py-0.5 rounded-full shrink-0',
                  isActive
                    ? 'bg-white text-primary font-black shadow-sm'
                    : 'bg-surface border border-surface-border text-muted-foreground group-hover:text-foreground'
                )}
              >
                {cat.itemCount}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Culinary Kitchen Note */}
      <div className="pt-3 px-2 border-t border-surface-border/60 text-[11px] text-muted-foreground space-y-1">
        <p className="flex items-center gap-1.5 text-secondary font-semibold">
          <Flame className="w-3.5 h-3.5 text-primary" />
          Stone-Baked Freshness
        </p>
        <p className="text-[10px] leading-relaxed">
          All pizzas prepared with 100% mozzarella, fresh daily dough & house marinara at Soldier Bazar No. 3.
        </p>
      </div>
    </aside>
  );
}

