import { expect, test } from '@playwright/test';

import { E2E_TEST_USER } from './seed';

test.describe('Authentication', () => {
  test.describe('Login Flow', () => {
    test('displays login form correctly', async ({ page }) => {
      await page.goto('/login');

      // Check page title and description
      await expect(page.getByText('Formbase Log In')).toBeVisible();
      await expect(
        page.getByText('Log in to your account to access your dashboard'),
      ).toBeVisible();

      // Check form elements
      await expect(page.getByPlaceholder('email@example.com')).toBeVisible();
      await expect(page.getByPlaceholder('********')).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Log In', exact: true }),
      ).toBeVisible();
    });

    test('shows error for invalid credentials', async ({ page }) => {
      await page.goto('/login');

      await page
        .getByPlaceholder('email@example.com')
        .fill('invalid@example.com');
      await page.getByPlaceholder('********').fill('wrongpassword');
      await page.getByRole('button', { name: 'Log In', exact: true }).click();

      // Wait for error message
      await expect(page.getByText(/invalid|error|incorrect/i)).toBeVisible({
        timeout: 10000,
      });
    });

    test('successfully logs in with valid credentials', async ({ page }) => {
      await page.goto('/login');

      await page
        .getByPlaceholder('email@example.com')
        .fill(E2E_TEST_USER.email);
      await page.getByPlaceholder('********').fill(E2E_TEST_USER.password);
      await page.getByRole('button', { name: 'Log In', exact: true }).click();

      // Should redirect to dashboard
      await page.waitForURL(/.*dashboard/, { timeout: 15000 });
    });

    test('redirects authenticated user from login to dashboard', async ({
      page,
    }) => {
      // First, log in
      await page.goto('/login');
      await page
        .getByPlaceholder('email@example.com')
        .fill(E2E_TEST_USER.email);
      await page.getByPlaceholder('********').fill(E2E_TEST_USER.password);
      await page.getByRole('button', { name: 'Log In', exact: true }).click();
      await page.waitForURL(/.*dashboard/, { timeout: 15000 });

      // Now try to visit login page again
      await page.goto('/login');

      // Should redirect back to dashboard (or stay on protected page)
      await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    });
  });

  test.describe('Logout Flow', () => {
    test('successfully logs out', async ({ page }) => {
      // First, log in
      await page.goto('/login');
      await page
        .getByPlaceholder('email@example.com')
        .fill(E2E_TEST_USER.email);
      await page.getByPlaceholder('********').fill(E2E_TEST_USER.password);
      await page.getByRole('button', { name: 'Log In', exact: true }).click();
      await page.waitForURL(/.*dashboard/, { timeout: 15000 });

      // Open user menu dropdown (avatar button in header showing user initials)
      const userMenuButton = page.locator('header button').last();
      await userMenuButton.click();

      // Click logout in the dropdown menu (it's a button, not menuitem)
      await page.getByRole('button', { name: /sign\s*out/i }).click();

      // Confirm the sign out dialog
      await page.getByRole('button', { name: 'Okay' }).click();

      // After logout, should be on home or login page (root URL ends with port/)
      await expect(page).toHaveURL(/:\d+\/?$|\/login/, { timeout: 10000 });
    });
  });

  test.describe('Protected Routes', () => {
    test('redirects unauthenticated user to login', async ({ page }) => {
      // Clear any existing session
      await page.context().clearCookies();

      // Try to access dashboard directly
      await page.goto('/dashboard');

      // Should redirect to login
      await expect(page).toHaveURL(/.*login/, { timeout: 10000 });
    });

    test('allows authenticated user to access dashboard', async ({ page }) => {
      // Log in first
      await page.goto('/login');
      await page
        .getByPlaceholder('email@example.com')
        .fill(E2E_TEST_USER.email);
      await page.getByPlaceholder('********').fill(E2E_TEST_USER.password);
      await page.getByRole('button', { name: 'Log In', exact: true }).click();
      await page.waitForURL(/.*dashboard/, { timeout: 15000 });

      // Dashboard should show the main heading
      await expect(
        page.getByRole('heading', { name: 'Form Endpoints' }),
      ).toBeVisible();
    });
  });
});
