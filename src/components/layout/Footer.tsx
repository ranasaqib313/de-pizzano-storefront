import React from 'react';
import Link from 'next/link';
import { Flame, Phone, MapPin, Clock, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { MAIN_NAV_ITEMS } from '@/data/navigation';
import { BUSINESS_CONFIG } from '@/data/business';
import { getMapsDirectionsUrl, getFoodpandaUrl } from '@/lib/links';

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border text-muted-foreground mt-auto">
      {/* Main Footer Content */}
      <div className="py-12 md:py-16">
        <Container size="xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-black tracking-wider text-foreground font-display uppercase">
                  DE PIZZANO
                </span>
              </Link>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                {BUSINESS_CONFIG.tagline}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Serving premium pizza, loaded pasta, signature sandwiches, and savoury starters in Soldier Bazar, Karachi.
              </p>
              <div className="pt-2">
                <Button
                  variant="foodpanda"
                  size="sm"
                  href={getFoodpandaUrl()}
                  external
                  icon={<ExternalLink className="w-3.5 h-3.5" />}
                  iconPosition="right"
                >
                  Order on Foodpanda
                </Button>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div>
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 border-l-2 border-primary pl-2.5">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-sm">
                {MAIN_NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact & Hours */}
            <div>
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 border-l-2 border-secondary pl-2.5">
                Hours & Contact
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-foreground font-medium block">
                      {BUSINESS_CONFIG.operatingHours.daily}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {BUSINESS_CONFIG.operatingHours.note}
                    </span>
                  </div>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-secondary shrink-0" />
                  <div>
                    <span className="text-foreground font-medium">
                      {BUSINESS_CONFIG.contact.formattedPhone}
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      Provisional Google listing
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 4: Location & Directions */}
            <div>
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 border-l-2 border-primary pl-2.5">
                Soldier Bazar Location
              </h4>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed flex items-start gap-2">
                <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>
                  {BUSINESS_CONFIG.primaryLocation.address},{' '}
                  {BUSINESS_CONFIG.primaryLocation.landmark},{' '}
                  {BUSINESS_CONFIG.primaryLocation.city}, Pakistan.
                </span>
              </p>
              <Button
                variant="outline"
                size="sm"
                href={getMapsDirectionsUrl()}
                external
                icon={<MapPin className="w-3.5 h-3.5 text-secondary" />}
                className="w-full text-xs justify-center"
              >
                Get Directions in Google Maps
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Copyright & Legal Bar */}
      <div className="bg-background py-5 border-t border-border text-xs text-muted-foreground text-center">
        <Container size="xl" className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} De Pizzano. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
