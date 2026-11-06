'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Order } from '@/types/storefront';
import { formatPkr } from '@/lib/cart-calculations';
import { MOCK_ORDERS } from '@/data/mock-orders';
import { BUSINESS_CONFIG } from '@/data/business';
import { getPhoneLink } from '@/lib/links';
import {
  CheckCircle2,
  ShieldAlert,
  Clock,
  MapPin,
  Banknote,
  Phone,
  ArrowRight,
  ShoppingBag,
  Bike,
} from 'lucide-react';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // 1. Try to read matching order from local storage
    try {
      const storedLatest = localStorage.getItem('depizzano_latest_order');
      if (storedLatest) {
        const parsed: Order = JSON.parse(storedLatest);
        if (!orderIdParam || parsed.id === orderIdParam) {
          setOrder(parsed);
          return;
        }
      }

      const recentOrdersRaw = localStorage.getItem('depizzano_recent_orders');
      if (recentOrdersRaw) {
        const parsedList: Order[] = JSON.parse(recentOrdersRaw);
        const found = parsedList.find((o) => o.id === orderIdParam);
        if (found) {
          setOrder(found);
          return;
        }
      }
    } catch {
      // Storage parsing error fallback
    }

    // 2. Fallback to mock order
    const fallback =
      MOCK_ORDERS.find((o) => o.id === orderIdParam) || MOCK_ORDERS[0];
    setOrder(fallback);
  }, [orderIdParam]);

  if (!order) {
    return (
      <div className="py-24 text-center">
        <Container size="sm">
          <div className="animate-pulse space-y-4">
            <div className="w-16 h-16 rounded-full bg-surface mx-auto" />
            <div className="h-6 w-48 bg-surface rounded mx-auto" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 bg-background min-h-[85vh]">
      <Container size="lg">
        {/* Success Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-glow-gold">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <span className="text-xs font-bold text-secondary uppercase tracking-widest px-3 py-1 rounded-full bg-surface border border-secondary/30 inline-block mb-3">
            Demo Order Placed Successfully
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
            THANK YOU FOR YOUR ORDER!
          </h1>

          <p className="text-sm text-muted-light mt-2 leading-relaxed">
            Order Reference:{' '}
            <strong className="text-white font-mono tracking-wider">
              {order.id}
            </strong>
          </p>
        </div>

        {/* Prototype Demo Warning Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-surface border-2 border-secondary/40 shadow-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <div className="text-xs text-muted-light leading-relaxed">
            <strong className="text-white block mb-0.5 uppercase tracking-wider">
              DEMO SIMULATION NOTICE — NO REAL FOOD TRANSMITTED
            </strong>
            This order was created in simulation mode for Phase 1 stakeholder demonstration. The restaurant kitchen has not received this order. Real live order submission with Supabase backend will be implemented in Phase 2.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Order Breakdown & Next Steps */}
          <div className="md:col-span-7 space-y-6">
            {/* Ordered Dishes */}
            <div className="bg-surface border border-surface-border rounded-2xl p-5 sm:p-7 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white uppercase tracking-wider font-display pb-3 border-b border-surface-border flex items-center justify-between">
                <span>Items in this Order</span>
                <span className="text-xs text-muted">
                  {order.items.length} {order.items.length === 1 ? 'line item' : 'line items'}
                </span>
              </h2>

              <div className="divide-y divide-surface-border">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3 text-xs sm:text-sm">
                    <div>
                      <h4 className="font-bold text-white">
                        {item.quantity}x {item.name}
                      </h4>
                      {item.variant && (
                        <p className="text-xs text-secondary mt-0.5 font-medium">
                          Size: {item.variant.name}
                        </p>
                      )}
                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <p className="text-[11px] text-muted mt-0.5">
                          Addons: {item.selectedOptions.map((o) => o.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="font-extrabold text-white tabular-nums shrink-0">
                      {formatPkr(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-surface-border space-y-2 text-xs">
                <div className="flex justify-between text-muted-light">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-white tabular-nums">
                    {formatPkr(order.pricing.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-muted-light">
                  <span>Delivery ({order.deliveryAddress.area}):</span>
                  <span className="font-semibold text-white tabular-nums">
                    {formatPkr(order.pricing.deliveryFee)}
                  </span>
                </div>

                <div className="pt-3 border-t border-surface-border flex justify-between items-baseline text-sm">
                  <div>
                    <span className="font-extrabold text-white block">Total Cash on Delivery:</span>
                    <span className="text-[11px] text-secondary">Pay upon arrival to rider</span>
                  </div>
                  <span className="text-2xl font-black text-secondary tabular-nums">
                    {formatPkr(order.pricing.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps Guidance */}
            <div className="bg-surface border border-surface-border rounded-2xl p-5 sm:p-7 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-display pb-3 border-b border-surface-border flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary" />
                What Happens Next?
              </h3>

              <div className="space-y-3.5 text-xs text-muted-light leading-relaxed">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-surface-elevated border border-surface-border flex items-center justify-center font-bold text-white shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-white block">Order Confirmation Call</strong>
                    Our order desk calls you on <span className="text-secondary font-mono">{order.deliveryAddress.phone}</span> within 5 minutes to verify your address.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-surface-elevated border border-surface-border flex items-center justify-center font-bold text-white shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-white block">Oven Stone-Baking</strong>
                    Pizzas are fresh-dough tossed, topped, and stone-baked hot in our Soldier Bazar oven.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-surface-elevated border border-surface-border flex items-center justify-center font-bold text-white shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-white block">Delivery & Cash Collection</strong>
                    Rider arrives at your door. Inspect your hot meal and pay <strong className="text-secondary">{formatPkr(order.pricing.total)}</strong> in cash.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customer & Delivery Details + Actions */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-surface border border-surface-border rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display pb-2 border-b border-surface-border">
                Delivery Details
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-muted block text-[11px]">Customer:</span>
                  <span className="font-semibold text-white">{order.customer.fullName}</span>
                </div>

                <div>
                  <span className="text-muted block text-[11px]">Contact Phone:</span>
                  <span className="font-mono text-secondary font-bold">{order.customer.phone}</span>
                </div>

                <div>
                  <span className="text-muted block text-[11px]">Delivery Address:</span>
                  <p className="text-white font-medium mt-0.5">
                    {order.deliveryAddress.streetAddress}, {order.deliveryAddress.area}, {order.deliveryAddress.city}
                  </p>
                </div>

                {order.deliveryAddress.instructions && (
                  <div>
                    <span className="text-muted block text-[11px]">Special Instructions:</span>
                    <p className="text-muted-light italic mt-0.5">
                      &quot;{order.deliveryAddress.instructions}&quot;
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-surface-border flex items-center justify-between">
                  <span className="text-muted text-[11px]">Payment Mode:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <Banknote className="w-3.5 h-3.5" />
                    Cash on Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href={`/track?orderId=${order.id}`} className="block w-full">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full justify-center shadow-glow-red font-bold text-xs sm:text-sm"
                  icon={<Bike className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Track Order Timeline
                </Button>
              </Link>

              <Link href="/menu" className="block w-full">
                <Button
                  variant="outline"
                  size="md"
                  className="w-full justify-center text-xs"
                  icon={<ShoppingBag className="w-4 h-4" />}
                >
                  Order Additional Dishes
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                href={getPhoneLink()}
                className="w-full justify-center text-xs text-muted-light"
                icon={<Phone className="w-3.5 h-3.5 text-secondary" />}
              >
                Call Restaurant Desk: {BUSINESS_CONFIG.contact.formattedPhone}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <Container size="sm">
            <div className="animate-pulse space-y-4">
              <div className="w-16 h-16 rounded-full bg-surface mx-auto" />
              <div className="h-6 w-48 bg-surface rounded mx-auto" />
            </div>
          </Container>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
