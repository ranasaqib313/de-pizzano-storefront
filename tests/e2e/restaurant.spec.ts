import { test, expect } from '@playwright/test';

test.describe('De Pizzano Restaurant Web Experience', () => {
  test('1. Homepage loads with brand identity and hero content', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/De Pizzano/i);
    await expect(page.getByText('BIG FLAVOURS. UNFORGETTABLE BITES.')).toBeVisible();
    await expect(page.getByText('INDEPENDENT WEBSITE CONCEPT — FOR OWNER REVIEW')).toBeVisible();
  });

  test('2. Navbar navigation links exist and are functional', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Desktop nav links are replaced by hamburger drawer on mobile');
    await page.goto('/');
    const nav = page.locator('header nav');
    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Menu' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Locations' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Contact' })).toBeVisible();
  });

  test('3, 4 & 5. Menu page displays all 6 categories and all 26 products', async ({ page }) => {
    await page.goto('/menu');
    await expect(page).toHaveTitle(/Full Menu/i);

    // Verify all 6 category filters exist
    await expect(page.getByRole('button', { name: /all items/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /starters/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /regular pizza/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /special pizza/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sandwiches/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /pastas/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /fried items/i })).toBeVisible();

    // Verify total counter shows 26 items
    await expect(page.getByText('Showing 26 of 26 items')).toBeVisible();

    // Verify presence of sample products across categories
    await expect(page.getByText('Garlic Bread')).toBeVisible();
    await expect(page.getByText('Chicken Tikka Pizza')).toBeVisible();
    await expect(page.getByText('Pizzano Max Chicken Pizza')).toBeVisible();
    await expect(page.getByText('Chicken Sandwich')).toBeVisible();
    await expect(page.getByText('Creamy Pasta')).toBeVisible();
    await expect(page.getByText('Large Pizza Fries')).toBeVisible();
  });

  test('6. Every category filter correctly filters items', async ({ page }) => {
    await page.goto('/menu');

    // Filter: Starters (4 items)
    await page.getByRole('button', { name: /starters/i }).click();
    await expect(page.getByText(/in Starters/i)).toBeVisible();
    await expect(page.getByText('Garlic Bread')).toBeVisible();
    await expect(page.getByText('Cheesy Stick')).toBeVisible();

    // Filter: Regular Pizza (11 items)
    await page.getByRole('button', { name: /regular pizza/i }).click();
    await expect(page.getByText(/in Regular Pizza/i)).toBeVisible();
    await expect(page.getByText('Chicken Tikka Pizza')).toBeVisible();

    // Filter: Special Pizza (5 items)
    await page.getByRole('button', { name: /special pizza/i }).click();
    await expect(page.getByText(/in Special Pizza/i)).toBeVisible();
    await expect(page.getByText('Pizzano Max Chicken Pizza')).toBeVisible();

    // Filter: Sandwiches (2 items)
    await page.getByRole('button', { name: /sandwiches/i }).click();
    await expect(page.getByText(/in Sandwiches/i)).toBeVisible();
    await expect(page.getByText('Chicken Sandwich')).toBeVisible();

    // Filter: Pastas (2 items)
    await page.getByRole('button', { name: /pastas/i }).click();
    await expect(page.getByText(/in Pastas/i)).toBeVisible();
    await expect(page.getByText('Creamy Pasta')).toBeVisible();

    // Filter: Fried Items (2 items)
    await page.getByRole('button', { name: /fried items/i }).click();
    await expect(page.getByText(/in Fried Items/i)).toBeVisible();
    await expect(page.getByText('Large Pizza Fries')).toBeVisible();
  });

  test('7, 8 & 9. Menu search, combination with filter, and reset', async ({ page }) => {
    await page.goto('/menu');
    const searchInput = page.getByPlaceholder(/search menu/i);

    // Search for "lasagne"
    await searchInput.fill('lasagne');
    await expect(page.getByText(/matching "lasagne"/i)).toBeVisible();
    await expect(page.getByText('Chicken Lasagne')).toBeVisible();

    // Clear search using clear button
    await page.getByLabel('Clear Search').click();
    await expect(page.getByText('Chicken Tikka Pizza')).toBeVisible();

    // Combined filter + search
    await page.getByRole('button', { name: /regular pizza/i }).click();
    await searchInput.fill('fajita');
    await expect(page.getByText('Chicken Fajita Pizza')).toBeVisible();
    await expect(page.getByText('Fajita Sicillian Pizza')).toBeVisible();

    // Reset filters
    await page.getByText('Reset Filters').click();
    await expect(page.getByText('Garlic Bread')).toBeVisible();
  });

  test('10. Product pricing displays starting rates accurately', async ({ page }) => {
    await page.goto('/menu');
    await expect(page.getByText('Starting at Rs. 200')).toBeVisible(); // Garlic Bread
    await expect(page.getByText('Rs. 550').first()).toBeVisible(); // Cheesy Stick / Sandwich
    await expect(page.getByText('Starting at Rs. 750').first()).toBeVisible(); // Pizzas
  });

  test('11, 12 & 13. Google Maps link is accurate', async ({ page }) => {
    await page.goto('/contact');

    // Maps link
    const mapLink = page.getByRole('link', { name: /open google maps/i });
    expect(await mapLink.getAttribute('href')).toContain('Soldier+Bazar');
  });

  test('14, 15 & 16. About, Locations, and Contact pages load cleanly', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { name: 'ABOUT DE PIZZANO' })).toBeVisible();

    await page.goto('/locations');
    await expect(page.getByRole('heading', { name: 'VISIT DE PIZZANO' })).toBeVisible();

    await page.goto('/contact');
    await expect(page.getByRole('heading', { name: 'GET IN TOUCH' })).toBeVisible();
  });

  test('17 & 18. Mobile menu opens, closes via Escape key and button', async ({ page }) => {
    // Set small mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Open mobile menu
    const openBtn = page.getByLabel('Open Navigation Menu');
    await expect(openBtn).toBeVisible();
    await openBtn.click();

    const dialog = page.getByRole('dialog', { name: 'Navigation Menu' });
    await expect(dialog).toBeVisible();

    // Press Escape to close
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('19 & 20. Gallery displays food images, supports category filtering and lightbox with Escape', async ({ page }) => {
    await page.goto('/');

    // Scroll to Gallery
    const gallerySection = page.locator('section').filter({ hasText: /CULINARY SHOWCASE/i });
    await expect(gallerySection).toBeVisible();

    // Verify category filter buttons exist
    await expect(gallerySection.getByRole('button', { name: 'All' })).toBeVisible();
    await expect(gallerySection.getByRole('button', { name: 'Pizzas' })).toBeVisible();
    await expect(gallerySection.getByRole('button', { name: 'Starters' })).toBeVisible();

    // Verify gallery images render
    const tikkaCard = gallerySection.getByText('Chicken Tikka Pizza');
    await expect(tikkaCard).toBeVisible();

    // Click to open lightbox
    await tikkaCard.click();

    // Lightbox modal appears
    const closeBtn = page.getByLabel('Close lightbox');
    await expect(closeBtn).toBeVisible();

    // Press Escape to close lightbox
    await page.keyboard.press('Escape');
    await expect(closeBtn).not.toBeVisible();

    // Filter by 'Starters'
    await gallerySection.getByRole('button', { name: 'Starters' }).click();
    await expect(gallerySection.getByRole('heading', { name: 'Crispy Chicken Wings' })).toBeVisible();
    await expect(gallerySection.getByRole('heading', { name: 'Toasted Garlic Bread' })).toBeVisible();

    // Re-open lightbox from filtered item
    await gallerySection.getByRole('heading', { name: 'Crispy Chicken Wings' }).click();
    await expect(page.getByLabel('Close lightbox')).toBeVisible();

    // Close via close button
    await page.getByLabel('Close lightbox').click();
    await expect(page.getByLabel('Close lightbox')).not.toBeVisible();
  });

  test('21 & 22. No broken images and no horizontal overflow', async ({ page }) => {
    await page.goto('/');
    
    // Check no horizontal scrollbar
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);

    // Scroll down to trigger lazy loading of below-the-fold images
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);

    // Check images loaded
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const isVisible = await img.isVisible();
      if (isVisible) {
        await img.evaluate(async (el: HTMLImageElement) => {
          if (!el.complete) {
            await new Promise((resolve) => {
              el.onload = resolve;
              el.onerror = resolve;
            });
          }
        });
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
      }
    }
  });
});
