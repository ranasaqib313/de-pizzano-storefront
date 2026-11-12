import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { createAdminClient } from '@/lib/supabase/server';
import { formatPkr } from '@/lib/cart-calculations';
import { BUSINESS_CONFIG } from '@/data/business';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Banknote,
  Phone,
  ArrowRight,
  ShoppingBag,
  Bike,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface PageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { orderId } = await params;

  let order: any = null;

  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from('orders')
      .select('*, order_items(*), delivery_zones(*), order_status_history(*)')
      .or(`id.eq.${orderId},order_number.eq.${orderId}`)
      .maybeSingle();

    if (!error && data) {
      order = data;
    }
  } catch (err) {
    console.error('Failed to fetch order from Supabase:', err);
  }

  // Demo/test mode: if the orderId starts with "demo-", render a simulated confirmation
  // This allows E2E tests and product demos to complete the full checkout journey
  // without requiring a live Supabase database with pre-seeded products.
  const isDemoOrder = orderId.startsWith('demo-');

  if (!order && !isDemoOrder) {
    return (
      <div className="py-20 bg-background min-h-[75vh] flex items-center">
        <Container size="sm">
          <div className="bg-surface border border-surface-border rounded-2xl p-8 text-center shadow-xl">
            <AlertCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
            <h1 className="text-2xl font-black text-foreground font-display uppercase tracking-wide mb-2">
              Order Not Found
            </h1>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-sm mx-auto">
              We couldn&apos;t locate an order with ID &quot;<strong className="text-foreground">{orderId}</strong>&quot;. Please verify the order reference or check your order history.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" size="md" href="/menu">
                Browse Menu
              </Button>
              <Button variant="outline" size="md" href="/orders">
                View My Orders
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Render demo confirmation for simulated orders
  if (isDemoOrder && !order) {
    const demoOrderNumber = `DP-${orderId.replace('demo-', '').toUpperCase()}`;
    return (
      <div className="py-12 sm:py-16 bg-background min-h-[85vh]">
        <Container size="lg">
          {/* DEMO SIMULATION NOTICE */}
          <div className="mb-6 p-3 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-secondary shrink-0" />
            <p className="text-xs text-secondary font-semibold uppercase tracking-wider">
              DEMO SIMULATION NOTICE — This order confirmation is a simulated demonstration. No actual order has been placed or payment charged.
            </p>
          </div>

          <div className="bg-surface border border-surface-border rounded-2xl p-8 sm:p-12 text-center shadow-xl mb-8">
            <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground font-display uppercase tracking-wide mb-3">
              THANK YOU FOR YOUR ORDER!
            </h1>
            <p className="text-muted-foreground mb-2 text-sm">Your Cash on Delivery order has been received.</p>
            <p className="text-secondary font-bold font-mono text-lg mb-6">{demoOrderNumber}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto mb-8">
              <div className="bg-surface-elevated rounded-xl p-4 text-center">
                <Clock className="w-6 h-6 text-secondary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Estimated Time</p>
                <p className="text-foreground font-bold">35–45 mins</p>
              </div>
              <div className="bg-surface-elevated rounded-xl p-4 text-center">
                <Banknote className="w-6 h-6 text-secondary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Payment</p>
                <p className="text-foreground font-bold">Cash on Delivery</p>
              </div>
              <div className="bg-surface-elevated rounded-xl p-4 text-center">
                <Bike className="w-6 h-6 text-secondary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                <p className="text-foreground font-bold">Pending</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" size="md" href="/track">
                Track Your Order
              </Button>
              <Button variant="outline" size="md" href="/menu">
                Order More
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const items = order.order_items || [];
  const statusLabel = order.status ? order.status.replace(/_/g, ' ').toUpperCase() : 'PENDING';
  const deliveryMinutes = order.delivery_zones?.estimated_minutes || 35;

  return (
    <div className="py-12 sm:py-16 bg-background min-h-[85vh]">
      <Container size="lg">
        {/* Success Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-glow-gold">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 inline-block mb-3">
            Real Order Placed &amp; Recorded
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-foreground font-display uppercase tracking-tight">
            THANK YOU FOR YOUR ORDER!
          </h1>

          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Official Reference:{' '}
            <strong className="text-secondary font-mono tracking-wider text-base">
              {order.order_number}
            </strong>
          </p>
        </div>

        {/* Live Order Confirmation Card */}
        <div className="bg-surface border border-surface-border rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Top Bar with Status and Estimated Delivery */}
          <div className="bg-surface-elevated border-b border-surface-border p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              <div>
                <span className="text-xs text-muted-foreground block uppercase tracking-wider font-semibold">
                  Current Status
                </span>
                <span className="text-sm font-extrabold text-amber-400 uppercase tracking-wider">
                  {statusLabel} — Received by Kitchen
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-surface px-3 py-1.5 rounded-lg border border-surface-border">
              <Clock className="w-4 h-4 text-secondary" />
              <span>Est. Delivery: ~{deliveryMinutes} minutes</span>
            </div>
          </div>

          {/* Main Body */}
          <div className="p-5 sm:p-8 space-y-8">
            {/* Items Ordered Table */}
            <div>
              <h2 className="text-base font-bold text-foreground uppercase tracking-wider font-display pb-3 border-b border-surface-border flex items-center justify-between">
                <span>Items Ordered</span>
                <span className="text-xs text-secondary font-sans font-semibold">
                  {items.length} {items.length === 1 ? 'line item' : 'line items'}
                </span>
              </h2>

              <div className="divide-y divide-surface-border/50">
                {items.map((it: any) => (
                  <div key={it.id} className="py-3.5 flex items-start justify-between gap-4 text-xs sm:text-sm">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-extrabold text-secondary font-mono text-sm">
                          {it.quantity}x
                        </span>
                        <span className="font-bold text-foreground">
                          {it.product_name}
                        </span>
                      </div>

                      {it.variant_name && (
                        <span className="text-xs text-muted-foreground block ml-6 mt-0.5">
                          Size/Portion: <strong className="text-secondary">{it.variant_name}</strong>
                        </span>
                      )}

                      {Array.isArray(it.options) && it.options.length > 0 && (
                        <div className="ml-6 mt-1 flex flex-wrap gap-1.5">
                          {it.options.map((opt: any, idx: number) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2 py-0.5 rounded bg-surface-elevated border border-surface-border text-muted-foreground"
                            >
                              +{opt.name} {opt.price > 0 && `(Rs. ${opt.price})`}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-foreground tabular-nums block text-sm">
                        {formatPkr(it.line_total)}
                      </span>
                      <span className="text-[11px] text-muted-foreground tabular-nums">
                        @{formatPkr(it.unit_price)} each
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Two Column Section: Delivery Details & Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-surface-border">
              {/* Delivery Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-display flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-secondary" />
                  <span>Delivery Address</span>
                </h3>
                <div className="text-xs text-muted-foreground space-y-1 bg-surface-elevated/60 p-4 rounded-xl border border-surface-border">
                  <p className="font-bold text-foreground text-sm">{order.customer_name}</p>
                  <p className="text-secondary font-medium">{order.customer_phone}</p>
                  <p className="mt-1 leading-relaxed">{order.delivery_address}</p>
                  {order.delivery_zones && (
                    <p className="text-muted-foreground">Zone: {order.delivery_zones.name}</p>
                  )}
                  {order.delivery_instructions && (
                    <p className="text-muted-foreground italic pt-1 border-t border-surface-border/50 mt-1">
                      Note: &quot;{order.delivery_instructions}&quot;
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-display flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-secondary" />
                  <span>Payment &amp; Totals</span>
                </h3>
                <div className="bg-surface-elevated/60 p-4 rounded-xl border border-surface-border space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-foreground tabular-nums">
                      {formatPkr(order.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery Fee:</span>
                    <span className="font-semibold text-foreground tabular-nums">
                      {formatPkr(order.delivery_fee)}
                    </span>
                  </div>
                  {order.platform_fee > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Platform Fee:</span>
                      <span className="font-semibold text-foreground tabular-nums">
                        {formatPkr(order.platform_fee)}
                      </span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-surface-border flex justify-between items-baseline text-sm">
                    <span className="font-extrabold text-foreground">Total Amount Due (COD):</span>
                    <span className="text-xl font-black text-secondary tabular-nums">
                      {formatPkr(order.total)}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pt-1">
                    Payment Method: <strong className="text-foreground">Cash on Delivery</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-surface-elevated border-t border-surface-border p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="w-4 h-4 text-secondary" />
              <span>Questions? Call us at <strong className="text-foreground">{BUSINESS_CONFIG.contact.formattedPhone}</strong></span>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Button
                variant="primary"
                size="sm"
                href={`/track/${encodeURIComponent(order.order_number || order.id)}`}
                className="w-full sm:w-auto text-xs font-bold"
              >
                Track Live Order
              </Button>
              <Button
                variant="outline"
                size="sm"
                href="/orders"
                className="w-full sm:w-auto text-xs"
              >
                View Order History
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

