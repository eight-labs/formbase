import { expect, test } from '@playwright/test';

import { E2E_TEST_USER } from './seed';

test.describe('Submission Flow', () => {
  let formId: string;

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('email@example.com').fill(E2E_TEST_USER.email);
    await page.getByPlaceholder('********').fill(E2E_TEST_USER.password);
    await page.getByRole('button', { name: 'Log In', exact: true }).click();
    await page.waitForURL(/.*dashboard/, { timeout: 15000 });
  });

  test.describe('Form Creation via UI', () => {
    test('creates a new form for submission testing', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      await page.getByRole('button', { name: 'New Form Endpoint' }).click();
      await expect(
        page.getByRole('heading', { name: 'Create New Form Endpoint' }),
      ).toBeVisible({ timeout: 5000 });

      const uniqueFormName = `Submission Test ${Date.now()}`;
      await page.getByRole('textbox', { name: 'Name' }).fill(uniqueFormName);
      await page.getByRole('button', { name: 'Create Form' }).click();

      await expect(page.getByText(uniqueFormName)).toBeVisible({
        timeout: 10000,
      });
    });
  });

  test.describe('Direct API Submission', () => {
    test('submits JSON data to form endpoint', async ({ page, request }) => {
      await page.getByText('E2E Test Form').click();
      await expect(page).toHaveURL(/.*form.*/, { timeout: 10000 });

      const url = page.url();
      const formIdMatch = url.match(/form\/([^/]+)/);
      if (!formIdMatch) throw new Error('Could not extract form ID');
      formId = formIdMatch[1];

      const baseUrl = new URL(url).origin;
      const response = await request.post(`${baseUrl}/api/s/${formId}`, {
        data: {
          name: 'E2E Test Submission',
          email: 'e2e@example.com',
          message: 'This is a test submission from Playwright',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(response.ok()).toBe(true);
    });

    test('submits form-urlencoded data', async ({ page, request }) => {
      await page.getByText('E2E Test Form').click();
      await expect(page).toHaveURL(/.*form.*/, { timeout: 10000 });

      const url = page.url();
      const formIdMatch = url.match(/form\/([^/]+)/);
      if (!formIdMatch) throw new Error('Could not extract form ID');
      formId = formIdMatch[1];

      const baseUrl = new URL(url).origin;
      const response = await request.post(`${baseUrl}/api/s/${formId}`, {
        form: {
          name: 'URLEncoded Test',
          email: 'urlencoded@example.com',
        },
      });

      expect(response.ok()).toBe(true);
    });

    test('handles multipart form data', async ({ page, request }) => {
      await page.getByText('E2E Test Form').click();
      await expect(page).toHaveURL(/.*form.*/, { timeout: 10000 });

      const url = page.url();
      const formIdMatch = url.match(/form\/([^/]+)/);
      if (!formIdMatch) throw new Error('Could not extract form ID');
      formId = formIdMatch[1];

      const baseUrl = new URL(url).origin;
      const response = await request.post(`${baseUrl}/api/s/${formId}`, {
        multipart: {
          name: 'Multipart Test',
          description: 'Testing multipart submission',
        },
      });

      expect(response.ok()).toBe(true);
    });
  });

  test.describe('Submission Verification', () => {
    test('submissions appear in the UI after submitting', async ({
      page,
      request,
    }) => {
      await page.getByText('E2E Test Form').click();
      await expect(page).toHaveURL(/.*form.*/, { timeout: 10000 });

      const url = page.url();
      const formIdMatch = url.match(/form\/([^/]+)/);
      if (!formIdMatch) throw new Error('Could not extract form ID');
      formId = formIdMatch[1];

      const uniqueValue = `Verification-${Date.now()}`;
      const baseUrl = new URL(url).origin;
      await request.post(`${baseUrl}/api/s/${formId}`, {
        data: {
          test_field: uniqueValue,
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

    test('submission data integrity is preserved', async ({ page, request }) => {
      await page.getByText('E2E Test Form').click();
      await expect(page).toHaveURL(/.*form.*/, { timeout: 10000 });

      const url = page.url();
      const formIdMatch = url.match(/form\/([^/]+)/);
      if (!formIdMatch) throw new Error('Could not extract form ID');
      formId = formIdMatch[1];

      const testData = {
        name: 'Integrity Test',
        email: 'integrity@test.com',
        number: '12345',
        special_chars: 'Test & <Value>',
      };

      const baseUrl = new URL(url).origin;
      await request.post(`${baseUrl}/api/s/${formId}`, {
        data: testData,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.getByRole('tab', { name: 'Submissions' }).click();

      await expect(page.getByText('Integrity Test')).toBeVisible({
        timeout: 10000,
      });
      await expect(page.getByText('integrity@test.com')).toBeVisible();
    });
  });

  test.describe('Browser vs API Response Handling', () => {
    test('browser request returns 303 redirect', async ({ page }) => {
      await page.getByText('E2E Test Form').click();
      await expect(page).toHaveURL(/.*form.*/, { timeout: 10000 });

      const url = page.url();
      const formIdMatch = url.match(/form\/([^/]+)/);
      if (!formIdMatch) throw new Error('Could not extract form ID');
      formId = formIdMatch[1];

      const baseUrl = new URL(url).origin;

      const response = await page.evaluate(
        async ({ endpoint, data }) => {
          const form = new FormData();
          Object.entries(data).forEach(([key, value]) => {
            form.append(key, value as string);
          });

          const res = await fetch(endpoint, {
            method: 'POST',
            body: form,
            redirect: 'manual',
          });

          return {
            status: res.status,
            location: res.headers.get('location'),
          };
        },
        {
          endpoint: `${baseUrl}/api/s/${formId}`,
          data: { browser_test: 'redirect-check' },
        },
      );

      expect(response.status).toBe(303);
      expect(response.location).toContain(`/s/${formId}`);
    });

    test('returns JSON response for API requests', async ({ page, request }) => {
      await page.getByText('E2E Test Form').click();
      await expect(page).toHaveURL(/.*form.*/, { timeout: 10000 });

      const url = page.url();
      const formIdMatch = url.match(/form\/([^/]+)/);
      if (!formIdMatch) throw new Error('Could not extract form ID');
      formId = formIdMatch[1];

      const baseUrl = new URL(url).origin;
      const response = await request.post(`${baseUrl}/api/s/${formId}`, {
        data: { test: 'api-response' },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(response.ok()).toBe(true);
      const json = await response.json();
      expect(json).toHaveProperty('formId');
      expect(json).toHaveProperty('message');
    });

    test('handles CORS preflight correctly', async ({ page, request }) => {
      await page.getByText('E2E Test Form').click();
      await expect(page).toHaveURL(/.*form.*/, { timeout: 10000 });

      const url = page.url();
      const formIdMatch = url.match(/form\/([^/]+)/);
      if (!formIdMatch) throw new Error('Could not extract form ID');
      formId = formIdMatch[1];

      const baseUrl = new URL(url).origin;
      const response = await request.fetch(`${baseUrl}/api/s/${formId}`, {
        method: 'OPTIONS',
      });

      expect(response.ok()).toBe(true);
      const headers = response.headers();
      expect(headers['access-control-allow-origin']).toBeDefined();
      expect(headers['access-control-allow-methods']).toContain('POST');
    });

    test('returns 404 for non-existent form', async ({ page, request }) => {
      const baseUrl = new URL(page.url()).origin;
      const response = await request.post(
        `${baseUrl}/api/s/nonexistent-form-id-12345`,
        {
          data: { test: 'should-fail' },
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      expect(response.status()).toBe(404);
    });
  });

  test.describe('Unicode and Special Characters', () => {
    test('handles unicode in submission data', async ({ page, request }) => {
      await page.getByText('E2E Test Form').click();
      await expect(page).toHaveURL(/.*form.*/, { timeout: 10000 });

      const url = page.url();
      const formIdMatch = url.match(/form\/([^/]+)/);
      if (!formIdMatch) throw new Error('Could not extract form ID');
      formId = formIdMatch[1];

      const baseUrl = new URL(url).origin;
      const response = await request.post(`${baseUrl}/api/s/${formId}`, {
        data: {
          japanese: 'テスト',
          emoji: '👋 Hello!',
          arabic: 'مرحبا',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(response.ok()).toBe(true);

      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.getByRole('tab', { name: 'Submissions' }).click();

      await expect(page.getByText('テスト')).toBeVisible({ timeout: 10000 });
    });
  });
});
