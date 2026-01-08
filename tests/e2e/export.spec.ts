import * as fs from 'fs';
import * as path from 'path';

import { expect, test } from '@playwright/test';

import { E2E_TEST_USER } from './seed';

test.describe('Export Functionality', () => {
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

    const baseUrl = new URL(url).origin;
    await request.post(`${baseUrl}/api/s/${formId}`, {
      data: {
        export_test_name: `Export Test ${Date.now()}`,
        export_test_email: 'export@test.com',
        export_test_value: '12345',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test.describe('CSV Export', () => {
    test('export button is visible when submissions exist', async ({
      page,
    }) => {
      await page.getByRole('tab', { name: 'Submissions' }).click();
      await page.waitForLoadState('networkidle');

      const exportButton = page.getByRole('button', { name: /export/i });
      await expect(exportButton).toBeVisible({ timeout: 10000 });
    });

    test('export dropdown shows CSV and JSON options', async ({ page }) => {
      await page.getByRole('tab', { name: 'Submissions' }).click();
      await page.waitForLoadState('networkidle');

      await page.getByRole('button', { name: /export/i }).click();

      await expect(page.getByText(/export as csv/i)).toBeVisible();
      await expect(page.getByText(/export as json/i)).toBeVisible();
    });

    test('downloads CSV file', async ({ page }) => {
      await page.getByRole('tab', { name: 'Submissions' }).click();
      await page.waitForLoadState('networkidle');

      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: /export/i }).click();
      await page.getByText(/export as csv/i).click();

      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('.csv');
    });

    test('CSV file has correct format', async ({ page }) => {
      await page.getByRole('tab', { name: 'Submissions' }).click();
      await page.waitForLoadState('networkidle');

      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: /export/i }).click();
      await page.getByText(/export as csv/i).click();

      const download = await downloadPromise;
      const downloadPath = await download.path();

      if (downloadPath) {
        const content = fs.readFileSync(downloadPath, 'utf-8');
        const lines = content.split('\n').filter((l) => l.trim());

        expect(lines.length).toBeGreaterThanOrEqual(1);
        expect(lines[0]).toContain(',');
      }
    });
  });

  test.describe('JSON Export', () => {
    test('downloads JSON file', async ({ page }) => {
      await page.getByRole('tab', { name: 'Submissions' }).click();
      await page.waitForLoadState('networkidle');

      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: /export/i }).click();
      await page.getByText(/export as json/i).click();

      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('.json');
    });

    test('JSON file contains valid JSON array', async ({ page }) => {
      await page.getByRole('tab', { name: 'Submissions' }).click();
      await page.waitForLoadState('networkidle');

      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: /export/i }).click();
      await page.getByText(/export as json/i).click();

      const download = await downloadPromise;
      const downloadPath = await download.path();

      if (downloadPath) {
        const content = fs.readFileSync(downloadPath, 'utf-8');
        const parsed = JSON.parse(content);

        expect(Array.isArray(parsed)).toBe(true);
        expect(parsed.length).toBeGreaterThanOrEqual(1);
      }
    });

    test('JSON preserves nested data structures', async ({ page, request }) => {
      const baseUrl = new URL(page.url()).origin;
      await request.post(`${baseUrl}/api/s/${formId}`, {
        data: {
          nested: {
            value: 'test',
            deep: {
              level: 2,
            },
          },
          array: [1, 2, 3],
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.getByRole('tab', { name: 'Submissions' }).click();

      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: /export/i }).click();
      await page.getByText(/export as json/i).click();

      const download = await downloadPromise;
      const downloadPath = await download.path();

      if (downloadPath) {
        const content = fs.readFileSync(downloadPath, 'utf-8');
        const parsed = JSON.parse(content);

        const hasNestedData = parsed.some(
          (item: Record<string, unknown>) =>
            item.nested && typeof item.nested === 'object',
        );
        expect(hasNestedData).toBe(true);
      }
    });
  });

  test.describe('Export with Multiple Submissions', () => {
    test('exports all submissions', async ({ page, request }) => {
      const baseUrl = new URL(page.url()).origin;

      for (let i = 0; i < 5; i++) {
        await request.post(`${baseUrl}/api/s/${formId}`, {
          data: {
            batch_item: `Item ${i}`,
            index: i,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.getByRole('tab', { name: 'Submissions' }).click();

      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: /export/i }).click();
      await page.getByText(/export as json/i).click();

      const download = await downloadPromise;
      const downloadPath = await download.path();

      if (downloadPath) {
        const content = fs.readFileSync(downloadPath, 'utf-8');
        const parsed = JSON.parse(content);

        expect(parsed.length).toBeGreaterThanOrEqual(5);
      }
    });
  });

  test.describe('Filename Generation', () => {
    test('filename includes form title', async ({ page }) => {
      await page.getByRole('tab', { name: 'Submissions' }).click();
      await page.waitForLoadState('networkidle');

      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: /export/i }).click();
      await page.getByText(/export as csv/i).click();

      const download = await downloadPromise;
      const filename = download.suggestedFilename();

      expect(filename).toContain('E2E');
      expect(filename).toContain('submissions');
    });
  });
});
