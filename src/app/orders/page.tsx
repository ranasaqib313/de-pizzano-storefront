'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { OrderStatusBadge } from '@/components/order/OrderStatusBadge';
import { Button } from '@/components/ui/Button';
import { Order } from '@/types/storefront';
import { formatPkr } from '@/lib/cart-calculations';
import { getCustomerOrders } from '@/lib/supabase/services/order-service';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  MapPin,
  Banknote,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Database,
  Lock,
  User,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [dataSource, setDataSource] = useState<'database' | 'local_session'>('local_session');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await getCustomerOrders();
      setOrders(res.orders);
      setDataSource(res.source);
      if (res.error) {
        setErrorMessage(res.error);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to fetch order history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading) {
      fetchOrders();
    }
  }, [isAuthLoading, user]);

  return (
    <div className="py-12 sm:py-16 bg-background min-h-[85vh]">
      <Container size="xl">
        <SectionHeading
          badge="Customer Portal & Orders"
          title="MY ORDERS"
          subtitle="View verified order history, review item receipts, and track live Cash on Delivery status."
        />

        {/* Database & RLS Protection Status Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-surface border border-secondary/30 flex items-start justify-between gap-4 shadow-md max-w-4xl mx-auto flex-wrap sm:flex-nowrap">
          <div className="flex items-start gap-3">
            {dataSource === 'database' ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Database className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            )}
            <div className="text-xs text-muted-light leading-relaxed">
              <strong className="text-white block mb-0.5 uppercase tracking-wider">
                {dataSource === 'database'
                  ? 'SUPABASE POSTGRESQL (RLS SECURED)'
                  : 'CLIENT SESSION & DEMO ORDERS'}
              </strong>
              {dataSource === 'database'
                ? 'Your order records are secured with PostgreSQL Row Level Security (RLS). Only your authenticated account can access this data.'
                : 'Displaying local session orders. Sign in to sync your order history with Supabase.'}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isAuthenticated && (
              <Link href="/login?redirect=/orders">
                <Button variant="primary" size="sm" className="text-xs font-bold" icon={<Lock className="w-3.5 h-3.5" />}>
                  Sign In
                </Button>
              </Link>
            )}
            <button
              type="button"
              onClick={fetchOrders}
              disabled={isLoading}
              className="p-2 rounded-lg bg-surface-elevated text-muted hover:text-white border border-surface-border transition-colors cursor-pointer"
              title="Refresh Orders"
              aria-label="Refresh Orders"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="max-w-4xl mx-auto space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface border border-surface-border rounded-2xl p-6 animate-pulse space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-36 bg-surface-elevated rounded" />
                  <div className="h-5 w-24 bg-surface-elevated rounded" />
                </div>
                <div className="h-8 w-3/4 bg-surface-elevated rounded" />
                <div className="h-4 w-1/2 bg-surface-elevated rounded" />
              </div>
            ))}
          </div>
        ) : errorMessage ? (
          /* Error State */
          <div className="bg-surface border border-primary/40 rounded-2xl p-8 text-center max-w-md mx-auto shadow-xl">
            <AlertCircle className="w-12 h-12 text-primary mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Could Not Load Orders</h3>
            <p className="text-xs text-muted mb-6">{errorMessage}</p>
            <Button variant="primary" size="sm" onClick={fetchOrders}>
              Try Again
            </Button>
          </div>
        ) : orders.length > 0 ? (
          /* Orders List */
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
        ) : (
          /* Empty Orders State */
          <div className="bg-surface border border-surface-border rounded-2xl p-10 sm:p-14 text-center max-w-lg mx-auto shadow-xl">
            <ShoppingBag className="w-14 h-14 text-muted mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2 font-display uppercase tracking-wider">
              No Orders Found
            </h2>
            <p className="text-xs text-muted max-w-sm mx-auto mb-6 leading-relaxed">
              You haven&apos;t placed any orders with this account yet. Browse our menu to build your first meal.
            </p>
            <Button variant="primary" size="md" href="/menu">
              Explore Restaurant Menu
            </Button>
          </div>
        )}

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
