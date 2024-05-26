import { relations } from "drizzle-orm";

import { formDatas } from "./form-data";
import { forms } from "./forms";
import { users } from "./users";

export const userRelations = relations(users, ({ many }) => ({
  forms: many(forms),
}));

export const formRelations = relations(forms, ({ one, many }) => ({
  user: one(users, {
    fields: [forms.userId],
    references: [users.id],
  }),
  formData: many(formDatas),
}));

export const formDataRelations = relations(formDatas, ({ one }) => ({
  form: one(forms, {
    fields: [formDatas.formId],
    references: [forms.id],
  }),
}));
