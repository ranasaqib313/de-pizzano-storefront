'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Tag, ArrowRight, Check, Flame } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/format-price';

interface ValueDeal {
  id: string;
  number: number;
  title: string;
  description: string;
  price: number;
  serves: string;
  badge: string;
  popular?: boolean;
}

const FEATURED_DEALS: ValueDeal[] = [
  {
    id: 'deal-1',
    number: 1,
    title: 'Deal 1 (Solo Deal)',
    description: '1 Small 9" Pizza + 1 Chilled 345ml Soft Drink',
    price: 400,
    serves: '1 Person',
    badge: 'Best Value Solo',
  },
  {
    id: 'deal-2',
    number: 2,
    title: 'Deal 2 (Regular Meal)',
    description: '1 Regular 11" Pizza + 1 Chilled 345ml Soft Drink',
    price: 750,
    serves: '1–2 Persons',
    badge: 'Customer Favourite',
    popular: true,
  },
  {
    id: 'deal-3',
    number: 3,
    title: 'Deal 3 (Large Feast)',
    description: '1 Large 13" Pizza + 1 Litre Soft Drink',
    price: 1000,
    serves: '2–3 Persons',
    badge: 'Popular Feast',
  },
  {
    id: 'deal-5',
    number: 5,
    title: 'Deal 5 (Family Duo)',
    description: '2 Large 13" Pizzas + 1.5 Litre Jumbo Soft Drink',
    price: 1950,
    serves: '4–6 Persons',
    badge: 'Family Special',
    popular: true,
  },
  {
    id: 'deal-9',
    number: 9,
    title: 'Deal 9 (Pizza & Wings)',
    description: '1 Regular 11" Pizza + 4 Pcs Crispy Chicken Wings + 345ml Drink',
    price: 950,
    serves: '2 Persons',
    badge: 'Wing Combo',
  },
  {
    id: 'deal-10',
    number: 10,
    title: 'Deal 10 (Mega Feast)',
    description: '1 Large 13" Pizza + 4 Pcs Wings + 1 Litre Soft Drink',
    price: 1250,
    serves: '3–4 Persons',
    badge: 'Mega Combo',
  },
];

export function DealsSection() {
  const { addItem } = useCart();
  const [addedDealId, setAddedDealId] = useState<string | null>(null);

  const handleQuickAdd = (deal: ValueDeal) => {
    addItem({
      productId: deal.id,
      name: deal.title,
      image: '/images/gallery/chicken-tikka-pizza.jpg',
      category: 'pizza-deals',
      unitPrice: deal.price,
      quantity: 1,
    });
    setAddedDealId(deal.id);
    setTimeout(() => {
      setAddedDealId(null);
    }, 1800);
  };

  return (
    <section id="pizza-deals" className="py-20 bg-surface/30 border-t border-surface-border relative">
      <Container size="xl">
        {/* Section Heading */}
        <SectionHeading
          badge="Special Value Combos"
          title="DEALS & EXCLUSIVE COMBOS"
          subtitle="Complete meals paired with chilled soft drinks at verified bundle prices. Prepared fresh to order for delivery and takeaway in Karachi."
        />

        {/* Deals Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {FEATURED_DEALS.map((deal) => {
            const isAdded = addedDealId === deal.id;

            return (
              <div
                key={deal.id}
                className={`relative flex flex-col justify-between p-6 rounded-3xl bg-surface border transition-all duration-300 hover:shadow-card hover:-translate-y-1 ${
                  deal.popular
                    ? 'border-secondary/60 shadow-glow-gold/10'
                    : 'border-surface-border hover:border-secondary/40'
                }`}
              >
                {/* Popular Pill */}
                {deal.popular && (
                  <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-secondary to-secondary-dark text-black text-[11px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-black" />
                    <span>Popular</span>
                  </div>
                )}

                {/* Card Top */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-secondary bg-surface-elevated px-2.5 py-1 rounded-xl border border-surface-border">
                      {deal.badge}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      Serves: <strong className="text-foreground">{deal.serves}</strong>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground font-display mb-2">
                    {deal.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                    {deal.description}
                  </p>
                </div>

                {/* Card Bottom */}
                <div className="pt-4 border-t border-surface-border/80 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-muted-foreground block uppercase tracking-wider font-semibold">
                      Bundle Price
                    </span>
                    <span className="text-2xl font-black text-secondary font-display">
                      {formatCurrency(deal.price)}
                    </span>
                  </div>

                  <Button
                    variant={deal.popular ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleQuickAdd(deal)}
                    icon={isAdded ? <Check className="w-4 h-4 text-white" /> : <Tag className="w-4 h-4" />}
                    className={deal.popular ? 'shadow-glow-red' : ''}
                  >
                    {isAdded ? 'Added to Cart' : 'Add to Order'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Deals Button */}
        <div className="mt-12 text-center">
          <Button
            variant="ghost"
            size="md"
            href="/menu"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Explore All 10 Pizza Deals on Menu
          </Button>
        </div>
      </Container>
    </section>
  );
}
