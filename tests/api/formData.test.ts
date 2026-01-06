import { beforeEach, describe, expect, it } from 'vitest';

import {
  createAuthenticatedCaller,
  createTestForm,
  createTestSession,
  createTestUser,
  type TestForm,
  type TestSession,
  type TestUser,
} from '../helpers';

describe('FormData API', () => {
  let user: TestUser;
  let session: TestSession;
  let caller: Awaited<ReturnType<typeof createAuthenticatedCaller>>;
  let testForm: TestForm;

  beforeEach(async () => {
    const password = 'Password123!';
    user = await createTestUser({
      email: 'formdata@example.com',
      password,
    });
    session = await createTestSession(user.email, password);
    caller = await createAuthenticatedCaller(user, session);
    testForm = await createTestForm({ userId: user.id, title: 'Test Form' });
  });

  describe('formData.create', () => {
    it('creates a submission for an owned form', async () => {
      const result = await caller.formData.create({
        formId: testForm.id,
        data: { name: 'John Doe', email: 'john@example.com' },
      });

      expect(result).toHaveProperty('id');
      expect(result.id).toHaveLength(15);
    });
  });

  describe('formData.get', () => {
    it('retrieves a submission by ID', async () => {
      const created = await caller.formData.create({
        formId: testForm.id,
        data: { name: 'Jane Doe' },
      });

      const submission = await caller.formData.get({ id: created.id });

      expect(submission).not.toBeNull();
      expect(submission?.data).toEqual({ name: 'Jane Doe' });
    });
  });

  describe('formData.delete', () => {
    it('deletes a submission', async () => {
      const created = await caller.formData.create({
        formId: testForm.id,
        data: { message: 'To delete' },
      });

      await caller.formData.delete({ id: created.id });

      // Getting a deleted submission should throw NOT_FOUND
      await expect(caller.formData.get({ id: created.id })).rejects.toThrow();
    });
  });

  describe('formData.all', () => {
    it('lists all submissions for a form', async () => {
      await caller.formData.create({ formId: testForm.id, data: { n: 1 } });
      await caller.formData.create({ formId: testForm.id, data: { n: 2 } });
      await caller.formData.create({ formId: testForm.id, data: { n: 3 } });

      const submissions = await caller.formData.all({ formId: testForm.id });

      expect(submissions).toHaveLength(3);
    });
  });
});
