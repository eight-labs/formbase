import { users } from '@formbase/db/schema';
import { generateId } from '@formbase/utils/generate-id';

export interface TestUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
}

export interface TestSession {
  token: string;
  userId: string;
}

/**
 * Creates a test user using better-auth's API (properly hashes password).
 */
export async function createTestUser(
  options: {
    email?: string;
    name?: string;
    password?: string;
    emailVerified?: boolean;
  } = {},
): Promise<TestUser> {
  const { auth } = await import('@formbase/auth');
  const { db, drizzlePrimitives } = await import('@formbase/db');

  const email = options.email ?? `test-${generateId(15)}@example.com`;
  const name = options.name ?? 'Test User';
  const password = options.password ?? 'TestPassword123!';
  const emailVerified = options.emailVerified ?? true;

  // Use better-auth's signUp API to create user with properly hashed password
  const response = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  });

  if (!response.user) {
    throw new Error(`Failed to create test user: ${email}`);
  }

  // Mark email as verified if needed
  if (emailVerified) {
    await db
      .update(users)
      .set({ emailVerified: true })
      .where(drizzlePrimitives.eq(users.id, response.user.id));
  }

  return {
    id: response.user.id,
    email: response.user.email,
    name: response.user.name ?? name,
    emailVerified,
  };
}

/**
 * Creates a test session for a user using better-auth's API.
 */
export async function createTestSession(
  email: string,
  password: string,
): Promise<TestSession> {
  const { auth } = await import('@formbase/auth');

  // Use better-auth's signIn API to create a session
  const response = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (!response.token || !response.user) {
    throw new Error(`Failed to create session for: ${email}`);
  }

  return {
    token: response.token,
    userId: response.user.id,
  };
}

/**
 * Creates HTTP headers with a session cookie for authenticated requests.
 */
export function createAuthHeaders(sessionToken: string): Headers {
  const headers = new Headers();
  headers.set('Cookie', `better-auth.session_token=${sessionToken}`);
  return headers;
}
