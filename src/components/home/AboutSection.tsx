import React from 'react';
import Link from 'next/link';
import { Flame, Clock, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { BUSINESS_CONFIG } from '@/data/business';

export function AboutSection() {
  const highlights = [
    {
      title: 'Soldier Bazar Branch',
      description: 'Conveniently located at Shop No. 9, Murtaza Terrace, Soldier Bazar No. 3, Karachi.',
    },
    {
      title: '50 Delicious Dishes',
      description: 'Choose from 24 signature pizza flavours, value combos, toasted sandwiches, and rich pastas.',
    },
    {
      title: 'Fast Home Delivery',
      description: 'Hot doorstep delivery across Karachi and quick pickup at our Soldier Bazar counter.',
    },
    {
      title: 'Open Daily Until Late',
      description: 'Serving hot, fresh food day and night (12:00 PM – 3:00 AM) right when cravings strike.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-background relative overflow-hidden transition-colors duration-300">
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text & Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              align="left"
              badge="About Our Kitchen"
              title="FRESH PIZZAS &amp; FAST FOOD IN KARACHI"
              subtitle="De Pizzano is your local neighborhood pizzeria in Soldier Bazar No. 3. We bake hot, fresh stone oven pizzas with 100% pure mozzarella and generous toppings."
              className="mb-8"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {highlights.map((h, i) => (
                <div
                  key={i}
                  className="bg-surface/60 border border-surface-border p-4 rounded-xl flex items-start gap-3 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground mb-1">{h.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{h.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="md"
                href="/about"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Our Kitchen Story
              </Button>

              <Button
                variant="outline"
                size="md"
                href="/locations"
                icon={<MapPin className="w-4 h-4 text-secondary" />}
              >
                Find Our Branch
              </Button>
            </div>
          </div>

          {/* Right Column: Visual Infographic Box */}
          <div className="lg:col-span-5">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 relative shadow-lg transition-colors">
              <div className="flex items-center gap-3 pb-6 border-b border-border">
                <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground uppercase font-display">
                    {BUSINESS_CONFIG.name}
                  </h3>
                  <p className="text-xs text-secondary font-semibold">
                    {BUSINESS_CONFIG.tagline}
                  </p>
                </div>
              </div>

              <div className="py-6 space-y-4 text-xs text-muted-foreground">
                <div className="flex justify-between items-center py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Primary Cuisine</span>
                  <span className="text-foreground font-medium">Pizza & Fast Food</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Active Listing Location</span>
                  <span className="text-foreground font-medium">Soldier Bazar No. 3</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Operating Hours</span>
                  <span className="text-foreground font-medium">12:00 PM – 3:00 AM (Provisional)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Online Ordering Destination</span>
                  <span className="text-secondary font-medium">Foodpanda Verified Listing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
