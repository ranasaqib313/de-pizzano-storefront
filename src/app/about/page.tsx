import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { Flame, MapPin, Clock, Utensils, CheckCircle2, AlertTriangle, ArrowRight, Phone, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { BUSINESS_CONFIG } from '@/data/business';
import { MENU_CATEGORIES } from '@/data/menu';
import { getFoodpandaUrl, getMapsDirectionsUrl } from '@/lib/links';

export const metadata: Metadata = {
  title: 'About De Pizzano — Restaurant Concept & Story',
  description:
    'Learn about De Pizzano in Soldier Bazar No. 3, Karachi: our pizza specialities, fast food offerings, and this modern web concept created for owner review.',
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20 bg-background">
      <Container size="xl">
        {/* Page Header */}
        <SectionHeading
          badge="Restaurant Profile & Vision"
          title="ABOUT DE PIZZANO"
          subtitle="A neighbourhood pizza and fast food eatery in Soldier Bazar No. 3, Karachi — dedicated to flavorful pizzas, pasta, sandwiches and savoury bites."
        />

        {/* Narrative & Concept Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          <div className="lg:col-span-7 space-y-6 text-muted-foreground leading-relaxed text-sm sm:text-base">
            <h3 className="text-2xl font-bold text-foreground font-display uppercase tracking-wide">
              Culinary Focus & Local Roots
            </h3>
            <p>
              Located in the heart of Soldier Bazar No. 3 near Hamza Uniform, De Pizzano has built a reputation for offering a flavour-packed menu that blends classic Italian-style crusts with vibrant Pakistani spice palettes.
            </p>
            <p>
              From aromatic Chicken Tikka and Chicken Fajita pizzas to innovative specialties like the Pizzano Creamy Shawarma and Pizzano Malai Classic, each dish is formulated to satisfy late-night appetites and family gatherings alike.
            </p>
            <p>
              In addition to pizza, the kitchen crafts loaded baked pastas, oven-toasted sandwiches, and signature pizza fries, serving both local takeaway visitors and delivery patrons across central Karachi.
            </p>

            {/* Factual Highlights List */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surface border border-surface-border">
                <span className="text-secondary font-bold block text-sm mb-1">
                  Established Hub
                </span>
                <span className="text-xs text-muted-foreground">
                  Soldier Bazar No. 3, Karachi, Pakistan.
                </span>
              </div>
              <div className="p-4 rounded-xl bg-surface border border-surface-border">
                <span className="text-primary font-bold block text-sm mb-1">
                  Menu Selection
                </span>
                <span className="text-xs text-muted-foreground">
                  26 distinct items across 6 culinary categories.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Restaurant Quality & Heritage */}
          <div className="lg:col-span-5 bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-surface-border">
              <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center">
                <Flame className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h4 className="text-base font-bold text-foreground uppercase tracking-wider">
                  Our Quality Promise
                </h4>
                <p className="text-xs text-muted-foreground">Authentic Flavours &amp; Fresh Ingredients</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Every pizza and fast-food specialty is freshly baked to order using premium mozzarella, custom dough, and signature spice blends created specifically for our Karachi patrons.
            </p>

            <div className="space-y-3 text-xs text-foreground">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Stone-baked crusts with 100% pure dairy mozzarella.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Handcrafted fresh dough and slow-simmered sauces daily.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Prompt doorstep delivery and warm counter takeaway service.</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                href="/menu"
                className="w-full justify-center text-xs"
              >
                Explore Full Menu
              </Button>
            </div>
          </div>
        </div>

        {/* Menu Categories Breakdown */}
        <div className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
              Complete Offerings
            </span>
            <h3 className="text-3xl font-extrabold text-foreground font-display uppercase tracking-tight mt-1">
              Six Specialized Categories
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MENU_CATEGORIES.map((category) => (
              <div
                key={category.id}
                className="bg-surface border border-surface-border rounded-xl p-5 hover:border-secondary/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-foreground text-base uppercase font-display">
                    {category.label}
                  </h4>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-surface-elevated text-secondary rounded-full">
                    {category.itemCount} Items
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {category.description}
                </p>
                <div className="mt-4 pt-3 border-t border-surface-border/50">
                  <Link
                    href={`/menu`}
                    className="text-xs font-semibold text-secondary hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    <span>View items</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-surface via-surface-elevated to-surface border border-surface-border text-center">
          <h3 className="text-2xl sm:text-3xl font-black text-foreground font-display uppercase tracking-wide mb-3">
            Ready To Experience De Pizzano?
          </h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-6">
            Browse our complete 26-item menu or order directly through the official Foodpanda delivery channel.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="primary" size="lg" href="/menu">
              Explore The Menu
            </Button>
            <Button
              variant="foodpanda"
              size="lg"
              href={getFoodpandaUrl()}
              external
              icon={<ExternalLink className="w-4 h-4" />}
              iconPosition="right"
            >
              Order on Foodpanda
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

