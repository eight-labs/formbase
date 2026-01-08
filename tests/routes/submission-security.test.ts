import { beforeEach, describe, expect, it } from 'vitest';

import {
  createTestForm,
  createTestUser,
  createUnauthenticatedCaller,
  getTestDb,
  type TestForm,
  type TestUser,
} from '../helpers';

describe('Submission Security', () => {
  let user: TestUser;
  let testForm: TestForm;
  let publicCaller: Awaited<ReturnType<typeof createUnauthenticatedCaller>>;

  beforeEach(async () => {
    user = await createTestUser({
      email: 'security-test@example.com',
    });
    testForm = await createTestForm({
      userId: user.id,
      title: 'Security Test Form',
      enableEmailNotifications: false,
      enableSubmissions: true,
    });
    publicCaller = await createUnauthenticatedCaller();
  });

  describe('Form existence validation', () => {
    it('rejects submission to non-existent form', async () => {
      await expect(
        publicCaller.formData.setFormData({
          formId: 'nonexistent-form-id',
          data: { test: 'data' },
          keys: ['test'],
        }),
      ).rejects.toThrow();
    });

    it('rejects submission with empty form ID', async () => {
      await expect(
        publicCaller.formData.setFormData({
          formId: '',
          data: { test: 'data' },
          keys: ['test'],
        }),
      ).rejects.toThrow();
    });
  });

  describe('Data validation', () => {
    it('accepts valid form submission', async () => {
      const result = await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: { name: 'Valid User', email: 'valid@example.com' },
        keys: ['name', 'email'],
      });

      expect(result).toBeDefined();
    });

    it('handles empty data object', async () => {
      const result = await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {},
        keys: [],
      });

      expect(result).toBeDefined();
    });

    it('handles very large payload', async () => {
      const largeValue = 'x'.repeat(10000);
      const result = await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: { largeField: largeValue },
        keys: ['largeField'],
      });

      expect(result).toBeDefined();

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data.largeField.length).toBe(10000);
    });
  });

  describe('Input sanitization', () => {
    it('stores script tags in values without execution', async () => {
      const result = await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          name: '<script>alert("xss")</script>',
          message: '<img onerror="alert(1)" src="x">',
        },
        keys: ['name', 'message'],
      });

      expect(result).toBeDefined();

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data.name).toBe('<script>alert("xss")</script>');
    });

    it('stores SQL injection attempts safely', async () => {
      const result = await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          name: "Robert'); DROP TABLE forms;--",
          email: "' OR '1'='1",
        },
        keys: ['name', 'email'],
      });

      expect(result).toBeDefined();

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data.name).toBe("Robert'); DROP TABLE forms;--");
    });
  });

  describe('Form key updates', () => {
    it('updates keys with each submission', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: { name: 'First' },
        keys: ['name'],
      });

      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: { email: 'second@example.com' },
        keys: ['name', 'email'],
      });

      const db = getTestDb();
      const form = await db.query.forms.findFirst({
        where: (table, { eq }) => eq(table.id, testForm.id),
      });

      const keys = JSON.parse(form?.keys ?? '[]');
      expect(keys).toContain('name');
      expect(keys).toContain('email');
    });

    it('stores keys as provided', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: { name: 'Test' },
        keys: ['name', 'email', 'phone'],
      });

      const db = getTestDb();
      const form = await db.query.forms.findFirst({
        where: (table, { eq }) => eq(table.id, testForm.id),
      });

      const keys = JSON.parse(form?.keys ?? '[]');
      expect(keys).toContain('name');
      expect(keys).toContain('email');
      expect(keys).toContain('phone');
    });
  });

  describe('Submission timestamp tracking', () => {
    it('records createdAt for submissions', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: { test: 'timestamp' },
        keys: ['test'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      expect(submissions[0]?.createdAt).toBeDefined();
    });

    it('updates form updatedAt on submission', async () => {
      const db = getTestDb();

      const before = await db.query.forms.findFirst({
        where: (table, { eq }) => eq(table.id, testForm.id),
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: { test: 'update' },
        keys: ['test'],
      });

      const after = await db.query.forms.findFirst({
        where: (table, { eq }) => eq(table.id, testForm.id),
      });

      expect(after?.updatedAt).toBeDefined();
      expect(after?.updatedAt).not.toEqual(before?.updatedAt);
    });
  });
});
