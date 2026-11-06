'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Container } from '@/components/ui/Container';
import { FormField } from '@/components/forms/FormField';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { Textarea } from '@/components/forms/Textarea';
import { Button } from '@/components/ui/Button';
import { KARACHI_DELIVERY_ZONES } from '@/data/delivery-zones';
import { getDeliveryZones } from '@/lib/supabase/services/delivery-service';
import {
  formatPkr,
  validateCheckoutForm,
  CheckoutFormValues,
} from '@/lib/cart-calculations';
import { Order, OrderStatus, DeliveryZone } from '@/types/storefront';
import {
  Banknote,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Phone,
  MapPin,
  Clock,
  ShoppingBag,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const {
    items,
    itemCount,
    pricing,
    selectedZone,
    setSelectedZone,
    clearCart,
    isInitialized,
  } = useCart();

  const [zones, setZones] = useState<DeliveryZone[]>(KARACHI_DELIVERY_ZONES);
  const [zonesSource, setZonesSource] = useState<'database' | 'fallback'>('fallback');

  const [formValues, setFormValues] = useState<CheckoutFormValues>({
    fullName: '',
    phone: '',
    streetAddress: '',
    area: selectedZone?.areaName || 'Soldier Bazar No. 3',
    instructions: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch delivery zones from Supabase
  useEffect(() => {
    let isMounted = true;
    async function loadZones() {
      try {
        const res = await getDeliveryZones();
        if (isMounted && res.zones.length > 0) {
          setZones(res.zones);
          setZonesSource(res.source);
          if (selectedZone) {
            const match = res.zones.find(
              (z) => z.id === selectedZone.id || z.areaName === selectedZone.areaName
            );
            if (match) setSelectedZone(match);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch delivery zones from Supabase:', err);
      }
    }
    loadZones();
    return () => {
      isMounted = false;
    };
  }, []);

  // Pre-fill user profile info if logged in
  useEffect(() => {
    if (user || profile) {
      setFormValues((prev) => ({
        ...prev,
        fullName: prev.fullName || profile?.full_name || (user?.user_metadata?.full_name as string) || '',
        phone: prev.phone || profile?.phone || '',
      }));
    }
  }, [user, profile]);

  // Sync selected delivery zone with area
  useEffect(() => {
    if (selectedZone) {
      setFormValues((prev) => ({
        ...prev,
        area: selectedZone.areaName,
      }));
    }
  }, [selectedZone]);

  const handleInputChange = (
    field: keyof CheckoutFormValues,
    value: string
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleZoneSelect = (zoneId: string) => {
    const zone = zones.find((z) => z.id === zoneId);
    if (zone) {
      setSelectedZone(zone);
      handleInputChange('area', zone.areaName);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateCheckoutForm(formValues);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    // Generate prototype demo order
    const demoOrderId = `DPZ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    const newOrder: Order = {
      id: demoOrderId,
      createdAt: nowIso,
      customer: {
        fullName: formValues.fullName.trim(),
        email: 'customer@demo.local',
        phone: formValues.phone.trim(),
      },
      deliveryAddress: {
        fullName: formValues.fullName.trim(),
        phone: formValues.phone.trim(),
        streetAddress: formValues.streetAddress.trim(),
        area: formValues.area,
        city: 'Karachi',
        instructions: formValues.instructions?.trim() || undefined,
      },
      items: [...items],
      pricing: { ...pricing },
      paymentMethod: 'Cash on Delivery',
      status: 'Pending',
      estimatedDeliveryMinutes: 35,
      isDemoOrder: true,
      statusHistory: [
        {
          status: 'Pending',
          timestamp: nowIso,
          note: 'Cash on Delivery demo order placed.',
        },
      ],
    };

    try {
      // Store order in recent orders list
      const existing = localStorage.getItem('depizzano_recent_orders');
      const ordersList: Order[] = existing ? JSON.parse(existing) : [];
      ordersList.unshift(newOrder);
      localStorage.setItem('depizzano_recent_orders', JSON.stringify(ordersList.slice(0, 10)));
      localStorage.setItem('depizzano_latest_order', JSON.stringify(newOrder));
    } catch {
      // Storage unavailable fallback
    }

    setTimeout(() => {
      clearCart();
      router.push(`/order-confirmation?orderId=${demoOrderId}`);
    }, 600);
  };

  if (!isInitialized) {
    return (
      <div className="py-24 text-center">
        <Container size="sm">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-36 bg-surface rounded mx-auto" />
            <div className="h-32 bg-surface rounded-xl" />
          </div>
        </Container>
      </div>
    );
  }

  // If cart is empty, redirect or prompt customer
  if (items.length === 0) {
    return (
      <div className="py-20 bg-background min-h-[70vh]">
        <Container size="md">
          <div className="bg-surface border border-surface-border rounded-2xl p-8 sm:p-12 text-center shadow-xl">
            <ShoppingBag className="w-16 h-16 text-muted mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white font-display uppercase tracking-wide mb-2">
              Cannot Proceed to Checkout
            </h1>
            <p className="text-sm text-muted-light mb-6 leading-relaxed max-w-md mx-auto">
              Your cart is currently empty. Please select pizzas, sides, or beverages from our menu before checking out.
            </p>
            <Button variant="primary" size="lg" href="/menu">
              Return to Menu
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 bg-background min-h-[85vh]">
      <Container size="xl">
        {/* Header Breadcrumbs */}
        <div className="mb-8 pb-4 border-b border-surface-border">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-white transition-colors mb-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Cart
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-wide">
            Checkout — Cash on Delivery
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Enter your delivery address in Karachi. Pay in cash directly to our rider upon delivery.
          </p>
        </div>

        {/* Prototype Demo Warning Banner */}
        <div className="mb-8 p-4 rounded-xl bg-surface border border-secondary/30 flex items-start gap-3 shadow-md">
          <ShieldAlert className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <div className="text-xs text-muted-light leading-relaxed">
            <strong className="text-white block mb-0.5 uppercase tracking-wider">
              DEMO SIMULATION ENVIRONMENT
            </strong>
            This is a frontend demonstration for client evaluation. Placed orders are saved locally in your browser session for tracking tests. No real kitchen order will be dispatched to the restaurant.
          </div>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Delivery & Contact Details */}
            <div className="lg:col-span-7 space-y-6">
              {/* Customer Contact Section */}
              <div className="bg-surface border border-surface-border rounded-2xl p-5 sm:p-7 shadow-xl space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-surface-border">
                  <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary-light flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wider font-display">
                    1. Contact Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    id="checkout-name"
                    label="Full Name"
                    required
                    error={errors.fullName}
                  >
                    <Input
                      id="checkout-name"
                      placeholder="e.g., Tariq Ahmed"
                      value={formValues.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      error={!!errors.fullName}
                      autoComplete="name"
                    />
                  </FormField>

                  <FormField
                    id="checkout-phone"
                    label="Mobile Phone Number"
                    required
                    helperText="Required for order confirmation call"
                    error={errors.phone}
                  >
                    <Input
                      id="checkout-phone"
                      placeholder="e.g., 0318-2588631"
                      value={formValues.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      error={!!errors.phone}
                      autoComplete="tel"
                    />
                  </FormField>
                </div>
              </div>

              {/* Delivery Address Section */}
              <div className="bg-surface border border-surface-border rounded-2xl p-5 sm:p-7 shadow-xl space-y-5">
                <div className="flex items-center justify-between gap-2.5 pb-3 border-b border-surface-border">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <h2 className="text-base font-bold text-white uppercase tracking-wider font-display">
                      2. Karachi Delivery Address
                    </h2>
                  </div>
                  <span
                    data-testid="zones-data-source-indicator"
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      zonesSource === 'database'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${zonesSource === 'database' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    {zonesSource === 'database' ? 'Live Zones' : 'Demo Zones'}
                  </span>
                </div>

                <div className="space-y-4">
                  <FormField
                    id="checkout-area"
                    label="Delivery Neighbourhood / Zone"
                    required
                    error={errors.area}
                    helperText={`Estimated delivery: ${selectedZone?.estimatedMinutes || '30-45 mins'}`}
                  >
                    <Select
                      id="checkout-area"
                      value={selectedZone?.id}
                      onChange={(e) => handleZoneSelect(e.target.value)}
                      error={!!errors.area}
                    >
                      {zones.map((zone) => (
                        <option key={zone.id} value={zone.id} className="bg-surface text-white">
                          {zone.name} — {formatPkr(zone.fee)} delivery fee
                        </option>
                      ))}
                    </Select>
                  </FormField>

                  <FormField
                    id="checkout-address"
                    label="Complete Street Address"
                    required
                    helperText="Apartment/House #, Floor, Building name, and Street"
                    error={errors.streetAddress}
                  >
                    <Input
                      id="checkout-address"
                      placeholder="e.g., Flat 402, Murtaza Terrace, Soldier Bazar No. 3"
                      value={formValues.streetAddress}
                      onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                      error={!!errors.streetAddress}
                      autoComplete="street-address"
                    />
                  </FormField>

                  <FormField
                    id="checkout-instructions"
                    label="Special Instructions (Optional)"
                    helperText="Landmark details or special delivery requests"
                  >
                    <Textarea
                      id="checkout-instructions"
                      placeholder="e.g., Near Hamza Uniform. Call upon arrival at front gate."
                      value={formValues.instructions}
                      onChange={(e) => handleInputChange('instructions', e.target.value)}
                    />
                  </FormField>
                </div>
              </div>

              {/* Payment Method Section: Cash on Delivery Only */}
              <div className="bg-surface border border-surface-border rounded-2xl p-5 sm:p-7 shadow-xl space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-surface-border">
                  <div className="w-7 h-7 rounded-lg bg-emerald-900/30 text-emerald-400 flex items-center justify-center">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wider font-display">
                    3. Payment Method
                  </h2>
                </div>

                {/* Cash on Delivery Selection */}
                <div className="p-4 rounded-xl bg-secondary/10 border-2 border-secondary flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-secondary bg-secondary flex items-center justify-center text-background">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                        Cash on Delivery (COD)
                      </h4>
                      <p className="text-xs text-muted-light mt-0.5 leading-relaxed">
                        Pay in cash when our rider hands you your fresh order. Please keep exact change ready.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider shrink-0 bg-surface px-2.5 py-1 rounded-md border border-secondary/30">
                    Active
                  </span>
                </div>

                {/* Card Payment Notice (Excluded from Phase 1 scope) */}
                <div className="p-3.5 rounded-xl bg-surface-elevated/40 border border-surface-border/50 flex items-center justify-between text-xs text-muted">
                  <span className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-muted-dark" />
                    Debit/Credit Card & Online Payment Gateways
                  </span>
                  <span className="text-[11px] text-muted-dark italic">
                    Planned for Phase 2
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Submission */}
            <div className="lg:col-span-5 sticky top-24 space-y-5">
              <div className="bg-surface border border-surface-border rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-display pb-3 border-b border-surface-border flex items-center justify-between">
                  <span>Order Review</span>
                  <span className="text-xs text-secondary font-sans font-semibold">
                    {itemCount} {itemCount === 1 ? 'dish' : 'dishes'}
                  </span>
                </h3>

                {/* Condensed item list */}
                <div className="max-h-64 overflow-y-auto space-y-3 pr-1 divide-y divide-surface-border/50">
                  {items.map((item) => (
                    <div key={item.id} className="pt-2.5 first:pt-0 flex items-start justify-between text-xs">
                      <div className="flex-1 pr-2">
                        <span className="font-bold text-white block truncate">
                          {item.quantity}x {item.name}
                        </span>
                        {item.variant && (
                          <span className="text-[11px] text-secondary block">
                            {item.variant.name}
                          </span>
                        )}
                        {item.selectedOptions && item.selectedOptions.length > 0 && (
                          <span className="text-[10px] text-muted block">
                            +{item.selectedOptions.map((o) => o.name).join(', ')}
                          </span>
                        )}
                      </div>
                      <span className="font-semibold text-white tabular-nums">
                        {formatPkr(item.totalPrice)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing totals */}
                <div className="pt-4 border-t border-surface-border space-y-2 text-xs">
                  <div className="flex justify-between text-muted-light">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-white tabular-nums">
                      {formatPkr(pricing.subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-muted-light">
                    <span>Delivery ({selectedZone?.areaName}):</span>
                    <span className="font-semibold text-white tabular-nums">
                      {formatPkr(pricing.deliveryFee)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-surface-border flex justify-between items-baseline text-sm">
                    <span className="font-extrabold text-white">COD Amount Due:</span>
                    <span className="text-2xl font-black text-secondary tabular-nums">
                      {formatPkr(pricing.total)}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full justify-center shadow-glow-red font-bold text-sm"
                >
                  {isSubmitting ? 'Placing Demo Order...' : `Place COD Order — ${formatPkr(pricing.total)}`}
                </Button>

                <p className="text-[11px] text-muted text-center leading-relaxed">
                  By clicking Place Order, your demo order will be recorded in local simulation storage.
                </p>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}

