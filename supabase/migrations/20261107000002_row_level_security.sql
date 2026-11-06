-- ==============================================================================
-- DE PIZZANO RESTAURANT PLATFORM — ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Security Enforcement for Anon, Authenticated Customers, Staff, and Admins
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLE: profiles
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = 'customer');

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ------------------------------------------------------------------------------
-- 2. TABLE: categories
-- ------------------------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active categories" ON public.categories;
CREATE POLICY "Public read active categories"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Staff can read all categories" ON public.categories;
CREATE POLICY "Staff can read all categories"
  ON public.categories FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

DROP POLICY IF EXISTS "Staff can modify categories" ON public.categories;
CREATE POLICY "Staff can modify categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- ------------------------------------------------------------------------------
-- 3. TABLE: products
-- ------------------------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active products" ON public.products;
CREATE POLICY "Public read active products"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (is_available = true);

DROP POLICY IF EXISTS "Staff can read all products" ON public.products;
CREATE POLICY "Staff can read all products"
  ON public.products FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

DROP POLICY IF EXISTS "Staff can modify products" ON public.products;
CREATE POLICY "Staff can modify products"
  ON public.products FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- ------------------------------------------------------------------------------
-- 4. TABLE: product_variants
-- ------------------------------------------------------------------------------
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read product variants" ON public.product_variants;
CREATE POLICY "Public read product variants"
  ON public.product_variants FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Staff can modify product variants" ON public.product_variants;
CREATE POLICY "Staff can modify product variants"
  ON public.product_variants FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- ------------------------------------------------------------------------------
-- 5. TABLE: product_options
-- ------------------------------------------------------------------------------
ALTER TABLE public.product_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read product options" ON public.product_options;
CREATE POLICY "Public read product options"
  ON public.product_options FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Staff can modify product options" ON public.product_options;
CREATE POLICY "Staff can modify product options"
  ON public.product_options FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- ------------------------------------------------------------------------------
-- 6. TABLE: delivery_zones
-- ------------------------------------------------------------------------------
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active delivery zones" ON public.delivery_zones;
CREATE POLICY "Public read active delivery zones"
  ON public.delivery_zones FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Staff can modify delivery zones" ON public.delivery_zones;
CREATE POLICY "Staff can modify delivery zones"
  ON public.delivery_zones FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- ------------------------------------------------------------------------------
-- 7. TABLE: orders
-- ------------------------------------------------------------------------------
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Customers see own orders only
DROP POLICY IF EXISTS "Customers see own orders" ON public.orders;
CREATE POLICY "Customers see own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = customer_id);

-- Staff/admin see all orders
DROP POLICY IF EXISTS "Staff see all orders" ON public.orders;
CREATE POLICY "Staff see all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- Authenticated customers can create orders (for own customer_id)
DROP POLICY IF EXISTS "Customers can create own orders" ON public.orders;
CREATE POLICY "Customers can create own orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = customer_id);

-- Only staff/admin can update orders (e.g. status changes, driver assignments)
DROP POLICY IF EXISTS "Staff can update orders" ON public.orders;
CREATE POLICY "Staff can update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- ------------------------------------------------------------------------------
-- 8. TABLE: order_items
-- ------------------------------------------------------------------------------
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Same visibility as parent order
DROP POLICY IF EXISTS "Order items visible with order" ON public.order_items;
CREATE POLICY "Order items visible with order"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (
        orders.customer_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'admin'))
      )
    )
  );

-- Order items can be inserted by customer when creating their own order
DROP POLICY IF EXISTS "Customers can create items for own orders" ON public.order_items;
CREATE POLICY "Customers can create items for own orders"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id = auth.uid()
    )
  );

-- ------------------------------------------------------------------------------
-- 9. TABLE: order_status_history
-- ------------------------------------------------------------------------------
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Status history visible with order" ON public.order_status_history;
CREATE POLICY "Status history visible with order"
  ON public.order_status_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_status_history.order_id
      AND (
        orders.customer_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'admin'))
      )
    )
  );

DROP POLICY IF EXISTS "Staff can insert status history" ON public.order_status_history;
CREATE POLICY "Staff can insert status history"
  ON public.order_status_history FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- ------------------------------------------------------------------------------
-- 10. TABLE: restaurant_settings
-- ------------------------------------------------------------------------------
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read settings" ON public.restaurant_settings;
CREATE POLICY "Public read settings"
  ON public.restaurant_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin can modify settings" ON public.restaurant_settings;
CREATE POLICY "Admin can modify settings"
  ON public.restaurant_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

