import type { Config } from "drizzle-kit";

import { env } from "@formbase/env";

export default {
  dialect: "postgresql",
  schema: "./schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["formbase_*"],
} satisfies Config;
