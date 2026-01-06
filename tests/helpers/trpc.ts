import { createCaller } from '@formbase/api';

import { type TestSession, type TestUser } from './auth';
import { getTestDb } from './db';

/**
 * Creates a tRPC caller with optional authenticated user/session.
 *
 * For authenticated tests, pass both user and session.
 * For unauthenticated tests, call without options.
 */
export async function createTestCaller(options?: {
  user?: TestUser;
  session?: TestSession;
}) {
  const db = getTestDb();

  // Build session object matching better-auth's structure
  const sessionData = options?.session
    ? {
        session: {
          id: options.session.id,
          token: options.session.token,
          userId: options.session.userId,
          expiresAt: options.session.expiresAt,
          createdAt: new Date(),
          updatedAt: new Date(),
          ipAddress: null,
          userAgent: null,
        },
        user: options.user
          ? {
              id: options.user.id,
              email: options.user.email,
              name: options.user.name,
              emailVerified: options.user.emailVerified,
              image: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          : null,
      }
    : null;

  // Create context matching createTRPCContext structure
  const ctx = {
    db,
    session: sessionData,
    user: sessionData?.user ?? null,
    headers: new Headers(),
  };

  // Create caller with the test context
  // The createCaller function accepts a context factory function
  return createCaller(() => ctx as never);
}

/**
 * Creates an unauthenticated tRPC caller.
 */
export async function createUnauthenticatedCaller() {
  return createTestCaller();
}

/**
 * Creates an authenticated tRPC caller for the given user and session.
 */
export async function createAuthenticatedCaller(
  user: TestUser,
  session: TestSession,
) {
  return createTestCaller({ user, session });
}
