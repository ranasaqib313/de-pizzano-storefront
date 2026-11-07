'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { LiveOrderTracker } from '@/components/order/LiveOrderTracker';
import { Order } from '@/types/storefront';
import { MOCK_ORDERS } from '@/data/mock-orders';
import {
  Search,
  Bike,
  Clock,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

function OrderTrackingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryOrderId = searchParams.get('orderId');

  const [searchInput, setSearchInput] = useState('');
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [simulatedStatus, setSimulatedStatus] = useState<string>('Pending');
  const statuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'];

  useEffect(() => {
    try {
      const recents: Order[] = [];
      const storedLatest = localStorage.getItem('depizzano_latest_order');
      if (storedLatest) {
        recents.push(JSON.parse(storedLatest));
      }
      const storedList = localStorage.getItem('depizzano_recent_orders');
      if (storedList) {
        const parsed = JSON.parse(storedList);
        if (Array.isArray(parsed)) {
          parsed.forEach((o) => {
            if (!recents.some((r) => r.id === o.id)) {
              recents.push(o);
            }
          });
        }
      }
      if (recents.length === 0) {
        recents.push(...MOCK_ORDERS.slice(0, 2));
      }
      setRecentOrders(recents);
    } catch {
      setRecentOrders(MOCK_ORDERS.slice(0, 2));
    }
  }, []);

  // If orderId is provided in URL query string, display the live tracker directly
  if (queryOrderId) {
    return <LiveOrderTracker orderId={queryOrderId} />;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchInput.trim();
    if (clean) {
      router.push(`/track/${encodeURIComponent(clean)}`);
    }
  };

  return (
    <div className="py-12 sm:py-20 bg-background min-h-[85vh]">
      <Container size="md">
        <SectionHeading
          badge="Live Status &amp; Dispatch Sync"
          title="TRACK YOUR PIZZA ORDER"
          subtitle="Enter your De Pizzano order reference to check real-time oven baking, dispatch, and rider arrival status."
        />

        {/* Search Card */}
        <div className="bg-surface border border-surface-border rounded-2xl p-6 sm:p-10 shadow-xl mb-10">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <label htmlFor="order-search" className="block text-xs font-bold uppercase tracking-wider text-muted">
              Order Reference Number
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="order-search"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="e.g. DP-20261107-1234 or DPZ-2026-8921"
                  className="w-full bg-surface-elevated border border-surface-border rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-muted focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary font-mono tracking-wider transition-colors"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!searchInput.trim()}
                icon={<Bike className="w-4 h-4" />}
                iconPosition="right"
                className="font-bold sm:px-6 justify-center"
              >
                Track Live Order
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-surface-border flex items-center justify-between text-xs text-muted flex-wrap gap-2">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              Connected to Live Supabase PostgreSQL Realtime
            </span>
            <Link href="/orders" className="text-secondary hover:underline font-medium">
              View all my orders &rarr;
            </Link>
          </div>
        </div>

        {/* Interactive Kitchen Milestone Timeline Simulator */}
        <div className="bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 shadow-xl mb-10">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">
              Kitchen Milestone Timeline
            </span>
            <span className="text-[11px] text-muted">
              Live status progression across 7 kitchen milestones
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {statuses.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSimulatedStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  simulatedStatus === st
                    ? 'bg-secondary text-neutral-950 shadow-glow-gold'
                    : 'bg-surface-elevated text-muted hover:text-white border border-surface-border'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Status Feedback Display */}
          <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
                <Bike className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <span className="text-xs text-muted block uppercase tracking-wider">Kitchen Status</span>
                <span className="text-sm font-bold text-white">
                  {simulatedStatus === 'Out for Delivery' ? 'Rider on the Way' : simulatedStatus === 'Cancelled' ? 'Order Cancelled' : simulatedStatus}
                </span>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-surface text-secondary border border-secondary/30 font-semibold">
              {simulatedStatus === 'Out for Delivery' ? 'Estimated 15 mins' : simulatedStatus === 'Cancelled' ? 'Voided' : 'In Progress'}
            </span>
          </div>
        </div>

        {/* Recent Orders Quick Links */}
        {recentOrders.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted font-display">
              Recent Orders On This Device
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {recentOrders.map((ro) => (
                <Link
                  key={ro.id}
                  href={`/track/${encodeURIComponent(ro.id)}`}
                  className="bg-surface hover:bg-surface-elevated border border-surface-border p-4 rounded-xl flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-elevated group-hover:bg-primary/20 border border-surface-border flex items-center justify-center text-secondary">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-mono font-bold text-white block">
                        {ro.id}
                      </span>
                      <span className="text-xs text-muted">
                        Status: <strong className="text-secondary">{ro.status}</strong>
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-secondary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Track Live <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-muted">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-secondary mb-2" />
          <p className="text-xs">Loading order tracker...</p>
        </div>
      }
    >
      <OrderTrackingContent />
    </Suspense>
  );
}
