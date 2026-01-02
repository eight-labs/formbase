import { createClient } from '@libsql/client';
import { and, count, eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from './schema';

const databaseUrl = process.env['DATABASE_URL']!;
const authToken =
  databaseUrl.startsWith('libsql://')
    ? process.env['TURSO_AUTH_TOKEN']
    : undefined;

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
