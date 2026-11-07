import type { Metadata } from 'next';
import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MenuGrid } from '@/components/menu/MenuGrid';
import { MENU_ITEMS } from '@/data/menu';
import { getMenuProducts } from '@/lib/supabase/services/menu-service';
import { BUSINESS_CONFIG } from '@/data/business';
import { AlertCircle, ExternalLink, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getFoodpandaUrl, getPhoneLink } from '@/lib/links';

export const metadata: Metadata = {
  title: 'Full Menu (26 Items) — Pizzas, Pastas & Fast Food',
  description:
    'Explore all 26 researched menu items of De Pizzano, Soldier Bazar No. 3, Karachi: Regular & Special Pizzas, Starters, Pastas, Sandwiches, and Loaded Pizza Fries.',
};

export default async function MenuPage() {
  const { items, source } = await getMenuProducts();

  return (
    <div className="py-12 sm:py-16 bg-background">
      <Container size="xl">
        {/* Header Section */}
        <SectionHeading
          badge="Complete Researched Menu"
          title="DE PIZZANO MENU"
          subtitle="Explore all 26 dishes spanning our signature regular and special pizzas, toasted sandwiches, rich pastas, and savoury starters."
        />

        {/* Pricing Notice & External Ordering Banner */}
        <div className="mb-10 p-5 rounded-2xl bg-surface border border-secondary/20 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Indicative Pricing Notice
                </h4>
                <p className="text-xs text-muted mt-1 leading-relaxed max-w-3xl">
                  Prices listed below reflect public directory rates (Foodpanda) and are labelled as starting prices where applicable. Direct restaurant takeaway prices may differ and will be updated upon official owner confirmation.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
              <Button
                variant="foodpanda"
                size="sm"
                href={getFoodpandaUrl()}
                external
                icon={<ExternalLink className="w-3.5 h-3.5" />}
                iconPosition="right"
                className="w-full sm:w-auto text-xs"
              >
                Order on Foodpanda
              </Button>
              <Button
                variant="outline"
                size="sm"
                href={getPhoneLink()}
                icon={<Phone className="w-3.5 h-3.5 text-secondary" />}
                className="w-full sm:w-auto text-xs"
              >
                Call: {BUSINESS_CONFIG.contact.formattedPhone}
              </Button>
            </div>
          </div>
        </div>

        {/* Interactive Menu Grid with Filters and Search */}
        <MenuGrid initialItems={items} initialSource={source} />
      </Container>
    </div>
  );
}

