import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const onboardingForms = pgTable('onboarding_forms', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  formId: text('form_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
