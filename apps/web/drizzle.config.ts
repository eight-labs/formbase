import { type Config } from "drizzle-kit";

import { env } from "src/env";
import { DATABASE_PREFIX } from "src/lib/constants";

export default {
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: [`${DATABASE_PREFIX}_*`],
} satisfies Config;
