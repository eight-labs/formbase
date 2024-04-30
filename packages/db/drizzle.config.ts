import { type Config } from "drizzle-kit";

import { env } from "@formbase/env";
import { DATABASE_PREFIX } from "@formbase/lib/constants";

export default {
  schema: "./schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: [`${DATABASE_PREFIX}_*`],
} satisfies Config;
