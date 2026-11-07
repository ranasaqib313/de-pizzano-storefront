-- ==============================================================================
-- DE PIZZANO RESTAURANT PLATFORM — PHASE 3 REAL MENU DATABASE UPDATE
-- Clear Fake/Placeholder Seed Data and Insert Real Restaurant Menu
-- ==============================================================================

-- 1. TRUNCATE OLD DATA (Clean slate for products and categories)
TRUNCATE TABLE public.product_options, public.product_variants, public.products, public.categories CASCADE;

-- 2. INSERT REAL CATEGORIES
-- Category IDs generated cleanly via UUIDs
DO $$
DECLARE
  cat_deals UUID := gen_random_uuid();
  cat_flavours UUID := gen_random_uuid();
  cat_special UUID := gen_random_uuid();
  cat_sandwiches UUID := gen_random_uuid();
  cat_pasta_fries UUID := gen_random_uuid();
  cat_sides UUID := gen_random_uuid();

  -- Product variable placeholders for variant insertions
  prod_id UUID;
BEGIN
  -- Insert 6 Official Categories
  INSERT INTO public.categories (id, name, slug, description, sort_order, is_active) VALUES
    (cat_deals, 'Pizza Deals', 'pizza-deals', 'Exclusive value meal deals with soft drinks included. Perfect for individuals, families, and parties.', 1, true),
    (cat_flavours, 'Pizza Flavours', 'pizza-flavours', 'Signature oven-baked stone pizzas available in Small, Regular, and Large sizes.', 2, true),
    (cat_special, 'Special Flavours', 'special-flavours', 'Signature stuffed crust pizzas loaded with premium fillings in Medium and Large sizes.', 3, true),
    (cat_sandwiches, 'Sandwiches', 'sandwiches', 'Toasted savoury subs and calzone sandwiches packed with flavourful meats.', 4, true),
    (cat_pasta_fries, 'Pasta & Fries', 'pasta-fries', 'Rich baked pasta, hearty lasagna, and cheese-loaded pizza fries in Small and Large sizes.', 5, true),
    (cat_sides, 'Sides', 'sides', 'Crispy appetizers, chicken wings, nuggets, and garlic breads.', 6, true);

  -- ============================================================================
  -- 1. PIZZA DEALS (Fixed bundle items, no size variants)
  -- ============================================================================
  INSERT INTO public.products (category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order) VALUES
    (cat_deals, 'Deal 1: Small Pizza + 345ml Drink', 'deal-1', '1 Small Pizza (9") with 1 345ml Soft Drink.', '/images/menu/chicken-tikka-pizza.jpg', 400, true, true, 1),
    (cat_deals, 'Deal 2: Regular Pizza + 1 Liter Drink', 'deal-2', '1 Regular Pizza (11") with 1 Liter Soft Drink.', '/images/menu/chicken-tikka-pizza.jpg', 750, true, true, 2),
    (cat_deals, 'Deal 3: Large Pizza + 1 Liter Drink', 'deal-3', '1 Large Pizza (13") with 1 Liter Soft Drink.', '/images/menu/chicken-tikka-pizza.jpg', 1000, true, true, 3),
    (cat_deals, 'Deal 4: 2 Regular Pizza + 1 Liter Drink', 'deal-4', '2 Regular Pizzas (11") with 1 Liter Soft Drink.', '/images/menu/chicken-fajita-pizza.jpg', 1400, true, false, 4),
    (cat_deals, 'Deal 5: 4 Small Pizza + 1 Liter Drink', 'deal-5', '4 Small Pizzas (9") with 1 Liter Soft Drink.', '/images/menu/chicken-tikka-pizza.jpg', 1400, true, false, 5),
    (cat_deals, 'Deal 6: 1 Large Pizza + 1 Regular Pizza + 1 Liter Drink', 'deal-6', '1 Large Pizza (13") and 1 Regular Pizza (11") with 1 Liter Soft Drink.', '/images/menu/chicken-tikka-pizza.jpg', 1600, true, false, 6),
    (cat_deals, 'Deal 7: 2 Large Pizza + 1 Liter Drink', 'deal-7', '2 Large Pizzas (13") with 1 Liter Soft Drink.', '/images/menu/chicken-tikka-pizza.jpg', 1800, true, true, 7),
    (cat_deals, 'Deal 8: 3 Regular Pizza + 1 Liter Drink', 'deal-8', '3 Regular Pizzas (11") with 1 Liter Soft Drink.', '/images/menu/chicken-fajita-pizza.jpg', 1900, true, false, 8),
    (cat_deals, 'Deal 9: 3 Large Pizza + 1 Liter Drink', 'deal-9', '3 Large Pizzas (13") with 1 Liter Soft Drink.', '/images/menu/chicken-tikka-pizza.jpg', 2600, true, false, 9),
    (cat_deals, 'Deal 10: 4 Large Pizza + 1.5 Liter Drink', 'deal-10', '4 Large Pizzas (13") with 1.5 Liter Soft Drink.', '/images/menu/chicken-tikka-pizza.jpg', 3400, true, false, 10);

  -- ============================================================================
  -- 2. PIZZA FLAVOURS (24 Flavours with Small, Regular, Large variants)
  -- Base price: 400 (Small). Regular +350 (750), Large +600 (1000).
  -- TODO: Standalone pizza pricing derived from Deal 1 (Small Rs. 400), Deal 2 (Regular Rs. 750), Deal 3 (Large Rs. 1000). Awaiting final client price confirmation for standalone pizzas without drinks.
  -- ============================================================================
  
  -- Macro for inserting pizza flavour and its 3 standard variants
  -- 1. Tikka
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Tikka Pizza', 'tikka-pizza', 'Traditional BBQ chicken tikka chunks with onions and mozzarella cheese.', '/images/menu/chicken-tikka-pizza.jpg', 400, true, true, 11)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 2. Fajita
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Fajita Pizza', 'fajita-pizza', 'Marinated chicken fajita chunks, bell peppers, onions, and melted cheese.', '/images/menu/chicken-fajita-pizza.jpg', 400, true, true, 12)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 3. Fajita Sicilian
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Fajita Sicilian Pizza', 'fajita-sicilian-pizza', 'Spicy chicken fajita, capsicum, onions, and jalapenos on Sicilian sauce.', '/images/menu/fajita-sicillian-pizza.jpg', 400, true, false, 13)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 4. Malai
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Malai Pizza', 'malai-pizza', 'Creamy malai boti chicken chunks with creamy sauce and mozzarella.', '/images/menu/pizzano-malai-classic-pizza.jpg', 400, true, true, 14)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 5. Afghani
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Afghani Pizza', 'afghani-pizza', 'Mild Afghani seasoned chicken chunks, herbs, and premium cheese.', '/images/menu/afghani-delux-pizza.jpg', 400, true, false, 15)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 6. Tandoori
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Tandoori Pizza', 'tandoori-pizza', 'Spicy tandoori chicken, aromatic spices, red onions, and cheese.', '/images/menu/tandoori-hot-pizza.jpg', 400, true, false, 16)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 7. Bihari Botti
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Bihari Botti Pizza', 'bihari-botti-pizza', 'Smoky bihari masala marinated chicken chunks with crisp onions.', '/images/menu/kababis-pizza.jpg', 400, true, false, 17)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 8. Veggie Lover
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Veggie Lover Pizza', 'veggie-lover-pizza', 'Fresh bell peppers, onions, tomatoes, sweet corn, mushrooms, and olives.', '/images/menu/veggie-lover-pizza.jpg', 400, true, false, 18)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 9. Cheese Lovers
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Cheese Lovers Pizza', 'cheese-lovers-pizza', 'Double layer of melted mozzarella and golden cheddar cheese.', '/images/menu/cheesy-delight-pizza.jpg', 400, true, false, 19)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 10. Chicken Supreme
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Chicken Supreme Pizza', 'chicken-supreme-pizza', 'Combination of smoked chicken, sausages, bell peppers, onions, and olives.', '/images/menu/pizzano-max-chicken-pizza.jpg', 400, true, true, 20)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 11. Hot & Spicy
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Hot & Spicy Pizza', 'hot-and-spicy-pizza', 'Fiery chili sauce base, seasoned chicken, jalapenos, and onions.', '/images/menu/italian-delight-pizza.jpg', 400, true, false, 21)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 12. Smoke Pizza
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Smoke Pizza', 'smoke-pizza', 'Wood-smoked chicken strips, caramelized onions, and smoky BBQ drizzle.', '/images/menu/arabian-green-pizza.jpg', 400, true, false, 22)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 13. Afghani Fest
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Afghani Fest Pizza', 'afghani-fest-pizza', 'Festive Afghani boti, extra cheese, garlic sauce, and fresh herbs.', '/images/menu/afghani-delux-pizza.jpg', 400, true, false, 23)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 14. Bihari Max
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Bihari Max Pizza', 'bihari-max-pizza', 'Double portions of Bihari chicken boti with crisp capsicum and onions.', '/images/menu/pizzano-kabab-delight-pizza.jpg', 400, true, false, 24)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 15. Creamy Tikka
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Creamy Tikka Pizza', 'creamy-tikka-pizza', 'Succulent chicken tikka topped with luscious creamy white garlic sauce.', '/images/menu/chicken-tikka-pizza.jpg', 400, true, true, 25)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 16. Creamy Fajita
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Creamy Fajita Pizza', 'creamy-fajita-pizza', 'Spiced chicken fajita layered with velvety cream sauce and mozzarella.', '/images/menu/chicken-fajita-pizza.jpg', 400, true, false, 26)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 17. Creamy Shawarma
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Creamy Shawarma Pizza', 'creamy-shawarma-pizza', 'Thin-sliced chicken shawarma meat with authentic garlic-mayo sauce drizzle.', '/images/menu/pizzano-creamy-shawarma-pizza.jpg', 400, true, true, 27)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 18. Max Super
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Max Super Pizza', 'max-super-pizza', 'Loaded super recipe with triple chicken meats, olives, mushrooms, and cheese.', '/images/menu/pizzano-max-chicken-pizza.jpg', 400, true, false, 28)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 19. Sriracha Max
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Sriracha Max Pizza', 'sriracha-max-pizza', 'Bold spicy sriracha sauce, grilled chicken boti, and jalapeños.', '/images/menu/italian-delight-pizza.jpg', 400, true, false, 29)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 20. Malai Classic
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Malai Classic Pizza', 'malai-classic-pizza', 'Classic rich cream malai cuts on a soft golden hand-tossed crust.', '/images/menu/pizzano-malai-classic-pizza.jpg', 400, true, false, 30)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 21. Italian Delicious Ranch
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Italian Delicious Ranch Pizza', 'italian-delicious-ranch-pizza', 'Herb roasted chicken with rich buttermilk ranch sauce drizzle.', '/images/menu/italian-delight-pizza.jpg', 400, true, false, 31)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 22. Lava Spicy
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Lava Spicy Pizza', 'lava-spicy-pizza', 'Molten spicy red sauce, extra hot chicken tikka, and crushed red chilies.', '/images/menu/tandoori-hot-pizza.jpg', 400, true, false, 32)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 23. Mughlai Tikka
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Mughlai Tikka Pizza', 'mughlai-tikka-pizza', 'Royal Mughlai style spiced chicken, rich onion gravy base, and cheese.', '/images/menu/chicken-tikka-pizza.jpg', 400, true, false, 33)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- 24. Pepperoni
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_flavours, 'Pepperoni Pizza', 'pepperoni-pizza', 'Generous slices of savoury beef pepperoni over Italian tomato sauce and mozzarella.', '/images/menu/hot-pepperoni-pizza.jpg', 400, true, true, 34)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small (9")', 0, false, 1),
    (prod_id, 'Regular (11")', 350, true, 2),
    (prod_id, 'Large (13")', 600, false, 3);

  -- ============================================================================
  -- 3. SPECIAL FLAVOURS / STUFFED CRUST (Medium Rs. 800, Large Rs. 1100)
  -- ============================================================================
  -- 1. Stuf Crust Kabab
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_special, 'Stuf Crust Kabab', 'stuf-crust-kabab', 'Crust filled with seasoned seekh kabab pieces, topped with special chicken.', '/images/menu/pizzano-kabab-delight-pizza.jpg', 800, true, true, 35)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Medium (11")', 0, true, 1),
    (prod_id, 'Large (13")', 300, false, 2);

  -- 2. Stuf Crust Cheese
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_special, 'Stuf Crust Cheese', 'stuf-crust-cheese', 'Crust packed with gooey mozzarella cheese sticks that melt with every bite.', '/images/menu/stuffed-crust-cheese-pizza.jpg', 800, true, true, 36)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Medium (11")', 0, true, 1),
    (prod_id, 'Large (13")', 300, false, 2);

  -- 3. Stuf Crust Peri Peri
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_special, 'Stuf Crust Peri Peri', 'stuf-crust-peri-peri', 'Tangy African bird''s eye peri peri sauce stuffed inside the crust.', '/images/menu/italian-delight-pizza.jpg', 800, true, false, 37)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Medium (11")', 0, true, 1),
    (prod_id, 'Large (13")', 300, false, 2);

  -- 4. Stuf Crust Chipotle
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_special, 'Stuf Crust Chipotle', 'stuf-crust-chipotle', 'Smoky Mexican chipotle cream infused into the outer crust rings.', '/images/menu/stuffed-crust-cheese-pizza.jpg', 800, true, false, 38)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Medium (11")', 0, true, 1),
    (prod_id, 'Large (13")', 300, false, 2);

  -- ============================================================================
  -- 4. SANDWICHES (Fixed price items)
  -- ============================================================================
  INSERT INTO public.products (category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order) VALUES
    (cat_sandwiches, 'Club Sandwich', 'club-sandwich', 'Triple-decker toasted bread filled with shredded seasoned chicken, egg, and fresh veggies.', '/images/menu/chicken-sandwich.jpg', 500, true, true, 39),
    (cat_sandwiches, 'Canzone Sandwich', 'canzone-sandwich', 'Oven-folded golden calzone crust stuffed with spicy chicken and melted cheese.', '/images/menu/mexican-sandwich.jpg', 450, true, false, 40);

  -- ============================================================================
  -- 5. PASTAS, LASAGNA & PIZZA FRIES (Small & Large sizes)
  -- ============================================================================
  -- 1. Pasta
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_pasta_fries, 'Pasta', 'pasta', 'Oven-baked macaroni pasta tossed in creamy white cheese sauce with tender chicken.', '/images/menu/creamy-pasta.jpg', 350, true, true, 41)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small', 0, true, 1),
    (prod_id, 'Large', 250, false, 2);

  -- 2. Lasagna
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_pasta_fries, 'Lasagna', 'lasagna', 'Layers of pasta sheets, spiced minced chicken meat, bechamel sauce, and bubbling mozzarella.', '/images/menu/chicken-lasagne.jpg', 400, true, true, 42)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small', 0, true, 1),
    (prod_id, 'Large', 400, false, 2);

  -- 3. Pizza Fries
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_pasta_fries, 'Pizza Fries', 'pizza-fries', 'Golden french fries baked with pizza sauce, chicken chunks, jalapenos, and melted cheese.', '/images/menu/large-pizza-fries.jpg', 350, true, true, 43)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Small', 0, true, 1),
    (prod_id, 'Large', 250, false, 2);

  -- ============================================================================
  -- 6. SIDES & OTHERS (Variants for portions / pcs)
  -- ============================================================================
  -- 1. Alfredo Pasta (Half Rs. 500, Full Rs. 900)
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_sides, 'Alfredo Pasta', 'alfredo-pasta', 'Fettuccine or penne pasta tossed in rich butter parmesan alfredo sauce.', '/images/menu/creamy-pasta.jpg', 500, true, true, 44)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, 'Half', 0, true, 1),
    (prod_id, 'Full', 400, false, 2);

  -- 2. Chicken Wings (6 pcs Rs. 600, 12 pcs Rs. 1100)
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_sides, 'Chicken Wings', 'chicken-wings', 'Crispy spiced chicken wings served with dipping sauce.', '/images/menu/chicken-wings.jpg', 600, true, true, 45)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, '6 pcs', 0, true, 1),
    (prod_id, '12 pcs', 500, false, 2);

  -- 3. Chicken Nuggets (6 pcs Rs. 500, 12 pcs Rs. 950)
  INSERT INTO public.products (id, category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order)
  VALUES (gen_random_uuid(), cat_sides, 'Chicken Nuggets', 'chicken-nuggets', 'Golden battered tender chicken breast nuggets with ketchup.', '/images/menu/chicken-nuggets.jpg', 500, true, false, 46)
  RETURNING id INTO prod_id;
  INSERT INTO public.product_variants (product_id, name, price_delta, is_default, sort_order) VALUES
    (prod_id, '6 pcs', 0, true, 1),
    (prod_id, '12 pcs', 450, false, 2);

  -- 4. Garlic Bread (4 pcs Rs. 400)
  INSERT INTO public.products (category_id, name, slug, description, image_url, base_price, is_available, is_featured, sort_order) VALUES
    (cat_sides, 'Garlic Bread (4 pcs)', 'garlic-bread-4pcs', 'Toasted French baguette slices spread with aromatic garlic herb butter.', '/images/menu/garlic-bread.jpg', 400, true, false, 47),
    (cat_sides, 'Cheese Garlic Bread (4 pcs)', 'cheese-garlic-bread-4pcs', 'Garlic bread slices topped with melted golden mozzarella cheese.', '/images/menu/garlic-bread.jpg', 550, true, false, 48),
    (cat_sides, 'Cheese Sticks', 'cheese-sticks', 'Crispy crumb-coated sticks filled with stretchy molten mozzarella.', '/images/menu/cheesy-stick.jpg', 450, true, false, 49),
    (cat_sides, 'Sticko Sandwich', 'sticko-sandwich', 'Crispy toasted finger sandwiches stuffed with savoury fillings.', '/images/menu/chicken-sandwich.jpg', 450, true, false, 50);

END $$;

-- 3. RLS PERMISSION ENHANCEMENT FOR ORDER CREATION FLOW
-- Allow authenticated customers to create initial status history for their own orders
DROP POLICY IF EXISTS "Customers can insert initial status history for own orders" ON public.order_status_history;
CREATE POLICY "Customers can insert initial status history for own orders"
  ON public.order_status_history FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_status_history.order_id
      AND orders.customer_id = auth.uid()
    )
  );

-- Also allow service role full access if needed for server actions

