'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Info, Sparkles } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { formatMenuItemPrice } from '@/lib/format-price';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface MenuCardProps {
  item: MenuItem;
  onSelect?: (item: MenuItem) => void;
  layout?: 'grid' | 'list';
}

/**
 * De Pizzano Artisanal Menu Card
 * Focuses on on-site direct ordering with customizable portions while
 * maintaining high culinary appeal and zero third-party dependency.
 */
export function MenuCard({ item, onSelect, layout = 'grid' }: MenuCardProps) {
  const [imgError, setImgError] = useState(false);
  const formattedPrice = formatMenuItemPrice(item);
  const isList = layout === 'list';

  const isPizza =
    item.category === 'pizza-flavours' ||
    item.category === 'special-flavours' ||
    item.category === 'regular-pizza' ||
    item.category === 'special-pizza' ||
    item.category === 'pizza-deals';

  return (
    <div
      className={cn(
        'group relative bg-card border border-border hover:border-secondary/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-card hover:-translate-y-1 flex',
        isList ? 'flex-col sm:flex-row items-stretch' : 'flex-col h-full'
      )}
    >
      {/* Product Image Container */}
      <div
        className={cn(
          'relative bg-surface-elevated overflow-hidden shrink-0',
          isList
            ? 'w-full sm:w-56 aspect-[4/3] sm:aspect-auto min-h-[160px]'
            : 'aspect-[4/3] w-full'
        )}
      >
        {item.image && !imgError ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-surface to-surface-elevated p-4 text-center">
            <span className="text-3xl mb-1">🍕</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              {item.category.replace('-', ' ')}
            </span>
          </div>
        )}

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-background/85 backdrop-blur-md text-secondary border border-secondary/30 rounded-full shadow-sm">
            {item.category.replace('-', ' ')}
          </span>
        </div>

        {/* Featured Tag if applicable */}
        {item.featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary text-white rounded-md shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Popular
            </span>
          </div>
        )}
      </div>

      {/* Product Details Content */}
      <div
        className={cn(
          'p-5 flex-1 flex flex-col justify-between',
          isList && 'sm:pl-6'
        )}
      >
        <div>
          {/* Header Row in List Mode */}
          <div
            className={cn(
              isList
                ? 'flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2'
                : 'block'
            )}
          >
            <div>
              {/* Product Name */}
              <h3 className="text-lg font-bold text-foreground group-hover:text-secondary transition-colors font-display tracking-wide">
                {item.name}
              </h3>

              {/* Product Description */}
              {item.description ? (
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground italic">
                  Handcrafted fresh to order with pure mozzarella and stone-baked crust.
                </p>
              )}
            </div>

            {/* Price Presentation */}
            <div
              className={cn(
                'flex items-baseline gap-1.5 shrink-0',
                isList ? 'sm:flex-col sm:items-end sm:gap-0' : 'mt-3'
              )}
            >
              <span className="text-xl font-extrabold text-foreground">
                {formattedPrice}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                (Public listing rate)
              </span>
            </div>
          </div>
        </div>

        {/* Card Actions: Focus on Direct On-Site Order */}
        <div className="mt-5 pt-4 border-t border-border flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {onSelect ? (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onSelect(item)}
                  icon={<ShoppingBag className="w-3.5 h-3.5" />}
                  className="text-xs flex-1 justify-center shadow-glow-red font-bold"
                >
                  {isPizza ? 'Customize & Order' : 'Add to Cart'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelect(item)}
                  icon={<Info className="w-3.5 h-3.5 text-secondary" />}
                  className="text-xs px-2.5 shrink-0"
                  title="View Details & Customization"
                >
                  Details
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                href="/menu"
                icon={<ShoppingBag className="w-3.5 h-3.5" />}
                className="text-xs flex-1 justify-center font-bold"
              >
                Order Online
              </Button>
            )}
          </div>

          {/* Status Indicator - High Contrast in Light/Dark */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium px-1">
            <span className="flex items-center gap-1.5 text-foreground font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 inline-block shadow-sm" />
              Kitchen Live (Soldier Bazar)
            </span>
            <span className="text-secondary font-bold">Fresh Daily</span>
          </div>
        </div>
      </div>
    </div>
  );
}
