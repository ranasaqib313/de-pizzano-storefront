# DE PIZZANO — DESIGN SYSTEM SPECIFICATIONS
## Tokens, Components, Responsive Layouts & Interaction Standards

**Version:** 2.0  
**Target:** De Pizzano Web Storefront & Administrative Suite  
**Author:** Senior Product Designer & Principal UI/UX Engineer  
**Date:** November 2026  
**Status:** Canonical Implementation Standard  

---

## 1. Design Tokens

### 1.1 Color Tokens
All color tokens are registered in `tailwind.config.ts` and `src/app/globals.css`:

```css
:root {
  /* Surface Foundations */
  --color-background: #171311;        /* Canvas: Obsidian Dark */
  --color-surface: #211c19;           /* Cards, Drawers, Modals */
  --color-surface-elevated: #2a2420;  /* Hover states & dropdowns */
  --color-surface-border: #38302b;    /* Dividers, borders */
  --color-surface-highlight: #483e38; /* Active pill outlines */

  /* Brand Accents */
  --color-primary: #d92d2d;           /* Artisanal Crimson Red */
  --color-primary-hover: #c22323;     /* Button hover */
  --color-primary-light: #f85151;     /* Gradient stop */
  --color-primary-dark: #9e1919;      /* Shadow depth */

  --color-secondary: #f3b544;         /* Mozzarella Gold */
  --color-secondary-hover: #e0a02e;   /* Gold hover */
  --color-secondary-light: #f7cb77;   /* Badge highlight */
  --color-secondary-dark: #b87b1e;    /* Deep gold */

  /* Text & Typography */
  --color-cream: #fff7ea;             /* Primary text */
  --color-cream-muted: #eadbc8;       /* Subheadings */
  --color-muted: #b8aca2;             /* Body descriptions */
  --color-muted-light: #d3c9c2;       /* Light neutral */
  --color-muted-dark: #85786e;        /* Placeholders & hints */

  /* Order Status Tokens */
  --color-status-pending: #f59e0b;    /* Amber 500 */
  --color-status-confirmed: #10b981;  /* Emerald 500 */
  --color-status-preparing: #f97316;  /* Orange 500 */
  --color-status-ready: #8b5cf6;      /* Violet 500 */
  --color-status-out: #3b82f6;        /* Blue 500 */
  --color-status-delivered: #059669;  /* Emerald 600 */
  --color-status-cancelled: #ef4444;  /* Rose 500 */
}
```

### 1.2 Spacing & Grid System
The spacing system uses a consistent `4px` grid:
* `space-1` (4px), `space-2` (8px), `space-3` (12px), `space-4` (16px)
* `space-5` (20px), `space-6` (24px), `space-8` (32px), `space-10` (40px)
* `space-12` (48px), `space-16` (64px), `space-20` (80px), `space-24` (96px)

### 1.3 Border Radii & Elevation
* Small elements (tags, badges): `rounded-lg` (8px)
* Input fields, buttons: `rounded-xl` (12px)
* Product cards, dialogs, drawers: `rounded-2xl` (16px)
* Hero banners, container wrappers: `rounded-3xl` (24px)
* Elevation Shadows:
  - Default card: `0 10px 30px -10px rgba(0, 0, 0, 0.6)`
  - Crimson Glow: `0 0 35px -5px rgba(217, 45, 45, 0.35)`
  - Gold Glow: `0 0 35px -5px rgba(243, 181, 68, 0.35)`

---

## 2. Layout Architectures

### 2.1 Desktop Layout (1024px – 1920px)
The desktop ordering experience is structured into **three balanced functional zones**:

```
+---------------------------------------------------------------------------------------+
|  HEADER / NAVBAR (Sticky): Logo | Order Mode (Delivery/Pickup) | Links | Bag | Auth   |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|  +---------------------------------------------------+  +--------------------------+  |
|  |             CENTRAL PRODUCT CONTENT               |  |   RIGHT-SIDE CATEGORY    |  |
|  |                                                   |  |     NAVIGATION RAIL      |  |
|  |  • Search & Filter Bar                            |  |                          |  |
|  |  • Active Category Heading & Dish Count           |  |  [Sticky top-28, w-64]   |  |
|  |  • Responsive Product Card Grid (2 to 3 columns)  |  |                          |  |
|  |    [ Card ]  [ Card ]  [ Card ]                   |  |  🔥 All Dishes (50)     |  |
|  |    [ Card ]  [ Card ]  [ Card ]                   |  |  🍕 Pizza Deals (10)    |  |
|  |    [ Card ]  [ Card ]  [ Card ]                   |  |  🧀 Pizza Flavours (24) |  |
|  |                                                   |  |  ⭐ Special Flavours (4)|  |
|  |                                                   |  |  🥪 Sandwiches (2)      |  |
|  |                                                   |  |  🍝 Pasta & Fries (3)   |  |
|  |                                                   |  |  🍟 Sides (7)           |  |
|  +---------------------------------------------------+  +--------------------------+  |
|                                                                                       |
+---------------------------------------------------------------------------------------+
|  FOOTER: Brand Information | Soldier Bazar Location | Hours | Links | Copyright       |
+---------------------------------------------------------------------------------------+
```

#### Specifications for the Right-Side Category Rail:
* **Position:** Fixed right column on desktop screens (`lg:w-64 xl:w-72`), sticky positioned at `top-28`.
* **Visual Styling:** Contained in a smoked-oak card (`bg-surface/90 border border-surface-border rounded-2xl p-3 backdrop-blur-md shadow-card`).
* **Active Category Indicator:** Active item styled with rich crimson background (`bg-primary text-white shadow-glow-red font-bold`), left gold indicator notch, and live item count badge.
* **Scrollspy Integration:** Automatically tracks scrolling position of category section anchors on the central feed and highlights the current section in the right rail.
* **Click Behavior:** Clicking an item smoothly scrolls the main viewport to the target category section without jarring jumps.

### 2.2 Tablet Layout (768px – 1023px)
* Header remains sticky with compact navigation links.
* Right-side rail transitions to a sticky top horizontal pill bar with scroll snap (`overflow-x-auto scrollbar-none`).
* Product cards render in a balanced 2-column grid.
* Cart drawer occupies 50% screen width (`w-1/2`).

### 2.3 Mobile Layout (320px – 767px)
* Header features brand logo, order-type badge, and floating shopping bag with bouncing counter badge.
* Category navigation switches to an ergonomic **floating horizontal category carousel** pinned beneath the search bar.
* Product grid renders as single-column or 2-column compact cards optimized for vertical thumb-scrolling.
* Cart drawer occupies 100% viewport width with large, touch-friendly checkout buttons (`min-h-[48px]`).

---

## 3. Core Component Specifications

### 3.1 Header & Order Mode Selector
* **Order Mode Trigger:** Prominent pill in the navbar displaying current mode:
  - `🛵 Delivery to [Soldier Bazar / Garden / Karachi Area]` or
  - `🏪 Takeaway at Soldier Bazar No. 3`
* **Modal Selector:** Clicking opens a modal allowing customer to toggle between Delivery (with neighborhood dropdown) and Pickup (displaying address and preparation time).
* **Shopping Bag Button:** Displays live item counter; clicking slides open `CartDrawer`.

### 3.2 Product Cards (`MenuCard`)
* **Card Container:** `bg-surface border border-surface-border rounded-2xl overflow-hidden hover:border-secondary/40 transition-all duration-300 hover:shadow-card hover:-translate-y-1`.
* **Image Area:** 4:3 aspect ratio, subtle dark gradient overlay, category badge top-left, availability badge top-right.
* **Content:** Bold product title (`text-white font-bold`), 2-line truncated description (`text-muted text-xs`), integer base price (`text-secondary font-bold text-base`).
* **Action Area:** 
  - Products with variants/options: "Customize & Add" button (`variant="secondary"`).
  - Fixed-price items: "Quick Add +" button (`variant="primary"`).

### 3.3 Product Customization Dialog / Drawer (`ProductDialog`)
* **Trigger:** Click on product card or customize button.
* **Structure:**
  - Hero image and dish description.
  - Size variant selector (e.g. Small 9" Rs. 400, Regular 11" Rs. 750, Large 13" Rs. 1,000) using segmented card buttons.
  - Crust option selector (Pan Crust, Thin & Crispy, Cheese Stuffed Crust +Rs. 200).
  - Extra add-ons (Extra Cheese, Dip Sauce, Extra Meat) with checkbox toggles and explicit price deltas.
  - Special kitchen instructions textarea.
  - Sticky bottom action bar: Quantity stepper `[- 1 +]`, live dynamic total (`Rs. 1,200`), and "Add to Order" CTA.

### 3.4 Shopping Cart (`CartDrawer` & `/cart` Page)
* **Line Items:** Thumbnail, title, selected size variant, add-on badges, quantity stepper, remove button.
* **Delivery Zone Calculator:** Karachi delivery zone selector with clear fee breakdowns (Soldier Bazar Rs. 100, Central Karachi Rs. 150, Extended Rs. 200).
* **Summary Breakdown:**
  - Subtotal: Integer PKR sum of items.
  - Delivery Fee: Integer PKR based on zone.
  - Discounts: Applied vouchers or promotions.
  - Total Payable: High-contrast gold display (`text-2xl font-black text-secondary`).
* **Checkout CTA:** High-visibility crimson button leading directly to multi-step checkout.

### 3.5 Multi-Step Checkout Experience (`/checkout`)
* **Step 1 — Order Type Confirmation:** Delivery vs. Takeaway verification.
* **Step 2 — Customer & Contact Details:** Full Name, Phone Number (`03XX-XXXXXXX` format), Area selection, Complete Street Address, Landmark, Delivery notes.
* **Step 3 — Order Review:** Immutable itemized snapshot.
* **Step 4 — Payment Selection:** 
  - Cash on Delivery (COD) [Enabled & Recommended].
  - Pay at Takeaway Counter [Enabled for Pickup].
  - Online Card / Wallet [Marked as "Gateway Integration in Setup — Cash on Delivery Active"].
* **Step 5 — Submission & Order Receipt:** Submits to server action, locks client state, routes to `/order-confirmation/[orderId]`.

### 3.6 Order Tracking Timeline (`/track/[orderId]`)
* **Status Badges:** 7 verified lifecycle states:
  1. `Order Received` (Amber)
  2. `Order Confirmed` (Emerald)
  3. `Preparing in Kitchen` (Orange)
  4. `Ready for Pickup / Dispatch` (Violet)
  5. `Out for Delivery` (Blue)
  6. `Delivered / Completed` (Dark Emerald)
  7. `Cancelled` (Rose Red)
* **Realtime Updates:** Subscribed via Supabase Realtime channel for live status updates without page refreshing.

---

## 4. Accessibility & Performance Standards

* **Contrast Ratios:** Text color `#FFF7EA` on `#171311` achieves `17.4:1` (exceeding WCAG AAA standard of `7:1`).
* **Keyboard Navigation:** All interactive cards, modal dialogs, and navigation links support standard `Tab`, `Shift+Tab`, `Enter`, and `Escape` handlers. Focus rings use high-visibility crimson (`focus:ring-2 focus:ring-primary focus:outline-none`).
* **Touch Targets:** All mobile tap targets (category buttons, quantity steppers, cart triggers) maintain minimum dimensions of `48px x 48px`.
* **Motion Preferences:** All Framer Motion animations respect `prefers-reduced-motion: reduce`, defaulting instantly to final opacities and scales.

