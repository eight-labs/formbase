import { afterAll, afterEach, beforeAll } from 'vitest';

import {
  resetDatabase,
  setupTestDatabase,
  teardownTestDatabase,
} from './helpers/db';

// Set test environment variables before any imports
process.env['SKIP_ENV_VALIDATION'] = 'true';
process.env['NODE_ENV'] = 'test';
process.env['DATABASE_URL'] = 'file::memory:?cache=shared';
process.env['BETTER_AUTH_SECRET'] =
  'test-secret-minimum-32-characters-long-for-testing';
process.env['NEXT_PUBLIC_APP_URL'] = 'http://localhost:3000';
process.env['ALLOW_SIGNIN_SIGNUP'] = 'true';

beforeAll(async () => {
  await setupTestDatabase();
});

afterEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await teardownTestDatabase();
});
