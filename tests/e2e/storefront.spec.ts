import { test, expect } from '@playwright/test';

test.describe('De Pizzano Customer Storefront & Ordering Flow', () => {
  test('1. Product customization modal allows selecting size, crust, add-ons and adding to cart', async ({
    page,
  }) => {
    await page.goto('/menu');

    // Click Details on Chicken Tikka Pizza
    const tikkaCard = page.locator('div.group').filter({ hasText: 'Chicken Tikka Pizza' }).first();
    await tikkaCard.getByRole('button', { name: /details/i }).click();

    // Verify dialog opened
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Chicken Tikka Pizza')).toBeVisible();

    // Verify size buttons exist (Small, Regular, Large)
    await expect(dialog.getByText('Small (9")')).toBeVisible();
    await expect(dialog.getByText(/Regular \/ Medium/i)).toBeVisible();
    await expect(dialog.getByText('Large (13")')).toBeVisible();

    // Select Large size
    await dialog.getByText('Large (13")').click();

    // Select Cheese Stuffed Crust (+ Rs. 200)
    await dialog.getByText('Cheese Stuffed Crust').click();

    // Click Add to Cart
    const addBtn = dialog.getByRole('button', { name: /add to cart/i });
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // Cart drawer should open with 1 item
    const cartDrawer = page.getByRole('dialog', { name: /shopping cart drawer/i });
    await expect(cartDrawer).toBeVisible();
    await expect(cartDrawer.getByText('Chicken Tikka Pizza')).toBeVisible();
    await expect(cartDrawer.getByText(/Size: Large/i)).toBeVisible();
    await expect(cartDrawer.getByText(/Cheese Stuffed Crust/i)).toBeVisible();
  });

  test('2. Cart page supports quantity modification and shows integer PKR breakdown', async ({
    page,
  }) => {
    await page.goto('/menu');

    // Add Garlic Bread
    const gbCard = page.locator('div.group').filter({ hasText: 'Garlic Bread' }).first();
    await gbCard.getByRole('button', { name: /details/i }).click();

    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: /add to cart/i }).click();

    // Navigate to /cart
    await page.goto('/cart');
    await expect(page).toHaveTitle(/De Pizzano/i);
    await expect(page.getByRole('heading', { name: 'SHOPPING CART' })).toBeVisible();

    // Check item presence
    await expect(page.getByText('Garlic Bread').first()).toBeVisible();

    // Quantity selector: increase quantity
    const increaseBtn = page.getByLabel('Increase quantity').first();
    await increaseBtn.click();

    // Verify subtotal updated
    await expect(page.getByText('Rs. 400').first()).toBeVisible();

    // Verify Cash on Delivery indicator
    await expect(page.getByText(/Cash on Delivery/i).first()).toBeVisible();
  });

  test('3. Checkout page enforces Cash on Delivery and validates required delivery fields', async ({
    page,
  }) => {
    // Put item in cart first
    await page.goto('/menu');
    const itemCard = page.locator('div.group').filter({ hasText: 'Garlic Bread' }).first();
    await itemCard.getByRole('button', { name: /details/i }).click();
    await page.getByRole('dialog').getByRole('button', { name: /add to cart/i }).click();

    // Go to checkout
    await page.goto('/checkout');
    await expect(page.getByRole('heading', { name: /Checkout — Cash on Delivery/i })).toBeVisible();

    // Cash on Delivery is the sole active payment method
    await expect(page.getByText(/Cash on Delivery \(COD\)/i)).toBeVisible();

    // Submit empty form to trigger validation errors
    await page.getByRole('button', { name: /place cod order/i }).click();

    await expect(page.getByText(/Full name must be at least 3 characters long/i)).toBeVisible();
    await expect(page.getByText(/Phone number is required/i)).toBeVisible();
    await expect(page.getByText(/Please enter complete house\/flat number/i)).toBeVisible();

    // Fill valid delivery information
    await page.getByPlaceholder(/Tariq Ahmed/i).fill('Ali Reza');
    await page.getByPlaceholder(/0318-2588631/i).fill('03182588631');
    await page.getByPlaceholder(/Flat 402, Murtaza Terrace/i).fill('Flat 101, Murtaza Terrace, Soldier Bazar No. 3');

    // Submit valid order
    await page.getByRole('button', { name: /place cod order/i }).click();

    // Should redirect to Order Confirmation
    await page.waitForURL(/\/order-confirmation/);
    await expect(page.getByRole('heading', { name: /THANK YOU FOR YOUR ORDER!/i })).toBeVisible();
    await expect(page.getByText(/DEMO SIMULATION NOTICE/i)).toBeVisible();
  });

  test('4. Order Tracking page renders visual timeline and supports all 7 statuses', async ({
    page,
  }) => {
    await page.goto('/track');
    await expect(page.getByRole('heading', { name: 'TRACK YOUR PIZZA ORDER' })).toBeVisible();

    // Verify all 7 status filter buttons are present
    const statuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'];
    for (const status of statuses) {
      await expect(page.getByRole('button', { name: status })).toBeVisible();
    }

    // Click 'Out for Delivery'
    await page.getByRole('button', { name: 'Out for Delivery' }).click();
    await expect(page.getByText('Rider on the Way')).toBeVisible();

    // Click 'Cancelled' to verify alert state
    await page.getByRole('button', { name: 'Cancelled' }).click();
    await expect(page.getByText('Order Cancelled')).toBeVisible();
  });

  test('5. My Orders page renders past order history', async ({ page }) => {
    await page.goto('/orders');
    await expect(page.getByRole('heading', { name: 'MY ORDERS' })).toBeVisible();
    await expect(page.getByText(/DPZ-2026-8921/i)).toBeVisible();
    await expect(page.getByText(/DPZ-2026-8842/i)).toBeVisible();
  });

  test('6. Customer Login and Registration pages load cleanly with accessible forms', async ({
    page,
  }) => {
    // Login
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in to account/i })).toBeVisible();

    // Register
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Create Customer Account' })).toBeVisible();
    await expect(page.getByRole('button', { name: /complete registration/i })).toBeVisible();
  });
});

