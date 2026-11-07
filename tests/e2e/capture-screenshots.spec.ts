import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const SCREENSHOT_DIR = path.resolve('SCREENSHOT_EVIDENCE');

test.describe('De Pizzano Master QA Visual Verification & Screenshot Capture', () => {
  test.beforeAll(async () => {
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
  });

  test('Capture screenshots across key pages, customer journeys, and responsive viewports', async ({ page }) => {
    test.setTimeout(180000);

    // 1. Home Page Desktop (1440px)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-home-desktop-1440px.png'), fullPage: false });

    // 2. Home Page Mobile (390px - iPhone 12/13/14)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-home-mobile-390px.png'), fullPage: false });

    // 3. Menu Page with Product Customization Modal (1280px)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/menu');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-menu-catalog-desktop-1280px.png'), fullPage: false });

    // Open customization modal on Tikka Pizza
    const tikkaCard = page.locator('div.group').filter({ hasText: 'Tikka' }).first();
    const customizeBtn = tikkaCard.getByRole('button', { name: /details|customize/i }).first();
    if (await customizeBtn.isVisible()) {
      await customizeBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-product-customization-modal-1280px.png') });

      // Add item to cart
      const addToCartBtn = page.getByRole('dialog').getByRole('button', { name: /add to cart/i });
      if (await addToCartBtn.isVisible()) {
        await addToCartBtn.click();
        await page.waitForTimeout(600);
      }
    }

    // 5. Cart Drawer (1280px)
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-cart-drawer-1280px.png') });

    // 6. Dedicated Cart Page (1280px)
    await page.goto('/cart');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-cart-page-desktop-1280px.png'), fullPage: true });

    // 7. Cart Page Mobile (360px - Android Compact)
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/cart');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-cart-page-mobile-360px.png'), fullPage: true });

    // 8. Checkout Page Desktop (1280px)
    await page.setViewportSize({ width: 1280, height: 850 });
    await page.goto('/checkout');
    await page.waitForTimeout(500);
    const fullNameInput = page.locator('#fullName');
    if (await fullNameInput.isVisible()) {
      await fullNameInput.fill('Salman Asif');
      const phoneInput = page.locator('#phone');
      if (await phoneInput.isVisible()) await phoneInput.fill('03182588631');
      const addressInput = page.locator('#streetAddress');
      if (await addressInput.isVisible()) await addressInput.fill('Flat 4B, Murtaza Terrace, Soldier Bazar No. 3');
    }
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-checkout-delivery-desktop-1280px.png'), fullPage: true });

    // 9. Checkout Page Mobile (430px - iPhone Pro Max)
    await page.setViewportSize({ width: 430, height: 932 });
    await page.goto('/checkout');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09-checkout-mobile-430px.png'), fullPage: true });

    // 10. Order Confirmation Page (1280px)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/order-confirmation?orderId=DP-20261108-9842');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10-order-confirmation-receipt-1280px.png'), fullPage: true });

    // 11. Order Tracking Page with Status Timeline (1280px)
    await page.goto('/track?orderId=DP-20261108-9842');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11-order-tracking-timeline-1280px.png'), fullPage: true });

    // 12. Order Tracking Tablet Viewport (768px - iPad)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/track?orderId=DP-20261108-9842');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12-order-tracking-tablet-768px.png'), fullPage: true });

    // 13. My Orders History (1280px)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/orders');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13-my-orders-history-1280px.png'), fullPage: true });

    // 14. Customer Login Page (1024px)
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/login');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14-customer-login-1024px.png') });

    // 15. Customer Registration Page (1024px)
    await page.goto('/register');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '15-customer-register-1024px.png') });

    // 16. Admin Dashboard Overview (1440px)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/admin');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '16-admin-dashboard-overview-1440px.png'), fullPage: true });

    // 17. Admin Live Order Queue (1440px)
    await page.goto('/admin/orders');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '17-admin-orders-queue-1440px.png'), fullPage: true });

    // 18. Admin Product Catalog (1440px)
    await page.goto('/admin/products');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '18-admin-products-catalog-1440px.png'), fullPage: true });

    // 19. Admin Categories (1440px)
    await page.goto('/admin/categories');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '19-admin-categories-1440px.png'), fullPage: true });

    // 20. Admin Deals & Promotions (1440px)
    await page.goto('/admin/deals');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '20-admin-deals-promotions-1440px.png'), fullPage: true });

    // 21. Admin Restaurant Settings (1440px)
    await page.goto('/admin/settings');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '21-admin-settings-operations-1440px.png'), fullPage: true });
  });
});
