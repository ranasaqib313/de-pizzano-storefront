-- ==============================================================================
-- DE PIZZANO RESTAURANT PLATFORM — PHASE 2 SEED DATA
-- 26 Verified Dishes, 6 Categories, Sizing Variants, Crust Options, Delivery Zones
-- ==============================================================================

-- 1. SEED CATEGORIES (6 Categories from Phase 1)
INSERT INTO public.categories (id, name, slug, description, sort_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Starters', 'starters', 'Crispy, oven-baked appetizers to begin your feast.', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'Regular Pizza', 'regular-pizza', 'Classic stone-baked crusts loaded with traditional favourite toppings.', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'Special Pizza', 'special-pizza', 'Signature gourmet recipes, creamy sauces, and premium specialty meats.', 3, true),
  ('c1000000-0000-0000-0000-000000000004', 'Sandwiches', 'sandwiches', 'Toasted savoury subs packed with flavourful meats and sauces.', 4, true),
  ('c1000000-0000-0000-0000-000000000005', 'Pastas', 'pastas', 'Rich, oven-baked pasta dishes prepared with indulgent creamy cheeses.', 5, true),
  ('c1000000-0000-0000-0000-000000000006', 'Fried Items', 'fried-items', 'Crispy fries tossed with signature pizza toppings and melted cheese.', 6, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

-- 2. SEED PRODUCTS (All 26 Verified Dishes from Phase 1 Menu)
INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
VALUES
  -- CATEGORY 1: Starters (4 items)
  ('p1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Garlic Bread', 'garlic-bread', 'Toasted oven-fresh bread brushed with garlic butter and herbs.', '/images/menu/garlic-bread.jpg', 200, true, false, 1),
  ('p1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Cheesy Stick', 'cheesy-stick', 'Warm golden breadsticks layered with melted cheese blend.', '/images/menu/cheesy-stick.jpg', 550, true, false, 2),
  ('p1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'Chicken Nuggets', 'chicken-nuggets', 'Golden-fried crispy breaded chicken bites with dipping sauce.', '/images/menu/chicken-nuggets.jpg', 400, true, false, 3),
  ('p1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 'Chicken Wings', 'chicken-wings', 'Oven-roasted chicken wings glazed in spicy and savoury sauce.', '/images/menu/chicken-wings.jpg', 500, true, true, 4),

  -- CATEGORY 2: Regular Pizza (11 items)
  ('p1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000002', 'Chicken Tikka Pizza', 'chicken-tikka-pizza', 'Pizza sauce, onion, chicken tikka, cheese.', '/images/menu/chicken-tikka-pizza.jpg', 750, true, true, 5),
  ('p1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000002', 'Chicken Fajita Pizza', 'chicken-fajita-pizza', 'Pizza sauce, onion, green pepper, chicken fajita, cheese.', '/images/menu/chicken-fajita-pizza.jpg', 750, true, true, 6),
  ('p1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000002', 'Fajita Sicillian Pizza', 'fajita-sicillian-pizza', 'Pizza sauce, onion, green pepper, fajita sicilian chicken, cheese.', '/images/menu/fajita-sicillian-pizza.jpg', 750, true, false, 7),
  ('p1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000002', 'Cheesy Delight Pizza', 'cheesy-delight-pizza', 'Special cheese sauce, loaded cheese.', '/images/menu/cheesy-delight-pizza.jpg', 750, true, false, 8),
  ('p1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000002', 'Veggie Lover Pizza', 'veggie-lover-pizza', 'Pizza sauce, onion, green pepper, mushroom, black olives, tomato, sweet corn, cheese.', '/images/menu/veggie-lover-pizza.jpg', 750, true, false, 9),
  ('p1000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000002', 'Hot Pepperoni Pizza', 'hot-pepperoni-pizza', 'Pizza sauce, onion, green pepper, black olives, chicken pepperoni, cheese.', '/images/menu/hot-pepperoni-pizza.jpg', 750, true, false, 10),
  ('p1000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000002', 'Tandoori Hot Pizza', 'tandoori-hot-pizza', 'Spicy tandoori chicken, red onion, green chillies, mozzarella.', '/images/menu/tandoori-hot-pizza.jpg', 750, true, false, 11),
  ('p1000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000002', 'Italian Delight Pizza', 'italian-delight-pizza', 'Italian herbs, sliced mushrooms, diced chicken, melted cheese.', '/images/menu/italian-delight-pizza.jpg', 750, true, false, 12),
  ('p1000000-0000-0000-0000-000000000013', 'c1000000-0000-0000-0000-000000000002', 'Afghani Delux Pizza', 'afghani-delux-pizza', 'Mild Afghani seasoned chicken chunks, creamy sauce, capsicum.', '/images/menu/afghani-delux-pizza.jpg', 750, true, false, 13),
  ('p1000000-0000-0000-0000-000000000014', 'c1000000-0000-0000-0000-000000000002', 'Arabian Green Pizza', 'arabian-green-pizza', 'Green herb seasoning, grilled chicken, black olives, capsicum.', '/images/menu/arabian-green-pizza.jpg', 750, true, false, 14),
  ('p1000000-0000-0000-0000-000000000015', 'c1000000-0000-0000-0000-000000000002', 'Kababis Pizza', 'kababis-pizza', 'Spiced seekh kabab slices, onion slivers, melted cheese.', '/images/menu/kababis-pizza.jpg', 750, true, false, 15),

  -- CATEGORY 3: Special Pizza (5 items)
  ('p1000000-0000-0000-0000-000000000016', 'c1000000-0000-0000-0000-000000000003', 'Pizzano Max Chicken Pizza', 'pizzano-max-chicken-pizza', 'Tikka, fajita, onion, green pepper, mushroom, black olives.', '/images/menu/pizzano-max-chicken-pizza.jpg', 750, true, true, 16),
  ('p1000000-0000-0000-0000-000000000017', 'c1000000-0000-0000-0000-000000000003', 'Pizzano Malai Classic Pizza', 'pizzano-malai-classic-pizza', 'Tender malai boti chicken, cream sauce base, sweet peppers, cheese.', '/images/menu/pizzano-malai-classic-pizza.jpg', 750, true, false, 17),
  ('p1000000-0000-0000-0000-000000000018', 'c1000000-0000-0000-0000-000000000003', 'Pizzano Kabab Delight Pizza', 'pizzano-kabab-delight-pizza', 'Grilled kabab slices, special smokey drizzle, onions, mozzarella.', '/images/menu/pizzano-kabab-delight-pizza.jpg', 750, true, false, 18),
  ('p1000000-0000-0000-0000-000000000019', 'c1000000-0000-0000-0000-000000000003', 'Pizzano Creamy Shawarma Pizza', 'pizzano-creamy-shawarma-pizza', 'Marinated shawarma chicken, signature garlic cream swirl, pickles.', '/images/menu/pizzano-creamy-shawarma-pizza.jpg', 800, true, true, 19),
  ('p1000000-0000-0000-0000-000000000020', 'c1000000-0000-0000-0000-000000000003', 'Stuffed Crust Cheese Pizza', 'stuffed-crust-cheese-pizza', 'Outer rim baked with rich melted mozzarella, topped with savoury cheese blend.', '/images/menu/stuffed-crust-cheese-pizza.jpg', 900, true, true, 20),

  -- CATEGORY 4: Sandwiches (2 items)
  ('p1000000-0000-0000-0000-000000000021', 'c1000000-0000-0000-0000-000000000004', 'Chicken Sandwich', 'chicken-sandwich', 'Toasted bread filled with seasoned shredded chicken, mayo and salad.', '/images/menu/chicken-sandwich.jpg', 550, true, false, 21),
  ('p1000000-0000-0000-0000-000000000022', 'c1000000-0000-0000-0000-000000000004', 'Mexican Sandwich', 'mexican-sandwich', 'Spicy Mexican seasoned chicken with jalapenos and tangy dressing.', '/images/menu/mexican-sandwich.jpg', 550, true, false, 22),

  -- CATEGORY 5: Pastas (2 items)
  ('p1000000-0000-0000-0000-000000000023', 'c1000000-0000-0000-0000-000000000005', 'Creamy Pasta', 'creamy-pasta', 'Rich white sauce pasta baked with chicken chunks and mozzarella.', '/images/menu/creamy-pasta.jpg', 700, true, true, 23),
  ('p1000000-0000-0000-0000-000000000024', 'c1000000-0000-0000-0000-000000000005', 'Chicken Lasagne', 'chicken-lasagne', 'Layered pasta sheets with minced chicken, tomato marinara, and bechamel.', '/images/menu/chicken-lasagne.jpg', 750, true, false, 24),

  -- CATEGORY 6: Fried Items (2 items)
  ('p1000000-0000-0000-0000-000000000025', 'c1000000-0000-0000-0000-000000000006', 'Small Pizza Fries', 'small-pizza-fries', 'Golden fries topped with pizza sauce, chicken and melted cheese.', '/images/menu/small-pizza-fries.jpg', 450, true, false, 25),
  ('p1000000-0000-0000-0000-000000000026', 'c1000000-0000-0000-0000-000000000006', 'Large Pizza Fries', 'large-pizza-fries', 'Generous portion of loaded pizza fries, ideal for sharing.', '/images/menu/large-pizza-fries.jpg', 650, true, true, 26)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  base_price = EXCLUDED.base_price,
  image_url = EXCLUDED.image_url,
  is_available = EXCLUDED.is_available,
  is_featured = EXCLUDED.is_featured;

-- 3. SEED PIZZA VARIANTS (Small, Regular/Medium +350, Large +700)
-- Insert variants for all 16 pizza products (products 5 to 20)
INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order)
SELECT
  p.id,
  v.name,
  v.price_delta,
  v.is_default,
  v.sort_order
FROM public.products p
CROSS JOIN (
  VALUES
    ('Small (9")', 0, true, 1),
    ('Regular / Medium (11")', 350, false, 2),
    ('Large (13")', 700, false, 3)
) AS v(name, price_delta, is_default, sort_order)
WHERE p.category_id IN ('c1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000003')
ON CONFLICT DO NOTHING;

-- 4. SEED PIZZA CRUST & TOPPING OPTIONS
INSERT INTO public.product_options (product_id, option_group, name, price_delta, is_default, max_selections)
SELECT
  p.id,
  o.option_group,
  o.name,
  o.price_delta,
  o.is_default,
  o.max_selections
FROM public.products p
CROSS JOIN (
  VALUES
    ('crust', 'Classic Pan Crust', 0, true, 1),
    ('crust', 'Thin & Crispy Crust', 0, false, 1),
    ('crust', 'Cheese Stuffed Crust', 200, false, 1),
    ('topping', 'Extra Mozzarella Cheese', 150, false, 1),
    ('topping', 'Extra Chicken Chunks', 150, false, 1),
    ('dip', 'Signature Garlic Mayo Dip', 60, false, 1),
    ('dip', 'Spicy Ranch Dip', 60, false, 1)
) AS o(option_group, name, price_delta, is_default, max_selections)
WHERE p.category_id IN ('c1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000003')
ON CONFLICT DO NOTHING;

-- 5. SEED DELIVERY ZONES (Karachi Localities)
INSERT INTO public.delivery_zones (id, name, delivery_fee, estimated_minutes, is_active)
VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Soldier Bazar No. 3 (Nearby)', 100, 30, true),
  ('d1000000-0000-0000-0000-000000000002', 'Soldier Bazar No. 1 & 2', 100, 30, true),
  ('d1000000-0000-0000-0000-000000000003', 'Garden East & West', 150, 35, true),
  ('d1000000-0000-0000-0000-000000000004', 'Saddar / Empress Market', 150, 35, true),
  ('d1000000-0000-0000-0000-000000000005', 'Jamshed Road / Martin Quarters', 150, 35, true),
  ('d1000000-0000-0000-0000-000000000006', 'Gurumandir / Patel Para', 150, 35, true),
  ('d1000000-0000-0000-0000-000000000007', 'PECHS (Blocks 2, 3 & 6)', 200, 40, true),
  ('d1000000-0000-0000-0000-000000000008', 'Bahadurabad / Tariq Road', 250, 45, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  delivery_fee = EXCLUDED.delivery_fee,
  estimated_minutes = EXCLUDED.estimated_minutes,
  is_active = EXCLUDED.is_active;

-- 6. SEED RESTAURANT SETTINGS
INSERT INTO public.restaurant_settings (key, value)
VALUES
  ('general_info', '{
    "restaurant_name": "De Pizzano",
    "legal_name": "De Pizzano Pizza Restaurant",
    "tagline": "Tasty Delicious",
    "currency": "PKR",
    "currency_symbol": "Rs.",
    "phone": "+92 318 2588631",
    "address": "Shop No. 9, Murtaza Terrace, Soldier Bazar No. 3, near Hamza Uniform, Karachi",
    "city": "Karachi",
    "country": "Pakistan",
    "operating_hours": "Daily: 12:00 PM – 3:00 AM",
    "is_open": true
  }'::jsonb),
  ('ordering_config', '{
    "min_order_amount": 300,
    "default_delivery_fee": 100,
    "payment_methods_allowed": ["cod"],
    "cod_enabled": true,
    "online_cards_enabled": false
  }'::jsonb)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();

