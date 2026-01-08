import { beforeEach, describe, expect, it } from 'vitest';

import {
  createAuthenticatedCaller,
  createTestForm,
  createTestFormData,
  createTestSession,
  createTestUser,
  createUnauthenticatedCaller,
  type TestForm,
  type TestFormData,
  type TestSession,
  type TestUser,
} from '../helpers';

describe('Security Matrix', () => {
  // Test users
  let userA: TestUser;
  let userB: TestUser;
  let sessionA: TestSession;
  let sessionB: TestSession;
  let callerA: Awaited<ReturnType<typeof createAuthenticatedCaller>>;
  let callerB: Awaited<ReturnType<typeof createAuthenticatedCaller>>;
  let unauthCaller: Awaited<ReturnType<typeof createUnauthenticatedCaller>>;

  // Test data
  let formA: TestForm;
  let submissionA: TestFormData;

  beforeEach(async () => {
    // Create two test users
    const passwordA = 'PasswordA123!';
    const passwordB = 'PasswordB123!';

    userA = await createTestUser({
      email: 'usera@example.com',
      password: passwordA,
    });
    userB = await createTestUser({
      email: 'userb@example.com',
      password: passwordB,
    });

    sessionA = await createTestSession(userA.email, passwordA);
    sessionB = await createTestSession(userB.email, passwordB);

    callerA = await createAuthenticatedCaller(userA, sessionA);
    callerB = await createAuthenticatedCaller(userB, sessionB);
    unauthCaller = await createUnauthenticatedCaller();

    // Create test data owned by User A
    formA = await createTestForm({
      userId: userA.id,
      title: 'User A Form',
    });
    submissionA = await createTestFormData({
      formId: formA.id,
      data: { secret: 'data' },
    });
  });

  describe('Cross-user form isolation', () => {
    it('User B cannot read User A form via form.get', async () => {
      const result = await callerB.form.get({ formId: formA.id });
      expect(result).toBeNull();
    });

    it('User B cannot update User A form', async () => {
      await expect(
        callerB.form.update({ id: formA.id, title: 'Hacked' }),
      ).rejects.toThrow();
    });

    it('User B cannot delete User A form', async () => {
      await expect(callerB.form.delete({ id: formA.id })).rejects.toThrow();
    });

    it("User B form list does not include User A forms", async () => {
      const formB = await createTestForm({
        userId: userB.id,
        title: 'User B Form',
      });
      const listB = await callerB.form.list({ page: 1, perPage: 10 });

      expect(listB.map((f) => f.id)).not.toContain(formA.id);
      expect(listB.map((f) => f.id)).toContain(formB.id);
    });
  });

  describe('Cross-user submission isolation', () => {
    it('User B cannot read User A submissions via formData.get', async () => {
      await expect(
        callerB.formData.get({ id: submissionA.id }),
      ).rejects.toThrow();
    });

    it('User B cannot delete User A submissions', async () => {
      await expect(
        callerB.formData.delete({ id: submissionA.id }),
      ).rejects.toThrow();
    });

    it('User B cannot list User A form submissions', async () => {
      await expect(
        callerB.formData.all({ formId: formA.id }),
      ).rejects.toThrow();
    });

    it('User B cannot create submission on User A form via protected route', async () => {
      await expect(
        callerB.formData.create({
          formId: formA.id,
          data: { attack: 'data' },
        }),
      ).rejects.toThrow();
    });
  });

  describe('Unauthenticated access attempts', () => {
    it('form.create requires authentication', async () => {
      await expect(
        unauthCaller.form.create({ title: 'Anon Form' }),
      ).rejects.toThrow('UNAUTHORIZED');
    });

    it('form.get requires authentication', async () => {
      await expect(
        unauthCaller.form.get({ formId: formA.id }),
      ).rejects.toThrow('UNAUTHORIZED');
    });

    it('form.update requires authentication', async () => {
      await expect(
        unauthCaller.form.update({ id: formA.id, title: 'X' }),
      ).rejects.toThrow('UNAUTHORIZED');
    });

    it('form.delete requires authentication', async () => {
      await expect(
        unauthCaller.form.delete({ id: formA.id }),
      ).rejects.toThrow('UNAUTHORIZED');
    });

    it('form.list requires authentication', async () => {
      await expect(
        unauthCaller.form.list({ page: 1, perPage: 10 }),
      ).rejects.toThrow('UNAUTHORIZED');
    });

    it('formData.create requires authentication', async () => {
      await expect(
        unauthCaller.formData.create({ formId: formA.id, data: {} }),
      ).rejects.toThrow('UNAUTHORIZED');
    });

    it('formData.get requires authentication', async () => {
      await expect(
        unauthCaller.formData.get({ id: submissionA.id }),
      ).rejects.toThrow('UNAUTHORIZED');
    });

    it('formData.delete requires authentication', async () => {
      await expect(
        unauthCaller.formData.delete({ id: submissionA.id }),
      ).rejects.toThrow('UNAUTHORIZED');
    });

    it('formData.all requires authentication', async () => {
      await expect(
        unauthCaller.formData.all({ formId: formA.id }),
      ).rejects.toThrow('UNAUTHORIZED');
    });

    it('user.get requires authentication', async () => {
      await expect(unauthCaller.user.get()).rejects.toThrow('UNAUTHORIZED');
    });

    it('user.update requires authentication', async () => {
      await expect(
        unauthCaller.user.update({ id: 'x', name: 'X' }),
      ).rejects.toThrow('UNAUTHORIZED');
    });
  });

  describe('Deleted resource handling', () => {
    it('accessing deleted form returns null', async () => {
      const tempForm = await createTestForm({
        userId: userA.id,
        title: 'Temp',
      });
      await callerA.form.delete({ id: tempForm.id });

      const result = await callerA.form.get({ formId: tempForm.id });
      expect(result).toBeNull();
    });

    it('updating deleted form throws NOT_FOUND', async () => {
      const tempForm = await createTestForm({
        userId: userA.id,
        title: 'Temp',
      });
      await callerA.form.delete({ id: tempForm.id });

      await expect(
        callerA.form.update({ id: tempForm.id, title: 'X' }),
      ).rejects.toThrow();
    });

    it('accessing nonexistent form ID returns null', async () => {
      const result = await callerA.form.get({ formId: 'nonexistent12345' });
      expect(result).toBeNull();
    });

    it('accessing nonexistent submission ID throws NOT_FOUND', async () => {
      await expect(
        callerA.formData.get({ id: 'nonexistent12345' }),
      ).rejects.toThrow();
    });
  });
});
