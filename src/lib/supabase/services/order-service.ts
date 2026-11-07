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

export function mapDatabaseStatus(rawStatus: string): OrderStatus {
  const normalized = (rawStatus || '').toLowerCase().replace(/_/g, ' ').trim();
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
    case 'out_for_delivery':
      return 'Out for Delivery';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Pending';
  }
}

/**
 * Fetches a single order by UUID or order_number with its items, status history, and delivery zone.
 * Respects Supabase Row Level Security (RLS).
 */
export async function getOrderById(orderId: string): Promise<{
  order: Order | null;
  dbId: string | null;
  source: 'database' | 'local_session';
  error: string | null;
}> {
  if (!orderId) {
    return { order: null, dbId: null, source: 'local_session', error: 'Order ID is required' };
  }

  const cleanId = orderId.trim();

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);

      let query = supabase
        .from('orders')
        .select('*, order_items(*), order_status_history(*), delivery_zones(*)');

      if (isUuid) {
        query = query.or(`id.eq.${cleanId},order_number.eq.${cleanId}`);
      } else {
        query = query.eq('order_number', cleanId);
      }

      const { data, error } = await query.maybeSingle();

      if (data) {
        const row = data as any;
        const mappedOrder: Order = {
          id: row.order_number || row.id,
          createdAt: row.created_at,
          customer: {
            fullName: row.customer_name,
            email: '',
            phone: row.customer_phone,
          },
          deliveryAddress: {
            fullName: row.customer_name,
            phone: row.customer_phone,
            streetAddress: row.delivery_address,
            area: row.delivery_zones?.name || 'Karachi Delivery Area',
            city: 'Karachi',
            instructions: row.delivery_instructions || undefined,
          },
          items: (row.order_items || []).map((it: any) => ({
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
          statusHistory: (row.order_status_history || [])
            .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            .map((h: any) => ({
              status: mapDatabaseStatus(h.status),
              timestamp: h.created_at,
              note: h.notes || undefined,
            })),
          estimatedDeliveryMinutes: row.delivery_zones?.estimated_minutes
            ? parseInt(row.delivery_zones.estimated_minutes, 10) || 35
            : 35,
        };

        return { order: mappedOrder, dbId: row.id, source: 'database', error: null };
      }

      if (error) {
        console.warn('Database error in getOrderById:', error.message);
      }
    } catch (err) {
      console.warn('Exception in getOrderById:', err);
    }
  }

  // Fallback to local session
  if (typeof window !== 'undefined') {
    try {
      const storedLatest = localStorage.getItem('depizzano_latest_order');
      if (storedLatest) {
        const parsed: Order = JSON.parse(storedLatest);
        if (parsed.id.toLowerCase() === cleanId.toLowerCase()) {
          return { order: parsed, dbId: null, source: 'local_session', error: null };
        }
      }

      const storedRecents = localStorage.getItem('depizzano_recent_orders');
      if (storedRecents) {
        const parsedList: Order[] = JSON.parse(storedRecents);
        const found = parsedList.find((o) => o.id.toLowerCase() === cleanId.toLowerCase());
        if (found) {
          return { order: found, dbId: null, source: 'local_session', error: null };
        }
      }

      const mockFound = MOCK_ORDERS.find((o) => o.id.toLowerCase() === cleanId.toLowerCase());
      if (mockFound) {
        return { order: mockFound, dbId: null, source: 'local_session', error: null };
      }
    } catch {
      // ignore
    }
  }

  return { order: null, dbId: null, source: 'local_session', error: 'Order not found' };
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

