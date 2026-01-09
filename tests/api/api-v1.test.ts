import { beforeEach, describe, expect, it } from 'vitest';

import {
  createApiV1Caller,
  createExpiredApiKey,
  createTestApiKey,
  createTestForm,
  createTestFormData,
  createTestUser,
  type TestApiKey,
  type TestUser,
} from '../helpers';

describe('API v1', () => {
  let user: TestUser;
  let apiKey: TestApiKey;

  beforeEach(async () => {
    user = await createTestUser({ email: 'api-test@example.com' });
    apiKey = await createTestApiKey({ userId: user.id });
  });

  describe('Authentication', () => {
    it('succeeds with valid API key', async () => {
      const caller = await createApiV1Caller(apiKey.key);
      const result = await caller.forms.list({ page: 1, perPage: 20 });
      expect(result.forms).toBeDefined();
    });

    it('fails with missing auth header', async () => {
      const caller = await createApiV1Caller();
      await expect(caller.forms.list({ page: 1, perPage: 20 })).rejects.toThrow(
        'Invalid or missing API key',
      );
    });

    it('fails with invalid API key', async () => {
      const caller = await createApiV1Caller('invalid-key');
      await expect(caller.forms.list({ page: 1, perPage: 20 })).rejects.toThrow(
        'Invalid or missing API key',
      );
    });

    it('fails with expired API key', async () => {
      const expiredKey = await createExpiredApiKey({ userId: user.id });
      const caller = await createApiV1Caller(expiredKey.key);
      await expect(caller.forms.list({ page: 1, perPage: 20 })).rejects.toThrow(
        'Invalid or missing API key',
      );
    });
  });

  describe('Rate Limiting', () => {
    it('returns 429 when rate limit exceeded', async () => {
      const rateLimitKey = await createTestApiKey({
        userId: user.id,
        name: 'Rate Limit Test Key',
      });

      const caller = await createApiV1Caller(rateLimitKey.key);

      for (let i = 0; i < 100; i++) {
        await caller.forms.list({ page: 1, perPage: 20 });
      }

      await expect(
        caller.forms.list({ page: 1, perPage: 20 }),
      ).rejects.toThrow('Rate limit exceeded');
    });
  });

  describe('Forms', () => {
    describe('list', () => {
      it('returns paginated list of forms', async () => {
        await createTestForm({ userId: user.id, title: 'Form 1' });
        await createTestForm({ userId: user.id, title: 'Form 2' });

        const caller = await createApiV1Caller(apiKey.key);
        const result = await caller.forms.list({ page: 1, perPage: 20 });

        expect(result.forms).toHaveLength(2);
        expect(result.pagination).toMatchObject({
          page: 1,
          perPage: 20,
          total: 2,
          totalPages: 1,
        });
      });

      it('respects pagination parameters', async () => {
        for (let i = 0; i < 5; i++) {
          await createTestForm({ userId: user.id, title: `Form ${i}` });
        }

        const caller = await createApiV1Caller(apiKey.key);
        const result = await caller.forms.list({ page: 2, perPage: 2 });

        expect(result.forms).toHaveLength(2);
        expect(result.pagination.page).toBe(2);
        expect(result.pagination.totalPages).toBe(3);
      });

      it('returns empty list for user with no forms', async () => {
        const caller = await createApiV1Caller(apiKey.key);
        const result = await caller.forms.list({ page: 1, perPage: 20 });

        expect(result.forms).toHaveLength(0);
        expect(result.pagination.total).toBe(0);
      });
    });

    describe('create', () => {
      it('creates a form with valid input', async () => {
        const caller = await createApiV1Caller(apiKey.key);
        const result = await caller.forms.create({
          title: 'New Form',
          description: 'Test description',
        });

        expect(result.id).toBeDefined();
        expect(result.id).toHaveLength(15);
      });

      it('creates form with optional fields', async () => {
        const caller = await createApiV1Caller(apiKey.key);
        const result = await caller.forms.create({
          title: 'Test Form',
          description: 'A description',
          returnUrl: 'https://example.com/thanks',
        });

        expect(result.id).toBeDefined();

        const form = await caller.forms.get({ formId: result.id });
        expect(form.returnUrl).toBe('https://example.com/thanks');
      });
    });

    describe('get', () => {
      it('returns form for owner', async () => {
        const form = await createTestForm({
          userId: user.id,
          title: 'My Form',
          description: 'Test',
        });

        const caller = await createApiV1Caller(apiKey.key);
        const result = await caller.forms.get({ formId: form.id });

        expect(result.title).toBe('My Form');
        expect(result.description).toBe('Test');
      });

      it('throws NOT_FOUND for non-existent form', async () => {
        const caller = await createApiV1Caller(apiKey.key);
        await expect(
          caller.forms.get({ formId: 'nonexistent12345' }),
        ).rejects.toThrow('Form not found');
      });

      it('throws NOT_FOUND for form owned by another user', async () => {
        const otherUser = await createTestUser({ email: 'other@example.com' });
        const otherForm = await createTestForm({
          userId: otherUser.id,
          title: 'Other Form',
        });

        const caller = await createApiV1Caller(apiKey.key);
        await expect(
          caller.forms.get({ formId: otherForm.id }),
        ).rejects.toThrow('Form not found');
      });
    });

    describe('update', () => {
      it('updates form properties', async () => {
        const form = await createTestForm({
          userId: user.id,
          title: 'Original',
        });

        const caller = await createApiV1Caller(apiKey.key);
        await caller.forms.update({
          formId: form.id,
          title: 'Updated',
          description: 'New description',
        });

        const updated = await caller.forms.get({ formId: form.id });
        expect(updated.title).toBe('Updated');
        expect(updated.description).toBe('New description');
      });

      it('throws NOT_FOUND for form owned by another user', async () => {
        const otherUser = await createTestUser({ email: 'other2@example.com' });
        const otherForm = await createTestForm({
          userId: otherUser.id,
          title: 'Other Form',
        });

        const caller = await createApiV1Caller(apiKey.key);
        await expect(
          caller.forms.update({ formId: otherForm.id, title: 'Hacked' }),
        ).rejects.toThrow('Form not found');
      });
    });

    describe('delete', () => {
      it('deletes form owned by user', async () => {
        const form = await createTestForm({
          userId: user.id,
          title: 'To Delete',
        });

        const caller = await createApiV1Caller(apiKey.key);
        await caller.forms.delete({ formId: form.id });

        await expect(
          caller.forms.get({ formId: form.id }),
        ).rejects.toThrow('Form not found');
      });

      it('throws NOT_FOUND for form owned by another user', async () => {
        const otherUser = await createTestUser({ email: 'other3@example.com' });
        const otherForm = await createTestForm({
          userId: otherUser.id,
          title: 'Protected',
        });

        const caller = await createApiV1Caller(apiKey.key);
        await expect(
          caller.forms.delete({ formId: otherForm.id }),
        ).rejects.toThrow('Form not found');
      });
    });

    describe('duplicate', () => {
      it('duplicates form with configuration', async () => {
        const form = await createTestForm({
          userId: user.id,
          title: 'Original Form',
          description: 'Test description',
        });

        const caller = await createApiV1Caller(apiKey.key);
        const result = await caller.forms.duplicate({ formId: form.id });

        expect(result.id).toBeDefined();
        expect(result.id).not.toBe(form.id);

        const duplicated = await caller.forms.get({ formId: result.id });
        expect(duplicated.title).toBe('Original Form (Copy)');
      });

      it('throws NOT_FOUND for non-existent form', async () => {
        const caller = await createApiV1Caller(apiKey.key);
        await expect(
          caller.forms.duplicate({ formId: 'nonexistent12345' }),
        ).rejects.toThrow('Form not found');
      });
    });

    describe('bulkCreate', () => {
      it('creates multiple forms', async () => {
        const caller = await createApiV1Caller(apiKey.key);
        const result = await caller.forms.bulkCreate({
          forms: [
            { title: 'Bulk Form 1' },
            { title: 'Bulk Form 2' },
            { title: 'Bulk Form 3' },
          ],
        });

        expect(result.ids).toHaveLength(3);
      });
    });

    describe('bulkUpdate', () => {
      it('updates multiple forms', async () => {
        const form1 = await createTestForm({ userId: user.id, title: 'Form 1' });
        const form2 = await createTestForm({ userId: user.id, title: 'Form 2' });

        const caller = await createApiV1Caller(apiKey.key);
        await caller.forms.bulkUpdate({
          forms: [
            { id: form1.id, title: 'Updated 1' },
            { id: form2.id, title: 'Updated 2' },
          ],
        });

        const list = await caller.forms.list({ page: 1, perPage: 20 });
        const titles = list.forms.map((f) => f.title);
        expect(titles).toContain('Updated 1');
        expect(titles).toContain('Updated 2');
      });

      it('fails if any form not owned by user', async () => {
        const form1 = await createTestForm({ userId: user.id, title: 'Mine' });
        const otherUser = await createTestUser({ email: 'other4@example.com' });
        const form2 = await createTestForm({
          userId: otherUser.id,
          title: 'Not Mine',
        });

        const caller = await createApiV1Caller(apiKey.key);
        await expect(
          caller.forms.bulkUpdate({
            forms: [
              { id: form1.id, title: 'Updated' },
              { id: form2.id, title: 'Hacked' },
            ],
          }),
        ).rejects.toThrow('Form not found');
      });
    });

    describe('bulkDelete', () => {
      it('deletes multiple forms', async () => {
        const form1 = await createTestForm({
          userId: user.id,
          title: 'Delete 1',
        });
        const form2 = await createTestForm({
          userId: user.id,
          title: 'Delete 2',
        });

        const caller = await createApiV1Caller(apiKey.key);
        await caller.forms.bulkDelete({ ids: [form1.id, form2.id] });

        const list = await caller.forms.list({ page: 1, perPage: 20 });
        expect(list.forms).toHaveLength(0);
      });

      it('fails with mixed ownership', async () => {
        const myForm = await createTestForm({ userId: user.id, title: 'Mine' });
        const otherUser = await createTestUser({ email: 'other5@example.com' });
        const otherForm = await createTestForm({
          userId: otherUser.id,
          title: 'Not Mine',
        });

        const caller = await createApiV1Caller(apiKey.key);
        await expect(
          caller.forms.bulkDelete({ ids: [myForm.id, otherForm.id] }),
        ).rejects.toThrow('Forms not found');
      });
    });
  });

  describe('Submissions', () => {
    let form: Awaited<ReturnType<typeof createTestForm>>;

    beforeEach(async () => {
      form = await createTestForm({ userId: user.id, title: 'Test Form' });
    });

    describe('list', () => {
      it('returns paginated list of submissions', async () => {
        await createTestFormData({ formId: form.id, data: { name: 'John' } });
        await createTestFormData({ formId: form.id, data: { name: 'Jane' } });

        const caller = await createApiV1Caller(apiKey.key);
        const result = await caller.submissions.list({
          formId: form.id,
          page: 1,
          perPage: 20,
        });

        expect(result.submissions).toHaveLength(2);
        expect(result.pagination.total).toBe(2);
      });

      it('supports date filtering', async () => {
        await createTestFormData({ formId: form.id, data: { name: 'Old' } });

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const caller = await createApiV1Caller(apiKey.key);
        const result = await caller.submissions.list({
          formId: form.id,
          page: 1,
          perPage: 20,
          startDate: tomorrow.toISOString(),
        });

        expect(result.submissions).toHaveLength(0);
      });

      it('throws NOT_FOUND for form not owned by user', async () => {
        const otherUser = await createTestUser({ email: 'other6@example.com' });
        const otherForm = await createTestForm({
          userId: otherUser.id,
          title: 'Other',
        });

        const caller = await createApiV1Caller(apiKey.key);
        await expect(
          caller.submissions.list({
            formId: otherForm.id,
            page: 1,
            perPage: 20,
          }),
        ).rejects.toThrow('Form not found');
      });
    });

    describe('get', () => {
      it('returns single submission', async () => {
        const submission = await createTestFormData({
          formId: form.id,
          data: { name: 'Test', email: 'test@test.com' },
        });

        const caller = await createApiV1Caller(apiKey.key);
        const result = await caller.submissions.get({
          formId: form.id,
          submissionId: submission.id,
        });

        expect(result.data.name).toBe('Test');
        expect(result.data.email).toBe('test@test.com');
      });

      it('throws NOT_FOUND if submission not in form', async () => {
        const otherForm = await createTestForm({
          userId: user.id,
          title: 'Other Form',
        });
        const submission = await createTestFormData({
          formId: otherForm.id,
          data: { name: 'Other' },
        });

        const caller = await createApiV1Caller(apiKey.key);
        await expect(
          caller.submissions.get({
            formId: form.id,
            submissionId: submission.id,
          }),
        ).rejects.toThrow('Submission not found');
      });
    });

    describe('delete', () => {
      it('deletes single submission', async () => {
        const submission = await createTestFormData({
          formId: form.id,
          data: { name: 'Delete Me' },
        });

        const caller = await createApiV1Caller(apiKey.key);
        await caller.submissions.delete({
          formId: form.id,
          submissionId: submission.id,
        });

        await expect(
          caller.submissions.get({
            formId: form.id,
            submissionId: submission.id,
          }),
        ).rejects.toThrow('Submission not found');
      });

      it('throws NOT_FOUND for non-existent submission', async () => {
        const caller = await createApiV1Caller(apiKey.key);
        await expect(
          caller.submissions.delete({
            formId: form.id,
            submissionId: 'nonexistent123',
          }),
        ).rejects.toThrow('Submission not found');
      });
    });

    describe('bulkDelete', () => {
      it('deletes multiple submissions', async () => {
        const sub1 = await createTestFormData({
          formId: form.id,
          data: { name: 'Sub 1' },
        });
        const sub2 = await createTestFormData({
          formId: form.id,
          data: { name: 'Sub 2' },
        });

        const caller = await createApiV1Caller(apiKey.key);
        await caller.submissions.bulkDelete({
          formId: form.id,
          ids: [sub1.id, sub2.id],
        });

        const list = await caller.submissions.list({
          formId: form.id,
          page: 1,
          perPage: 20,
        });
        expect(list.submissions).toHaveLength(0);
      });

      it('fails with submissions from different form', async () => {
        const sub1 = await createTestFormData({
          formId: form.id,
          data: { name: 'Mine' },
        });
        const otherForm = await createTestForm({
          userId: user.id,
          title: 'Other',
        });
        const sub2 = await createTestFormData({
          formId: otherForm.id,
          data: { name: 'Other' },
        });

        const caller = await createApiV1Caller(apiKey.key);
        await expect(
          caller.submissions.bulkDelete({
            formId: form.id,
            ids: [sub1.id, sub2.id],
          }),
        ).rejects.toThrow('Submissions not found');
      });
    });
  });
});
