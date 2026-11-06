import { test, expect } from '@playwright/test';

test.describe('Phase 2 — Authentication & Storefront Database Integration', () => {
  test('Login page renders Google OAuth button, form fields and validation', async ({ page }) => {
    await page.goto('/login');

    // Title and headings
    await expect(page.getByRole('heading', { name: /customer login/i })).toBeVisible();

    // Google OAuth button presence
    const googleButton = page.getByRole('button', { name: /continue with google/i });
    await expect(googleButton).toBeVisible();

    // Email and Password inputs
    const emailInput = page.locator('input#login-email');
    const passwordInput = page.locator('input#login-password');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // Submit button
    const submitButton = page.getByRole('button', { name: /sign in to account/i });
    await expect(submitButton).toBeVisible();

    // Client validation when submitted empty
    await submitButton.click();
    await expect(page.getByText(/please enter a valid email address/i)).toBeVisible();
    await expect(page.getByText(/password must be at least 6 characters/i)).toBeVisible();
  });

  test('Register page renders Google OAuth button and creates account validation', async ({ page }) => {
    await page.goto('/register');

    // Title
    await expect(page.getByRole('heading', { name: /create customer account/i })).toBeVisible();

    // Google OAuth button presence
    await expect(page.getByRole('button', { name: /sign up with google/i })).toBeVisible();

    // Form inputs
    await expect(page.locator('input#register-name')).toBeVisible();
    await expect(page.locator('input#register-email')).toBeVisible();
    await expect(page.locator('input#register-password')).toBeVisible();
    await expect(page.locator('input#register-confirm-password')).toBeVisible();

    // Submit button
    const submitButton = page.getByRole('button', { name: /complete registration/i });
    await expect(submitButton).toBeVisible();

    // Submit empty to trigger validation
    await submitButton.click();
    await expect(page.getByText(/please enter your full name/i)).toBeVisible();
  });

  test('Navbar displays Customer Login / Account link when not authenticated', async ({ page }) => {
    await page.goto('/');

    const accountLink = page.locator('header a[href="/login"]').first();
    await expect(accountLink).toBeVisible();
    expect(await accountLink.getAttribute('href')).toBe('/login');
  });

  test('Menu page displays subtle data source indicator', async ({ page }) => {
    await page.goto('/menu');

    const indicator = page.locator('[data-testid="menu-data-source-indicator"]');
    await expect(indicator).toBeVisible();
    const text = await indicator.textContent();
    expect(text).toMatch(/(Live Data|Demo Data)/);
  });

  test('Orders page displays PostgreSQL RLS security banner and sign in prompt', async ({ page }) => {
    await page.goto('/orders');

    await expect(page.getByRole('heading', { name: /my orders/i })).toBeVisible();
    await expect(page.getByText(/row level security/i).or(page.getByText(/client session & demo orders/i))).toBeVisible();
  });
});
