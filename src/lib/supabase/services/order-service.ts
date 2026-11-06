import { createClient, isSupabaseConfigured } from '../client';
import { Order, OrderStatus } from '@/types/storefront';
import { MOCK_ORDERS } from '@/data/mock-orders';

export interface DbOrderWithItems {
  id: string;
  order_number: string;
  customer_id: string | null;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  platform_fee: number;
  total: number;
  payment_method: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_instructions: string | null;
  created_at: string;
  order_items: {
    id: string;
    product_id: string | null;
    product_name: string;
    variant_name: string | null;
    options: unknown;
    unit_price: number;
    quantity: number;
    line_total: number;
  }[];
  order_status_history?: {
    status: string;
    created_at: string;
    notes: string | null;
  }[];
}

/**
 * Fetches customer orders from Supabase using Row Level Security (RLS).
 * Supabase RLS automatically filters rows to `auth.uid() = customer_id`.
 */
export async function getCustomerOrders(): Promise<{
  orders: Order[];
  source: 'database' | 'local_session';
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return getLocalSessionOrders();
  }

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return getLocalSessionOrders();
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*), order_status_history(*)')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) {
        return {
          orders: [],
          source: 'database',
          error: error.message,
        };
      }
      // If user has 0 orders in database, check if any local demo orders exist
      return getLocalSessionOrders();
    }

    const mappedOrders: Order[] = (data as unknown as DbOrderWithItems[]).map((row) => ({
      id: row.order_number || row.id,
      createdAt: row.created_at,
      customer: {
        fullName: row.customer_name,
        email: user.email || 'customer@depizzano.demo',
        phone: row.customer_phone,
      },
      deliveryAddress: {
        fullName: row.customer_name,
        phone: row.customer_phone,
        streetAddress: row.delivery_address,
        area: 'Soldier Bazar No. 3',
        city: 'Karachi',
        instructions: row.delivery_instructions || undefined,
      },
      items: (row.order_items || []).map((it) => ({
        id: it.id,
        productId: it.product_id || it.product_name,
        name: it.product_name,
        image: '/images/menu/chicken-tikka-pizza.jpg',
        category: 'regular-pizza',
        unitPrice: it.unit_price,
        quantity: it.quantity,
        totalPrice: it.line_total,
        variant: it.variant_name ? { id: it.variant_name, name: it.variant_name, price: it.unit_price } : undefined,
        selectedOptions: Array.isArray(it.options) ? it.options : [],
      })),
      pricing: {
        subtotal: row.subtotal,
        deliveryFee: row.delivery_fee,
        platformFee: row.platform_fee || 0,
        discount: 0,
        total: row.total,
      },
      paymentMethod: 'Cash on Delivery',
      status: mapDatabaseStatus(row.status),
      isDemoOrder: false,
      statusHistory: (row.order_status_history || []).map((h) => ({
        status: mapDatabaseStatus(h.status),
        timestamp: h.created_at,
        note: h.notes || undefined,
      })),
    }));

    return {
      orders: mappedOrders,
      source: 'database',
      error: null,
    };
  } catch (err) {
    return {
      orders: [],
      source: 'database',
      error: err instanceof Error ? err.message : 'Unknown database error',
    };
  }
}

function mapDatabaseStatus(rawStatus: string): OrderStatus {
  const normalized = rawStatus?.toLowerCase().replace(/_/g, ' ');
  switch (normalized) {
    case 'pending':
      return 'Pending';
    case 'confirmed':
      return 'Confirmed';
    case 'preparing':
      return 'Preparing';
    case 'ready':
      return 'Ready';
    case 'out for delivery':
      return 'Out for Delivery';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Pending';
  }
}

function getLocalSessionOrders(): {
  orders: Order[];
  source: 'local_session';
  error: null;
} {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('depizzano_recent_orders');
      if (stored) {
        const parsed: Order[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const seen = new Set(parsed.map((o) => o.id));
          const uniqueMocks = MOCK_ORDERS.filter((m) => !seen.has(m.id));
          return { orders: [...parsed, ...uniqueMocks], source: 'local_session', error: null };
        }
      }
    }
  } catch {
    // Ignore storage parse error
  }
  return { orders: MOCK_ORDERS, source: 'local_session', error: null };
}

