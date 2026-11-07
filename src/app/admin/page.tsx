import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminDashboardOverview, AdminOrderRow } from '@/components/admin/AdminDashboardOverview';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import { mapDatabaseStatus } from '@/lib/supabase/services/order-service';
import { MOCK_ORDERS } from '@/data/mock-orders';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  let mappedOrders: AdminOrderRow[] = [];

  try {
    const adminClient = createAdminClient();
    const userClient = await createClient();
    const db = adminClient || userClient;

    const { data, error } = await (db.from('orders') as any)
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      mappedOrders = data.map((row: any) => ({
        id: row.id,
        orderNumber: row.order_number || row.id.slice(0, 8),
        customerName: row.customer_name || 'Customer',
        customerPhone: row.customer_phone || '',
        deliveryAddress: row.delivery_address || 'Soldier Bazar, Karachi',
        orderType: row.order_type || 'delivery',
        subtotal: row.subtotal || 0,
        deliveryFee: row.delivery_fee || 0,
        total: row.total || row.subtotal || 0,
        status: mapDatabaseStatus(row.status),
        paymentMethod: row.payment_method || 'Cash on Delivery',
        createdAt: row.created_at || new Date().toISOString(),
        itemsCount: Array.isArray(row.order_items) ? row.order_items.length : 1,
      }));
    } else {
      // Fallback to demonstration orders if database has 0 rows
      mappedOrders = MOCK_ORDERS.map((m) => ({
        id: m.id,
        orderNumber: m.id,
        customerName: m.customer.fullName,
        customerPhone: m.customer.phone,
        deliveryAddress: m.deliveryAddress.streetAddress,
        orderType: 'delivery',
        subtotal: m.pricing.subtotal,
        deliveryFee: m.pricing.deliveryFee,
        total: m.pricing.total,
        status: m.status,
        paymentMethod: m.paymentMethod,
        createdAt: m.createdAt,
        itemsCount: m.items.length,
      }));
    }
  } catch (err) {
    console.warn('Failed to load admin orders from database, using fallback:', err);
    mappedOrders = MOCK_ORDERS.map((m) => ({
      id: m.id,
      orderNumber: m.id,
      customerName: m.customer.fullName,
      customerPhone: m.customer.phone,
      deliveryAddress: m.deliveryAddress.streetAddress,
      orderType: 'delivery',
      subtotal: m.pricing.subtotal,
      deliveryFee: m.pricing.deliveryFee,
      total: m.pricing.total,
      status: m.status,
      paymentMethod: m.paymentMethod,
      createdAt: m.createdAt,
      itemsCount: m.items.length,
    }));
  }

  return (
    <div>
      <AdminHeader
        title="Kitchen Operations Overview"
        subtitle="Live sales metrics, active preparation queue and real-time order lifecycle transitions."
      />
      <AdminDashboardOverview initialOrders={mappedOrders} />
    </div>
  );
}

