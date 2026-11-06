import { test, expect } from '@playwright/test';

const ROUTES_TO_TEST = [
  '/',
  '/menu',
  '/cart',
  '/checkout',
  '/order-confirmation?orderId=DPZ-2026-8921',
  '/track?orderId=DPZ-2026-8921',
  '/orders',
  '/login',
  '/register',
  '/about',
  '/locations',
  '/contact',
];

test.describe('Zero Console Errors Across All Routes', () => {
  for (const route of ROUTES_TO_TEST) {
    test(`Route ${route} loads with 0 console errors`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      page.on('pageerror', (err) => {
        consoleErrors.push(err.message);
      });

      await page.goto(route);
      await page.waitForTimeout(300);

      expect(consoleErrors).toEqual([]);
    });
  }
});

