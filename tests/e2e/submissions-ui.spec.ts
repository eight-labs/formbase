import { expect, test } from '@playwright/test';

import { E2E_TEST_USER } from './seed';

test.describe('Submissions UI', () => {
  let formId: string;

  test.beforeEach(async ({ page, request }) => {
    await page.goto('/login');
    await page.getByPlaceholder('email@example.com').fill(E2E_TEST_USER.email);
    await page.getByPlaceholder('********').fill(E2E_TEST_USER.password);
    await page.getByRole('button', { name: 'Log In', exact: true }).click();
    await page.waitForURL(/.*dashboard/, { timeout: 15000 });

    await page.getByText('E2E Test Form').click();
    await expect(page).toHaveURL(/.*form.*/, { timeout: 10000 });

    const url = page.url();
    const formIdMatch = url.match(/form\/([^/]+)/);
    if (!formIdMatch) throw new Error('Could not extract form ID');
    formId = formIdMatch[1];
  });

  test.describe('Submissions List', () => {
    test('displays submissions tab', async ({ page }) => {
      await expect(page.getByRole('tab', { name: 'Submissions' })).toBeVisible();
    });

    test('shows empty state when no submissions', async ({ page }) => {
      await page.getByRole('tab', { name: 'Submissions' }).click();
      await page.waitForLoadState('networkidle');

      const hasSubmissions = await page
        .locator('table, [data-testid="submission-list"]')
        .count();
      const hasEmptyState = await page.getByText(/no submissions/i).count();

      expect(hasSubmissions > 0 || hasEmptyState > 0).toBe(true);
    });

    test('displays submissions when data exists', async ({ page, request }) => {
      const baseUrl = new URL(page.url()).origin;
      const uniqueValue = `UI-Test-${Date.now()}`;

      await request.post(`${baseUrl}/api/s/${formId}`, {
        data: {
          ui_test_field: uniqueValue,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.getByRole('tab', { name: 'Submissions' }).click();

      await expect(page.getByText(uniqueValue)).toBeVisible({ timeout: 10000 });
    });

    test('displays multiple submissions', async ({ page, request }) => {
      const baseUrl = new URL(page.url()).origin;

      for (let i = 0; i < 3; i++) {
        await request.post(`${baseUrl}/api/s/${formId}`, {
          data: {
            item_name: `Multiple-${i}-${Date.now()}`,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.getByRole('tab', { name: 'Submissions' }).click();

      await expect(page.getByText(/Multiple-0/)).toBeVisible({ timeout: 10000 });
      await expect(page.getByText(/Multiple-1/)).toBeVisible();
      await expect(page.getByText(/Multiple-2/)).toBeVisible();
    });
  });

  test.describe('Submission Deletion', () => {
    test('delete button is visible for submissions', async ({
      page,
      request,
    }) => {
      const baseUrl = new URL(page.url()).origin;
      await request.post(`${baseUrl}/api/s/${formId}`, {
        data: {
          delete_test: `Delete-${Date.now()}`,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.getByRole('tab', { name: 'Submissions' }).click();
      await page.waitForLoadState('networkidle');

      const deleteButton = page.getByRole('button', { name: /delete/i }).first();
      const trashIcon = page.locator('[data-testid="delete-submission"]').first();
      const hasDelete =
        (await deleteButton.count()) > 0 || (await trashIcon.count()) > 0;

      expect(hasDelete).toBe(true);
    });
  });

  test.describe('Export UI', () => {
    test('export dropdown appears', async ({ page, request }) => {
      const baseUrl = new URL(page.url()).origin;
      await request.post(`${baseUrl}/api/s/${formId}`, {
        data: {
          export_ui: 'test',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.getByRole('tab', { name: 'Submissions' }).click();

      await page.getByRole('button', { name: /export/i }).click();

      await expect(page.getByText(/csv/i)).toBeVisible();
      await expect(page.getByText(/json/i)).toBeVisible();
    });
  });

  test.describe('Submission Details', () => {
    test('shows all submitted fields', async ({ page, request }) => {
      const baseUrl = new URL(page.url()).origin;
      const testData = {
        name: `Detail-Name-${Date.now()}`,
        email: 'detail@test.com',
        message: 'This is the detail test message',
      };

      await request.post(`${baseUrl}/api/s/${formId}`, {
        data: testData,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.getByRole('tab', { name: 'Submissions' }).click();

      await expect(page.getByText(testData.name)).toBeVisible({ timeout: 10000 });
      await expect(page.getByText(testData.email)).toBeVisible();
    });

    test('handles long field values', async ({ page, request }) => {
      const baseUrl = new URL(page.url()).origin;
      const longValue = 'x'.repeat(200);

      await request.post(`${baseUrl}/api/s/${formId}`, {
        data: {
          long_field: longValue,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.getByRole('tab', { name: 'Submissions' }).click();

      const content = await page.textContent('body');
      expect(content).toContain('xxx');
    });
  });

  test.describe('Real-time Updates', () => {
    test('new submissions appear after page refresh', async ({
      page,
      request,
    }) => {
      await page.getByRole('tab', { name: 'Submissions' }).click();
      await page.waitForLoadState('networkidle');

      const baseUrl = new URL(page.url()).origin;
      const uniqueValue = `Refresh-${Date.now()}`;

      await request.post(`${baseUrl}/api/s/${formId}`, {
        data: {
          refresh_test: uniqueValue,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.getByRole('tab', { name: 'Submissions' }).click();

      await expect(page.getByText(uniqueValue)).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Navigation', () => {
    test('can navigate between Setup and Submissions tabs', async ({
      page,
    }) => {
      await page.getByRole('tab', { name: 'Submissions' }).click();
      await page.waitForLoadState('networkidle');

      await page.getByRole('tab', { name: 'Setup' }).click();
      await page.waitForLoadState('networkidle');

      await expect(
        page.getByRole('tab', { name: 'Setup', selected: true }),
      ).toBeVisible();
    });

    test('tab selection persists during session', async ({ page }) => {
      await page.getByRole('tab', { name: 'Submissions' }).click();
      await page.waitForLoadState('networkidle');

      await expect(
        page.getByRole('tab', { name: 'Submissions', selected: true }),
      ).toBeVisible();
    });
  });

  test.describe('Form Configuration Display', () => {
    test('shows form title in header', async ({ page }) => {
      await expect(page.getByText('E2E Test Form')).toBeVisible();
    });

    test('shows form endpoint URL', async ({ page }) => {
      const endpointPattern = /\/api\/s\/|\/s\//;
      const content = await page.textContent('body');
      expect(content).toMatch(endpointPattern);
    });
  });
});
