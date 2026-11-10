import React from 'react';
import { MapPin, Clock, Phone, ExternalLink, AlertCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { BUSINESS_CONFIG } from '@/data/business';
import { getMapsDirectionsUrl, getFoodpandaUrl } from '@/lib/links';

export function LocationSection() {
  const loc = BUSINESS_CONFIG.primaryLocation;

  return (
    <section className="py-20 bg-background relative transition-colors duration-300">
      <Container size="xl">
        <SectionHeading
          badge="Visit Or Order"
          title="FIND US IN SOLDIER BAZAR"
          subtitle="Stop by for takeaway pickup or order hot, freshly baked pizzas directly to your doorstep in Karachi."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Location Card */}
          <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-lg transition-colors">
            <div>
              <div className="flex items-center justify-between gap-4 pb-6 border-b border-border">
                <div>
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1">
                    Primary Branch
                  </span>
                  <h3 className="text-2xl font-bold text-foreground font-display uppercase">
                    {loc.name}
                  </h3>
                </div>
                <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full">
                  Open Daily
                </span>
              </div>

              <div className="py-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                      Full Address
                    </h4>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {loc.address}, {loc.landmark}, {loc.city}, {loc.country}.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                      Business Operating Hours
                    </h4>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {BUSINESS_CONFIG.operatingHours.daily}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {BUSINESS_CONFIG.operatingHours.note}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                      Public Listing Contact
                    </h4>
                    <span className="text-sm font-bold text-foreground mt-0.5 inline-block">
                      {BUSINESS_CONFIG.contact.formattedPhone}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {BUSINESS_CONFIG.contact.disclaimer}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="md"
                href={getMapsDirectionsUrl()}
                external
                icon={<MapPin className="w-4 h-4" />}
                className="flex-1 justify-center"
              >
                Directions on Google Maps
              </Button>
              <Button
                variant="foodpanda"
                size="md"
                href={getFoodpandaUrl()}
                external
                icon={<ExternalLink className="w-4 h-4" />}
                iconPosition="right"
                className="flex-1 justify-center"
              >
                Order on Foodpanda
              </Button>
            </div>
          </div>

          {/* Secondary Information & Architecture Readiness Card */}
          <div className="lg:col-span-5 bg-surface-elevated/70 border border-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-secondary" />
                <h4 className="text-base font-bold text-foreground uppercase tracking-wider">
                  Location Architecture
                </h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                De Pizzano operates from Soldier Bazar No. 3, servicing neighborhoods across Karachi with high-speed delivery dispatch.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
