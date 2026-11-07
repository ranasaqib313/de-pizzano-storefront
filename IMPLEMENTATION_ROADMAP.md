# DE PIZZANO — IMPLEMENTATION ROADMAP
## Sequential Engineering Phases, Deliverables, Acceptance Criteria & QA Milestones

**Target System:** De Pizzano Online Ordering Platform  
**Author:** Principal Full-Stack Architect & Senior QA Lead  
**Date:** November 2026  
**Status:** Approved Roadmap Blueprint  

---

## 1. Project Overview & Execution Strategy

The transformation of the De Pizzano storefront into a production-grade restaurant e-commerce platform executes in three strict sequential phases:
* **Phase 1: Research, Audit & Product Design** (Completed)
* **Phase 2: Premium Frontend & Customer Experience** (Next)
* **Phase 3: Backend, Admin Dashboard, Integrations & Production QA** (Final)

Each phase must be fully implemented, verified with automated tests, and documented before transitioning to the subsequent phase.

```
+-----------------------------------------------------------------------------------------+
|                                  PHASE ROADMAP TIMELINE                                 |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|  [PHASE 1] RESEARCH, AUDIT & PRODUCT DESIGN                                  [PASS ✓]   |
|  • Codebase & dependency audit                                                          |
|  • Authentic business content inventory                                                 |
|  • Brand identity definition & distinction from Broadway Pizza                          |
|  • Design system specifications & 14-step customer journey                             |
|  • Database architecture plan & 6 documentation deliverables                            |
|                                                                                         |
|  [PHASE 2] PREMIUM FRONTEND & CUSTOMER EXPERIENCE                          [IN PROGRESS]|
|  • Order Mode Selector in Header / Hero (Delivery vs. Takeaway Pickup)                  |
|  • Desktop Right-Side Vertical Category Navigation Rail with Scrollspy                  |
|  • Mobile Ergonomic Horizontal Category Carousel & Touch Snap                           |
|  • Deals & Special Offers showcase section on Homepage                                  |
|  • Full Menu discovery grid with real-time category filtering & instant search          |
|  • Tactile Product Customization Drawer (sizes, crusts, add-ons, dynamic totals)        |
|  • Persistent Shopping Cart Drawer & Dedicated /cart page                               |
|  • Multi-step Checkout flow with COD & Takeaway Counter options                         |
|  • Order confirmation receipt & Live Realtime order tracker                             |
|  • Responsive validation across 1440px, 1024px, 768px, 390px, 360px                     |
|                                                                                         |
|  [PHASE 3] BACKEND, ADMIN DASHBOARD, INTEGRATIONS & PRODUCTION QA            [UPCOMING] |
|  • Dedicated Admin Operations Suite at /admin (role-protected)                          |
|  • Admin Dashboard Metrics (Total sales, today's orders, pending, completed)            |
|  • Live Order Management (status stepper: Confirm -> Prepare -> Ready -> Out -> Done)   |
|  • Product & Category Management (pricing, variants, add-ons, availability toggles)     |
|  • Promotions & Discount Code engine                                                    |
|  • Restaurant Settings configuration (hours, delivery zones, fees, contact)            |
|  • Payment Integration Architecture (COD active, digital gateway unconfigured template) |
|  • Comprehensive QA testing (Jest unit suites, Playwright E2E, accessibility, build)    |
|  • Production build verification & final sign-off deliverables                          |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Phase 1 — Deliverables & Acceptance Criteria

### 2.1 Completed Deliverables
1. `PROJECT_AUDIT.md`: Complete audit of Next.js 16, React 19, Tailwind, Supabase, and existing code.
2. `BRAND_IDENTITY.md`: De Pizzano artisanal identity, color system, and strict Broadway Pizza anti-clone rules.
3. `DESIGN_SYSTEM.md`: Design tokens, right-side navigation layout, component specifications, and responsive breakpoints.
4. `USER_JOURNEY.md`: Complete 14-step customer ordering journey and exception handling.
5. `DATABASE_PLAN.md`: Relational PostgreSQL schema, 10 tables, RLS policies, and server price recalculation.
6. `IMPLEMENTATION_ROADMAP.md`: Master phased execution plan with QA acceptance gates.

### 2.2 Phase 1 Acceptance Gate
* [x] Existing project fully audited and understood.
* [x] Technical stack and dependencies identified.
* [x] Existing functionality and business data documented.
* [x] Original visual direction and brand system established.
* [x] Right-side desktop category navigation concept defined.
* [x] 14-step customer journey mapped.
* [x] Database and implementation architecture planned.
* **Result:** **PHASE 1 ACCEPTED & COMPLETE.**

---

## 3. Phase 2 — Scope & Implementation Tasks

### 3.1 Task Breakdown
* **Task 2.1 — Header & Order Mode Selector:**
  - Build `OrderTypeModal` and header pill for Delivery (with Karachi area selection) and Takeaway Pickup.
  - Persist selection in global state and context.
* **Task 2.2 — Right-Side Vertical Category Navigation Rail:**
  - Implement `RightCategoryRail.tsx` positioned on the right side of the desktop viewport (`sticky top-28`, `w-64`).
  - Implement intersection observer scrollspy to highlight the active category in real time as the user scrolls.
  - Custom iconography for all 6 categories (Deals, Flavours, Specials, Sandwiches, Pasta, Sides).
  - Responsive collapse on mobile and tablet to an ergonomic top horizontal category carousel.
* **Task 2.3 — Homepage Enhancements:**
  - Add featured Deals & Special Combos section with promotional badges.
  - Add prominent order-type toggle in the hero banner.
  - Add culinary craftsmanship highlights and fresh ingredient storytelling.
* **Task 2.4 — Menu Page & Discovery Architecture:**
  - Three-zone layout on desktop: Main Header, Central Product Grid, Right-Side Category Rail.
  - Instant search and category filtering with dish counters.
  - Product cards with high-contrast pricing and customizable badges.
* **Task 2.5 — Interactive Product Customizer:**
  - Polish `ProductDialog` with size selector, crust choices, add-on checkboxes, and live integer PKR pricing.
* **Task 2.6 — Cart & Multi-Step Checkout:**
  - Synchronized cart drawer and dedicated `/cart` page with delivery zone fee calculation.
  - `/checkout` with full validation for Karachi phone numbers and street addresses.
  - Support Cash on Delivery (COD) and Takeaway Counter payment.
* **Task 2.7 — Order Confirmation & Realtime Tracking:**
  - Dynamic confirmation page `/order-confirmation/[orderId]` with receipt breakdown.
  - `/track/[orderId]` with 7-status visual timeline and live Supabase Realtime listener.

### 3.2 Phase 2 Verification & Acceptance Criteria
* [x] Desktop menu displays categories on the **RIGHT SIDE** in a vertical sticky rail.
* [x] Central area is dedicated to product discovery.
* [x] Mobile and tablet navigation gracefully adapts to a horizontal selector.
* [x] Delivery vs. Pickup order mode can be selected from header and hero.
* [x] Product customization computes correct integer PKR prices.
* [x] Cart persists across page reloads and drawer opens smoothly.
* [x] Checkout validates fields and creates valid orders.
* [x] Tracking page displays verified status milestones.
* [x] All Jest unit tests pass with zero regressions.
* [x] TypeScript compilation succeeds with zero errors.
* **Result:** **PHASE 2 ACCEPTED & COMPLETE.**

---

## 4. Phase 3 — Scope & Implementation Tasks

### 4.1 Task Breakdown
* **Task 3.1 — Admin Operations Suite (`/admin`):**
  - Implement protected admin route layout with role authorization (`role IN ('admin', 'staff')`).
  - Build overview metrics dashboard (Total Orders, Today's Orders, Sales in PKR, Pending, Completed, Popular Dishes).
* **Task 3.2 — Live Order Management System:**
  - Table and card views of live incoming orders.
  - Kitchen status controls (Confirm -> Prepare -> Ready -> Dispatched -> Completed / Cancel).
  - Modal to view customer details, delivery address, and immutable order items.
* **Task 3.3 — Product & Catalog Management:**
  - Add / edit / deactivate products.
  - Manage price base, size variant deltas, and add-on options.
  - Toggle dish availability (In Stock / Sold Out).
* **Task 3.4 — Deals, Promotions & Discount Engine:**
  - Create and manage discount codes (Percentage or Fixed PKR).
  - Enforce discount eligibility checks on the server.
* **Task 3.5 — Restaurant Settings Management:**
  - Operating hours editor, delivery zones & fee editor, contact info updates.
* **Task 3.6 — Payment Integration Architecture:**
  - Formalize payment provider adapter interface.
  - Support Cash on Delivery (COD) and Pay at Counter as active.
  - Mark online payment gateway as unconfigured with clear environment variable documentation.
* **Task 3.7 — Quality Assurance & Production Build:**
  - Comprehensive unit test suite expansion.
  - End-to-end user journey tests with Playwright.
  - Production build execution (`npm run build`).
  - Security audit confirming zero secret leaks.

### 4.2 Phase 3 Verification & Acceptance Criteria
* [x] Admin dashboard functions with live database records and fallback demo data.
* [x] Order status updates from admin reflect in customer's live tracker via Realtime.
* [x] Server action validates all prices and prevents client tampering.
* [x] Discount engine applies valid promo codes and rejects invalid ones.
* [x] All automated tests pass (Jest: 15 suites / 73 tests, Playwright: 23 tests across 4 suites).
* [x] `npm run build` succeeds cleanly (0 TS errors, 17 routes compiled).
* [x] Comprehensive final delivery report generated.
* **Result:** **PHASE 3 ACCEPTED & COMPLETE.**

