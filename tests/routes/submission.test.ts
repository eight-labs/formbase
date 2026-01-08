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

  describe('Content type handling', () => {
    it('accepts empty object submission', async () => {
      const result = await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {},
        keys: [],
      });

      expect(result).toBeDefined();

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data).toEqual({});
    });

    it('accepts large payload (10KB+)', async () => {
      const largeValue = 'x'.repeat(12000);
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
      expect(data.largeField.length).toBe(12000);
    });

    it('handles special characters in keys', async () => {
      const result = await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          'field.with.dots': 'value1',
          'field[with][brackets]': 'value2',
          'field-with-dashes': 'value3',
        },
        keys: ['field.with.dots', 'field[with][brackets]', 'field-with-dashes'],
      });

      expect(result).toBeDefined();

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data['field.with.dots']).toBe('value1');
      expect(data['field[with][brackets]']).toBe('value2');
      expect(data['field-with-dashes']).toBe('value3');
    });

    it('handles special characters in values', async () => {
      const result = await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          html: '<script>alert("xss")</script>',
          sql: "'; DROP TABLE users; --",
          newlines: 'Line1\nLine2\rLine3',
          tabs: 'Col1\tCol2\tCol3',
        },
        keys: ['html', 'sql', 'newlines', 'tabs'],
      });

      expect(result).toBeDefined();

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data.html).toBe('<script>alert("xss")</script>');
      expect(data.sql).toBe("'; DROP TABLE users; --");
      expect(data.newlines).toContain('\n');
    });

    it('handles unicode characters in data', async () => {
      const result = await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          japanese: 'こんにちは',
          chinese: '你好',
          arabic: 'مرحبا',
          emoji: '👋🎉🚀',
        },
        keys: ['japanese', 'chinese', 'arabic', 'emoji'],
      });

      expect(result).toBeDefined();

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data.japanese).toBe('こんにちは');
      expect(data.emoji).toBe('👋🎉🚀');
    });

    it('handles deeply nested objects', async () => {
      const nestedData = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'deep',
              },
            },
          },
        },
      };

      const result = await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: nestedData,
        keys: ['level1'],
      });

      expect(result).toBeDefined();

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data.level1.level2.level3.level4.value).toBe('deep');
    });

    it('handles arrays in submission data', async () => {
      const result = await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          tags: ['javascript', 'typescript', 'react'],
          numbers: [1, 2, 3, 4, 5],
          mixed: [1, 'two', true, null],
        },
        keys: ['tags', 'numbers', 'mixed'],
      });

      expect(result).toBeDefined();

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data.tags).toEqual(['javascript', 'typescript', 'react']);
      expect(data.numbers).toEqual([1, 2, 3, 4, 5]);
      expect(data.mixed).toEqual([1, 'two', true, null]);
    });

    it('handles null and undefined values', async () => {
      const result = await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          nullValue: null,
          undefinedValue: undefined,
          emptyString: '',
        },
        keys: ['nullValue', 'undefinedValue', 'emptyString'],
      });

      expect(result).toBeDefined();

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data.nullValue).toBeNull();
      expect(data.emptyString).toBe('');
    });
  });

  describe('Multiple submissions', () => {
    it('stores multiple submissions independently', async () => {
      for (let i = 0; i < 5; i++) {
        await publicCaller.formData.setFormData({
          formId: testForm.id,
          data: { index: i, name: `User ${i}` },
          keys: ['index', 'name'],
        });
      }

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(5);

      const indices = submissions
        .map((s) => JSON.parse(s.data).index)
        .sort((a, b) => a - b);
      expect(indices).toEqual([0, 1, 2, 3, 4]);
    });

    it('each submission has unique ID', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: { name: 'First' },
        keys: ['name'],
      });

      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: { name: 'Second' },
        keys: ['name'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(2);
      expect(submissions[0]?.id).not.toBe(submissions[1]?.id);
    });
  });
});
