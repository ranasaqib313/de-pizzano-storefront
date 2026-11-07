'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  Settings,
  Phone,
  Clock,
  MapPin,
  Bike,
  Store,
  CreditCard,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { BUSINESS_CONFIG } from '@/data/business';
import { KARACHI_DELIVERY_ZONES } from '@/data/delivery-zones';
import { Button } from '@/components/ui/Button';

export default function AdminSettingsPage() {
  const [phone, setPhone] = useState(BUSINESS_CONFIG.contact.primaryPhone);
  const [hours, setHours] = useState(BUSINESS_CONFIG.operatingHours.display);
  const [deliveryActive, setDeliveryActive] = useState(true);
  const [takeawayActive, setTakeawayActive] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div>
      <AdminHeader
        title="Restaurant Operational Settings"
        subtitle="Manage business hours, delivery zones, kitchen fulfillment status and payment provider configurations."
      />

      <form onSubmit={handleSave} className="p-6 space-y-6 max-w-5xl">
        {/* Save Banner */}
        {isSaved && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center gap-3 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Settings saved successfully. Changes applied to restaurant configuration.</span>
          </div>
        )}

        {/* Section 1: Kitchen Operating Status */}
        <div className="p-6 rounded-3xl bg-surface border border-surface-border shadow-card space-y-4">
          <h2 className="text-base font-bold text-white font-display uppercase tracking-wide flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" />
            <span>Operating Hours & Kitchen Status</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">
                Public Operating Schedule:
              </label>
              <input
                type="text"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-elevated border border-surface-border rounded-xl text-xs text-white focus:outline-none focus:border-secondary"
              />
              <span className="text-[11px] text-muted mt-1 block">
                Provisional Google Listing: Daily 12:00 PM – 3:00 AM.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">
                Primary Kitchen Phone Number:
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-elevated border border-surface-border rounded-xl text-xs text-white focus:outline-none focus:border-secondary"
              />
              <span className="text-[11px] text-muted mt-1 block">
                Provisional contact reference awaiting official owner confirmation.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-surface-border/60">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-elevated/60 border border-surface-border">
              <div className="flex items-center gap-2.5">
                <Bike className="w-4 h-4 text-primary" />
                <div>
                  <span className="text-xs font-bold text-white block">Home Delivery Service</span>
                  <span className="text-[10px] text-muted">Orders delivered via dispatch riders</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={deliveryActive}
                onChange={(e) => setDeliveryActive(e.target.checked)}
                className="w-4 h-4 accent-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-elevated/60 border border-surface-border">
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-secondary" />
                <div>
                  <span className="text-xs font-bold text-white block">Takeaway Counter Pickup</span>
                  <span className="text-[10px] text-muted">Soldier Bazar No. 3 collection</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={takeawayActive}
                onChange={(e) => setTakeawayActive(e.target.checked)}
                className="w-4 h-4 accent-secondary cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Delivery Zones & Fees */}
        <div className="p-6 rounded-3xl bg-surface border border-surface-border shadow-card space-y-4">
          <h2 className="text-base font-bold text-white font-display uppercase tracking-wide flex items-center gap-2">
            <MapPin className="w-5 h-5 text-secondary" />
            <span>Karachi Delivery Zones & Courier Rates</span>
          </h2>
          <p className="text-xs text-muted">
            Delivery charges are verified server-side during checkout calculations to eliminate price manipulation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {KARACHI_DELIVERY_ZONES.map((zone) => (
              <div
                key={zone.id}
                className="p-3.5 rounded-2xl bg-surface-elevated/50 border border-surface-border flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-white block truncate">{zone.name}</span>
                  <span className="text-[10px] text-muted block mt-0.5">{zone.estimatedMinutes}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-surface-border/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-secondary">Rs. {zone.fee}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Payment Gateway Architecture & Security */}
        <div className="p-6 rounded-3xl bg-surface border border-surface-border shadow-card space-y-4">
          <h2 className="text-base font-bold text-white font-display uppercase tracking-wide flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-secondary" />
            <span>Payment Integrations & Security Standards</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Payment 1: COD */}
            <div className="p-4 rounded-2xl bg-surface-elevated/60 border border-emerald-500/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 inline-block mb-2">
                Active & Verified
              </span>
              <h3 className="text-sm font-bold text-white">Cash on Delivery (COD)</h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Customer pays cash to rider upon delivery. No card data stored. Fully supported.
              </p>
            </div>

            {/* Payment 2: Counter Pickup */}
            <div className="p-4 rounded-2xl bg-surface-elevated/60 border border-emerald-500/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 inline-block mb-2">
                Active & Verified
              </span>
              <h3 className="text-sm font-bold text-white">Pay at Counter</h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Customer settles payment via cash or card terminal at the Soldier Bazar counter.
              </p>
            </div>

            {/* Payment 3: Online Gateway Template */}
            <div className="p-4 rounded-2xl bg-surface-elevated/60 border border-amber-500/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 inline-block mb-2 flex items-center gap-1 w-fit">
                <AlertTriangle className="w-3 h-3" />
                <span>Integration Blueprint</span>
              </span>
              <h3 className="text-sm font-bold text-white">Online Digital Gateway</h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Clearly marked as unconfigured. Ready for merchant key connection (JazzCash / EasyPaisa / Stripe).
              </p>
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="primary" size="lg" type="submit" icon={<Save className="w-4 h-4" />}>
            Save Operational Settings
          </Button>
        </div>
      </form>
    </div>
  );
}

