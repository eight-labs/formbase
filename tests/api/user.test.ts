import { beforeEach, describe, expect, it } from 'vitest';

import {
  createAuthenticatedCaller,
  createTestSession,
  createTestUser,
  getTestDb,
  type TestSession,
  type TestUser,
} from '../helpers';

describe('User API', () => {
  let user: TestUser;
  let session: TestSession;
  let caller: Awaited<ReturnType<typeof createAuthenticatedCaller>>;

  beforeEach(async () => {
    const password = 'Password123!';
    user = await createTestUser({
      email: 'usertest@example.com',
      name: 'Test User',
      password,
    });
    session = await createTestSession(user.email, password);
    caller = await createAuthenticatedCaller(user, session);
  });

  describe('user.get', () => {
    it('returns the current authenticated user', async () => {
      const result = await caller.user.get();

      expect(result).toEqual(
        expect.objectContaining({
          id: user.id,
          email: user.email,
          name: user.name,
        }),
      );
    });
  });

  describe('user.update', () => {
    it('updates the user name in the database', async () => {
      await caller.user.update({
        id: user.id,
        name: 'Updated Name',
      });

      // Verify the database was updated directly
      // (user.get returns cached ctx.user, so we check the DB)
      const db = getTestDb();
      const updated = await db.query.users.findFirst({
        where: (table, { eq }) => eq(table.id, user.id),
      });
      expect(updated?.name).toBe('Updated Name');
    });
  });
});
