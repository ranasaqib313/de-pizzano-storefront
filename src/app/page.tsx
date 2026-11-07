import React from 'react';
import { Hero } from '@/components/home/Hero';
import { DealsSection } from '@/components/home/DealsSection';
import { FeaturedMenu } from '@/components/home/FeaturedMenu';
import { AboutSection } from '@/components/home/AboutSection';
import { Gallery } from '@/components/home/Gallery';
import { LocationSection } from '@/components/home/LocationSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <DealsSection />
      <FeaturedMenu />
      <AboutSection />
      <Gallery />
      <LocationSection />
    </>
  );
}

