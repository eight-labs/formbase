import { index, json, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const formDatas = pgTable(
  'form_datas',
  {
    id: text('id').primaryKey(),
    formId: text('form_id').notNull(),
    data: json('data').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    formIdx: index('form_idx').on(t.formId),
    createdAtIdx: index('form_data_created_at_idx').on(t.createdAt),
  }),
);
