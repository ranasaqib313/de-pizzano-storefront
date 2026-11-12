import type { Metadata } from 'next';
import React from 'react';
import { Phone, MapPin, Clock, ExternalLink, Mail, AlertCircle, ShoppingBag } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { BUSINESS_CONFIG } from '@/data/business';
import { getMapsDirectionsUrl } from '@/lib/links';
import { ACTIVE_SOCIAL_LINKS } from '@/data/social-links';

export const metadata: Metadata = {
  title: 'Contact & Location — De Pizzano Karachi',
  description:
    'Contact De Pizzano in Soldier Bazar No. 3, Karachi. Find restaurant address, get Google Maps directions, or order online.',
};

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-20 bg-background">
      <Container size="xl">
        <SectionHeading
          badge="Direct Contact"
          title="GET IN TOUCH"
          subtitle="Reach out to De Pizzano for takeaway orders, directions to Soldier Bazar, or online delivery."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
          {/* Left Column: Direct Action Contact Cards */}
          <div className="lg:col-span-7 space-y-6">
            {/* Call Card */}
            <div className="bg-surface border border-surface-border rounded-2xl p-6 sm:p-7 hover:border-primary/50 transition-all shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                    Phone Inquiries & Orders
                  </span>
                  <h3 className="text-xl font-bold text-foreground mt-1">
                    {BUSINESS_CONFIG.contact.formattedPhone}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {BUSINESS_CONFIG.contact.disclaimer}
                  </p>
                </div>
              </div>
            </div>

            {/* Location & Directions Card */}
            <div className="bg-surface border border-surface-border rounded-2xl p-6 sm:p-7 hover:border-secondary/50 transition-all shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                    Restaurant Address
                  </span>
                  <h3 className="text-lg font-bold text-foreground mt-1">
                    {BUSINESS_CONFIG.primaryLocation.address}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {BUSINESS_CONFIG.primaryLocation.landmark}, {BUSINESS_CONFIG.primaryLocation.city}, Pakistan.
                  </p>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      href={getMapsDirectionsUrl()}
                      external
                      icon={<MapPin className="w-3.5 h-3.5 text-secondary" />}
                    >
                      Open Google Maps
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Online Ordering Card */}
            <div className="bg-surface border border-surface-border rounded-2xl p-6 sm:p-7 hover:border-primary/50 transition-all shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                    Direct Kitchen Delivery
                  </span>
                  <h3 className="text-lg font-bold text-foreground mt-1">
                    Direct Online Storefront
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Order hot pizza, creamy pasta and appetizers delivered to your home across Karachi with Cash on Delivery.
                  </p>
                  <div className="mt-4">
                    <Button
                      variant="primary"
                      size="sm"
                      href="/menu"
                      icon={<ShoppingBag className="w-3.5 h-3.5" />}
                    >
                      Browse Full Menu
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Operational Hours & Owner Verification */}
          <div className="lg:col-span-5 space-y-6">
            {/* Hours Card */}
            <div className="bg-surface border border-surface-border rounded-2xl p-6 sm:p-7">
              <div className="flex items-center gap-3 pb-4 border-b border-surface-border">
                <Clock className="w-5 h-5 text-secondary" />
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Operating Hours
                </h4>
              </div>
              <div className="pt-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Everyday (Mon – Sun)</span>
                  <span className="text-foreground font-bold">12:00 PM – 3:00 AM</span>
                </div>
                <p className="text-xs text-muted-foreground pt-2 leading-relaxed">
                  {BUSINESS_CONFIG.operatingHours.note}
                </p>
              </div>
            </div>

            {/* Social Media Notice */}
            <div className="bg-surface border border-surface-border rounded-2xl p-6 sm:p-7">
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
                Social Media Channels
              </h4>
              {ACTIVE_SOCIAL_LINKS.length > 0 ? (
                <div className="space-y-2">
                  {ACTIVE_SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-secondary hover:underline block"
                    >
                      {link.platform}: {link.handle}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Social accounts (Facebook / Instagram) remain pending owner authentication before public links are activated.
                </p>
              )}
            </div>

            {/* Owner Concept Review Notice */}
            <div className="bg-surface-elevated/70 border border-secondary/20 rounded-2xl p-6 text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-2 text-secondary font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Notice for Restaurant Management</span>
              </div>
              <p className="leading-relaxed">
                To update the primary telephone number, confirm business hours, or activate direct WhatsApp ordering, review the verification checklist in this concept&apos;s project documentation.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

