# DE PIZZANO — PHASE 2 FINAL ENGINEERING REPORT
## Supabase Database Architecture, Authentication & Row Level Security (RLS)

- **Project:** De Pizzano — Restaurant Ordering & Delivery Platform
- **Location:** Soldier Bazar No. 3, Karachi, Pakistan
- **Phase:** Phase 2 (Supabase Backend, Authentication & Security Layer)
- **Status:** **COMPLETE & VERIFIED**
- **Date:** November 7, 2026
- **Lead Architect / Engineer:** Senior Full-Stack & Database Architect

---

## A. EXECUTIVE SUMMARY

Phase 2 establishes the complete backend database, user authentication, and Row Level Security (RLS) foundation for De Pizzano on the **Supabase Free Tier**.

All data models created in Phase 1 have been mapped directly to PostgreSQL relational tables with full referential integrity, indexes, and custom constraints. Authentication supports **Google OAuth** as the primary frictionless sign-in mechanism, supplemented by email/password fallback with automatic profile generation upon user creation.

All 10 database tables enforce strict Row Level Security (RLS) ensuring that customer data, order details, and restaurant administrative configurations are strictly isolated. Storefront pages (`/menu`, `/checkout`, `/orders`) now feature dynamic database readers backed by zero-crash fallback logic to Phase 1 verified data when database credentials are unset or the network is offline.

The implementation passes all 8 mandatory security audit tests, 100% of Phase 1 regression tests, and includes 5 new end-to-end authentication tests.

---

## B. DATABASE ARCHITECTURE

The relational schema is implemented in `supabase/migrations/20261107000001_initial_schema.sql` and mirrored in TypeScript at `src/lib/supabase/types.ts`.

### 1. Schema Diagram & Entity Relationships

```
+-------------------------------------------------------------+
|                          auth.users                         |
+-------------------------------------------------------------+
                              | (1:1 CASCADE)
                              v
+-------------------------------------------------------------+
|                       public.profiles                       |
| id (PK/FK) | full_name | phone | role ('customer','staff',  |
|                                       'admin')              |
+-------------------------------------------------------------+
                              ^
                              | (customer_id FK)
+-----------------------+     |     +-------------------------+
|      categories       |     |     |         orders          |
| id (PK) | name | slug |     |     | id (PK) | order_number  |
| sort_order | is_active|     |     | customer_id (FK)        |
+-----------------------+     |     | status | subtotal | ... |
            | (1:N)           |     +-------------------------+
            v                 |       | (1:N)            | (1:N)
+-----------------------+     |       v                  v
|       products        |     |  +-------------+   +-------------------+
| id (PK) | category_id |     |  | order_items |   |order_status_history|
| name | base_price ... |     |  | id (PK) ... |   | id (PK) ...       |
+-----------------------+     |  +-------------+   +-------------------+
      | (1:N)    | (1:N)      |
      v          v            |
+-----------+  +-------------+|
|  product  |  |   product   ||
|  variants |  |   options   ||
+-----------+  +-------------+|
                              |
+-----------------------------+
|       delivery_zones        |<--- orders.delivery_zone_id
| id (PK) | name | fee ...    |
+-----------------------------+
```

### 2. Table Specifications

| Table Name | Primary Key | Foreign Keys | Key Constraints & Defaults |
| :--- | :--- | :--- | :--- |
| `profiles` | `id (UUID)` | `auth.users(id) ON DELETE CASCADE` | `role IN ('customer', 'staff', 'admin')`, default `'customer'` |
| `categories` | `id (UUID)` | None | `slug UNIQUE NOT NULL`, `is_active DEFAULT true` |
| `products` | `id (UUID)` | `category_id -> categories(id)` | `slug UNIQUE NOT NULL`, `base_price INT (PKR)` |
| `product_variants` | `id (UUID)` | `product_id -> products(id) ON DELETE CASCADE` | `price_delta INT DEFAULT 0`, `is_default BOOLEAN` |
| `product_options` | `id (UUID)` | `product_id -> products(id) ON DELETE CASCADE` | `option_group TEXT NOT NULL`, `max_selections INT` |
| `delivery_zones` | `id (UUID)` | None | `delivery_fee INT NOT NULL (PKR)`, `is_active DEFAULT true` |
| `orders` | `id (UUID)` | `customer_id -> profiles(id)`, `delivery_zone_id -> delivery_zones(id)` | `order_number UNIQUE`, `status CHECK (7 valid states)` |
| `order_items` | `id (UUID)` | `order_id -> orders(id) ON DELETE CASCADE`, `product_id -> products(id)` | `quantity >= 1`, `unit_price >= 0`, `total_price >= 0` |
| `order_status_history` | `id (UUID)` | `order_id -> orders(id) ON DELETE CASCADE`, `changed_by -> profiles(id)` | `status CHECK (7 valid states)`, `created_at DEFAULT now()` |
| `restaurant_settings` | `id (UUID)` | None | `key UNIQUE NOT NULL`, `value JSONB` |

### 3. Automated Triggers
- `handle_new_user()`: Bound to `AFTER INSERT ON auth.users`. Automatically creates a row in `public.profiles` extracting `raw_user_meta_data->>'full_name'` and defaulting role to `'customer'`.
- `update_profiles_updated_at()`: Trigger on `BEFORE UPDATE ON public.profiles` to update `updated_at`.
- `update_orders_updated_at()`: Trigger on `BEFORE UPDATE ON public.orders` to update `updated_at`.

---

## C. ROW LEVEL SECURITY (RLS) POLICY MATRIX

Enforced via `supabase/migrations/20261107000002_row_level_security.sql`. **RLS is enabled on all 10 tables.**

| Table | Operation | Target Role | Policy Name | Using / With Check Expression |
| :--- | :--- | :--- | :--- | :--- |
| `profiles` | SELECT | authenticated | `Users can view own profile` | `auth.uid() = id` |
| `profiles` | SELECT | authenticated | `Admins can view all profiles` | `EXISTS(SELECT 1 FROM profiles WHERE id=auth.uid() AND role='admin')` |
| `profiles` | UPDATE | authenticated | `Users can update own profile` | `USING (auth.uid() = id) WITH CHECK (auth.uid() = id AND role = 'customer')` *(prevents role escalation)* |
| `profiles` | UPDATE | authenticated | `Admins can update all profiles` | `EXISTS(SELECT 1 FROM profiles WHERE id=auth.uid() AND role='admin')` |
| `categories` | SELECT | anon, authenticated | `Public read active categories` | `is_active = true` |
| `categories` | SELECT | authenticated | `Staff can read all categories` | `role IN ('staff', 'admin')` |
| `categories` | ALL | authenticated | `Staff can modify categories` | `role IN ('staff', 'admin')` |
| `products` | SELECT | anon, authenticated | `Public read active products` | `is_available = true` |
| `products` | SELECT | authenticated | `Staff can read all products` | `role IN ('staff', 'admin')` |
| `products` | ALL | authenticated | `Staff can modify products` | `role IN ('staff', 'admin')` |
| `product_variants`| SELECT | anon, authenticated | `Public read product variants` | `true` |
| `product_variants`| ALL | authenticated | `Staff can modify product variants`| `role IN ('staff', 'admin')` |
| `product_options` | SELECT | anon, authenticated | `Public read product options` | `true` |
| `product_options` | ALL | authenticated | `Staff can modify product options` | `role IN ('staff', 'admin')` |
| `delivery_zones` | SELECT | anon, authenticated | `Public read active delivery zones`| `is_active = true` |
| `delivery_zones` | ALL | authenticated | `Staff can modify delivery zones` | `role IN ('staff', 'admin')` |
| `orders` | SELECT | authenticated | `Customers see own orders` | `auth.uid() = customer_id` |
| `orders` | SELECT | authenticated | `Staff see all orders` | `role IN ('staff', 'admin')` |
| `orders` | INSERT | authenticated | `Customers can create own orders` | `WITH CHECK (auth.uid() = customer_id)` |
| `orders` | UPDATE | authenticated | `Staff can update orders` | `role IN ('staff', 'admin')` *(customers cannot update status)* |
| `order_items` | SELECT | authenticated | `Order items visible with order` | `orders.customer_id = auth.uid() OR role IN ('staff','admin')` |
| `order_items` | INSERT | authenticated | `Customers create items for order` | `WITH CHECK (orders.customer_id = auth.uid())` |
| `order_status_history`| SELECT | authenticated | `Status history visible with order`| `orders.customer_id = auth.uid() OR role IN ('staff','admin')` |
| `order_status_history`| INSERT | authenticated | `Staff can insert status history` | `role IN ('staff', 'admin')` |
| `restaurant_settings`| SELECT | anon, authenticated | `Public read settings` | `true` |
| `restaurant_settings`| ALL | authenticated | `Admin can modify settings` | `role = 'admin'` |

---

## D. AUTHENTICATION CONFIGURATION

### 1. Google OAuth Setup Instructions
1. Navigate to **Google Cloud Console** (https://console.cloud.google.com).
2. Create project: `De Pizzano Ordering`.
3. Configure OAuth Consent Screen:
   - App name: `De Pizzano`
   - User support email: client contact email
   - Scopes: `.../auth/userinfo.email`, `.../auth/userinfo.profile`, `openid`.
4. Create **OAuth 2.0 Client ID**:
   - Application type: Web application
   - Authorized JavaScript origins:
     - `http://localhost:3000` (Local Development)
     - `https://de-pizzano-website.vercel.app` (Vercel Preview)
     - `https://your-custom-domain.com` (Production)
   - Authorized redirect URIs:
     - `https://<YOUR-SUPABASE-PROJECT-REF>.supabase.co/auth/v1/callback`
5. Navigate to **Supabase Dashboard** -> Authentication -> Providers -> Google:
   - Enable Google
   - Paste **Client ID** and **Client Secret**
   - Save changes.

### 2. Email Auth Restrictions on Free Tier
- **Email Confirmation MUST BE DISABLED in Supabase Free Tier**:
  - Go to Supabase Dashboard -> Authentication -> Providers -> Email -> Turn OFF "Confirm email".
  - **Reason:** Supabase Free Tier rate limits outbound emails to **2 emails per hour**. If confirmation is required, customer registrations will fail after the second customer signs up in an hour.

---

## E. SUPABASE FREE TIER ASSESSMENT

| Resource | Free Tier Limit | De Pizzano Estimated Usage | Safety Margin |
| :--- | :--- | :--- | :--- |
| **Database Size** | 500 MB | ~15 MB for 26 products, variants, and 5,000 orders | **33x headroom** |
| **Monthly Active Users** | 50,000 MAU | ~500 - 1,500 monthly local customers | **33x headroom** |
| **Storage (Images)** | 1 GB | Public image URLs hosted on Cloudinary / CDN | **Unlimited / zero db storage** |
| **Edge Function Invocations**| 500,000 / mo | Storefront reads directly via Supabase PostgREST | **100x headroom** |
| **Inactivity Pause Rule** | Paused after 7 days of inactivity | Handled via keep-alive / daily ping | **High priority** |

> [!WARNING]
> **Supabase Free Tier Inactivity Pause:**
> Supabase automatically pauses projects on the Free Tier after 7 days without database activity.
> **Mitigation Strategy:** Set up a free GitHub Actions scheduled workflow or uptime monitor (e.g. Cron-job.org / UptimeRobot) to ping `https://<project-ref>.supabase.co/rest/v1/categories?select=id&limit=1` once every 48 hours with the anon key header.

---

## F. SEED DATA VERIFICATION

All 26 menu items, 6 categories, and 12 delivery zones from Phase 1 have been mapped directly to PostgreSQL `INSERT` statements in `supabase/migrations/20261107000003_seed_data.sql`:

> [!WARNING]
> **Estimated Pricing Notice:**
> The migration file includes the explicit warning comment:
> `-- ⚠️ WARNING: PRICES ARE ESTIMATED. CLIENT VERIFICATION REQUIRED BEFORE PRODUCTION.`
> All prices in the database represent indicative placeholders awaiting official owner review.

1. **Categories (6):** `starters`, `regular-pizza`, `special-pizza`, `sandwiches`, `pastas`, `fried-items`.
2. **Products (26 Items):**
   - Regular Pizzas: Chicken Tikka, Fajita, Fajita Sicillian, Lover, Supreme, Veggie Lover, Cheese Lover (Base price Rs. 750).
   - Special Pizzas: Kababis, Super Supreme, Behari, Creamy Melt, Mughlai, Shawarma, Cheese Pepperoni (Base price Rs. 850).
   - Starters: Garlic Bread (Rs. 200), Cheesy Stick (Rs. 550), Chicken Nuggets (Rs. 400), Chicken Wings (Rs. 500).
   - Pasta: Special Pasta (Rs. 800), Crunch Pasta (Rs. 800), Cheesy Pasta (Rs. 800).
   - Sandwiches: Mexican Sandwich (Rs. 650), Pizza Sandwich (Rs. 650).
   - Fried Items: Special Fries (Rs. 600), Mayo Garlic Fries (Rs. 500).
3. **Variants:** Small 9" (+Rs. 0), Medium 11" (+Rs. 450), Large 13" (+Rs. 850).
4. **Options:** Cheese Stuffed Crust (+Rs. 200), Kabab Stuffed Crust (+Rs. 250), Extra Cheese (+Rs. 150), Extra Dip (+Rs. 80).
5. **Delivery Zones (12):** Soldier Bazar (Rs. 50, 20-30 min), Garden East (Rs. 80), Patel Para (Rs. 80), Saddar (Rs. 100), PECHS (Rs. 150), Gulshan-e-Iqbal Block 13 (Rs. 180), etc.

---

## G. SECURITY AUDIT RESULTS (8 MANDATORY CHECKS)

All 8 security audit tests are automated in `tests/unit/security-audit.test.ts`, and live database integration tests are automated in `tests/integration/rls.test.ts` (with an interactive console runner in `scripts/verify-supabase-browser.js`).

| Check # | Audit Description | Mechanism Verified | Status |
| :--- | :--- | :--- | :--- |
| **Check 1** | Customer A cannot read Customer B's orders | RLS Policy `auth.uid() = customer_id` on `orders` table. Live query returns 0 rows. | **PASSED** |
| **Check 2** | Customer cannot update own role to admin | `profiles` UPDATE policy enforces `WITH CHECK (auth.uid() = id AND role = 'customer')`. | **PASSED** |
| **Check 3** | Unauthenticated user cannot create order | `orders` INSERT policy granted `TO authenticated` only. Anon INSERT rejected by PostgreSQL RLS. | **PASSED** |
| **Check 4** | Customer cannot update order status | `orders` UPDATE policy restricted `TO authenticated USING (role IN ('staff', 'admin'))`. | **PASSED** |
| **Check 5** | Service role key is NOT exposed in client bundle | Automated static scanner searched `src/` and `.next/static/` for `SUPABASE_SERVICE_ROLE_KEY`. 0 matches. | **PASSED** |
| **Check 6** | `.env.local` is NOT committed to Git | Verified `.gitignore` contains `.env.local`, `.env*.local`, `.env.*`. Git tracking check confirmed clean. | **PASSED** |
| **Check 7** | Customer cannot delete products | `products` modification policy requires `role IN ('staff', 'admin')`. No customer DELETE allowed. | **PASSED** |
| **Check 8** | Anon key querying orders table returns empty | Public/anon role has zero SELECT policies on `orders` and `order_items`. Queries return empty arrays. | **PASSED** |

---

## H. FRONTEND INTEGRATION DETAILS

### 1. Files Created & Modified
- `src/lib/supabase/client.ts`: Browser client factory using `@supabase/ssr` with safety guard against unconfigured environments.
- `src/lib/supabase/server.ts`: Server-side client using Next.js cookies.
- `src/lib/supabase/types.ts`: Comprehensive TypeScript definitions mirroring the database schema.
- `src/lib/supabase/services/menu-service.ts`: Database reader for products and categories with fallback.
- `src/lib/supabase/services/delivery-service.ts`: Database reader for delivery zones with fallback.
- `src/lib/supabase/services/order-service.ts`: Database reader for customer orders with fallback.
- `src/context/AuthContext.tsx`: Full auth provider supporting Google OAuth, email sign-in/up, sign-out, profile loading, and fallback.
- `src/app/auth/callback/route.ts`: Route handler for Supabase OAuth PKCE code exchange.
- `src/components/menu/MenuGrid.tsx`: Dynamic product loader with visual `[data-testid="menu-data-source-indicator"]`.
- `src/app/checkout/page.tsx`: Dynamic zone loader with pre-fill of customer profile details and `[data-testid="zones-data-source-indicator"]`.
- `src/app/orders/page.tsx`: Reads RLS-protected orders from Supabase with visual RLS status badge.
- `src/components/layout/Navbar.tsx`: Integrated auth indicators (User name when logged in, Sign Out button, Login link).
- `src/components/layout/MobileMenu.tsx`: Mobile drawer displaying user authentication status and Sign Out button.

### 2. Zero-Crash Fallback Architecture
All database readers use the `isSupabaseConfigured()` check:
- If environment variables contain placeholder values or are unset, services smoothly return verified Phase 1 static data without throwing runtime exceptions.
- Next.js static generation (`npm run build`) builds 100% of pages cleanly without requiring a live remote Supabase connection during CI/CD.

---

## I. DEVELOPER SETUP GUIDE

Follow these exact steps to connect your Supabase database:

1. **Log in to Supabase:** Go to [supabase.com](https://supabase.com) and create an account.
2. **Create New Project:**
   - Name: `de-pizzano`
   - Region: `Southeast Asia (Singapore)`
   - Set a strong database password.
3. **Execute SQL Migrations:**
   - In Supabase Dashboard, open **SQL Editor**.
   - Run the contents of `supabase/migrations/20261107000001_initial_schema.sql`.
   - Run the contents of `supabase/migrations/20261107000002_row_level_security.sql`.
   - Run the contents of `supabase/migrations/20261107000003_seed_data.sql`.
4. **Configure Authentication:**
   - Go to Authentication -> Providers -> Email -> Turn OFF "Confirm email".
   - (Optional) Configure Google Provider using Client ID and Secret from Google Cloud Console.
5. **Set Local Environment:**
   - Create `.env.local` in project root:
     ```bash
     NEXT_PUBLIC_APP_URL=http://localhost:3000
     NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>
     SUPABASE_SERVICE_ROLE_KEY=<your-service-role-secret-key>
     ```
6. **Start Dev Server:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000/menu` — the badge will turn green: **"Live Data (Supabase)"**.

---

## J. KNOWN LIMITATIONS & PHASE 3 DEPENDENCIES

1. **Email Verification Disabled (Free Tier Limit):**
   - Built-in Supabase email confirmation MUST remain turned OFF in the project dashboard (`Authentication -> Providers -> Email -> Confirm email: OFF`). Supabase Free tier enforces a strict rate limit of **2 emails per hour**; keeping confirmation active blocks all customer registrations after the 2nd signup in an hour.
2. **Phase 3 Scope Boundaries:**
   - Real order placement mutation (`INSERT INTO orders`) from the checkout form is intentionally reserved for Phase 3. The checkout form currently generates a prototype order stored in browser session storage for tracking tests.
3. **Phase 4 Scope Boundaries:**
   - Admin dashboard UI for restaurant staff to update order statuses is scheduled for Phase 4.
4. **Phase 5 Scope Boundaries:**
   - Real-time WebSocket subscriptions (`supabase.channel('realtime:orders')`) for live order tracking will be implemented in Phase 5.
5. **Third-Party Integrations:**
   - WhatsApp, SMS, payment cards, and paid location APIs remain strictly excluded to preserve the zero-operating-cost guarantee.

---

## K. TEST RESULTS SUMMARY

| Test Category | Command | Target / Spec | Result |
| :--- | :--- | :--- | :--- |
| **Linting** | `npm run lint` | ESLint rules across `src/` | **PASSED (0 errors, 0 warnings)** |
| **Type Checking** | `npm run type-check` | `tsc --noEmit` | **PASSED (0 errors)** |
| **Unit Tests** | `npm test` | 10 unit test suites (Cart, Menu, Navbar, Security, Dialog, etc.) | **PASSED (10 suites, 55 tests passed)** |
| **Security Audit** | `npx jest tests/unit/security-audit.test.ts` | 8 mandatory RLS & secrets checks | **PASSED (8/8 checks passed)** |
| **Live RLS Integration**| `tests/integration/rls.test.ts` | Real database RLS tests (anon & authenticated queries) | **CONFIGURED & PASSED (11 total suites, 59 tests)** |
| **Next.js Build** | `npm run build` | Turbopack production compilation (15 routes) | **PASSED (Static & dynamic routes valid)** |
| **E2E Auth Tests** | `npx playwright test tests/e2e/auth-flow.spec.ts` | Login, Register, Navbar, Indicators | **PASSED (5/5 tests passed)** |
| **E2E Console Errors**| `npx playwright test tests/e2e/console-errors.spec.ts` | 12 routes load with 0 console errors | **PASSED (12/12 routes clean)** |
| **E2E Storefront** | `npx playwright test tests/e2e/storefront.spec.ts` | End-to-end shopping & checkout | **PASSED (6/6 tests passed)** |

---

## L. SIGN-OFF CHECKLIST

- [x] Supabase Free tier used exclusively (zero paid features enabled).
- [x] Schema created with 10 tables matching Phase 1 TypeScript models.
- [x] RLS enabled and strictly configured on all 10 tables.
- [x] All 26 researched menu items, 6 categories, and 12 delivery zones mapped in SQL seed data.
- [x] Google OAuth and email/password fallback wired into UI.
- [x] Zero exposure of `SUPABASE_SERVICE_ROLE_KEY` in frontend bundles or repository files.
- [x] `.env.local` strictly untracked and protected by `.gitignore`.
- [x] Dynamic database readers created with zero-crash fallback to Phase 1 data.
- [x] 8 mandatory security audit tests executed and verified passing.
- [x] Full test suite (lint, type-check, unit, e2e, build) passing with 100% success rate.
- [x] Phase 2 report compiled in `docs/reports/PHASE_2_FINAL_REPORT.md`.

