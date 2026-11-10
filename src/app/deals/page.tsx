import type { Metadata } from 'next';
import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MENU_ITEMS } from '@/data/menu';
import { DealsGrid } from '@/components/deals/DealsGrid';

export const metadata: Metadata = {
  title: 'Pizza Deals & Combos (10 Bundles) — De Pizzano Karachi',
  description:
    'Save with De Pizzano authentic pizza deals: 10 meal bundles featuring small, regular, and large stone-baked pizzas paired with soft drinks in Soldier Bazar, Karachi.',
};

export default function DealsPage() {
  // Extract all verified pizza deal combos
  const deals = MENU_ITEMS.filter((item) => item.category === 'pizza-deals');

  return (
    <div className="py-12 sm:py-16 bg-background">
      <Container size="xl">
        {/* Header Section */}
        <SectionHeading
          badge="Verified Value Combos"
          title="DE PIZZANO DEALS & COMBOS"
          subtitle="Enjoy our stone oven pizzas bundled with chilled soft drinks. From solo lunches to 4-pizza mega family feasts, get maximum flavour at friendly prices."
        />

        {/* Interactive Deals Grid */}
        <DealsGrid deals={deals} />
      </Container>
    </div>
  );
}

