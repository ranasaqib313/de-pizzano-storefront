import React from 'react';
import { HomePromoCarousel } from '@/components/home/HomePromoCarousel';
import { HomeProductFeed } from '@/components/home/HomeProductFeed';
import { AboutSection } from '@/components/home/AboutSection';
import { LocationSection } from '@/components/home/LocationSection';

export default function HomePage() {
  return (
    <>
      {/* 1. Wide Promotional Image Carousel (Replacing the typographic split hero) */}
      <HomePromoCarousel />

      {/* 2. Horizontal Category Pills & Product Catalog Grid */}
      <HomeProductFeed />

      {/* 3. Artisan Kitchen Craftsmanship & Story */}
      <AboutSection />

      {/* 4. Branch Location & Operating Hours */}
      <LocationSection />
    </>
  );
}
