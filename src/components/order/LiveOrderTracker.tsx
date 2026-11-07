'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { OrderStatusBadge } from '@/components/order/OrderStatusBadge';
import { OrderStatusTimeline } from '@/components/order/OrderStatusTimeline';
import { Button } from '@/components/ui/Button';
import { Order, OrderStatus, OrderStatusHistoryItem } from '@/types/storefront';
import { formatPkr } from '@/lib/cart-calculations';
import { BUSINESS_CONFIG } from '@/data/business';
import { getPhoneLink } from '@/lib/links';
import { getOrderById, mapDatabaseStatus } from '@/lib/supabase/services/order-service';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import {
  Clock,
  MapPin,
  Banknote,
  Phone,
  ShoppingBag,
  ArrowLeft,
  Check,
  Copy,
  RefreshCw,
  Radio,
  Wifi,
  WifiOff,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface LiveOrderTrackerProps {
  orderId: string;
}

export function LiveOrderTracker({ orderId }: LiveOrderTrackerProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [dbId, setDbId] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'database' | 'local_session'>('database');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLiveSyncActive, setIsLiveSyncActive] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date>(new Date());
  const [copied, setCopied] = useState(false);

  // Fetch order data
  const fetchOrderDetails = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const res = await getOrderById(orderId);
      if (res.order) {
        setOrder(res.order);
        setDbId(res.dbId);
        setDataSource(res.source);
        setErrorMessage(null);
        setLastSyncedAt(new Date());
      } else {
        if (isInitial) {
          setErrorMessage(res.error || 'Order not found or access restricted.');
        }
      }
    } catch (err) {
      if (isInitial) {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to fetch order details');
      }
    } finally {
      if (isInitial) setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [orderId]);

  // Initial fetch
  useEffect(() => {
    fetchOrderDetails(true);
  }, [fetchOrderDetails]);

  // Fallback 15-second polling
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchOrderDetails(false);
    }, 15000);

    return () => clearInterval(pollInterval);
  }, [fetchOrderDetails]);

  // Supabase Realtime Subscription
  useEffect(() => {
    if (!isSupabaseConfigured() || !dbId) {
      return;
    }

    const supabase = createClient();
    const channelName = `realtime-order-${dbId}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${dbId}`,
        },
        (payload) => {
          if (payload.new && (payload.new as any).status) {
            const rawStatus = (payload.new as any).status;
            const updatedStatus = mapDatabaseStatus(rawStatus);

            setOrder((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                status: updatedStatus,
              };
            });
            setLastSyncedAt(new Date());

            // Silently re-fetch to capture updated status history
            fetchOrderDetails(false);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_status_history',
          filter: `order_id=eq.${dbId}`,
        },
        (payload) => {
          if (payload.new) {
            const newHistoryItem: OrderStatusHistoryItem = {
              status: mapDatabaseStatus((payload.new as any).status),
              timestamp: (payload.new as any).created_at,
              note: (payload.new as any).notes || undefined,
            };

            setOrder((prev) => {
              if (!prev) return null;
              const currentHistory = prev.statusHistory || [];
              // Prevent duplicates
              const exists = currentHistory.some(
                (h) => h.status === newHistoryItem.status && h.timestamp === newHistoryItem.timestamp
              );
              if (exists) return prev;

              return {
                ...prev,
                statusHistory: [...currentHistory, newHistoryItem],
              };
            });
            setLastSyncedAt(new Date());
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsLiveSyncActive(true);
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setIsLiveSyncActive(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
      setIsLiveSyncActive(false);
    };
  }, [dbId, fetchOrderDetails]);

  const copyOrderNumber = () => {
    if (order?.id) {
      navigator.clipboard.writeText(order.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="py-16 sm:py-24 bg-background min-h-[85vh]">
        <Container size="lg">
          <div className="text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-surface-border text-secondary flex items-center justify-center mx-auto animate-spin">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider font-display">
              Connecting to Live Order Sync...
            </h2>
            <p className="text-xs text-muted">
              Fetching real-time order status and verified dispatch timeline.
            </p>
          </div>
        </Container>
      </div>
    );
  }

  // Not found or RLS access denied state
  if (errorMessage || !order) {
    return (
      <div className="py-16 sm:py-24 bg-background min-h-[85vh] flex items-center">
        <Container size="sm">
          <div className="bg-surface border border-surface-border rounded-2xl p-8 sm:p-10 text-center shadow-xl">
            <AlertCircle className="w-14 h-14 text-secondary mx-auto mb-4" />
            <h1 className="text-2xl font-black text-white font-display uppercase tracking-wide mb-2">
              Order Not Found
            </h1>
            <p className="text-xs sm:text-sm text-muted-light mb-6 leading-relaxed max-w-sm mx-auto">
              We couldn&apos;t locate an order matching &quot;
              <strong className="text-white font-mono">{orderId}</strong>&quot;, or it belongs to another account under PostgreSQL Row Level Security (RLS).
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" size="md" href="/orders">
                View My Orders
              </Button>
              <Button variant="outline" size="md" href="/menu">
                Browse Restaurant Menu
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const estimatedMinutes = order.estimatedDeliveryMinutes || 35;
  const formattedTime = new Date(order.createdAt).toLocaleTimeString('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="py-10 sm:py-16 bg-background min-h-[90vh]">
      <Container size="xl">
        {/* Top Navigation & Live Sync Status Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-light hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Orders</span>
          </Link>

          {/* TASK C: Real-time Updates Visual Indicator */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all shadow-sm',
                isLiveSyncActive
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-surface border-surface-border text-muted-light'
              )}
            >
              <span className="relative flex h-2 w-2">
                {isLiveSyncActive && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={cn(
                    'relative inline-flex rounded-full h-2 w-2',
                    isLiveSyncActive ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400'
                  )}
                />
              </span>
              <span>
                {isLiveSyncActive ? 'Live Sync Active' : 'Polling Active (15s)'}
              </span>
              <span className="text-[10px] text-muted hidden md:inline">
                • {lastSyncedAt.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>

            <button
              type="button"
              onClick={() => fetchOrderDetails(false)}
              disabled={isRefreshing}
              className="p-1.5 rounded-xl bg-surface border border-surface-border text-muted hover:text-white transition-colors disabled:opacity-50"
              title="Refresh order status"
              aria-label="Refresh order status"
            >
              <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin text-secondary')} />
            </button>
          </div>
        </div>

        {/* Hero Order Header Banner */}
        <div className="bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-surface-border">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Official Order Reference:
                </span>
                <span className="text-lg sm:text-2xl font-black font-mono text-secondary tracking-wider">
                  {order.id}
                </span>
                <button
                  type="button"
                  onClick={copyOrderNumber}
                  className="p-1.5 rounded-lg bg-surface-elevated hover:bg-surface-border text-muted hover:text-white transition-colors"
                  title="Copy Order Number"
                  aria-label="Copy Order Number"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <OrderStatusBadge status={order.status} size="md" />
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-light mt-2 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-secondary" />
                  Placed: {formattedDate} at {formattedTime}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Banknote className="w-3.5 h-3.5" />
                  Cash on Delivery
                </span>
              </div>
            </div>

            {/* Estimated Delivery Time Box */}
            <div className="bg-surface-elevated/80 border border-secondary/20 rounded-xl p-4 sm:px-6 sm:py-3.5 text-left md:text-right flex md:flex-col justify-between items-center md:items-end">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-muted font-bold block">
                  Estimated Delivery
                </span>
                <span className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
                  {estimatedMinutes} - {estimatedMinutes + 10} Mins
                </span>
              </div>
              <span className="text-[10px] text-secondary font-medium mt-0.5">
                Fresh Stone-Baked in Soldier Bazar
              </span>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="pt-4 flex items-center justify-between text-xs text-muted flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {dataSource === 'database'
                  ? 'Real-time database sync connected with PostgreSQL Row Level Security.'
                  : 'Displaying demo order. Live Supabase database connected.'}
              </span>
            </div>
            <span className="text-[11px] text-muted">
              Auto-updating via Supabase Realtime
            </span>
          </div>
        </div>

        {/* 2-Column Layout: Visual Timeline (Left) & Order Details Summary (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* TASK B: Visual Order Timeline Stepper */}
          <div className="lg:col-span-7 bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-6 border-b border-surface-border mb-6">
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display">
                  Live Dispatch Timeline
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Track each milestone from kitchen stone-baking to rider arrival.
                </p>
              </div>

              <OrderStatusBadge status={order.status} size="sm" />
            </div>

            {/* Stepper Component */}
            <OrderStatusTimeline
              currentStatus={order.status}
              history={order.statusHistory}
              className="py-2"
            />
          </div>

          {/* TASK D: Order Details Summary & Support */}
          <div className="lg:col-span-5 space-y-6">
            {/* Items & Financial Summary */}
            <div className="bg-surface border border-surface-border rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display pb-4 border-b border-surface-border flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-secondary" />
                  Order Summary
                </span>
                <span className="text-xs font-mono text-muted-light">
                  {order.items.reduce((acc, it) => acc + it.quantity, 0)} Items
                </span>
              </h3>

              {/* Line Items List */}
              <div className="py-4 divide-y divide-surface-border/60 max-h-[360px] overflow-y-auto pr-1">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {item.quantity}x
                          </span>
                          <span className="text-xs font-semibold text-white truncate">
                            {item.name}
                          </span>
                        </div>

                        {item.variant && (
                          <span className="text-[11px] text-muted block mt-0.5">
                            Size: {item.variant.name}
                          </span>
                        )}

                        {item.selectedOptions && item.selectedOptions.length > 0 && (
                          <div className="text-[10px] text-muted-light mt-0.5 flex flex-wrap gap-1">
                            {item.selectedOptions.map((opt, i) => (
                              <span key={i} className="bg-surface-elevated px-1.5 py-0.5 rounded text-muted-light">
                                + {opt.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <span className="text-xs font-mono font-bold text-secondary shrink-0">
                        {formatPkr(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="pt-4 border-t border-surface-border space-y-2 text-xs">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="font-mono text-muted-light">
                    {formatPkr(order.pricing.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Delivery Fee</span>
                  <span className="font-mono text-muted-light">
                    {order.pricing.deliveryFee > 0 ? formatPkr(order.pricing.deliveryFee) : 'FREE'}
                  </span>
                </div>
                {order.pricing.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono">
                      -{formatPkr(order.pricing.discount)}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-surface-border flex justify-between items-center text-sm font-bold text-white">
                  <span>Grand Total</span>
                  <span className="text-lg font-black font-mono text-secondary">
                    {formatPkr(order.pricing.total)}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center justify-between pt-1">
                  <span>Payment Method:</span>
                  <span className="font-semibold">Cash on Delivery</span>
                </div>
              </div>
            </div>

            {/* Delivery Address Details */}
            <div className="bg-surface border border-surface-border rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display pb-3 border-b border-surface-border flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary" />
                Delivery Information
              </h3>

              <div className="pt-3 space-y-2 text-xs">
                <div>
                  <span className="text-muted block text-[10px] uppercase tracking-wider font-semibold">
                    Recipient
                  </span>
                  <span className="text-white font-medium">
                    {order.deliveryAddress.fullName || order.customer.fullName}
                  </span>
                </div>

                <div>
                  <span className="text-muted block text-[10px] uppercase tracking-wider font-semibold">
                    Contact Phone
                  </span>
                  <a
                    href={`tel:${order.deliveryAddress.phone || order.customer.phone}`}
                    className="text-secondary hover:underline font-mono"
                  >
                    {order.deliveryAddress.phone || order.customer.phone}
                  </a>
                </div>

                <div>
                  <span className="text-muted block text-[10px] uppercase tracking-wider font-semibold">
                    Delivery Address
                  </span>
                  <p className="text-muted-light leading-relaxed mt-0.5">
                    {order.deliveryAddress.streetAddress}
                    {order.deliveryAddress.area && `, ${order.deliveryAddress.area}`}
                    {order.deliveryAddress.city && `, ${order.deliveryAddress.city}`}
                  </p>
                </div>

                {order.deliveryAddress.instructions && (
                  <div className="pt-1">
                    <span className="text-muted block text-[10px] uppercase tracking-wider font-semibold">
                      Delivery Instructions
                    </span>
                    <p className="text-muted-light italic mt-0.5">
                      &quot;{order.deliveryAddress.instructions}&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* TASK D: "Need Help?" Card with Phone Number */}
            <div className="bg-surface-elevated/70 border border-secondary/20 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-secondary shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                    Need Help With Your Order?
                  </h4>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">
                    Have special requests or need to check on your rider? Call our direct kitchen dispatch line.
                  </p>
                </div>
              </div>

              <div className="pt-1">
                <Button
                  variant="primary"
                  size="md"
                  href={getPhoneLink()}
                  external
                  icon={<Phone className="w-4 h-4" />}
                  className="w-full justify-center font-bold"
                >
                  Call Kitchen: {BUSINESS_CONFIG.contact.formattedPhone}
                </Button>
              </div>

              <div className="text-[11px] text-muted text-center flex items-center justify-center gap-3">
                <span>Hours: {BUSINESS_CONFIG.operatingHours.display}</span>
                <span>•</span>
                <span>Soldier Bazar, Karachi</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

