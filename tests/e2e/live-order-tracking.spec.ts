import { test, expect } from '@playwright/test';

test.describe('Phase 5 — Customer Live Order Tracking & Status Sync', () => {
  const TEST_ORDER_ID = 'DPZ-2026-8921';

  test('1. Navigating to /track/[orderId] displays live timeline, sync indicator, and order details', async ({
    page,
  }) => {
    await page.goto(`/track/${TEST_ORDER_ID}`);

    // Wait for the tracking view to load
    await expect(page.getByText(/Live Dispatch Timeline/i)).toBeVisible();

    // Verify Official Order Reference
    await expect(page.getByText(TEST_ORDER_ID)).toBeVisible();

    // Verify Realtime / Polling Sync Status Indicator
    const syncIndicator = page.locator('text=/Live Sync Active|Polling Active/i');
    await expect(syncIndicator).toBeVisible();

    // Verify All 6 Required Milestone Steps in the Visual Stepper
    await expect(page.getByRole('heading', { name: /Order Received/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Restaurant Accepted/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /In the Kitchen/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Waiting for Rider/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Rider on the way/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /^Delivered/i })).toBeVisible();

    // Verify Current Step Badge is visible on the active milestone
    await expect(page.getByText('Current Step')).toBeVisible();

    // Verify Order Summary & Pricing Details
    await expect(page.getByText(/Order Summary/i)).toBeVisible();
    await expect(page.getByText(/Subtotal/i)).toBeVisible();
    await expect(page.getByText(/Delivery Fee/i)).toBeVisible();
    await expect(page.getByText(/Grand Total/i)).toBeVisible();
    await expect(page.getByText(/Cash on Delivery/i).first()).toBeVisible();

    // Verify Delivery Information
    await expect(page.getByText(/Delivery Information/i)).toBeVisible();
    await expect(page.getByTestId('tracker-delivery-address')).toContainText(/Soldier Bazar/i);

    // Verify "Need Help?" Card and Phone Button
    await expect(page.getByText(/Need Help With Your Order\?/i)).toBeVisible();
    const callButton = page.getByRole('link', { name: /Call Kitchen/i });
    await expect(callButton).toBeVisible();
    await expect(callButton).toHaveAttribute('href', /^tel:/);
  });

  test('2. /orders page contains "Track Order" button linking directly to /track/[orderId]', async ({
    page,
  }) => {
    // Seed an order in local session so /orders renders an active order card
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'depizzano_recent_orders',
        JSON.stringify([
          {
            id: 'DPZ-2026-8921',
            createdAt: new Date().toISOString(),
            customer: { fullName: 'Salman Asif', phone: '03182588631', email: 'test@depizzano.demo' },
            deliveryAddress: { streetAddress: 'Apartment 2B, Murtaza Terrace', area: 'Soldier Bazar No. 3', city: 'Karachi' },
            items: [{ id: 'item-1', name: 'Tikka Pizza', unitPrice: 750, quantity: 1, totalPrice: 750 }],
            pricing: { subtotal: 750, deliveryFee: 100, platformFee: 0, discount: 0, total: 850 },
            paymentMethod: 'Cash on Delivery',
            status: 'Confirmed',
          },
        ])
      );
    });

    await page.goto('/orders');

    // Wait for orders page
    await expect(page.getByRole('heading', { name: /MY ORDERS/i })).toBeVisible();

    // Find Track Order button specifically inside the order card list
    const trackButton = page.getByTestId('order-card-track-btn').first();
    await expect(trackButton).toBeVisible({ timeout: 15000 });

    // Get href attribute and verify it matches /track/[orderId]
    const href = await trackButton.getAttribute('href');
    expect(href).toMatch(/\/track\/[a-zA-Z0-9_-]+/);

    // Click track button and wait for navigation
    await Promise.all([
      page.waitForURL(/\/track\/.+/, { timeout: 15000 }),
      trackButton.click(),
    ]);

    // Verify navigated to tracking page
    await expect(page).toHaveURL(/\/track\/.+/);
    await expect(page.getByText(/Live Dispatch Timeline/i)).toBeVisible();
  });

  test('3. General /track page search form navigates to /track/[orderId]', async ({
    page,
  }) => {
    await page.goto('/track');

    // Check heading
    await expect(page.getByRole('heading', { name: /TRACK YOUR PIZZA ORDER/i })).toBeVisible();

    // Fill in order reference search input
    const searchInput = page.locator('#order-search');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('DP-20261107-9999');

    // Click Track Live Order button and wait for navigation
    const submitBtn = page.getByRole('button', { name: /Track Live Order/i });
    await expect(submitBtn).toBeEnabled();

    await Promise.all([
      page.waitForURL('**/track/DP-20261107-9999', { timeout: 15000 }),
      submitBtn.click(),
    ]);

    // Verify URL navigated to /track/DP-20261107-9999
    await expect(page).toHaveURL(/\/track\/DP-20261107-9999/);
  });

  test('4. Live tracker dynamically updates UI when order status changes', async ({
    page,
  }) => {
    // Seed initial order in localStorage as "Pending"
    await page.addInitScript(() => {
      const initialOrder = {
        id: 'DPZ-E2E-LIVE-001',
        createdAt: new Date().toISOString(),
        customer: { fullName: 'Ali Hassan', phone: '+923001234567', email: 'ali@test.com' },
        deliveryAddress: {
          fullName: 'Ali Hassan',
          phone: '+923001234567',
          streetAddress: 'Flat 4B, Soldier Bazar No. 3',
          area: 'Soldier Bazar No. 3',
          city: 'Karachi',
        },
        items: [
          {
            id: 'item-1',
            productId: 'chicken-tikka-pizza',
            name: 'Chicken Tikka Pizza',
            image: '/images/menu/chicken-tikka-pizza.jpg',
            category: 'regular-pizza',
            unitPrice: 1200,
            quantity: 1,
            totalPrice: 1200,
            selectedOptions: [],
          },
        ],
        pricing: { subtotal: 1200, deliveryFee: 150, platformFee: 0, discount: 0, total: 1350 },
        paymentMethod: 'Cash on Delivery',
        status: 'Pending',
        statusHistory: [
          { status: 'Pending', timestamp: new Date().toISOString(), note: 'Order placed' },
        ],
        estimatedDeliveryMinutes: 35,
        isDemoOrder: true,
      };
      localStorage.setItem('depizzano_latest_order', JSON.stringify(initialOrder));
    });

    await page.goto('/track/DPZ-E2E-LIVE-001');

    // Confirm initial status is Pending
    await expect(page.getByText('DPZ-E2E-LIVE-001')).toBeVisible();

    // Now simulate external status update (e.g. from Admin or Realtime DB) to "Preparing"
    await page.evaluate(() => {
      const stored = localStorage.getItem('depizzano_latest_order');
      if (stored) {
        const order = JSON.parse(stored);
        order.status = 'Preparing';
        order.statusHistory.push({
          status: 'Preparing',
          timestamp: new Date().toISOString(),
          note: 'Stone baking in oven',
        });
        localStorage.setItem('depizzano_latest_order', JSON.stringify(order));
      }
    });

    // Trigger refresh button on tracker
    const refreshBtn = page.getByRole('button', { name: /Refresh order status/i });
    await refreshBtn.click();

    // Verify status badge changed to Baking in Oven / Preparing
    await expect(page.locator('span:has-text("Baking in Oven")').first()).toBeVisible();

    // Now simulate final status "Out for Delivery"
    await page.evaluate(() => {
      const stored = localStorage.getItem('depizzano_latest_order');
      if (stored) {
        const order = JSON.parse(stored);
        order.status = 'Out for Delivery';
        order.statusHistory.push({
          status: 'Out for Delivery',
          timestamp: new Date().toISOString(),
          note: 'Rider dispatched',
        });
        localStorage.setItem('depizzano_latest_order', JSON.stringify(order));
      }
    });

    await refreshBtn.click();

    // Verify UI reflects "Rider on the Way"
    await expect(page.locator('span:has-text("Rider on the Way")').first()).toBeVisible();
  });
});
