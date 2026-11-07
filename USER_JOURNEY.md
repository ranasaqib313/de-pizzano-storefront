# DE PIZZANO — CUSTOMER JOURNEY & EXPERIENCE ARCHITECTURE
## End-to-End 14-Step Ordering Lifecycle, State Transitions & Edge Cases

**Entity:** De Pizzano Restaurant (Soldier Bazar No. 3, Karachi)  
**Role:** Principal UX Engineer & E-Commerce Architect  
**Date:** November 2026  
**Status:** Approved Operational Journey  

---

## 1. Complete 14-Step Customer Journey Map

The De Pizzano ordering platform implements a frictionless, high-trust 14-step workflow tailored for modern online food ordering and Karachi residential logistics.

```
+-----------------------------------------------------------------------------------------+
|                                14-STEP CUSTOMER JOURNEY FLOW                            |
+-----------------------------------------------------------------------------------------+
|  [Step 1]  Visit Storefront Website                                                     |
|      ↓                                                                                  |
|  [Step 2]  Select Order Type (Delivery or Takeaway Pickup)                              |
|      ↓                                                                                  |
|  [Step 3]  Select / Confirm Delivery Location & Neighbourhood (Soldier Bazar / Garden)  |
|      ↓                                                                                  |
|  [Step 4]  Browse Menu (Central product stream + Desktop Right-Side Category Rail)       |
|      ↓                                                                                  |
|  [Step 5]  Explore Product Details (Ingredients, sizes, chef recommendations)           |
|      ↓                                                                                  |
|  [Step 6]  Customize Product (Crust type, size variant, dips, toppings, notes)          |
|      ↓                                                                                  |
|  [Step 7]  Add to Cart (Real-time cart badge update & slide-over confirmation)          |
|      ↓                                                                                  |
|  [Step 8]  Review Order (Cart Drawer / Dedicated Cart Page with integer PKR summary)    |
|      ↓                                                                                  |
|  [Step 9]  Enter Customer Information (Name, Mobile Phone, Street Address, Landmark)   |
|      ↓                                                                                  |
|  [Step 10] Confirm Delivery / Pickup Details (Fulfillment window & rider notes)         |
|      ↓                                                                                  |
|  [Step 11] Choose Payment Method (Cash on Delivery / Takeaway Counter / Online Gateway) |
|      ↓                                                                                  |
|  [Step 12] Confirm Order & Server Price Recalculation (Cryptographic Server Action)     |
|      ↓                                                                                  |
|  [Step 13] Order Confirmation & Printable Receipt (Unique Order ID: DP-YYYYMMDD-XXXX)  |
|      ↓                                                                                  |
|  [Step 14] Live Order Tracking (Supabase Realtime updates across 7 kitchen milestones)  |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Step-by-Step Experience Specifications

### Step 1: Visit Storefront Website
* **Customer State:** Discovery / Hungry.
* **Interface:** High-impact hero section showcasing artisanal oven-baked pizzas, value badges, and clear action buttons.
* **System Action:** Initializes anonymous session, loads cached menu metadata, checks localStorage for saved customer preferences.

### Step 2: Select Order Type
* **Customer State:** Deciding fulfillment mode.
* **Interface:** Header modal or Hero toggle offering:
  - `🛵 Delivery:` Food delivered hot to customer's home or office.
  - `🏪 Takeaway Pickup:` Customer collects directly from Soldier Bazar No. 3 counter.
* **System Action:** Updates global context with order type; adjusts delivery fee calculations accordingly (takeaway delivery fee = Rs. 0).

### Step 3: Select or Confirm Delivery Location
* **Customer State:** Specifying area.
* **Interface:** Interactive neighbourhood selector featuring verified Karachi zones:
  - *Zone A (Local):* Soldier Bazar, Garden East/West, Patel Para (Fee: Rs. 100).
  - *Zone B (Central):* Saddar, Lines Area, Jamshed Road, PECHS (Fee: Rs. 150).
  - *Zone C (Extended):* Bahadurabad, Gulshan-e-Iqbal Block 13, Tariq Road (Fee: Rs. 200).
* **System Action:** Validates delivery zone availability and locks the base fee into the cart calculations.

### Step 4: Browse the Menu
* **Customer State:** Exploring food offerings.
* **Interface:**
  - **Desktop:** Central product showcase paired with the **Right-Side Vertical Category Rail**. As customer scrolls down the dishes, the right rail automatically highlights the active category. Customer can click any category in the right rail to jump directly to it.
  - **Mobile:** Sticky horizontal category carousel pinned at top, smooth scroll snapping to category sections.
  - Search input with instantaneous filtering by title, ingredients, or category.
* **System Action:** Fetches dishes from Supabase PostgreSQL (with zero-crash fallback to verified local dataset).

### Step 5: Explore Product Details
* **Customer State:** Inspecting a specific dish.
* **Interface:** High-resolution dish photography, ingredient listing, spice level indicators, and starting price.
* **System Action:** Reads variants (Small/Regular/Large) and available option groups from database.

### Step 6: Customize Product
* **Customer State:** Tailoring order to personal taste.
* **Interface:** `ProductDialog` drawer/modal:
  - Pizza Size: Small 9" (Rs. 400), Regular 11" (Rs. 750), Large 13" (Rs. 1,000).
  - Crust Selection: Traditional Pan Crust, Thin & Crispy, Cheese Stuffed Crust (+Rs. 200).
  - Extra Add-ons: Extra Cheese (+Rs. 150), Ranch Dip (+Rs. 80), Garlic Mayo Dip (+Rs. 80).
  - Special Instructions textarea ("Well done crust", "Extra spicy sauce").
  - Live price counter updating dynamically with every selection.
* **System Action:** Validates required variant selections before allowing addition to cart.

### Step 7: Add Items to Cart
* **Customer State:** Decided on item.
* **Interface:** Customer taps "Add to Order (Rs. X)". Visual button feedback with checkmark icon and cart badge counter bump animation.
* **System Action:** Serializes item configuration, calculates item subtotal, appends to `CartContext`, synchronizes to `localStorage`.

### Step 8: Review the Order
* **Customer State:** Verifying basket before checkout.
* **Interface:** Slide-over `CartDrawer` or dedicated `/cart` page:
  - Itemized rows with custom option badges.
  - Quantity steppers `[- 1 +]`.
  - Item deletion button with confirmation.
  - Summary card displaying Subtotal, Delivery Fee, Discounts, and Final Total in whole integer PKR.
* **System Action:** Verifies that cart is not empty and minimum order threshold (Rs. 300) is satisfied.

### Step 9: Enter Customer Information
* **Customer State:** Providing contact & fulfillment details.
* **Interface:** `/checkout` form:
  - Full Name (required, min 2 chars).
  - Primary Contact Number (required, formatted `03XX-XXXXXXX`).
  - Secondary Contact Number (optional).
  - Street Address & Apartment/House number.
  - Nearby Landmark (crucial for Karachi courier dispatch).
  - Specific delivery notes for rider.
* **System Action:** Client-side regex validation prevents malformed numbers and incomplete street addresses.

### Step 10: Confirm Delivery or Pickup Details
* **Customer State:** Final check of destination and estimated timeline.
* **Interface:** Summary banner displaying delivery destination, estimated preparation & dispatch window (35–45 minutes for delivery, 20 minutes for pickup).
* **System Action:** Recalculates fulfillment window based on restaurant operating hours and order volume.

### Step 11: Choose Payment Method
* **Customer State:** Selecting settlement method.
* **Interface:**
  - `Cash on Delivery (COD):` Customer pays cash to rider upon delivery [Active].
  - `Pay at Counter:` Customer pays cash or card at Soldier Bazar takeaway counter [Active for Pickup].
  - `Debit/Credit Card (Online):` Marked as "Digital Gateway Integration in Progress — COD Currently Active".
* **System Action:** Locks payment mode to verified method; no imaginary cards or fake payment approvals are accepted.

### Step 12: Confirm the Order
* **Customer State:** Submitting final order.
* **Interface:** "Confirm & Place Order" button with loading spinner and disabled state to prevent duplicate submissions.
* **System Action:** Dispatches `placeOrderAction` (Server Action). Server recalculates all prices directly against PostgreSQL database, validates item availability, creates record in `orders` and `order_items` tables, creates initial entry in `order_status_history`, and clears client cart.

### Step 13: Order Confirmation
* **Customer State:** Reassured that order is received.
* **Interface:** `/order-confirmation/[orderId]` displaying:
  - Formatted Order Number: `DP-20261107-XXXX`.
  - Clear success checkmark and estimated arrival countdown.
  - Full itemized receipt with exact price snapshot.
  - Delivery address and phone number for courier reference.
  - Link to "Track Order in Realtime".
* **System Action:** Generates persistent receipt; persists order ID in customer's local session history.

### Step 14: Live Order Status Tracking
* **Customer State:** Monitoring delivery progress.
* **Interface:** `/track/[orderId]` featuring:
  - Interactive 7-stage visual milestone stepper.
  - Realtime badge updating instantly when restaurant staff updates status in kitchen dashboard.
  - Direct telephone contact link to restaurant dispatch (`+92 318 2588631`).
* **System Action:** Establishes Supabase Realtime channel subscription on `public:orders:id=eq.[orderId]` with automatic reconnect logic.

---

## 3. Edge Cases & Exception Handling

1. **Item Becomes Sold Out During Customization:** If a dish or variant is marked inactive by the restaurant admin before order placement, `placeOrderAction` rejects the transaction with a friendly message: *"Sorry, [Item Name] is currently unavailable. Please adjust your cart."*
2. **Network Interruption During Checkout:** Idempotency protection ensures that if a customer retries a dropped connection, duplicate orders are prevented by verifying customer session keys.
3. **Invalid Delivery Area:** If customer enters an address outside Karachi service zones, system politely prompts: *"Currently, De Pizzano delivers within Soldier Bazar and surrounding central Karachi areas. Takeaway pickup is available for all customers."*
4. **Offline Database Fallback:** If Supabase connection is temporarily unavailable, menu discovery gracefully switches to Phase 1 verified data while clearly alerting user if live order dispatch requires telephone fallback.

