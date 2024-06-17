import { and, count, eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

export const queryClient = postgres(process.env['DATABASE_URL']!);

export const db = drizzle(queryClient, {
  schema: schema,
});

export const drizzlePrimitives = {
  eq,
  and,
  count,
  sql,
};
