'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, Sparkles, Clock, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductDialog } from '@/components/menu/ProductDialog';
import { MENU_ITEMS } from '@/data/menu';
import { MenuItem } from '@/types/menu';

/**
 * De Pizzano Editorial Hero Section
 * An original, asymmetric restaurant-first composition communicating
 * culinary craftsmanship, stone-baked oven heritage, and on-site ordering convenience.
 */
export function EditorialHero() {
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  // Find a signature pizza for the hero spotlight (Chicken Tikka Pizza or Stuffed Crust)
  const spotlightPizza = MENU_ITEMS.find((item) => item.id === 'chicken-tikka-pizza') || MENU_ITEMS[0];

  return (
    <section
      aria-label="Promotional Showcase"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#181412] via-[#1A1613] to-background pt-6 pb-12 sm:pb-16 border-b border-[#2E2723]"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Story & Call to Actions */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Heritage Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#241E1A] border border-[#3E342D] text-secondary text-xs font-bold tracking-wide shadow-sm">
              <Flame className="w-4 h-4 text-primary animate-pulse" />
              <span>Authentic Stone-Baked Craftsmanship • Soldier Bazar No. 3</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black text-white font-display uppercase tracking-tight leading-[1.1]">
              Pure Mozzarella. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-[#F7CB77] to-secondary">
                Slow-Fermented Dough.
              </span> <br />
              Fire-Baked to Order.
            </h1>

            {/* Editorial Story Narrative */}
            <p className="text-sm sm:text-base text-muted-light max-w-xl leading-relaxed">
              At De Pizzano, every pizza is an independent culinary craft. Hand-stretched dough, 
              100% pure dairy mozzarella, slow-simmered garlic marinara, and generous local 
              toppings baked in high-heat stone ovens. Delivered fresh and piping-hot across Karachi.
            </p>

            {/* Direct Primary Action CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2 w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                href="/menu"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                className="shadow-glow-red text-xs sm:text-sm font-bold flex-1 sm:flex-initial"
              >
                Explore Full 50-Item Menu
              </Button>

              <Button
                variant="outline"
                size="lg"
                href="/menu#pizza-deals"
                icon={<Sparkles className="w-4 h-4 text-secondary" />}
                className="text-xs sm:text-sm font-bold flex-1 sm:flex-initial"
              >
                View Verified Deals
              </Button>
            </div>

            {/* Trust & Fulfillment Reassurance Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 w-full border-t border-[#2F2723]">
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-secondary" /> 30-45 Mins
                </span>
                <span className="text-[11px] text-muted">Hot Doorstep Delivery</span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-secondary" /> 100% Dairy
                </span>
                <span className="text-[11px] text-muted">Pure Mozzarella Pull</span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-primary" /> Soldier Bazar
                </span>
                <span className="text-[11px] text-muted">Karachi Neighborhood Kitchen</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Signature Product Spotlight */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl bg-gradient-to-b from-[#251F1B] to-[#1C1714] border border-[#3E342D] p-5 sm:p-6 shadow-2xl overflow-hidden group">
              
              {/* Highlight Ribbon */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-secondary/15 border border-secondary/30 text-secondary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Chef&apos;s Signature
                </span>
                <span className="text-xs text-muted font-medium">Bestseller of the Week</span>
              </div>

              {/* Large Food Photography */}
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-surface-elevated mb-4 shadow-inner">
                <Image
                  src={spotlightPizza.image || '/images/gallery/chicken-tikka-pizza.jpg'}
                  alt={spotlightPizza.name}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <span className="px-2.5 py-1 text-xs font-bold text-white bg-black/70 backdrop-blur-md rounded-lg border border-white/10">
                    Hand-Tossed & Stone-Baked
                  </span>
                  <span className="text-xl font-black text-white bg-primary px-3 py-1 rounded-xl shadow-md">
                    Rs. {spotlightPizza.price}
                  </span>
                </div>
              </div>

              {/* Dish Name & Description */}
              <h2 className="text-xl font-black text-white font-display uppercase tracking-wide group-hover:text-secondary transition-colors">
                {spotlightPizza.name}
              </h2>
              <p className="mt-1.5 text-xs text-muted-light leading-relaxed line-clamp-2">
                {spotlightPizza.description || 'Marinated spicy chicken chunks, caramelized onion, bell peppers and 100% dairy mozzarella baked to perfection.'}
              </p>

              {/* Interactive Customize & Order Trigger */}
              <div className="mt-5 pt-4 border-t border-[#382F2A] flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted uppercase font-semibold">Available Sizes</span>
                  <span className="text-xs font-bold text-white">Small 9&quot; • Regular 11&quot; • Large 13&quot;</span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedProduct(spotlightPizza)}
                  icon={<ShoppingBag className="w-3.5 h-3.5" />}
                  className="shadow-glow-red font-bold text-xs"
                >
                  Customize &amp; Order
                </Button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Product Customization Modal when clicked from Hero */}
      {selectedProduct && (
        <ProductDialog
          item={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
