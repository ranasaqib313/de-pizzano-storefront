import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { MENU_ITEMS, MENU_CATEGORIES } from '@/data/menu';
import { MenuCard } from '@/components/menu/MenuCard';

export function FeaturedMenu() {
  // Select featured items across categories
  const featuredItems = MENU_ITEMS.filter((item) => item.featured).slice(0, 6);

  return (
    <section className="py-20 bg-surface/40 border-y border-surface-border">
      <Container size="xl">
        {/* Section Header */}
        <SectionHeading
          badge="Signature Selections"
          title="Crowd Favourites"
          subtitle="Explore some of De Pizzano's most requested pizzas, savoury pasta, and signature loaded fries."
        />

        {/* Category Pills Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {MENU_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/menu`}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-surface border border-surface-border text-muted-light hover:text-white hover:border-secondary/50 hover:bg-surface-elevated transition-all"
            >
              {category.label} ({category.itemCount})
            </Link>
          ))}
        </div>

        {/* Featured Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>

        {/* Bottom CTA to View All 26 Items */}
        <div className="mt-14 text-center">
          <Button
            variant="primary"
            size="lg"
            href="/menu"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Explore Complete Menu (50 Dishes)
          </Button>
          <p className="mt-3 text-xs text-muted">
            All prices shown are indicative public listing rates awaiting official owner confirmation.
          </p>
        </div>
      </Container>
    </section>
  );
}

