'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { OrderStatusBadge } from '@/components/order/OrderStatusBadge';
import { OrderStatusTimeline } from '@/components/order/OrderStatusTimeline';
import { Button } from '@/components/ui/Button';
import { Order, OrderStatus } from '@/types/storefront';
import { MOCK_ORDERS } from '@/data/mock-orders';
import { formatPkr } from '@/lib/cart-calculations';
import { BUSINESS_CONFIG } from '@/data/business';
import { getPhoneLink } from '@/lib/links';
import {
  Search,
  ShieldAlert,
  Clock,
  MapPin,
  Banknote,
  Phone,
  Sliders,
  CheckCircle,
  ShoppingBag,
} from 'lucide-react';

const ALL_ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Ready',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || 'DPZ-2026-8921';

  const [searchQuery, setSearchQuery] = useState(initialOrderId);
  const [activeOrder, setActiveOrder] = useState<Order>(MOCK_ORDERS[0]);
  const [simulatedStatus, setSimulatedStatus] = useState<OrderStatus>(MOCK_ORDERS[0].status);

  // Load from local storage or mock orders on mount
  useEffect(() => {
    let matchedOrder: Order | null = null;

    try {
      // 1. Check latest order
      const storedLatest = localStorage.getItem('depizzano_latest_order');
      if (storedLatest) {
        const parsed: Order = JSON.parse(storedLatest);
        if (parsed.id.toLowerCase() === initialOrderId.toLowerCase()) {
          matchedOrder = parsed;
        }
      }

      // 2. Check recent orders
      if (!matchedOrder) {
        const storedRecents = localStorage.getItem('depizzano_recent_orders');
        if (storedRecents) {
          const parsedList: Order[] = JSON.parse(storedRecents);
          const found = parsedList.find(
            (o) => o.id.toLowerCase() === initialOrderId.toLowerCase()
          );
          if (found) matchedOrder = found;
        }
      }
    } catch {
      // Storage fallback
    }

    // 3. Check mock orders
    if (!matchedOrder) {
      matchedOrder =
        MOCK_ORDERS.find(
          (o) => o.id.toLowerCase() === initialOrderId.toLowerCase()
        ) || MOCK_ORDERS[0];
    }

    setActiveOrder(matchedOrder);
    setSimulatedStatus(matchedOrder.status);
    setSearchQuery(matchedOrder.id);
  }, [initialOrderId]);

  // Handle order search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    if (!query) return;

    // Check localStorage recents
    let found: Order | undefined;
    try {
      const storedRecents = localStorage.getItem('depizzano_recent_orders');
      if (storedRecents) {
        const list: Order[] = JSON.parse(storedRecents);
        found = list.find((o) => o.id.toUpperCase() === query);
      }
    } catch {
      // Ignore
    }

    if (!found) {
      found = MOCK_ORDERS.find((o) => o.id.toUpperCase() === query);
    }

    if (found) {
      setActiveOrder(found);
      setSimulatedStatus(found.status);
    } else {
      // Create dynamically mocked order for whatever ID was searched
      const dynamicOrder: Order = {
        ...MOCK_ORDERS[0],
        id: query,
        status: 'Preparing',
      };
      setActiveOrder(dynamicOrder);
      setSimulatedStatus('Preparing');
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-background min-h-[85vh]">
      <Container size="xl">
        <SectionHeading
          badge="Order Status & Dispatch Tracker"
          title="TRACK YOUR PIZZA ORDER"
          subtitle="Real-time status progression for Cash on Delivery orders in Soldier Bazar, Karachi."
        />

        {/* Prototype Demo Warning Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-surface border border-secondary/30 flex items-start gap-3 shadow-md">
          <ShieldAlert className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <div className="text-xs text-muted-light leading-relaxed">
            <strong className="text-white block mb-0.5 uppercase tracking-wider">
              PHASE 1 SIMULATION NOTICE
            </strong>
            This is a frontend demonstration tracker. Use the status switcher below to test all 7 lifecycle states (Pending, Confirmed, Preparing, Ready, Out for Delivery, Delivered, and Cancelled). Live Supabase real-time subscriptions will connect in Phase 2.
          </div>
        </div>

        {/* Search Bar & Order Selector */}
        <div className="max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSearchSubmit} className="flex gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Enter Order Number (e.g. DPZ-2026-8921)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-surface-elevated text-white text-sm border border-surface-border pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button variant="primary" size="md" type="submit" className="shrink-0 font-bold">
              Track Order
            </Button>
          </form>

          {/* Quick select sample order chips */}
          <div className="mt-3 flex items-center justify-center gap-2 flex-wrap text-xs text-muted">
            <span>Try sample orders:</span>
            {MOCK_ORDERS.map((mock) => (
              <button
                key={mock.id}
                type="button"
                onClick={() => {
                  setActiveOrder(mock);
                  setSimulatedStatus(mock.status);
                  setSearchQuery(mock.id);
                }}
                className={`px-2.5 py-1 rounded-lg border font-mono transition-colors cursor-pointer ${
                  activeOrder.id === mock.id
                    ? 'border-secondary bg-secondary/15 text-secondary font-bold'
                    : 'border-surface-border bg-surface text-muted-light hover:text-white'
                }`}
              >
                {mock.id}
              </button>
            ))}
          </div>
        </div>

        {/* Live Status Simulation Control */}
        <div className="mb-10 p-5 rounded-2xl bg-surface border border-surface-border shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-secondary" />
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Test Lifecycle State (Client Demo Control)
                </h3>
                <p className="text-[11px] text-muted">
                  Click any stage to simulate the customer timeline in real time:
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {ALL_ORDER_STATUSES.map((status) => {
                const isActive = simulatedStatus === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSimulatedStatus(status)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-secondary text-background font-black shadow-sm ring-2 ring-secondary/50'
                        : 'bg-surface-elevated text-muted-light hover:text-white border border-surface-border'
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Tracking Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual Timeline */}
          <div className="lg:col-span-7 bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-surface-border">
              <div>
                <span className="text-xs text-muted block">Current Status</span>
                <div className="mt-1">
                  <OrderStatusBadge status={simulatedStatus} size="lg" />
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-muted block">Estimated Delivery</span>
                <span className="text-sm font-extrabold text-white flex items-center justify-end gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-secondary" />
                  30–45 mins
                </span>
              </div>
            </div>

            {/* Visual Timeline Component */}
            <OrderStatusTimeline
              currentStatus={simulatedStatus}
              history={activeOrder.statusHistory}
            />

            {/* Support hotline */}
            <div className="pt-4 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-muted">
                Need to amend delivery directions or toppings?
              </span>
              <Button
                variant="outline"
                size="sm"
                href={getPhoneLink()}
                icon={<Phone className="w-3.5 h-3.5 text-secondary" />}
                className="text-xs"
              >
                Call: {BUSINESS_CONFIG.contact.formattedPhone}
              </Button>
            </div>
          </div>

          {/* Right Column: Order Details Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface border border-surface-border rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-display">
                  Order Details
                </h3>
                <span className="text-xs font-mono font-bold text-secondary">
                  {activeOrder.id}
                </span>
              </div>

              {/* Items summary */}
              <div className="space-y-3 divide-y divide-surface-border/50 text-xs">
                {activeOrder.items.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-start justify-between">
                    <div>
                      <span className="font-bold text-white">
                        {item.quantity}x {item.name}
                      </span>
                      {item.variant && (
                        <span className="text-[11px] text-secondary block">
                          Size: {item.variant.name}
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

              {/* Delivery and Customer details */}
              <div className="pt-3 border-t border-surface-border space-y-2 text-xs">
                <div>
                  <span className="text-muted block text-[11px]">Customer:</span>
                  <span className="text-white font-semibold">{activeOrder.customer.fullName}</span>
                </div>

                <div>
                  <span className="text-muted block text-[11px]">Delivery Location:</span>
                  <span className="text-white font-medium">
                    {activeOrder.deliveryAddress.streetAddress}, {activeOrder.deliveryAddress.area}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-muted">Payment:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Banknote className="w-3.5 h-3.5" />
                    Cash on Delivery
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-surface-border text-sm font-extrabold text-white">
                  <span>Payable Total:</span>
                  <span className="text-xl font-black text-secondary tabular-nums">
                    {formatPkr(activeOrder.pricing.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <Link href="/menu" className="w-full">
                <Button variant="outline" size="md" className="w-full justify-center text-xs" icon={<ShoppingBag className="w-4 h-4" />}>
                  Place Another Order
                </Button>
              </Link>
              <Link href="/orders" className="w-full">
                <Button variant="ghost" size="sm" className="w-full justify-center text-xs text-muted-light">
                  View Full Order History
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function OrderTrackingPage() {
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
      <OrderTrackingContent />
    </Suspense>
  );
}

