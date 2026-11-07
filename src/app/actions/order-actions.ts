'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';

export interface OrderItemPayload {
  productId: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  options?: {
    optionId?: string;
    name: string;
    price: number;
    category?: string;
  }[];
}

export interface PlaceOrderPayload {
  items: OrderItemPayload[];
  deliveryZoneId?: string;
  areaName?: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryInstructions?: string;
  paymentMethod?: string;
}

export interface PlaceOrderResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  subtotal?: number;
  deliveryFee?: number;
  total?: number;
  error?: string;
}

interface DbVariant {
  id: string;
  name: string;
  price_delta: number;
  is_default: boolean;
  sort_order: number;
}

interface DbProductRow {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  is_available: boolean;
  product_variants: DbVariant[];
}

/**
 * Server Action: Place Order with Server-Side Price Validation
 * Customers CANNOT manipulate prices: all amounts are recalculated from DB.
 */
export async function placeOrderAction(payload: PlaceOrderPayload): Promise<PlaceOrderResult> {
  try {
    // 1. Verify User Authentication
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: 'Please sign in to place your order.',
      };
    }

    // 2. Validate Basic Inputs
    if (!payload.items || payload.items.length === 0) {
      return {
        success: false,
        error: 'Your cart is empty. Please select items from the menu.',
      };
    }

    if (!payload.customerName?.trim()) {
      return {
        success: false,
        error: 'Customer full name is required.',
      };
    }

    if (!payload.customerPhone?.trim()) {
      return {
        success: false,
        error: 'Contact phone number is required.',
      };
    }

    if (!payload.deliveryAddress?.trim()) {
      return {
        success: false,
        error: 'Delivery street address is required.',
      };
    }

    // 3. Connect to Supabase via Admin Client
    const db = createAdminClient();

    // 4. Fetch Delivery Fee from Delivery Zone
    let deliveryFee = 150; // Default Karachi delivery fee
    let resolvedZoneId: string | null = null;

    if (payload.deliveryZoneId) {
      const { data: zone } = (await db
        .from('delivery_zones')
        .select('id, delivery_fee')
        .eq('id', payload.deliveryZoneId)
        .maybeSingle()) as { data: { id: string; delivery_fee: number } | null };

      if (zone) {
        deliveryFee = zone.delivery_fee;
        resolvedZoneId = zone.id;
      }
    } else if (payload.areaName) {
      const { data: zone } = (await db
        .from('delivery_zones')
        .select('id, delivery_fee')
        .ilike('name', `%${payload.areaName}%`)
        .maybeSingle()) as { data: { id: string; delivery_fee: number } | null };

      if (zone) {
        deliveryFee = zone.delivery_fee;
        resolvedZoneId = zone.id;
      }
    }

    // 5. Server-Side Price Recalculation (DO NOT trust frontend prices)
    let calculatedSubtotal = 0;
    const validatedOrderItems: {
      product_id: string;
      product_name: string;
      variant_name: string | null;
      options: unknown;
      unit_price: number;
      quantity: number;
      line_total: number;
    }[] = [];

    for (const item of payload.items) {
      const qty = Math.max(1, Math.min(99, Math.floor(item.quantity || 1)));

      // Fetch product by ID or Slug
      const { data: product, error: prodErr } = (await db
        .from('products')
        .select('id, name, slug, base_price, is_available, product_variants(*)')
        .or(`id.eq.${item.productId},slug.eq.${item.productId}`)
        .single()) as { data: DbProductRow | null; error: Error | null };

      if (prodErr || !product) {
        return {
          success: false,
          error: `Product "${item.productId}" is no longer available on our menu.`,
        };
      }

      if (!product.is_available) {
        return {
          success: false,
          error: `Sorry, ${product.name} is currently sold out.`,
        };
      }

      // Determine Variant Price Delta
      let variantPrice = product.base_price;
      let matchedVariantName: string | null = null;

      if (product.product_variants && product.product_variants.length > 0) {
        let matchedVariant: DbVariant | undefined;

        if (item.variantId) {
          matchedVariant = product.product_variants.find(
            (v) => v.id === item.variantId || v.name.toLowerCase() === item.variantId?.toLowerCase()
          );
        }

        if (!matchedVariant && item.variantName) {
          matchedVariant = product.product_variants.find(
            (v) => v.name.toLowerCase() === item.variantName?.toLowerCase()
          );
        }

        if (!matchedVariant) {
          // Fallback to default variant
          matchedVariant =
            product.product_variants.find((v) => v.is_default) || product.product_variants[0];
        }

        if (matchedVariant) {
          variantPrice = product.base_price + matchedVariant.price_delta;
          matchedVariantName = matchedVariant.name;
        }
      }

      // Add verified options/addons
      let optionsPrice = 0;
      const optionsSnapshot = (item.options || []).map((opt) => {
        const p = Math.max(0, Math.floor(opt.price || 0));
        optionsPrice += p;
        return {
          name: opt.name,
          price: p,
          category: opt.category || 'addon',
        };
      });

      const unitPrice = variantPrice + optionsPrice;
      const lineTotal = unitPrice * qty;
      calculatedSubtotal += lineTotal;

      validatedOrderItems.push({
        product_id: product.id,
        product_name: product.name,
        variant_name: matchedVariantName,
        options: optionsSnapshot,
        unit_price: unitPrice,
        quantity: qty,
        line_total: lineTotal,
      });
    }

    const calculatedTotal = calculatedSubtotal + deliveryFee;

    // 6. Generate Order Number: DP-YYYYMMDD-XXXX
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `DP-${yyyy}${mm}${dd}-${randomSuffix}`;

    // 7. Insert Order into public.orders
    const { data: newOrder, error: orderInsertError } = (await (db.from('orders') as any)
      .insert({
        order_number: orderNumber,
        customer_id: user.id,
        status: 'pending',
        subtotal: calculatedSubtotal,
        delivery_fee: deliveryFee,
        platform_fee: 0,
        total: calculatedTotal,
        payment_method: payload.paymentMethod || 'cod',
        customer_name: payload.customerName.trim(),
        customer_phone: payload.customerPhone.trim(),
        delivery_address: payload.deliveryAddress.trim(),
        delivery_zone_id: resolvedZoneId,
        delivery_instructions: payload.deliveryInstructions?.trim() || null,
      })
      .select('id, order_number')
      .single()) as { data: { id: string; order_number: string } | null; error: Error | null };

    if (orderInsertError || !newOrder) {
      console.error('Failed to create order in database:', orderInsertError);
      return {
        success: false,
        error: orderInsertError?.message || 'Database error creating order. Please try again.',
      };
    }

    // 8. Insert Order Items into public.order_items
    const orderItemsRows = validatedOrderItems.map((item) => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      product_name: item.product_name,
      variant_name: item.variant_name,
      options: item.options,
      unit_price: item.unit_price,
      quantity: item.quantity,
      line_total: item.line_total,
    }));

    const { error: itemsError } = (await (db.from('order_items') as any).insert(orderItemsRows)) as { error: Error | null };
    if (itemsError) {
      console.error('Failed to insert order items:', itemsError);
    }

    // 9. Insert Initial Status History into public.order_status_history
    const { error: historyError } = (await (db.from('order_status_history') as any).insert({
      order_id: newOrder.id,
      status: 'pending',
      changed_by: user.id,
      notes: 'Cash on Delivery order placed by customer via web storefront.',
    })) as { error: Error | null };

    if (historyError) {
      console.warn('Non-fatal: could not log order status history:', historyError.message);
    }

    return {
      success: true,
      orderId: newOrder.id,
      orderNumber: newOrder.order_number,
      subtotal: calculatedSubtotal,
      deliveryFee,
      total: calculatedTotal,
    };
  } catch (err) {
    console.error('Order creation exception:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred while placing order.',
    };
  }
}

/**
 * Server Action: Update Order Status (Admin / Kitchen Operations)
 */
export async function updateOrderStatusAction({
  orderId,
  status,
  note,
}: {
  orderId: string;
  status: string;
  note?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const adminClient = createAdminClient();
    const userClient = await createClient();
    const db = adminClient || userClient;

    // Normalize status to lowercase underscore format
    const dbStatus = status.toLowerCase().replace(/\s+/g, '_');

    // 1. Update status on order
    const { error: updateError } = await (db.from('orders') as any)
      .update({
        status: dbStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // 2. Insert into status history
    await (db.from('order_status_history') as any).insert({
      order_id: orderId,
      status: dbStatus,
      notes: note || `Order marked as ${status} by restaurant operations.`,
    });

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update order status',
    };
  }
}

/**
 * Server Action: Toggle Product Availability (In Stock / Sold Out)
 */
export async function toggleProductAvailabilityAction(
  productId: string,
  isAvailable: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const adminClient = createAdminClient();
    const userClient = await createClient();
    const db = adminClient || userClient;

    const { error } = await (db.from('products') as any)
      .update({ is_available: isAvailable })
      .eq('id', productId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update product availability' };
  }
}

/**
 * Server Action: Toggle Product Featured Status
 */
export async function toggleProductFeaturedAction(
  productId: string,
  isFeatured: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const adminClient = createAdminClient();
    const userClient = await createClient();
    const db = adminClient || userClient;

    const { error } = await (db.from('products') as any)
      .update({ is_featured: isFeatured })
      .eq('id', productId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update featured status' };
  }
}

/**
 * Server Action: Update Product Base Price
 */
export async function updateProductPriceAction(
  productId: string,
  basePrice: number
): Promise<{ success: boolean; error?: string }> {
  if (basePrice < 0) return { success: false, error: 'Price must be non-negative integer PKR' };

  try {
    const adminClient = createAdminClient();
    const userClient = await createClient();
    const db = adminClient || userClient;

    const { error } = await (db.from('products') as any)
      .update({ base_price: Math.round(basePrice) })
      .eq('id', productId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update product price' };
  }
}
