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
import { DeliveryZone } from '@/types/storefront';
import { placeOrderAction, PlaceOrderPayload } from '@/app/actions/order-actions';
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
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, profile, isLoading: isAuthLoading } = useAuth();
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
  const [submitError, setSubmitError] = useState<string | null>(null);
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

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validation = validateCheckoutForm(formValues);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (!user) {
      setSubmitError('You must be signed in to place an order.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: PlaceOrderPayload = {
        items: items.map((it) => ({
          productId: it.productId,
          variantId: it.variant?.id,
          variantName: it.variant?.name,
          quantity: it.quantity,
          options: it.selectedOptions?.map((o) => ({
            optionId: o.optionId,
            name: o.name,
            price: o.price,
            category: o.category,
          })),
        })),
        deliveryZoneId: selectedZone?.id,
        areaName: formValues.area,
        customerName: formValues.fullName.trim(),
        customerPhone: formValues.phone.trim(),
        deliveryAddress: formValues.streetAddress.trim(),
        deliveryInstructions: formValues.instructions?.trim() || undefined,
        paymentMethod: 'cod',
      };

      const result = await placeOrderAction(payload);

      if (!result.success || !result.orderId) {
        setSubmitError(result.error || 'Failed to place order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Order created successfully in Supabase!
      // Clear shopping cart and redirect to order confirmation page
      clearCart();
      router.push(`/order-confirmation/${result.orderId}`);
    } catch (err) {
      console.error('Checkout error:', err);
      setSubmitError(err instanceof Error ? err.message : 'An error occurred during order submission.');
      setIsSubmitting(false);
    }
  };

  if (!isInitialized || isAuthLoading) {
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

  // TASK D: Require login (AuthContext)
  if (!user) {
    return (
      <div className="py-20 bg-background min-h-[70vh] flex items-center">
        <Container size="sm">
          <div className="bg-surface border border-surface-border rounded-2xl p-8 sm:p-10 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center mx-auto mb-5 shadow-glow-red">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-wide mb-2 font-display">
              Sign In Required
            </h1>
            <p className="text-sm text-muted-light mb-6 leading-relaxed max-w-sm mx-auto">
              Please sign in to your De Pizzano account or create a new account to proceed with checkout and track your order in real time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                size="lg"
                href="/login?redirect=/checkout"
                className="w-full sm:w-auto font-bold shadow-glow-red"
              >
                Sign In to Continue
              </Button>
              <Button
                variant="outline"
                size="lg"
                href="/register?redirect=/checkout"
                className="w-full sm:w-auto font-semibold"
              >
                Create Account
              </Button>
            </div>
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
            Logged in as <strong className="text-white">{user.email}</strong>. Enter your delivery address in Karachi to place your order.
          </p>
        </div>

        {submitError && (
          <div className="mb-8 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Order Placement Error</p>
              <p className="text-xs mt-0.5 text-red-300">{submitError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Delivery Details & Payment */}
            <div className="lg:col-span-7 space-y-6">
              {/* Delivery Address Section */}
              <div className="bg-surface border border-surface-border rounded-2xl p-5 sm:p-7 shadow-lg space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-surface-border">
                  <MapPin className="w-5 h-5 text-secondary" />
                  <h2 className="text-base font-bold text-white uppercase tracking-wider font-display">
                    1. Delivery Address & Contact
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    id="fullName"
                    label="Full Name"
                    required
                    error={errors.fullName}
                  >
                    <Input
                      id="fullName"
                      value={formValues.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="e.g. Saqib Khan"
                      error={Boolean(errors.fullName)}
                      disabled={isSubmitting}
                    />
                  </FormField>

                  <FormField
                    id="phone"
                    label="Phone Number (Active for Rider)"
                    required
                    error={errors.phone}
                    helperText="Format: 03XX-XXXXXXX"
                  >
                    <Input
                      id="phone"
                      type="tel"
                      value={formValues.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="03001234567"
                      error={Boolean(errors.phone)}
                      disabled={isSubmitting}
                    />
                  </FormField>
                </div>

                <FormField
                  id="area"
                  label="Karachi Delivery Area / Zone"
                  required
                  error={errors.area}
                >
                  <Select
                    id="area"
                    value={selectedZone?.id || ''}
                    onChange={(e) => handleZoneSelect(e.target.value)}
                    disabled={isSubmitting}
                  >
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.areaName} — Delivery Rs. {zone.fee} ({zone.estimatedMinutes} mins)
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField
                  id="streetAddress"
                  label="Street Address / House / Flat No."
                  required
                  error={errors.streetAddress}
                >
                  <Input
                    id="streetAddress"
                    value={formValues.streetAddress}
                    onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                    placeholder="House / Apartment #, Street #, Landmark near Soldier Bazar"
                    error={Boolean(errors.streetAddress)}
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField
                  id="instructions"
                  label="Delivery Instructions (Optional)"
                  helperText="e.g. Ring bell twice, gate passcode, or call before arrival"
                >
                  <Textarea
                    id="instructions"
                    rows={2}
                    value={formValues.instructions || ''}
                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                    placeholder="Special instructions for rider..."
                    disabled={isSubmitting}
                  />
                </FormField>
              </div>

              {/* Payment Method Section */}
              <div className="bg-surface border border-surface-border rounded-2xl p-5 sm:p-7 shadow-lg space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-surface-border">
                  <Banknote className="w-5 h-5 text-secondary" />
                  <h2 className="text-base font-bold text-white uppercase tracking-wider font-display">
                    2. Payment Method
                  </h2>
                </div>

                {/* Cash on Delivery Selection */}
                <div className="border border-secondary bg-secondary/10 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                      Cash on Delivery (COD)
                    </h4>
                    <p className="text-xs text-muted-light mt-1 leading-relaxed">
                      Pay in exact cash directly to the De Pizzano delivery rider upon receiving your hot meal.
                    </p>
                  </div>
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
                  className="w-full justify-center shadow-glow-red font-bold text-sm cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying & Placing Order...</span>
                    </span>
                  ) : (
                    `Place COD Order — ${formatPkr(pricing.total)}`
                  )}
                </Button>

                <p className="text-[11px] text-muted text-center leading-relaxed">
                  Prices are validated server-side against our live Supabase database.
                </p>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
