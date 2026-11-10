import type { Metadata } from 'next';
import React from 'react';
import { MapPin, Clock, Phone, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { BUSINESS_CONFIG } from '@/data/business';
import { getMapsDirectionsUrl, getFoodpandaUrl } from '@/lib/links';

export const metadata: Metadata = {
  title: 'Location & Directions — Soldier Bazar, Karachi',
  description:
    'Find De Pizzano at Shop No. 9, Murtaza Terrace, Soldier Bazar No. 3, Karachi. Directions, contact information, provisional hours, and online ordering.',
};

export default function LocationsPage() {
  const loc = BUSINESS_CONFIG.primaryLocation;

  return (
    <div className="py-12 sm:py-20 bg-background">
      <Container size="xl">
        <SectionHeading
          badge="Restaurant Location"
          title="VISIT DE PIZZANO"
          subtitle="Stop by our Soldier Bazar kitchen for takeaway orders or request hot delivery to your location in Karachi."
        />

        {/* Primary Location Card */}
        <div className="max-w-4xl mx-auto bg-surface border border-surface-border rounded-2xl overflow-hidden shadow-card mb-16">
          <div className="bg-surface-elevated px-6 py-5 border-b border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                  Primary Verified Branch
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white font-display uppercase mt-1">
                {loc.name}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="foodpanda"
                size="sm"
                href={getFoodpandaUrl()}
                external
                icon={<ExternalLink className="w-3.5 h-3.5" />}
                iconPosition="right"
                className="text-xs"
              >
                Foodpanda Listing
              </Button>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Address */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-secondary">
                  <MapPin className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Address
                  </h4>
                </div>
                <p className="text-sm text-muted-light leading-relaxed">
                  {loc.address},<br />
                  {loc.landmark},<br />
                  {loc.city}, {loc.country}.
                </p>
              </div>

              {/* Operating Hours */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-secondary">
                  <Clock className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Public Hours
                  </h4>
                </div>
                <p className="text-sm font-semibold text-white">
                  {BUSINESS_CONFIG.operatingHours.daily}
                </p>
                <p className="text-xs text-muted-dark leading-tight">
                  {BUSINESS_CONFIG.operatingHours.note}
                </p>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-secondary">
                  <Phone className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Direct Contact
                  </h4>
                </div>
                <span className="text-sm font-bold text-white block">
                  {BUSINESS_CONFIG.contact.formattedPhone}
                </span>
                <p className="text-xs text-muted-dark leading-tight">
                  {BUSINESS_CONFIG.contact.disclaimer}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-surface-border flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="md"
                href={getMapsDirectionsUrl()}
                external
                icon={<MapPin className="w-4 h-4" />}
                className="w-full sm:w-auto justify-center"
              >
                Open Google Maps Directions
              </Button>
            </div>
          </div>
        </div>

        {/* Multi-Branch Architecture & Integrity Note */}
        <div className="max-w-4xl mx-auto bg-surface-elevated/40 border border-surface-border rounded-2xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0 mt-1">
              <AlertCircle className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white uppercase tracking-wider">
                Multi-Branch Architecture Readiness
              </h4>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                A historical directory from 2025 noted potential secondary references (Korangi, Mehmoodabad, North Karachi). In accordance with strict data integrity guidelines, unconfirmed branches are omitted from the active public directory.
              </p>
              <p className="text-xs text-muted-dark mt-2 leading-relaxed">
                The application schema has been engineered to dynamically support multi-branch selection, localized menus, and individual location ordering once verified by the restaurant management.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

