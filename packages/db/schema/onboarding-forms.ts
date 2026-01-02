import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { forms } from './forms';

export const onboardingForms = sqliteTable('onboarding_forms', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  formId: text('form_id')
    .references(() => forms.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
});
