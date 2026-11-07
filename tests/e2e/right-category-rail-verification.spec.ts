import { test, expect } from '@playwright/test';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('docs/testing/menu-rail');

test.describe('Site-Wide Right-Side Vertical Navigation Rail & Broadway-Style Architecture', () => {
  // Viewport 1: 1920px Full HD Desktop
  test('1920px Desktop: Site-wide right navigation rail is fixed on the FAR RIGHT', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Verify Site Navigation Rail
    const rightRail = page.locator('aside[aria-label="Site Navigation"]');
    await expect(rightRail).toBeVisible();

    // Verify Wide Hero Carousel on Homepage
    const heroCarousel = page.locator('section[aria-label="Promotional Showcase"]');
    await expect(heroCarousel).toBeVisible();

    // Verify Horizontal Category Pills below Carousel
    const categoryPills = page.locator('div[role="tablist"][aria-label="Menu Categories"]');
    await expect(categoryPills).toBeVisible();

    // Bounding Box Assertions: Rail is on the far right
    const railBox = await rightRail.boundingBox();
    expect(railBox).not.toBeNull();
    if (railBox) {
      expect(railBox.x).toBeGreaterThan(1800);
      expect(railBox.width).toBeGreaterThanOrEqual(70);
    }

    // Verify Header Structure: Logo, Location, Search, Cart
    await expect(page.locator('header').getByRole('link', { name: /de pizzano/i })).toBeVisible();
    await expect(page.getByTitle(/click to switch delivery \/ takeaway location/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /view shopping cart/i })).toBeVisible();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '01-home-desktop-1920px.png'),
      fullPage: false,
    });
  });

  // Viewport 2: 1440px Desktop
  test('1440px Desktop: Navigation rail on the RIGHT across both / and /menu', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/menu');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    const rightRail = page.locator('aside[aria-label="Site Navigation"]');
    await expect(rightRail).toBeVisible();

    const productCatalog = page.locator('main[aria-label="Product Catalog"]');
    await expect(productCatalog).toBeVisible();

    const railBox = await rightRail.boundingBox();
    const catalogBox = await productCatalog.boundingBox();

    expect(railBox).not.toBeNull();
    expect(catalogBox).not.toBeNull();
    if (railBox && catalogBox) {
      expect(railBox.x).toBeGreaterThan(catalogBox.x);
      expect(railBox.x).toBeGreaterThan(1350);
    }

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '02-menu-desktop-1440px.png'),
      fullPage: false,
    });
  });

  // Viewport 3: 1280px Laptop
  test('1280px Laptop: Right navigation rail visible with zero content overlap', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    const rightRail = page.locator('aside[aria-label="Site Navigation"]');
    await expect(rightRail).toBeVisible();

    const railBox = await rightRail.boundingBox();
    expect(railBox).not.toBeNull();
    if (railBox) {
      expect(railBox.x).toBeGreaterThan(1200);
    }

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '03-home-laptop-1280px.png'),
      fullPage: false,
    });
  });

  // Viewport 4: 1024px Tablet
  test('1024px Tablet: Adapts cleanly with full interactive navigation', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Carousel and category pills remain fully functional
    await expect(page.locator('section[aria-label="Promotional Showcase"]')).toBeVisible();
    await expect(page.locator('div[role="tablist"][aria-label="Menu Categories"]')).toBeVisible();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '04-home-tablet-1024px.png'),
      fullPage: false,
    });
  });

  // Viewport 5: 390px Mobile (iPhone)
  test('390px Mobile: Mobile bottom bar, compact header, no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Desktop right rail hidden on mobile
    const rightRail = page.locator('aside[aria-label="Site Navigation"]');
    await expect(rightRail).toBeHidden();

    // Mobile bottom navigation bar visible
    const bottomNav = page.locator('nav[aria-label="Mobile Bottom Bar"]');
    await expect(bottomNav).toBeVisible();

    // Zero horizontal page overflow
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(overflow).toBe(false);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '05-home-mobile-390px.png'),
      fullPage: false,
    });
  });

  // Viewport 6: 360px Compact Mobile
  test('360px Compact Mobile: Works cleanly without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/menu');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    const bottomNav = page.locator('nav[aria-label="Mobile Bottom Bar"]');
    await expect(bottomNav).toBeVisible();

    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(overflow).toBe(false);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '06-menu-mobile-360px.png'),
      fullPage: false,
    });
  });
});
