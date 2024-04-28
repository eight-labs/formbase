import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "src/env.js";

import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var -- only var works here
  var db: PostgresJsDatabase<typeof schema> | undefined;
}

let db: PostgresJsDatabase<typeof schema>;

if (env.NODE_ENV === "production") {
  db = drizzle(postgres(env.DATABASE_URL), { schema });
} else {
  if (!global.db) {
    global.db = drizzle(postgres(env.DATABASE_URL), { schema });
  }

  db = global.db;
}

export { db };

export const adapter = new DrizzlePostgreSQLAdapter(
  db,
  schema.sessions,
  schema.users,
);
