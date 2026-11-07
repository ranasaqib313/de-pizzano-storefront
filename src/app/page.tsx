import React from 'react';
import { EditorialHero } from '@/components/home/EditorialHero';
import { DealsSpotlight } from '@/components/home/DealsSpotlight';
import { HomeProductFeed } from '@/components/home/HomeProductFeed';
import { AboutSection } from '@/components/home/AboutSection';
import { LocationSection } from '@/components/home/LocationSection';

/**
 * De Pizzano Homepage Route
 * A completely bespoke, artisanal pizzeria digital experience with
 * zero visual imitation of market references.
 */
export default function HomePage() {
  return (
    <>
      {/* 1. Asymmetric Editorial Restaurant Hero (Craftsmanship & Signature Dish Spotlight) */}
      <EditorialHero />

      {/* 2. Signature Deals & Combos Showcase (Curated bundles with drinks) */}
      <DealsSpotlight />

      {/* 3. Artisanal Category Board & Kitchen Product Feed */}
      <HomeProductFeed />

      {/* 4. Heritage, Dough Fermentation & 100% Pure Mozzarella Story */}
      <AboutSection />

      {/* 5. Soldier Bazar No. 3 Branch Location & Operating Hours */}
      <LocationSection />
    </>
  );
}
