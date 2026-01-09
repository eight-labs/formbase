import { beforeEach, describe, expect, it } from 'vitest';

import {
  createTestForm,
  createTestUser,
  createUnauthenticatedCaller,
  getTestDb,
  type TestForm,
  type TestUser,
} from '../helpers';

describe('Public Submission (formData.setFormData)', () => {
  let user: TestUser;
  let testForm: TestForm;
  let publicCaller: Awaited<ReturnType<typeof createUnauthenticatedCaller>>;

  beforeEach(async () => {
    user = await createTestUser({
      email: 'submission@example.com',
    });
    testForm = await createTestForm({
      userId: user.id,
      title: 'Public Form',
      enableEmailNotifications: false, // Skip email for tests
    });
    publicCaller = await createUnauthenticatedCaller();
  });

  describe('FormData-like JSON submission', () => {
    it('accepts and stores form data', async () => {
      const result = await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Hello World',
        },
        keys: ['name', 'email', 'message'],
      });

      expect(result).toBeDefined();
    });

    it('updates form keys with new field names', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: { name: 'Jane' },
        keys: ['name'],
      });

      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: { email: 'jane@example.com' },
        keys: ['name', 'email'],
      });

      // Verify the form keys were updated
      const db = getTestDb();
      const form = await db.query.forms.findFirst({
        where: (table, { eq }) => eq(table.id, testForm.id),
      });

      const keys = JSON.parse(form?.keys ?? '[]');
      expect(keys).toContain('name');
      expect(keys).toContain('email');
    });
  });

  describe('JSON submission', () => {
    it('stores JSON data correctly', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          nested: { value: 123 },
          array: [1, 2, 3],
          boolean: true,
        },
        keys: ['nested', 'array', 'boolean'],
      });

      // Verify data was stored
      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data.nested).toEqual({ value: 123 });
      expect(data.array).toEqual([1, 2, 3]);
      expect(data.boolean).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('handles submission to nonexistent form (transaction will fail)', async () => {
      // Note: setFormData doesn't check if form exists before insert,
      // but the foreign key constraint will cause the transaction to fail
      await expect(
        publicCaller.formData.setFormData({
          formId: 'nonexistent12345',
          data: { test: 'data' },
          keys: ['test'],
        }),
      ).rejects.toThrow();
    });
  });

  describe('Form updates timestamp', () => {
    it('updates form updatedAt on submission', async () => {
      const db = getTestDb();

      // Get initial form state
      const before = await db.query.forms.findFirst({
        where: (table, { eq }) => eq(table.id, testForm.id),
      });

      // Small delay to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: { test: 'timestamp' },
        keys: ['test'],
      });

      const after = await db.query.forms.findFirst({
        where: (table, { eq }) => eq(table.id, testForm.id),
      });

      expect(after?.updatedAt).toBeDefined();
      // The updatedAt should be different (or at least defined)
      expect(after?.updatedAt).not.toEqual(before?.updatedAt);
    });
  });
});
