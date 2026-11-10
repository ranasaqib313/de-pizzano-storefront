'use client';

import React from 'react';
import Link from 'next/link';
import { PriceBreakdown, DeliveryZone } from '@/types/storefront';
import { formatPkr } from '@/lib/cart-calculations';
import { Button } from '@/components/ui/Button';
import { Truck, ShieldCheck, ArrowRight, Banknote } from 'lucide-react';
import { KARACHI_DELIVERY_ZONES } from '@/data/delivery-zones';

export interface CartSummaryProps {
  pricing: PriceBreakdown;
  selectedZone?: DeliveryZone | null;
  onZoneChange?: (zone: DeliveryZone) => void;
  showCheckoutButton?: boolean;
  onCheckoutClick?: () => void;
  disabled?: boolean;
}

export function CartSummary({
  pricing,
  selectedZone,
  onZoneChange,
  showCheckoutButton = true,
  onCheckoutClick,
  disabled = false,
}: CartSummaryProps) {
  return (
    <div className="rounded-2xl bg-surface border border-surface-border p-5 sm:p-6 shadow-xl flex flex-col gap-5">
      <h3 className="text-base font-bold text-foreground uppercase tracking-wider font-display pb-3 border-b border-surface-border flex items-center justify-between">
        <span>Order Summary</span>
        <span className="text-xs text-secondary font-sans font-semibold flex items-center gap-1.5">
          <Banknote className="w-4 h-4 text-secondary" />
          Cash on Delivery
        </span>
      </h3>

      {/* Delivery Zone Selector */}
      {onZoneChange && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="delivery-zone-select" className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-secondary" />
            Delivery Destination (Karachi)
          </label>
          <div className="relative">
            <select
              id="delivery-zone-select"
              value={selectedZone?.id || ''}
              onChange={(e) => {
                const zone = KARACHI_DELIVERY_ZONES.find((z) => z.id === e.target.value);
                if (zone && onZoneChange) onZoneChange(zone);
              }}
              className="w-full text-xs rounded-xl bg-surface-elevated text-foreground border border-surface-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="" disabled>Select your delivery area...</option>
              {KARACHI_DELIVERY_ZONES.map((zone) => (
                <option key={zone.id} value={zone.id} className="bg-surface text-foreground">
                  {zone.name} — {formatPkr(zone.fee)} ({zone.estimatedMinutes})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Cost Breakdown */}
      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Items Subtotal</span>
          <span className="font-semibold text-foreground tabular-nums">
            {formatPkr(pricing.subtotal)}
          </span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span className="flex items-center gap-1">
            Delivery Fee
            <span className="text-[11px] text-muted-foreground">({selectedZone ? selectedZone.areaName : 'Standard'})</span>
          </span>
          <span className="font-semibold text-foreground tabular-nums">
            {formatPkr(pricing.deliveryFee)}
          </span>
        </div>

        {pricing.platformFee > 0 && (
          <div className="flex justify-between text-muted-foreground">
            <span>Platform Service Fee</span>
            <span className="font-semibold text-foreground tabular-nums">
              {formatPkr(pricing.platformFee)}
            </span>
          </div>
        )}

        <div className="pt-3 border-t border-surface-border flex justify-between items-baseline">
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-foreground">Payable Total</span>
            <span className="text-[11px] text-secondary">Pay upon arrival in cash (COD)</span>
          </div>
          <span className="text-2xl font-black text-secondary tabular-nums">
            {formatPkr(pricing.total)}
          </span>
        </div>
      </div>

      {/* Cash on Delivery Notice */}
      <div className="p-3 rounded-xl bg-surface-elevated border border-secondary/20 flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
        <p>
          Pay in cash when your fresh order is handed to you by our delivery rider. No card required.
        </p>
      </div>

      {/* Checkout Action */}
      {showCheckoutButton && (
        <div>
          {onCheckoutClick ? (
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center shadow-glow-red"
              onClick={onCheckoutClick}
              disabled={disabled || pricing.subtotal === 0}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Proceed to Checkout
            </Button>
          ) : (
            <Link href="/checkout" className="block w-full">
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center shadow-glow-red"
                disabled={disabled || pricing.subtotal === 0}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Proceed to Checkout
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

