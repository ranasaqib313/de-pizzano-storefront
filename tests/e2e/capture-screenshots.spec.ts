import { test } from '@playwright/test';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('docs/testing/phase-1');

test.describe('Phase 1 Visual Verification & Screenshot Capture', () => {
  test('Capture screenshots across key pages and responsive viewports', async ({ page }) => {
    // 1. Home Page Desktop (1440px)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-home-desktop-1440px.png'), fullPage: false });

    // 2. Home Page Mobile (390px - iPhone 12/13/14)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-home-mobile-390px.png'), fullPage: false });

    // 3. Menu Page with Product Customization Modal (1280px)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/menu');
    await page.waitForTimeout(400);
    const tikkaCard = page.locator('div.group').filter({ hasText: 'Chicken Tikka Pizza' }).first();
    await tikkaCard.getByRole('button', { name: /details/i }).click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-menu-customization-modal-1280px.png') });

    // Add item to cart
    await page.getByRole('dialog').getByRole('button', { name: /add to cart/i }).click();
    await page.waitForTimeout(500);

    // 4. Cart Drawer (1280px)
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-cart-drawer-1280px.png') });

    // 5. Dedicated Cart Page (1280px)
    await page.goto('/cart');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-cart-page-desktop-1280px.png'), fullPage: true });

    // 6. Cart Page Mobile (360px - Android Compact)
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/cart');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-cart-page-mobile-360px.png'), fullPage: true });

    // 7. Checkout Page Desktop (1280px)
    await page.setViewportSize({ width: 1280, height: 850 });
    await page.goto('/checkout');
    await page.getByPlaceholder(/Tariq Ahmed/i).fill('Salman Asif');
    await page.getByPlaceholder(/0318-2588631/i).fill('03182588631');
    await page.getByPlaceholder(/Flat 402, Murtaza Terrace/i).fill('Apartment 2B, Soldier Bazar No. 3');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-checkout-cod-desktop-1280px.png'), fullPage: true });

    // 8. Checkout Page Mobile (430px - iPhone Pro Max)
    await page.setViewportSize({ width: 430, height: 932 });
    await page.goto('/checkout');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-checkout-mobile-430px.png'), fullPage: true });

    // 9. Order Confirmation Page (1280px)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/order-confirmation?orderId=DPZ-2026-8921');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09-order-confirmation-1280px.png'), fullPage: true });

    // 10. Order Tracking Page with Status Timeline (1280px)
    await page.goto('/track?orderId=DPZ-2026-8921');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10-order-tracking-timeline-1280px.png'), fullPage: true });

    // 11. Order Tracking Tablet Viewport (768px - iPad)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/track?orderId=DPZ-2026-8921');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11-order-tracking-tablet-768px.png'), fullPage: true });

    // 12. My Orders Page (1280px)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/orders');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12-my-orders-history-1280px.png'), fullPage: true });

    // 13. Customer Login Page (1024px)
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/login');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13-customer-login-1024px.png') });

    // 14. Customer Registration Page (1024px)
    await page.goto('/register');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14-customer-register-1024px.png') });
  });
});

