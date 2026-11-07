'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Phone,
  MapPin,
  Clock,
  Eye,
  Check,
  X,
  Truck,
  Flame,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { AdminOrderRow } from './AdminDashboardOverview';
import { OrderStatusBadge } from '@/components/order/OrderStatusBadge';
import { OrderStatus } from '@/types/storefront';
import { formatCurrency } from '@/lib/format-price';
import { updateOrderStatusAction } from '@/app/actions/order-actions';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface AdminOrderManagementProps {
  initialOrders: AdminOrderRow[];
}

const STATUS_FILTERS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All Orders', value: 'all' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Confirmed', value: 'Confirmed' },
  { label: 'Preparing', value: 'Preparing' },
  { label: 'Ready', value: 'Ready' },
  { label: 'Out for Delivery', value: 'Out for Delivery' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Cancelled', value: 'Cancelled' },
];

export function AdminOrderManagement({ initialOrders }: AdminOrderManagementProps) {
  const [orders, setOrders] = useState<AdminOrderRow[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderRow | null>(null);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.includes(q) ||
        order.deliveryAddress.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatusAction({
        orderId,
        status: newStatus,
        note: `Order marked as ${newStatus} by Kitchen Operations Staff.`,
      });

      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } else {
        alert(`Failed to update order: ${res.error}`);
      }
    } catch (err) {
      alert(`Error updating order status: ${err instanceof Error ? err.message : 'Unknown'}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Controls: Filter Pills & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-3xl bg-surface border border-surface-border">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none no-scrollbar">
          {STATUS_FILTERS.map((f) => {
            const count =
              f.value === 'all'
                ? orders.length
                : orders.filter((o) => o.status === f.value).length;
            const isActive = statusFilter === f.value;

            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setStatusFilter(f.value)}
                className={cn(
                  'shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer select-none',
                  isActive
                    ? 'bg-primary text-white border-primary shadow-glow-red scale-[1.02]'
                    : 'bg-surface-elevated text-muted-light border-surface-border hover:bg-surface-elevated/80 hover:text-white'
                )}
              >
                <span>{f.label}</span>
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                    isActive ? 'bg-white/20 text-white' : 'bg-surface text-muted'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, customer, phone..."
            className="w-full pl-10 pr-4 py-2 bg-surface-elevated border border-surface-border rounded-xl text-xs text-white placeholder-muted focus:outline-none focus:border-secondary transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Orders List / Table */}
      <div className="rounded-3xl bg-surface border border-surface-border overflow-hidden shadow-card">
        <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between text-xs text-muted">
          <span>
            Showing <strong className="text-white font-bold">{filteredOrders.length}</strong> of{' '}
            <strong className="text-white font-bold">{orders.length}</strong> total orders
          </span>
          <span className="text-secondary font-semibold">
            All updates propagate live to customer tracking screens
          </span>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-muted-light">
              <thead className="bg-surface-elevated/80 text-[11px] uppercase tracking-wider text-muted font-bold border-b border-surface-border">
                <tr>
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Delivery Area & Mode</th>
                  <th className="py-3.5 px-4">Order Total</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Workflow Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/60">
                {filteredOrders.map((order) => {
                  const isUpdating = updatingId === order.id;

                  return (
                    <tr key={order.id} className="hover:bg-surface-elevated/40 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-white">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="hover:text-secondary underline flex items-center gap-1.5 text-left"
                        >
                          <Eye className="w-3.5 h-3.5 text-secondary shrink-0" />
                          <span>{order.orderNumber}</span>
                        </button>
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
                          Mode: {order.orderType} • {order.paymentMethod}
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
                            <RefreshCw className="w-3 h-3 animate-spin" /> Updating...
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {order.status === 'Pending' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(order.id, 'Confirmed')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 text-[11px] font-bold"
                              >
                                Confirm
                              </button>
                            )}

                            {(order.status === 'Pending' || order.status === 'Confirmed') && (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(order.id, 'Preparing')}
                                className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30 text-[11px] font-bold"
                              >
                                In Kitchen
                              </button>
                            )}

                            {order.status === 'Preparing' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(order.id, 'Ready')}
                                className="px-2.5 py-1 rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 border border-violet-500/30 text-[11px] font-bold"
                              >
                                Ready
                              </button>
                            )}

                            {order.status === 'Ready' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(order.id, 'Out for Delivery')}
                                className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 text-[11px] font-bold"
                              >
                                Dispatch
                              </button>
                            )}

                            {order.status === 'Out for Delivery' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(order.id, 'Delivered')}
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
                                    handleUpdateStatus(order.id, 'Cancelled');
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
            <h4 className="text-base font-bold text-white mb-1">No Orders Match Filter</h4>
            <p className="text-xs">
              Try switching your status filter or clearing your search keywords.
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-surface border border-surface-border rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-surface-border">
              <div>
                <span className="text-[11px] font-bold text-secondary uppercase tracking-widest block">
                  Order Details
                </span>
                <h3 className="text-xl font-black text-white font-mono mt-0.5">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-surface-elevated text-muted hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="p-4 rounded-2xl bg-surface-elevated space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted">Customer Name:</span>
                <span className="font-bold text-white">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Phone Number:</span>
                <a href={`tel:${selectedOrder.customerPhone}`} className="font-bold text-secondary hover:underline">
                  {selectedOrder.customerPhone}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Delivery Address:</span>
                <span className="font-medium text-white max-w-[220px] text-right truncate">
                  {selectedOrder.deliveryAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Payment:</span>
                <span className="font-bold text-emerald-400">{selectedOrder.paymentMethod}</span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 rounded-2xl bg-surface-elevated/60 border border-surface-border space-y-2 text-xs">
              <div className="flex justify-between text-muted">
                <span>Subtotal:</span>
                <span className="text-white font-medium">{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Delivery Fee:</span>
                <span className="text-white font-medium">{formatCurrency(selectedOrder.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-surface-border">
                <span className="text-white">Total Amount:</span>
                <span className="text-secondary font-black text-base">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Tracking Link */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <Link
                href={`/track/${selectedOrder.orderNumber || selectedOrder.id}`}
                target="_blank"
                className="text-xs text-secondary hover:underline font-semibold"
              >
                Open Live Tracking Page ↗
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

