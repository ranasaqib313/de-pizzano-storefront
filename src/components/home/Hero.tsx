'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { Flame, Utensils, ExternalLink, Phone, MapPin, Sparkles, Bike, Store, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BUSINESS_CONFIG } from '@/data/business';
import { getFoodpandaUrl, getMapsDirectionsUrl } from '@/lib/links';
import { useCart } from '@/context/CartContext';
import { OrderTypeModal } from '@/components/layout/OrderTypeModal';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay },
  }),
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: 'easeOut', delay: 0.3 },
  },
};

export function Hero() {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const { orderType, selectedZone } = useCart();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-16 sm:py-24 bg-hero-glow">
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <Container size="xl" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Tagline Badge */}
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-secondary/30 text-secondary text-xs font-semibold uppercase tracking-wider shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>{BUSINESS_CONFIG.tagline} • Soldier Bazar No. 3</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={fadeUp}
              custom={0.1}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight text-foreground font-display leading-[1.08] uppercase"
            >
              BIG FLAVOURS.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary-light">
                UNFORGETTABLE
              </span>{' '}
              BITES.
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              variants={fadeUp}
              custom={0.2}
              initial="hidden"
              animate="visible"
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              Fresh stone oven pizzas, meal combos, toasted sandwiches, baked pastas, and crispy fries. Made with soft &amp; crispy dough and 100% real cheese in Soldier Bazar, Karachi.
            </motion.p>

            {/* Metrics Bar */}
            <motion.div
              variants={fadeUp}
              custom={0.3}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 py-2 text-xs sm:text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-foreground font-semibold">50 Delicious</span> Dishes
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-foreground font-semibold">6 Verified</span> Categories
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-foreground font-semibold">Home Delivery</span> & Takeaway
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              custom={0.4}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2"
            >
              <Button
                variant="primary"
                size="lg"
                href="/menu"
                icon={<Utensils className="w-4 h-4" />}
                className="w-full sm:w-auto shadow-glow-red"
              >
                Order Online Now
              </Button>

              <button
                type="button"
                onClick={() => setOrderModalOpen(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-surface border border-secondary/40 text-foreground hover:bg-surface-elevated hover:border-secondary transition-all flex items-center justify-center gap-2 text-sm font-bold cursor-pointer"
              >
                {orderType === 'delivery' ? (
                  <>
                    <Bike className="w-4 h-4 text-primary" />
                    <span>Mode: Delivery ({selectedZone?.name || 'Karachi'})</span>
                  </>
                ) : (
                  <>
                    <Store className="w-4 h-4 text-secondary" />
                    <span>Mode: Takeaway (Soldier Bazar)</span>
                  </>
                )}
              </button>

              <Button
                variant="outline"
                size="lg"
                href="/menu#pizza-deals"
                icon={<Sparkles className="w-4 h-4 text-secondary" />}
                className="w-full sm:w-auto"
              >
                Explore Deals
              </Button>
            </motion.div>

            {/* Address */}
            <motion.div
              variants={fadeUp}
              custom={0.5}
              initial="hidden"
              animate="visible"
              className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs text-muted-foreground"
            >
              <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span>Shop No. 9, Murtaza Terrace, Soldier Bazar No. 3, Karachi</span>
              <a
                href={getMapsDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline font-medium ml-1"
              >
                (View Map)
              </a>
            </motion.div>
          </div>

          {/* Right Column: Visual Showcase */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Outer ring */}
            <div className="relative w-80 sm:w-96 aspect-square rounded-full border-2 border-secondary/30 bg-surface/40 p-3 shadow-2xl flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-surface border border-surface-border flex flex-col items-center justify-center relative overflow-hidden group">
                {/* Food Image */}
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src="/images/gallery/chicken-tikka-pizza.jpg"
                    alt="Authentic De Pizzano Handcrafted Chicken Tikka Pizza"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  {/* Subtle vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/20" />
                </div>

                {/* Badge Overlay */}
                <div className="absolute bottom-6 inset-x-6 text-center bg-surface/90 backdrop-blur-md p-3 rounded-2xl border border-surface-border shadow-xl">
                  <h3 className="text-base sm:text-lg font-black text-foreground font-display uppercase tracking-wider">
                    DE PIZZANO ARTISANAL PIZZA
                  </h3>
                  <p className="text-[11px] text-secondary font-bold tracking-widest uppercase mt-0.5">
                    Starting from Rs. 400 (Small 9&quot;) • Rs. 750 (Regular 11&quot;)
                  </p>
                </div>

                {/* Floating Tags */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute top-4 right-4 bg-surface/95 border border-primary/40 px-3 py-1 rounded-xl text-[11px] font-bold text-foreground shadow-lg z-10 flex items-center gap-1.5"
                >
                  <Flame className="w-3.5 h-3.5 text-primary" /> Stone-Baked
                </motion.div>

                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 1 }}
                  className="absolute top-12 left-2 bg-background/95 border border-secondary/40 px-3 py-1 rounded-xl text-[11px] font-bold text-secondary shadow-lg z-10 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-secondary" /> 100% Mozzarella
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Order Mode Modal */}
      <OrderTypeModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
      />
    </section>
  );
}
