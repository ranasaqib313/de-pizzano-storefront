import type { Metadata } from 'next';
import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MenuGrid } from '@/components/menu/MenuGrid';
import { MENU_ITEMS } from '@/data/menu';
import { getMenuProducts, getMenuCategories } from '@/lib/supabase/services/menu-service';
import { BUSINESS_CONFIG } from '@/data/business';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Full Menu — 24 Pizza Flavours, Pastas, Sandwiches & Sides',
  description:
    'Explore authentic menu items of De Pizzano, Soldier Bazar No. 3, Karachi: 24 Pizza Flavours, Stuffed Crust Specials, Sandwiches, Pastas, and Sides.',
};

export default async function MenuPage() {
  const [{ items, source }, { categories }] = await Promise.all([
    getMenuProducts(),
    getMenuCategories(),
  ]);

  // Remove all Combo Deals from /menu: only show individual dishes
  const menuOnlyItems = items.filter((item) => item.category !== 'pizza-deals');
  const menuOnlyCategories = categories.filter((cat) => cat.id !== 'pizza-deals');

  return (
    <div className="py-12 sm:py-16 bg-background">
      <Container size="xl">
        {/* Header Section */}
        <SectionHeading
          badge="A La Carte Menu"
          title="DE PIZZANO MENU"
          subtitle="Explore all handmade dishes: 24 signature pizza flavours, cheese stuffed crusts, toasted sandwiches, rich pastas, and savoury sides. (For meal combos, visit our Deals page)."
        />

        {/* Pricing Notice & External Ordering Banner */}
        <div className="mb-10 p-5 rounded-2xl bg-surface border border-secondary/20 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Fresh Kitchen Menu &amp; Direct Ordering
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-3xl">
                  Order online with fast home delivery across Karachi or visit our takeaway counter at Soldier Bazar No. 3. All orders include server-verified pricing and fresh preparation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Menu Grid with Filters and Search */}
        <MenuGrid initialItems={menuOnlyItems} initialCategories={menuOnlyCategories} initialSource={source} />
      </Container>
    </div>
  );
}

