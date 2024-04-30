import { pgTableCreator } from "drizzle-orm/pg-core";

import { DATABASE_PREFIX as prefix } from "@formbase/lib/constants";

export const createTable = pgTableCreator((name) => `${prefix}_${name}`);
