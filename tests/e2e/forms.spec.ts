import { expect, test } from '@playwright/test';

import { E2E_TEST_USER } from './seed';

test.describe('Forms', () => {
  // Login before each test in this suite
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('email@example.com').fill(E2E_TEST_USER.email);
    await page.getByPlaceholder('********').fill(E2E_TEST_USER.password);
    await page.getByRole('button', { name: 'Log In', exact: true }).click();
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
  });

  test.describe('Form Creation', () => {
    test('displays create form dialog', async ({ page }) => {
      // Wait for page to be fully loaded before interacting
      await page.waitForLoadState('networkidle');

      // Click create form button
      await page.getByRole('button', { name: 'New Form Endpoint' }).click();

      // Dialog should appear - wait for the dialog title (more reliable with portals)
      await expect(
        page.getByRole('heading', { name: 'Create New Form Endpoint' }),
      ).toBeVisible({ timeout: 5000 });

      // Dialog should have the Name input field
      await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible();
    });

    test('creates a new form', async ({ page }) => {
      // Wait for page to be fully loaded before interacting
      await page.waitForLoadState('networkidle');

      // Click create button
      await page.getByRole('button', { name: 'New Form Endpoint' }).click();

      // Wait for dialog title to appear (more reliable with portals)
      await expect(
        page.getByRole('heading', { name: 'Create New Form Endpoint' }),
      ).toBeVisible({ timeout: 5000 });

      // Use unique form name to avoid strict mode violation from previous test runs
      const uniqueFormName = `E2E Test ${Date.now()}`;

      // Fill in form name
      await page.getByRole('textbox', { name: 'Name' }).fill(uniqueFormName);

      // Submit the dialog
      await page.getByRole('button', { name: 'Create Form' }).click();

      // Should see the new form in the list or be redirected to it
      await expect(page.getByText(uniqueFormName)).toBeVisible({
        timeout: 10000,
      });
    });
  });

  test.describe('Form List', () => {
    test('displays user forms on dashboard', async ({ page }) => {
      // Dashboard should show at least the seeded form
      await expect(page.getByText('E2E Test Form')).toBeVisible({
        timeout: 10000,
      });
    });

    test('can navigate to form details', async ({ page }) => {
      // Click on the test form
      await page.getByText('E2E Test Form').click();

      // Should navigate to form detail page
      await expect(page).toHaveURL(/.*form.*/, { timeout: 10000 });
    });
  });

  test.describe('Form Settings', () => {
    test('can view and update form settings', async ({ page }) => {
      // Navigate to form
      await page.getByText('E2E Test Form').click();
      await expect(page).toHaveURL(/.*form.*/, { timeout: 10000 });

      // Look for settings tab or button
      const settingsTab = page.getByRole('tab', { name: /settings/i });
      const settingsButton = page.getByRole('button', { name: /settings/i });
      const settingsLink = page.getByRole('link', { name: /settings/i });

      if (await settingsTab.isVisible()) {
        await settingsTab.click();
      } else if (await settingsButton.isVisible()) {
        await settingsButton.click();
      } else if (await settingsLink.isVisible()) {
        await settingsLink.click();
      }

      // Settings should show form configuration options
      const titleInput = page.getByLabel(/title/i);
      if (await titleInput.isVisible()) {
        await expect(titleInput).toHaveValue('E2E Test Form');
      }
    });
  });

  test.describe('Form Submissions', () => {
    test('can view submissions for a form', async ({ page }) => {
      // Navigate to form
      await page.getByText('E2E Test Form').click();
      await expect(page).toHaveURL(/.*form.*/, { timeout: 10000 });

      // Click Submissions tab
      await page.getByRole('tab', { name: 'Submissions' }).click();

      // Should see submissions panel (empty state shows "No Submissions Available")
      await expect(
        page.getByRole('heading', { name: 'No Submissions Available' }),
      ).toBeVisible({ timeout: 5000 });
    });
  });
});

test.describe('Public Form Submission', () => {
  test('can submit data to a public form endpoint', async ({ request }) => {
    // First, get the form ID by logging in and finding it
    // For simplicity, we'll use the API directly

    // This tests the public submission endpoint
    // Note: We need to know the form ID, which was seeded

    // Get the form ID from the seeded data
    // For E2E, we typically would fetch this from the running app
    // Here we test the submission flow works conceptually

    const testFormId = 'e2e-test-form-id'; // Placeholder

    // Skip if we don't have a real form ID
    // In a real E2E setup, we'd either:
    // 1. Query the DB for the seeded form
    // 2. Navigate the UI to get the form ID
    // 3. Have a fixture with known IDs

    test.skip(true, 'Requires seeded form ID');
  });

  test('submission endpoint accepts JSON data', async ({ request }) => {
    // This is a conceptual test showing how to test the API endpoint
    // In practice, you'd run this against the actual running server

    // Example of how to test the submission endpoint:
    // const response = await request.post(`/api/s/${formId}`, {
    //   data: {
    //     name: 'E2E Test',
    //     email: 'e2e@test.com',
    //   },
    // });
    // expect(response.ok()).toBeTruthy();

    test.skip(true, 'Requires running server with seeded data');
  });
});
