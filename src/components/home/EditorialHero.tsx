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
      className="relative w-full overflow-hidden bg-gradient-to-b from-surface/60 via-background to-background pt-8 sm:pt-12 pb-12 sm:pb-16 border-b border-border transition-colors duration-300"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Story & Call to Actions */}
          <div className="lg:col-span-7 flex flex-col items-start justify-center">
            
            {/* Display Headline - Simplified plain English */}
            <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black text-foreground font-display uppercase tracking-tight leading-[1.1] pt-1 sm:pt-2">
              100% Real Cheese. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-[#F7CB77] to-secondary">
                Soft &amp; Crispy Dough.
              </span> <br />
              Freshly Baked in Stone Oven.
            </h1>

            {/* Supporting Copy */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
              Fresh handmade pizzas with 100% real mozzarella cheese, rich garlic tomato sauce, and generous toppings baked in stone ovens. Fast home delivery across Karachi.
            </p>

            {/* Direct Primary Action CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mt-8 sm:mt-9 w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                href="/menu"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                className="shadow-glow-red text-xs sm:text-sm font-bold flex-1 sm:flex-initial"
              >
                Explore Full Menu
              </Button>

              <Button
                variant="outline"
                size="lg"
                href="/deals"
                icon={<Sparkles className="w-4 h-4 text-secondary" />}
                className="text-xs sm:text-sm font-bold flex-1 sm:flex-initial"
              >
                Explore Exclusive Deals
              </Button>
            </div>

            {/* Trust & Fulfillment Reassurance Row */}
            <div className="flex items-center gap-10 sm:gap-16 pt-8 mt-8 w-full border-t border-border justify-start">
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-secondary" /> 30-45 Mins
                </span>
                <span className="text-[11px] text-muted-foreground mt-0.5">Fast Home Delivery</span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-secondary" /> 100% Real Cheese
                </span>
                <span className="text-[11px] text-muted-foreground mt-0.5">Fresh Mozzarella</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Animated Signature Deal Card */}
          <div className="lg:col-span-5 relative">
            <motion.div
              whileHover={{ y: -8, scale: 1.02, boxShadow: '0px 20px 40px rgba(0,0,0,0.3)' }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="relative rounded-3xl bg-card text-card-foreground border border-border p-5 sm:p-6 shadow-2xl overflow-hidden group transition-colors duration-300"
            >
              
              {/* Highlight Ribbon with Glassmorphic Badges */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-secondary/15 backdrop-blur-md border border-secondary/40 text-secondary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(243,181,68,0.25)]">
                  <Sparkles className="w-3 h-3" /> Chef&apos;s Signature
                </span>
                <span className="text-xs text-muted-foreground font-semibold">Bestseller of the Week</span>
              </div>

              {/* Large Food Photography with Zoom on Hover */}
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-surface-elevated mb-4 shadow-inner">
                <Image
                  src={spotlightPizza.image || '/images/gallery/chicken-tikka-pizza.jpg'}
                  alt={spotlightPizza.name}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <span className="px-2.5 py-1 text-xs font-bold text-white bg-black/70 backdrop-blur-md rounded-lg border border-white/20">
                    Fresh Stone Oven Pizza
                  </span>
                  <span className="text-xl font-black text-white bg-primary/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 shadow-[0_0_20px_rgba(217,45,45,0.45)]">
                    Rs. {spotlightPizza.price}
                  </span>
                </div>
              </div>

              {/* Dish Name & Description */}
              <h2 className="text-xl font-black text-card-foreground font-display uppercase tracking-wide group-hover:text-secondary transition-colors">
                {spotlightPizza.name}
              </h2>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {spotlightPizza.description ||
                  '1 Small Pizza (9") with 1 chilled 345ml Soft Drink.'}
              </p>

              {/* Interactive Customize & Order Trigger with Subtle Glowing Pulsing Animation */}
              <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Available Sizes</span>
                  <span className="text-xs font-bold text-foreground">Small 9&quot; • Regular 11&quot; • Large 13&quot;</span>
                </div>

                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(217, 45, 45, 0.25)',
                      '0 0 25px rgba(217, 45, 45, 0.65)',
                      '0 0 10px rgba(217, 45, 45, 0.25)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="rounded-xl"
                >
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSelectedProduct(spotlightPizza)}
                    icon={<ShoppingBag className="w-3.5 h-3.5" />}
                    className="shadow-glow-red font-bold text-xs transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Customize &amp; Order
                  </Button>
                </motion.div>
              </div>

            </motion.div>
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
