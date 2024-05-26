import { index, json, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { type z } from 'zod';

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

export const ZSelectFormDataSchema = createSelectSchema(formDatas);
export const ZInsertFormDataSchema = createInsertSchema(formDatas);
export const ZUpdateFormDataSchema = createInsertSchema(formDatas).pick({
  formId: true,
  data: true,
});

export type FormData = z.infer<typeof ZSelectFormDataSchema>;
