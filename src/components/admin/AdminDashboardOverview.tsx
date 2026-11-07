'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  RefreshCw,
  Phone,
  MapPin,
  Flame,
} from 'lucide-react';
import { formatCurrency } from '@/lib/format-price';
import { updateOrderStatusAction } from '@/app/actions/order-actions';
import { OrderStatusBadge } from '@/components/order/OrderStatusBadge';
import { OrderStatus } from '@/types/storefront';
import { Button } from '@/components/ui/Button';

export interface AdminOrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  orderType: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
  itemsCount: number;
}

interface AdminDashboardOverviewProps {
  initialOrders: AdminOrderRow[];
}

export function AdminDashboardOverview({ initialOrders }: AdminDashboardOverviewProps) {
  const [orders, setOrders] = useState<AdminOrderRow[]>(initialOrders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Compute metrics from actual orders
  const totalOrders = orders.length;

  const todayDateString = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(todayDateString)).length;

  const pendingOrders = orders.filter((o) =>
    ['Pending', 'Confirmed', 'Preparing'].includes(o.status)
  ).length;

  const readyOrders = orders.filter((o) =>
    ['Ready', 'Out for Delivery'].includes(o.status)
  ).length;

  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
  const cancelledOrders = orders.filter((o) => o.status === 'Cancelled').length;

  const totalSales = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const result = await updateOrderStatusAction({
        orderId,
        status: newStatus,
        note: `Status updated to ${newStatus} from kitchen dashboard.`,
      });

      if (result.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        alert(`Failed to update status: ${result.error}`);
      }
    } catch (err) {
      alert(`Error updating order status: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* 6 Key Operational Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Metric 1: Total Orders */}
        <div className="p-4 rounded-2xl bg-surface border border-surface-border">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-secondary" />
          </div>
          <div className="text-2xl font-black text-white font-display">{totalOrders}</div>
          <span className="text-[10px] text-muted-light mt-1 block">All-time recorded</span>
        </div>

        {/* Metric 2: Today's Orders */}
        <div className="p-4 rounded-2xl bg-surface border border-surface-border">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Today&apos;s Orders</span>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-white font-display">{todayOrders}</div>
          <span className="text-[10px] text-secondary font-semibold mt-1 block">Live kitchen queue</span>
        </div>

        {/* Metric 3: Active Preparation */}
        <div className="p-4 rounded-2xl bg-surface border border-amber-500/30">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">In Kitchen</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-display">{pendingOrders}</div>
          <span className="text-[10px] text-muted-light mt-1 block">Pending & Preparing</span>
        </div>

        {/* Metric 4: Dispatched / Out */}
        <div className="p-4 rounded-2xl bg-surface border border-blue-500/30">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Dispatched</span>
            <Truck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400 font-display">{readyOrders}</div>
          <span className="text-[10px] text-muted-light mt-1 block">On road / ready</span>
        </div>

        {/* Metric 5: Completed */}
        <div className="p-4 rounded-2xl bg-surface border border-emerald-500/30">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-display">{deliveredOrders}</div>
          <span className="text-[10px] text-muted-light mt-1 block">Fulfilled successfully</span>
        </div>

        {/* Metric 6: Total Revenue */}
        <div className="p-4 rounded-2xl bg-surface border border-secondary/40 shadow-glow-gold/10">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Sales Volume</span>
            <TrendingUp className="w-4 h-4 text-secondary" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-secondary font-display truncate">
            {formatCurrency(totalSales)}
          </div>
          <span className="text-[10px] text-muted-light mt-1 block">Excluding cancellations</span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-3xl bg-surface border border-surface-border overflow-hidden">
        <div className="p-6 border-b border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-elevated/40">
          <div>
            <h2 className="text-lg font-black text-white font-display uppercase tracking-wide">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Live orders received from storefront. Update statuses to broadcast changes in realtime to customer tracker.
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-surface-border hover:border-secondary/50 text-xs font-bold text-white transition-all"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5 text-secondary" />
          </Link>
        </div>

        {/* Table / List */}
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-muted-light">
              <thead className="bg-surface-elevated/80 text-[11px] uppercase tracking-wider text-muted font-bold border-b border-surface-border">
                <tr>
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Address & Area</th>
                  <th className="py-3.5 px-4">Total (PKR)</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4 text-right">Quick Transition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/60">
                {orders.slice(0, 8).map((order) => {
                  const isUpdating = updatingId === order.id;

                  return (
                    <tr key={order.id} className="hover:bg-surface-elevated/40 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-white">
                        <Link
                          href={`/track/${order.orderNumber || order.id}`}
                          target="_blank"
                          className="hover:text-secondary underline"
                          title="Open live customer tracking timeline"
                        >
                          {order.orderNumber}
                        </Link>
                        <span className="block text-[10px] text-muted font-normal mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-PK', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-white block">{order.customerName}</span>
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="text-secondary hover:underline flex items-center gap-1 mt-0.5 font-medium"
                        >
                          <Phone className="w-3 h-3" />
                          {order.customerPhone}
                        </a>
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <div className="flex items-start gap-1 text-muted-light">
                          <MapPin className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                          <span className="truncate block" title={order.deliveryAddress}>
                            {order.deliveryAddress}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted block mt-0.5 pl-4 uppercase font-semibold">
                          Mode: {order.orderType}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-bold text-secondary text-sm">
                        {formatCurrency(order.total)}
                        <span className="block text-[10px] text-muted font-normal">
                          {order.itemsCount} {order.itemsCount === 1 ? 'item' : 'items'}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <OrderStatusBadge status={order.status} />
                      </td>

                      <td className="py-4 px-4 text-right">
                        {isUpdating ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-secondary font-bold">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Saving...
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {order.status === 'Pending' && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(order.id, 'Confirmed')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 text-[11px] font-bold"
                              >
                                Confirm
                              </button>
                            )}

                            {(order.status === 'Pending' || order.status === 'Confirmed') && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(order.id, 'Preparing')}
                                className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30 text-[11px] font-bold"
                              >
                                Prepare
                              </button>
                            )}

                            {order.status === 'Preparing' && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(order.id, 'Ready')}
                                className="px-2.5 py-1 rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 border border-violet-500/30 text-[11px] font-bold"
                              >
                                Mark Ready
                              </button>
                            )}

                            {order.status === 'Ready' && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(order.id, 'Out for Delivery')}
                                className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 text-[11px] font-bold"
                              >
                                Dispatch
                              </button>
                            )}

                            {order.status === 'Out for Delivery' && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(order.id, 'Delivered')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/40 border border-emerald-500/40 text-[11px] font-bold"
                              >
                                Delivered ✓
                              </button>
                            )}

                            {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Cancel order ${order.orderNumber}?`)) {
                                    handleStatusChange(order.id, 'Cancelled');
                                  }
                                }}
                                className="px-2 py-1 rounded-lg bg-surface hover:bg-red-500/20 text-muted hover:text-red-400 border border-surface-border text-[10px] font-semibold"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-muted">
            <ShoppingBag className="w-12 h-12 text-secondary/50 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white mb-1">No Orders Yet</h4>
            <p className="text-xs">
              When customers place orders from the storefront or menu, they will appear here live.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

