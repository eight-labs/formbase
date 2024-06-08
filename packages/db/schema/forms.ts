import type { InferSelectModel } from 'drizzle-orm';

import { boolean, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { users } from './users';

export const forms = pgTable(
  'forms',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    title: text('title').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at'),
    returnUrl: text('return_url'),
    enableEmailNotifications: boolean('send_email_for_new_submissions')
      .default(true)
      .notNull(),
    keys: text('keys').array().notNull(),
    enableSubmissions: boolean('enable_submissions').default(true).notNull(),
    enableRetention: boolean('enable_retention').default(true).notNull(),
  },
  (t) => ({
    userIdx: index('form_user_idx').on(t.userId),
    createdAtIdx: index('form_created_at_idx').on(t.createdAt),
  }),
);

export const ZSelectFormSchema = createSelectSchema(forms);
export const ZInsertFormSchema = createInsertSchema(forms);
export const ZUpdateFormSchema = createInsertSchema(forms).pick({
  id: true,
  title: true,
  description: true,
  returnUrl: true,
  enableSubmissions: true,
  enableEmailNotifications: true,
});

export type Form = InferSelectModel<typeof forms>;
