import { beforeEach, describe, expect, it } from 'vitest';

import {
  createTestForm,
  createTestUser,
  createUnauthenticatedCaller,
  getTestDb,
  type TestForm,
  type TestUser,
} from '../helpers';

describe('Concurrent Submissions', () => {
  let user: TestUser;
  let testForm: TestForm;
  let publicCaller: Awaited<ReturnType<typeof createUnauthenticatedCaller>>;

  beforeEach(async () => {
    user = await createTestUser({
      email: 'concurrency-test@example.com',
    });
    testForm = await createTestForm({
      userId: user.id,
      title: 'Concurrency Test Form',
      enableEmailNotifications: false,
    });
    publicCaller = await createUnauthenticatedCaller();
  });

  describe('Sequential submissions with different field names', () => {
    it('handles multiple submissions sequentially', async () => {
      for (let i = 0; i < 5; i++) {
        await publicCaller.formData.setFormData({
          formId: testForm.id,
          data: { [`field_${i}`]: `value_${i}` },
          keys: [`field_${i}`],
        });
      }

      const db = getTestDb();
      const storedSubmissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(storedSubmissions).toHaveLength(5);
    });

    it('merges keys from sequential submissions correctly', async () => {
      const submissions = [
        { data: { name: 'John' }, keys: ['name'] },
        { data: { email: 'john@example.com' }, keys: ['name', 'email'] },
        { data: { phone: '555-1234' }, keys: ['name', 'email', 'phone'] },
      ];

      for (const sub of submissions) {
        await publicCaller.formData.setFormData({
          formId: testForm.id,
          data: sub.data,
          keys: sub.keys,
        });
      }

      const db = getTestDb();
      const form = await db.query.forms.findFirst({
        where: (table, { eq }) => eq(table.id, testForm.id),
      });

      const keys = JSON.parse(form?.keys ?? '[]');
      expect(keys).toContain('name');
      expect(keys).toContain('email');
      expect(keys).toContain('phone');
    });

    it('stores keys as passed from client', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: { name: 'First', email: 'first@example.com' },
        keys: ['name', 'email'],
      });

      const db = getTestDb();
      let form = await db.query.forms.findFirst({
        where: (table, { eq }) => eq(table.id, testForm.id),
      });

      let keys = JSON.parse(form?.keys ?? '[]') as string[];
      expect(keys).toEqual(['name', 'email']);

      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: { name: 'Second', phone: '555-1234' },
        keys: ['name', 'email', 'phone'],
      });

      form = await db.query.forms.findFirst({
        where: (table, { eq }) => eq(table.id, testForm.id),
      });

      keys = JSON.parse(form?.keys ?? '[]') as string[];
      expect(keys).toEqual(['name', 'email', 'phone']);
    });
  });

  describe('Data integrity under load', () => {
    it('maintains data integrity for each submission', async () => {
      for (let i = 0; i < 10; i++) {
        await publicCaller.formData.setFormData({
          formId: testForm.id,
          data: {
            id: i,
            name: `User ${i}`,
            timestamp: Date.now() + i,
          },
          keys: ['id', 'name', 'timestamp'],
        });
      }

      const db = getTestDb();
      const storedSubmissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(storedSubmissions).toHaveLength(10);

      const storedIds = storedSubmissions
        .map((s) => JSON.parse(s.data).id)
        .sort((a, b) => a - b);

      expect(storedIds).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('handles rapid sequential submissions', async () => {
      for (let i = 0; i < 5; i++) {
        await publicCaller.formData.setFormData({
          formId: testForm.id,
          data: { sequence: i },
          keys: ['sequence'],
        });
      }

      const db = getTestDb();
      const storedSubmissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(storedSubmissions).toHaveLength(5);
    });
  });

  describe('Submission data variations', () => {
    it('handles submissions with varying data sizes', async () => {
      const submissions = [
        { data: { small: 'x' }, keys: ['small'] },
        { data: { medium: 'x'.repeat(1000) }, keys: ['medium'] },
        { data: { large: 'x'.repeat(5000) }, keys: ['large'] },
      ];

      for (const sub of submissions) {
        await publicCaller.formData.setFormData({
          formId: testForm.id,
          data: sub.data,
          keys: sub.keys,
        });
      }

      const db = getTestDb();
      const storedSubmissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(storedSubmissions).toHaveLength(3);

      const sizes = storedSubmissions.map((s) => {
        const data = JSON.parse(s.data);
        return Object.values(data)[0] as string;
      });

      const lengths = sizes.map((s) => s.length).sort((a, b) => a - b);
      expect(lengths).toEqual([1, 1000, 5000]);
    });

    it('handles submissions to different forms', async () => {
      const form2 = await createTestForm({
        userId: user.id,
        title: 'Second Form',
        enableEmailNotifications: false,
      });

      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: { form: 1 },
        keys: ['form'],
      });

      await publicCaller.formData.setFormData({
        formId: form2.id,
        data: { form: 2 },
        keys: ['form'],
      });

      const db = getTestDb();

      const form1Submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      const form2Submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, form2.id),
      });

      expect(form1Submissions).toHaveLength(1);
      expect(form2Submissions).toHaveLength(1);
      expect(JSON.parse(form1Submissions[0]!.data).form).toBe(1);
      expect(JSON.parse(form2Submissions[0]!.data).form).toBe(2);
    });
  });
});
