'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShoppingBag, Flame, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductDialog } from '@/components/menu/ProductDialog';
import { MENU_ITEMS } from '@/data/menu';
import { MenuItem } from '@/types/menu';

/**
 * De Pizzano Deals & Combos Spotlight
 * An editorial showcase for verified pizza meal bundles with beverage inclusions,
 * transparent savings, and direct on-site customization.
 */
export function DealsSpotlight() {
  const [selectedDeal, setSelectedDeal] = useState<MenuItem | null>(null);

  // Filter top verified deals
  const deals = MENU_ITEMS.filter((item) => item.category === 'pizza-deals').slice(0, 4);

  return (
    <section aria-label="Verified Deals & Meal Bundles" className="w-full py-12 bg-surface/40 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Handcrafted Value Bundles
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground font-display uppercase tracking-wide">
              Signature Pizza Deals &amp; Combos
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Stone-baked pizzas paired with chilled drinks for family dinners and gatherings.
            </p>
          </div>

          <Link
            href="/deals"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-foreground transition-colors group self-start sm:self-auto"
          >
            <span>View All 10 Pizza Deals</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Deals Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="group relative rounded-2xl bg-card border border-border hover:border-secondary/60 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-card hover:-translate-y-1 w-full"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-secondary/15 text-secondary text-[11px] font-bold uppercase tracking-wider border border-secondary/30">
                    Combo Bundle
                  </span>
                  <span className="text-[10px] text-foreground font-bold uppercase tracking-wider">
                    Verified Rate
                  </span>
                </div>

                {/* Deal Image if present */}
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-surface-elevated mb-3.5">
                  <Image
                    src={deal.image || '/images/gallery/chicken-fajita-pizza.jpg'}
                    alt={deal.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded-md bg-primary text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <Flame className="w-2.5 h-2.5" /> Popular
                    </span>
                  </div>
                </div>

                {/* Deal Title */}
                <h3 className="text-base font-bold text-foreground group-hover:text-secondary transition-colors font-display">
                  {deal.name}
                </h3>

                {/* Description */}
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {deal.description}
                </p>
              </div>

              {/* Price & Action */}
              <div className="mt-5 pt-3.5 border-t border-border">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-xs text-muted-foreground">Bundle Price</span>
                  <span className="text-lg font-black text-foreground">
                    Rs. {deal.price}
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedDeal(deal)}
                  icon={<ShoppingBag className="w-3.5 h-3.5" />}
                  className="w-full justify-center text-xs font-bold shadow-glow-red"
                >
                  Customize &amp; Order
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal dialog when clicked */}
      {selectedDeal && (
        <ProductDialog
          item={selectedDeal}
          onClose={() => setSelectedDeal(null)}
        />
      )}
    </section>
  );
}
