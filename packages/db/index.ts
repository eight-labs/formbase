import { createClient } from '@libsql/client';
import { and, count, eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';

import { env } from '@formbase/env';

import * as schema from './schema';

const databaseUrl = env.DATABASE_URL;
const authToken = databaseUrl.startsWith('libsql://')
  ? env.TURSO_AUTH_TOKEN
  : undefined;

if (databaseUrl.startsWith('libsql://') && !authToken) {
  throw new Error(
    'TURSO_AUTH_TOKEN is required when using libsql:// URLs. ' +
      'Get your token from the Turso dashboard.',
  );
}

export const queryClient = createClient({
  url: databaseUrl,
  authToken,
});

export const db = drizzle(queryClient, {
  schema: schema,
});

export const drizzlePrimitives = {
  eq,
  and,
  count,
  sql,
};
