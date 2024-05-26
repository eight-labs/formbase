import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    githubId: integer('github_id').unique(),
    name: text('name'),
    email: text('email').unique().notNull(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    hashedPassword: text('hashed_password'),
    avatar: text('avatar'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    stripePriceId: text('stripe_price_id'),
    stripeCustomerId: text('stripe_customer_id'),
    stripeCurrentPeriodEnd: timestamp('stripe_current_period_end'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at'),
  },
  (t) => ({
    emailIdx: index('email_idx').on(t.email),
    githubIdx: index('github_idx').on(t.githubId),
  }),
);

export const ZSelectUserSchema = createSelectSchema(users);
export const ZInsertUserSchema = createInsertSchema(users);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
