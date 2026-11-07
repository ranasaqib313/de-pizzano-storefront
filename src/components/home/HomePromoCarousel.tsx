'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Flame, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Slide {
  id: string;
  badge: string;
  badgeIcon?: 'sparkles' | 'flame' | 'clock';
  headline: string;
  highlightText: string;
  description: string;
  priceTag: string;
  strikethroughPrice?: string;
  ctaText: string;
  ctaHref: string;
  imageSrc: string;
  imageAlt: string;
  bgColor: string;
  accentColor: string;
}

const PROMO_SLIDES: Slide[] = [
  {
    id: 'slide-1',
    badge: 'LIMITED TIME VALUE DUO',
    badgeIcon: 'sparkles',
    headline: 'DOUBLE DEAL 11',
    highlightText: '1 SMALL + 1 REGULAR',
    description: 'Pick any 2 mouth-watering stone-baked pizzas crafted with 100% mozzarella and fresh dough.',
    priceTag: 'RS. 1,150',
    strikethroughPrice: 'RS. 1,400',
    ctaText: 'Order Double Deal',
    ctaHref: '/menu#pizza-deals',
    imageSrc: '/images/gallery/chicken-tikka-pizza.jpg',
    imageAlt: 'De Pizzano Handcrafted Chicken Tikka Pizza',
    bgColor: 'from-neutral-950 via-primary/30 to-neutral-900',
    accentColor: '#E63946',
  },
  {
    id: 'slide-2',
    badge: "CHEF'S SIGNATURE SPECIALS",
    badgeIcon: 'flame',
    headline: 'STUFFED CRUST',
    highlightText: 'CREAMY SHAWARMA',
    description: 'Melted cheese stuffed crust infused with spicy chicken chunks, black olives and garlic sauce.',
    priceTag: 'FROM RS. 800',
    ctaText: 'Explore Special Flavours',
    ctaHref: '/menu#special-flavours',
    imageSrc: '/images/gallery/stuffed-crust-pizza.jpg',
    imageAlt: 'De Pizzano Cheesy Stuffed Crust Shawarma Pizza',
    bgColor: 'from-neutral-950 via-amber-950/40 to-neutral-900',
    accentColor: '#F59E0B',
  },
  {
    id: 'slide-3',
    badge: 'MEGA FAMILY BUNDLE',
    badgeIcon: 'sparkles',
    headline: 'DEAL 4 — 2 LARGE PIZZAS',
    highlightText: '+ 1.5L CHILLED DRINK',
    description: 'The ultimate family feast with 2 large 13" pizzas packed with signature toppings & cheese.',
    priceTag: 'RS. 2,150',
    strikethroughPrice: 'RS. 2,500',
    ctaText: 'Grab Family Feast',
    ctaHref: '/menu#pizza-deals',
    imageSrc: '/images/gallery/chicken-fajita-pizza.jpg',
    imageAlt: 'De Pizzano Fajita Sicillian Large Pizza',
    bgColor: 'from-neutral-950 via-red-950/40 to-neutral-900',
    accentColor: '#E63946',
  },
  {
    id: 'slide-4',
    badge: 'CRISPY SIDES & BAKED PASTAS',
    badgeIcon: 'clock',
    headline: 'LOADED PIZZA FRIES',
    highlightText: '& CHICKEN LASAGNE',
    description: 'Golden fries layered with pizza sauce, melted cheese & tender chicken toppings baked to perfection.',
    priceTag: 'STARTING RS. 200',
    ctaText: 'Discover Sides & Pastas',
    ctaHref: '/menu#pasta-fries',
    imageSrc: '/images/gallery/loaded-pizza-fries.jpg',
    imageAlt: 'De Pizzano Loaded Cheesy Pizza Fries',
    bgColor: 'from-neutral-950 via-orange-950/40 to-neutral-900',
    accentColor: '#D97706',
  },
];

export function HomePromoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % PROMO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length);
  }, []);

  // Auto-advance timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const current = PROMO_SLIDES[currentIndex];

  return (
    <section
      aria-label="Promotional Showcase"
      className="relative w-full overflow-hidden py-4 sm:py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Wide Carousel Card */}
        <div className="relative w-full h-[360px] sm:h-[420px] md:h-[480px] lg:h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-surface-border bg-surface">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className={`absolute inset-0 bg-gradient-to-r ${current.bgColor} flex flex-col justify-between p-6 sm:p-10 md:p-12 overflow-hidden`}
            >
              {/* Background Glows */}
              <div
                className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[130px] opacity-30 pointer-events-none"
                style={{ backgroundColor: current.accentColor }}
              />
              <div
                className="absolute -bottom-24 right-1/3 w-96 h-96 rounded-full blur-[140px] opacity-25 pointer-events-none"
                style={{ backgroundColor: current.accentColor }}
              />

              {/* Slide Content Grid */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center h-full">
                {/* Left Text Column */}
                <div className="md:col-span-7 flex flex-col justify-center space-y-3 sm:space-y-4">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 self-start px-3.5 py-1 rounded-full bg-surface-elevated/90 border border-surface-border text-secondary text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-sm">
                    {current.badgeIcon === 'flame' && <Flame className="w-3.5 h-3.5 text-primary" />}
                    {current.badgeIcon === 'sparkles' && <Sparkles className="w-3.5 h-3.5 text-secondary" />}
                    {current.badgeIcon === 'clock' && <Clock className="w-3.5 h-3.5 text-secondary" />}
                    <span>{current.badge}</span>
                  </div>

                  {/* Headline */}
                  <div>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white font-display uppercase tracking-tight leading-none">
                      {current.headline}
                    </h2>
                    <h3 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-secondary via-amber-300 to-secondary font-display uppercase tracking-tight mt-1 leading-tight">
                      {current.highlightText}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm md:text-base text-muted-light max-w-lg line-clamp-2 sm:line-clamp-3 leading-relaxed">
                    {current.description}
                  </p>

                  {/* Pricing and CTA Row */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                    <div className="flex items-baseline gap-2 bg-surface-elevated/80 px-3.5 py-2 rounded-2xl border border-surface-border">
                      <span className="text-lg sm:text-2xl font-black font-mono text-secondary">
                        {current.priceTag}
                      </span>
                      {current.strikethroughPrice && (
                        <span className="text-xs sm:text-sm font-mono text-muted line-through">
                          {current.strikethroughPrice}
                        </span>
                      )}
                    </div>

                    <Button
                      variant="primary"
                      size="md"
                      href={current.ctaHref}
                      icon={<ArrowRight className="w-4 h-4" />}
                      iconPosition="right"
                      className="shadow-glow-red font-bold text-xs sm:text-sm"
                    >
                      {current.ctaText}
                    </Button>
                  </div>
                </div>

                {/* Right Visual Column */}
                <div className="md:col-span-5 relative h-48 sm:h-64 md:h-80 lg:h-96 flex items-center justify-center">
                  <div className="relative w-44 sm:w-60 md:w-72 lg:w-84 aspect-square rounded-full p-2 border-2 border-secondary/30 bg-surface/30 shadow-2xl overflow-hidden group">
                    <Image
                      src={current.imageSrc}
                      alt={current.imageAlt}
                      fill
                      priority
                      className="object-cover rounded-full group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Bottom Progress Bar / Indicator Dots */}
              <div className="relative z-10 flex items-center justify-between pt-2 border-t border-surface-border/40">
                <div className="flex items-center gap-2">
                  {PROMO_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentIndex
                          ? 'w-8 bg-secondary'
                          : 'w-2 bg-surface-border hover:bg-muted'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-muted font-medium">
                  <span>{currentIndex + 1}</span>
                  <span>/</span>
                  <span>{PROMO_SLIDES.length}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Previous / Next Arrow Controls */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/70 hover:bg-surface border border-surface-border text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 shadow-lg z-20 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/70 hover:bg-surface border border-surface-border text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 shadow-lg z-20 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
