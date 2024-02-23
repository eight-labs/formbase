import { pgTableCreator } from "drizzle-orm/pg-core";

import { DATABASE_PREFIX as prefix } from "~/lib/constants";

export const createTable = pgTableCreator((name) => `${prefix}_${name}`);
