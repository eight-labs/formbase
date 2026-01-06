import { createCaller } from '@formbase/api';

import { type TestSession, type TestUser } from './auth';
import { getTestDb } from './db';

export async function createTestCaller(options?: {
  user?: TestUser;
  session?: TestSession;
}) {
  const db = getTestDb();
  const { user, session } = options ?? {};

  if (!session || !user) {
    return createCaller(() => ({
      db,
      session: null,
      user: null,
      headers: new Headers(),
    }));
  }

  const now = new Date();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return createCaller(() => ({
    db,
    session: {
      session: {
        id: `test-session-${session.userId}`,
        token: session.token,
        userId: session.userId,
        expiresAt,
        createdAt: now,
        updatedAt: now,
        ipAddress: null,
        userAgent: null,
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        image: null,
        createdAt: now,
        updatedAt: now,
      },
    },
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      image: null,
      createdAt: now,
      updatedAt: now,
    },
    headers: new Headers(),
  }));
}

export async function createUnauthenticatedCaller() {
  return createTestCaller();
}

export async function createAuthenticatedCaller(
  user: TestUser,
  session: TestSession,
) {
  return createTestCaller({ user, session });
}
