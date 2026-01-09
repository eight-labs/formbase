import { relations } from 'drizzle-orm';

import { accounts } from './accounts';
import { apiAuditLogs } from './api-audit-logs';
import { apiKeys } from './api-keys';
import { formDatas } from './form-data';
import { forms } from './forms';
import { sessions } from './sessions';
import { users } from './users';

export const userRelations = relations(users, ({ many }) => ({
  forms: many(forms),
  sessions: many(sessions),
  accounts: many(accounts),
  apiKeys: many(apiKeys),
}));

export const apiKeyRelations = relations(apiKeys, ({ one, many }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
  auditLogs: many(apiAuditLogs),
}));

export const apiAuditLogRelations = relations(apiAuditLogs, ({ one }) => ({
  apiKey: one(apiKeys, {
    fields: [apiAuditLogs.apiKeyId],
    references: [apiKeys.id],
  }),
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
