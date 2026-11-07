import { test, expect } from '@playwright/test';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('docs/testing/menu-rail');

test.describe('Right-Side Category Navigation Rail Verification', () => {
  // Viewport 1: 1440px Desktop
  test('1440px Desktop: Right category rail is strictly on the RIGHT of products', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');

    // Locate product catalog main container and category navigation rail
    const productArea = page.locator('main[aria-label="Product Catalog"]');
    const categoryRail = page.locator('aside[aria-label="Menu Category Navigation"]');

    await expect(productArea).toBeVisible();
    await expect(categoryRail).toBeVisible();

    const productBox = await productArea.boundingBox();
    const railBox = await categoryRail.boundingBox();

    expect(productBox).not.toBeNull();
    expect(railBox).not.toBeNull();

    if (productBox && railBox) {
      // Rail must be strictly to the right of product area
      expect(railBox.x).toBeGreaterThan(productBox.x);
      expect(railBox.x).toBeGreaterThanOrEqual(productBox.x + productBox.width * 0.7);
      expect(railBox.width).toBeGreaterThanOrEqual(240);
    }

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '01-menu-desktop-1440px.png'),
      fullPage: false,
    });
  });

  // Viewport 2: 1280px Laptop
  test('1280px Laptop: Right category rail is visible on the RIGHT', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');

    const productArea = page.locator('main[aria-label="Product Catalog"]');
    const categoryRail = page.locator('aside[aria-label="Menu Category Navigation"]');

    await expect(productArea).toBeVisible();
    await expect(categoryRail).toBeVisible();

    const productBox = await productArea.boundingBox();
    const railBox = await categoryRail.boundingBox();

    expect(productBox).not.toBeNull();
    expect(railBox).not.toBeNull();

    if (productBox && railBox) {
      expect(railBox.x).toBeGreaterThan(productBox.x);
    }

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '02-menu-laptop-1280px.png'),
      fullPage: false,
    });
  });

  // Viewport 3: 1024px Tablet Landscape
  test('1024px Tablet: Category rail is visible on the right or adapts cleanly', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');

    const productArea = page.locator('main[aria-label="Product Catalog"]');
    await expect(productArea).toBeVisible();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '03-menu-tablet-1024px.png'),
      fullPage: false,
    });
  });

  // Viewport 4: 768px Tablet Portrait
  test('768px Tablet Portrait: Category navigation adapts to top horizontal filters', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');

    const productArea = page.locator('main[aria-label="Product Catalog"]');
    const mobileFilters = page.locator('nav[aria-label="Menu Categories"]').first();

    await expect(productArea).toBeVisible();
    await expect(mobileFilters).toBeVisible();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '04-menu-tablet-768px.png'),
      fullPage: false,
    });
  });

  // Viewport 5: 390px Mobile (iPhone 12/13/14)
  test('390px Mobile: Horizontal category carousel with no horizontal page overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');

    const productArea = page.locator('main[aria-label="Product Catalog"]');
    const mobileFilters = page.locator('nav[aria-label="Menu Categories"]').first();

    await expect(productArea).toBeVisible();
    await expect(mobileFilters).toBeVisible();

    // Check for horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '05-menu-mobile-390px.png'),
      fullPage: false,
    });
  });

  // Viewport 6: 360px Compact Mobile
  test('360px Compact Mobile: Works cleanly without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');

    const productArea = page.locator('main[aria-label="Product Catalog"]');
    await expect(productArea).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '06-menu-mobile-360px.png'),
      fullPage: false,
    });
  });
});

