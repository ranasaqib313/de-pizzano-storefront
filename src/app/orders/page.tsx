'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { OrderStatusBadge } from '@/components/order/OrderStatusBadge';
import { Button } from '@/components/ui/Button';
import { Order } from '@/types/storefront';
import { MOCK_ORDERS } from '@/data/mock-orders';
import { formatPkr } from '@/lib/cart-calculations';
import {
  ShoppingBag,
  Clock,
  MapPin,
  Banknote,
  ArrowRight,
  ShieldAlert,
  Calendar,
} from 'lucide-react';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  useEffect(() => {
    try {
      const storedRecents = localStorage.getItem('depizzano_recent_orders');
      if (storedRecents) {
        const parsed: Order[] = JSON.parse(storedRecents);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge recent orders with mock orders, avoiding duplicate IDs
          const seenIds = new Set(parsed.map((o) => o.id));
          const uniqueMocks = MOCK_ORDERS.filter((m) => !seenIds.has(m.id));
          setOrders([...parsed, ...uniqueMocks]);
        }
      }
    } catch {
      // Fallback to MOCK_ORDERS
    }
  }, []);

  return (
    <div className="py-12 sm:py-16 bg-background min-h-[85vh]">
      <Container size="xl">
        <SectionHeading
          badge="Customer Portal (Phase 1 UI)"
          title="MY ORDERS"
          subtitle="View past restaurant orders, review receipts, and track live Cash on Delivery status."
        />

        {/* Prototype Demo Warning Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-surface border border-secondary/30 flex items-start gap-3 shadow-md max-w-4xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <div className="text-xs text-muted-light leading-relaxed">
            <strong className="text-white block mb-0.5 uppercase tracking-wider">
              SAMPLE ORDER HISTORY DEMO
            </strong>
            This screen illustrates the future customer order history interface. Orders placed in this session appear alongside mock past orders. Real customer accounts and authenticated order history will connect with Supabase in Phase 2.
          </div>
        </div>

        {/* Orders List */}
        <div className="max-w-4xl mx-auto space-y-5">
          {orders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-PK', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={order.id}
                className="bg-surface border border-surface-border hover:border-surface-highlight rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-200"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-center text-secondary shrink-0">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm sm:text-base">
                          {order.id}
                        </span>
                        <OrderStatusBadge status={order.status} size="sm" />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-muted" />
                          {formattedDate}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <Banknote className="w-3 h-3" />
                          Cash on Delivery
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-muted block">Order Total:</span>
                    <span className="text-lg font-black text-secondary tabular-nums">
                      {formatPkr(order.pricing.total)}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="py-3.5 flex flex-wrap gap-2 text-xs">
                  {order.items.map((item) => (
                    <span
                      key={item.id}
                      className="px-2.5 py-1 rounded-lg bg-surface-elevated border border-surface-border text-muted-light"
                    >
                      {item.quantity}x {item.name}
                      {item.variant ? ` (${item.variant.name})` : ''}
                    </span>
                  ))}
                </div>

                {/* Footer with actions and address */}
                <div className="pt-3 border-t border-surface-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-muted">
                    <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span className="truncate max-w-xs sm:max-w-sm">
                      {order.deliveryAddress.streetAddress}, {order.deliveryAddress.area}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Link href={`/track?orderId=${order.id}`}>
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-xs font-bold"
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                        iconPosition="right"
                      >
                        Track Status
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back to menu button */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" href="/menu">
            Back to Restaurant Menu
          </Button>
        </div>
      </Container>
    </div>
  );
}
