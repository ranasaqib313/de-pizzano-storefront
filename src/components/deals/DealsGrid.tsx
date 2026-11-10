'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingBag, Flame, Tag, Check, Users, Coffee } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { Button } from '@/components/ui/Button';
import { ProductDialog } from '@/components/menu/ProductDialog';
import { cn } from '@/lib/utils';

interface DealsGridProps {
  deals: MenuItem[];
}

type DealFilter = 'all' | 'solo-duo' | 'family';

export function DealsGrid({ deals }: DealsGridProps) {
  const [activeFilter, setActiveFilter] = useState<DealFilter>('all');
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  const filteredDeals = useMemo(() => {
    if (activeFilter === 'solo-duo') {
      return deals.filter((d) => d.price <= 1200);
    }
    if (activeFilter === 'family') {
      return deals.filter((d) => d.price > 1200);
    }
    return deals;
  }, [deals, activeFilter]);

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {[
          { id: 'all' as DealFilter, label: 'All 10 Deals', count: deals.length },
          { id: 'solo-duo' as DealFilter, label: 'Solo & Duo Combos (Under Rs. 1200)', count: deals.filter((d) => d.price <= 1200).length },
          { id: 'family' as DealFilter, label: 'Family & Party Feasts', count: deals.filter((d) => d.price > 1200).length },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={cn(
              'px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer select-none',
              activeFilter === tab.id
                ? 'bg-primary text-white shadow-glow-red'
                : 'bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-surface-elevated'
            )}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredDeals.map((deal) => {
          const isLargeFeast = deal.price >= 2000;
          return (
            <motion.div
              key={deal.id}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={cn(
                'group relative rounded-3xl bg-card border border-border hover:border-secondary/60 p-4 sm:p-6 flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-2xl overflow-hidden w-full',
                isLargeFeast && 'ring-1 ring-secondary/30'
              )}
            >
              <div>
                {/* Badge Row */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 border border-secondary/30 text-secondary text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    {isLargeFeast ? 'Party Feast' : 'Combo Deal'}
                  </span>
                  <span className="text-xs font-black text-white bg-primary px-3 py-1 rounded-xl shadow-sm">
                    Rs. {deal.price}
                  </span>
                </div>

                {/* Deal Image */}
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-surface-elevated mb-4 shadow-inner">
                  <Image
                    src={deal.image || '/images/menu/chicken-tikka-pizza.jpg'}
                    alt={deal.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 text-[11px] font-bold text-white bg-black/70 backdrop-blur-md rounded-lg border border-white/10">
                      Stone-Oven Baked
                    </span>
                    <span className="text-[11px] font-bold text-secondary-light flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md">
                      <Coffee className="w-3 h-3" /> Soft Drink Included
                    </span>
                  </div>
                </div>

                {/* Deal Info */}
                <h3 className="text-lg font-black text-foreground font-display uppercase tracking-wide group-hover:text-secondary transition-colors">
                  {deal.name}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {deal.description}
                </p>
              </div>

              {/* Order Button */}
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Delivery &amp; Takeaway
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    Custom Flavours
                  </span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedProduct(deal)}
                  icon={<ShoppingBag className="w-3.5 h-3.5" />}
                  className="shadow-glow-red font-bold text-xs"
                >
                  Customize &amp; Order
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Product Customization Modal */}
      {selectedProduct && (
        <ProductDialog
          item={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

