import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { forms } from './forms';

export const onboardingForms = pgTable('onboarding_forms', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  formId: text('form_id')
    .references(() => forms.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
