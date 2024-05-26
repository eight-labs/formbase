import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const emailVerificationCodes = pgTable(
  "email_verification_codes",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").unique().notNull(),
    email: text("email").notNull(),
    code: text("code").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (t) => ({
    userIdx: index("email_verif_user_idx").on(t.userId),
    emailIdx: index("email_verif_idx").on(t.email),
  }),
);
