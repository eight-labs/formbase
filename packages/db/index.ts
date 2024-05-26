import { and, count, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@formbase/env";

import * as dbSchema from "./schema";

const queryClient = postgres(env.DATABASE_URL);

export const db = drizzle(queryClient, {
  schema: dbSchema,
});

export const drizzlePrimitives = {
  eq,
  and,
  count,
};
