import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
  },
  (t) => ({
    userIdx: index('password_reset_user_idx').on(t.userId),
  }),
);
