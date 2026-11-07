# DE PIZZANO — DATABASE ARCHITECTURE & SCHEMA PLAN
## Relational Design, Normalization, Security Policies & Operational Queries

**Target Engine:** PostgreSQL 15+ (Hosted on Supabase Free Tier)  
**Lead Architect:** Principal Database Engineer & Backend Architect  
**Date:** November 2026  
**Status:** Approved Architectural Blueprint  

---

## 1. Schema Overview & Normalization Strategy

The De Pizzano database architecture is designed to Third Normal Form (3NF) standards with strict referential integrity, foreign key cascades, domain check constraints, and immutable order history snapshots.

```
+----------------------------------------------------------------------------------------------------+
|                                    RELATIONAL ENTITY RELATIONSHIPS                                 |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|    +--------------------+             +--------------------+             +--------------------+    |
|    |     categories     | 1         N |      products      | 1         N |  product_variants  |    |
|    |--------------------|-------------|--------------------|-------------|--------------------|    |
|    | id (PK)            |             | id (PK)            |             | id (PK)            |    |
|    | name               |             | category_id (FK)   |             | product_id (FK)    |    |
|    | slug (UQ)          |             | name               |             | name (Small/Reg/Lg)|    |
|    | sort_order         |             | slug (UQ)          |             | price_delta (PKR)  |    |
|    | is_active          |             | base_price (PKR)   |             | is_default         |    |
|    +--------------------+             | is_available       |             +--------------------+    |
|                                       | is_featured        |                                       |
|                                       +--------------------+ 1         N +--------------------+    |
|                                                 |------------------------|  product_options   |    |
|                                                 |                        |--------------------|    |
|                                                 |                        | id (PK)            |    |
|                                                 |                        | product_id (FK)    |    |
|                                                 |                        | option_group (Dip) |    |
|                                                 |                        | name               |    |
|                                                 |                        | price (PKR)        |    |
|                                                 |                        +--------------------+    |
|                                                 |                                                  |
|    +--------------------+             +--------------------+             +--------------------+    |
|    |     auth.users     | 1         1 |      profiles      | 1         N |       orders       |    |
|    |--------------------|-------------|--------------------|-------------|--------------------|    |
|    | id (PK)            |             | id (PK/FK)         |             | id (PK)            |    |
|    | email              |             | role (cust/staff)  |             | order_number (UQ)  |    |
|    +--------------------+             | full_name          |             | customer_id (FK)   |    |
|                                       | phone              |             | delivery_zone_id   |    |
|                                       +--------------------+             | order_type (del/pu)|    |
|                                                 | 1                      | status (7 states)  |    |
|                                                 |                        | payment_status     |    |
|                                                 | N                      | subtotal (PKR)     |    |
|                                       +--------------------+             | delivery_fee (PKR) |    |
|                                       | customer_addresses |             | discount (PKR)     |    |
|                                       |--------------------|             | total_amount (PKR) |    |
|                                       | id (PK)            |             +--------------------+    |
|                                       | customer_id (FK)   |                       | 1             |
|                                       | area               |           +-----------+-----------+   |
|                                       | address_line       |           | 1                   1 |   |
|                                       | landmark           |           | N                   | N   |
|                                       +--------------------+     +-------------+    +-------------+|
|                                                                  | order_items |    |order_status ||
|                                                                  |-------------|    |  history    ||
|                                                                  | id (PK)     |    |-------------||
|                                                                  | order_id(FK)|    | id (PK)     ||
|                                                                  | product_id  |    | order_id(FK)||
|                                                                  | product_name|    | status      ||
|                                                                  | variant_name|    | note        ||
|                                                                  | options_json|    | changed_by  ||
|                                                                  | unit_price  |    | created_at  ||
|                                                                  | quantity    |    +-------------+|
|                                                                  | total_price |                   |
|                                                                  +-------------+                   |
+----------------------------------------------------------------------------------------------------+
```

---

## 2. Detailed Table Specifications

### 2.1 Catalog & Product Entities

#### `categories`
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `name` TEXT NOT NULL
* `slug` TEXT UNIQUE NOT NULL
* `description` TEXT
* `image_url` TEXT
* `sort_order` INT NOT NULL DEFAULT 0
* `is_active` BOOLEAN NOT NULL DEFAULT true
* `created_at` TIMESTAMPTZ DEFAULT now()

#### `products`
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `category_id` UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT
* `name` TEXT NOT NULL
* `slug` TEXT UNIQUE NOT NULL
* `description` TEXT
* `base_price` INT NOT NULL CHECK (base_price >= 0) -- All prices in integer PKR
* `image_url` TEXT
* `is_available` BOOLEAN NOT NULL DEFAULT true
* `is_featured` BOOLEAN NOT NULL DEFAULT false
* `created_at` TIMESTAMPTZ DEFAULT now()
* `updated_at` TIMESTAMPTZ DEFAULT now()

#### `product_variants`
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `product_id` UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE
* `name` TEXT NOT NULL -- e.g., 'Small (9")', 'Regular (11")', 'Large (13")'
* `price_delta` INT NOT NULL DEFAULT 0 CHECK (price_delta >= 0)
* `is_default` BOOLEAN NOT NULL DEFAULT false
* `sort_order` INT NOT NULL DEFAULT 0

#### `product_options` (Add-ons & Crusts)
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `product_id` UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE
* `option_group` TEXT NOT NULL -- 'crust', 'cheese', 'dip', 'topping'
* `name` TEXT NOT NULL -- 'Cheese Stuffed Crust', 'Garlic Mayo Dip'
* `price` INT NOT NULL DEFAULT 0 CHECK (price >= 0)
* `max_selections` INT NOT NULL DEFAULT 1
* `is_available` BOOLEAN NOT NULL DEFAULT true

---

### 2.2 Customer & Delivery Entities

#### `profiles`
* `id` UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
* `full_name` TEXT
* `phone` TEXT
* `role` TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin'))
* `created_at` TIMESTAMPTZ DEFAULT now()
* `updated_at` TIMESTAMPTZ DEFAULT now()

#### `delivery_zones`
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `name` TEXT NOT NULL -- 'Soldier Bazar (Local)', 'Central Karachi'
* `areas` TEXT[] NOT NULL DEFAULT '{}' -- Array of neighbourhood names
* `delivery_fee` INT NOT NULL DEFAULT 100 CHECK (delivery_fee >= 0)
* `min_order_amount` INT NOT NULL DEFAULT 300 CHECK (min_order_amount >= 0)
* `estimated_minutes` INT NOT NULL DEFAULT 40
* `is_active` BOOLEAN NOT NULL DEFAULT true

#### `customer_addresses`
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `customer_id` UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
* `area` TEXT NOT NULL
* `address_line` TEXT NOT NULL
* `landmark` TEXT
* `delivery_notes` TEXT
* `is_default` BOOLEAN DEFAULT false

---

### 2.3 Orders & Fulfillment Entities

#### `orders`
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `order_number` TEXT UNIQUE NOT NULL -- Format: DP-YYYYMMDD-XXXX
* `customer_id` UUID REFERENCES profiles(id) ON DELETE SET NULL
* `delivery_zone_id` UUID REFERENCES delivery_zones(id) ON DELETE SET NULL
* `order_type` TEXT NOT NULL DEFAULT 'delivery' CHECK (order_type IN ('delivery', 'pickup'))
* `status` TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'))
* `payment_status` TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded'))
* `payment_method` TEXT NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod', 'counter', 'online'))
* `customer_name` TEXT NOT NULL
* `customer_phone` TEXT NOT NULL
* `delivery_address` TEXT NOT NULL
* `delivery_instructions` TEXT
* `subtotal` INT NOT NULL CHECK (subtotal >= 0)
* `delivery_fee` INT NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0)
* `discount` INT NOT NULL DEFAULT 0 CHECK (discount >= 0)
* `total_amount` INT NOT NULL CHECK (total_amount >= 0)
* `created_at` TIMESTAMPTZ DEFAULT now()
* `updated_at` TIMESTAMPTZ DEFAULT now()

#### `order_items` (Immutable Financial Snapshot)
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `order_id` UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE
* `product_id` UUID REFERENCES products(id) ON DELETE SET NULL
* `product_name` TEXT NOT NULL -- Frozen at purchase time
* `variant_name` TEXT
* `customizations` JSONB DEFAULT '[]'::jsonb -- Frozen add-on details
* `quantity` INT NOT NULL CHECK (quantity >= 1)
* `unit_price` INT NOT NULL CHECK (unit_price >= 0) -- Base + Variant + Options
* `total_price` INT NOT NULL CHECK (total_price >= 0) -- unit_price * quantity

#### `order_status_history`
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `order_id` UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE
* `status` TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'))
* `note` TEXT
* `changed_by` UUID REFERENCES profiles(id) ON DELETE SET NULL
* `created_at` TIMESTAMPTZ DEFAULT now()

---

### 2.4 Marketing & Settings Entities

#### `promotions` (Deals & Discounts Engine)
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `code` TEXT UNIQUE NOT NULL -- e.g., 'PIZZANO10'
* `title` TEXT NOT NULL
* `discount_type` TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed'))
* `discount_value` INT NOT NULL CHECK (discount_value > 0)
* `min_order_value` INT DEFAULT 0
* `max_discount` INT -- Cap for percentage discounts
* `starts_at` TIMESTAMPTZ NOT NULL
* `expires_at` TIMESTAMPTZ NOT NULL
* `is_active` BOOLEAN NOT NULL DEFAULT true

#### `restaurant_settings`
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `key` TEXT UNIQUE NOT NULL
* `value` JSONB NOT NULL
* `updated_at` TIMESTAMPTZ DEFAULT now()

---

## 3. Row Level Security (RLS) Policy Blueprint

All tables enforce strict Row Level Security policies:

1. **Catalog Read Access (`categories`, `products`, `product_variants`, `product_options`):**
   - `SELECT`: Public access allowed (`anon`, `authenticated`).
   - `INSERT / UPDATE / DELETE`: Restricted exclusively to `role = 'admin'` via `profiles` lookup.
2. **Customer Profiles (`profiles`, `customer_addresses`):**
   - `SELECT`: User can read own record (`auth.uid() = id`), or Admins can read all.
   - `UPDATE`: User can update own record (with check preventing escalation to `admin` role).
3. **Orders & Items (`orders`, `order_items`, `order_status_history`):**
   - `SELECT`: Customers can read orders matching their `customer_id` or session lookup. Admins and Staff can read all orders.
   - `INSERT`: Public order creation allowed via validated server actions (`placeOrderAction`).
   - `UPDATE`: Status updates restricted exclusively to `role IN ('admin', 'staff')`.

---

## 4. Server-Side Price Verification Algorithm

To ensure zero price tampering, the server action executes the following verification pipeline in `src/app/actions/order-actions.ts`:

1. Accept customer order payload containing product IDs, variant IDs, option IDs, and quantities.
2. Fetch verified `base_price` from `products` table in PostgreSQL.
3. Fetch verified `price_delta` from `product_variants` table.
4. Fetch verified add-on `price` from `product_options` table.
5. Compute verified item unit price:  
   $$\text{unit\_price} = \text{base\_price} + \text{variant\_price\_delta} + \sum \text{option\_prices}$$
6. Multiply by quantity to determine item subtotal.
7. Sum item subtotals to verify order subtotal.
8. Fetch verified delivery fee for the selected `delivery_zone_id`.
9. Calculate total:  
   $$\text{total\_amount} = \text{subtotal} + \text{delivery\_fee} - \text{validated\_discount}$$
10. Store verified values into `orders` and `order_items` tables within a single atomic database transaction.

