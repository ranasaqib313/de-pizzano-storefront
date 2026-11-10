'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Clock, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductDialog } from '@/components/menu/ProductDialog';
import { MENU_ITEMS } from '@/data/menu';
import { MenuItem } from '@/types/menu';

/**
 * De Pizzano Editorial Hero Section
 * Modern, clean, and plain-English messaging with an interactive, animated Hero Deal Card.
 */
export function EditorialHero() {
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  // Spotlight Deal 1: Small Pizza + 345ml Drink
  const spotlightPizza =
    MENU_ITEMS.find((item) => item.id === 'deal-1') || MENU_ITEMS[0];

  return (
    <section
      aria-label="Promotional Showcase"
      className="relative w-full overflow-hidden bg-gradient-to-b from-surface/60 via-background to-background pt-4 sm:pt-8 md:pt-12 pb-8 sm:pb-12 md:pb-16 border-b border-border"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Story & Call to Actions */}
          <div className="w-full lg:w-7/12 flex flex-col items-start justify-center">
            
            {/* Display Headline - Scaled responsibly for mobile */}
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-foreground font-display uppercase tracking-tight leading-tight pt-1 sm:pt-2">
              100% Real Cheese. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-[#F7CB77] to-secondary">
                Soft &amp; Crispy Dough.
              </span> <br />
              Freshly Baked in Stone Oven.
            </h1>

            {/* Supporting Copy */}
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed">
              Fresh handmade pizzas with 100% real mozzarella cheese, rich garlic tomato sauce, and generous toppings baked in stone ovens. Fast home delivery across Karachi.
            </p>

            {/* Direct Primary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-5 sm:mt-8 w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                href="/menu"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                className="w-full sm:w-auto py-2.5 sm:py-3 px-5 sm:px-6 shadow-glow-red text-xs sm:text-sm font-bold justify-center"
              >
                Explore Full Menu
              </Button>

              <Button
                variant="outline"
                size="md"
                href="/deals"
                icon={<Sparkles className="w-4 h-4 text-secondary" />}
                className="w-full sm:w-auto py-2.5 sm:py-3 px-5 sm:px-6 text-xs sm:text-sm font-bold justify-center"
              >
                Explore Exclusive Deals
              </Button>
            </div>

            {/* Trust & Fulfillment Reassurance Row */}
            <div className="flex items-center gap-6 sm:gap-12 pt-5 sm:pt-6 mt-5 sm:mt-6 w-full border-t border-border justify-start">
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-secondary" /> 30-45 Mins
                </span>
                <span className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">Fast Home Delivery</span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-secondary" /> 100% Real Cheese
                </span>
                <span className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">Fresh Mozzarella</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Signature Deal Card */}
          <div className="w-full lg:w-5/12 relative">
            <div className="relative rounded-2xl sm:rounded-3xl bg-card text-card-foreground border border-border p-4 sm:p-6 shadow-xl sm:shadow-2xl overflow-hidden group w-full transition-all duration-300 hover:border-secondary/60">
              
              {/* Highlight Ribbon with Glassmorphic Badges */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-secondary/15 backdrop-blur-md border border-secondary/40 text-secondary text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(243,181,68,0.25)]">
                  <Sparkles className="w-3 h-3" /> Chef&apos;s Signature
                </span>
                <span className="text-[11px] sm:text-xs text-muted-foreground font-semibold">Bestseller of the Week</span>
              </div>

              {/* Large Food Photography with Zoom on Hover */}
              <div className="relative w-full h-[200px] sm:h-[260px] md:h-[340px] rounded-xl sm:rounded-2xl overflow-hidden bg-surface-elevated mb-3.5 sm:mb-4 shadow-inner">
                <Image
                  src={spotlightPizza.image || '/images/gallery/chicken-tikka-pizza.jpg'}
                  alt={spotlightPizza.name}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 flex items-end justify-between">
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-bold text-white bg-black/70 backdrop-blur-md rounded-lg border border-white/20">
                    Fresh Stone Oven Pizza
                  </span>
                  <span className="text-base sm:text-xl font-black text-white bg-primary/95 backdrop-blur-md px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl border border-white/20 shadow-[0_0_20px_rgba(217,45,45,0.45)]">
                    Rs. {spotlightPizza.price}
                  </span>
                </div>
              </div>

              {/* Dish Name & Description */}
              <h2 className="text-base sm:text-xl font-black text-card-foreground font-display uppercase tracking-wide group-hover:text-secondary transition-colors truncate">
                {spotlightPizza.name}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {spotlightPizza.description ||
                  '1 Small Pizza (9") with 1 chilled 345ml Soft Drink.'}
              </p>

              {/* Interactive Customize & Order Trigger */}
              <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-border flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Available Sizes</span>
                  <span className="text-[11px] sm:text-xs font-bold text-foreground">Small 9&quot; • Regular 11&quot; • Large 13&quot;</span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedProduct(spotlightPizza)}
                  icon={<ShoppingBag className="w-3.5 h-3.5" />}
                  className="shadow-glow-red font-bold text-xs transition-all duration-300 hover:scale-105 active:scale-95"
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
