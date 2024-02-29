import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  json,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { createTable } from "~/server/db/util";

export const users = createTable(
  "users",
  {
    id: text("id").primaryKey(),
    githubId: integer("github_id").unique(),
    name: text("name"),
    email: text("email").unique().notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    hashedPassword: text("hashed_password"),
    avatar: text("avatar"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    stripePriceId: text("stripe_price_id"),
    stripeCustomerId: text("stripe_customer_id"),
    stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at"),
  },
  (t) => ({
    emailIdx: index("email_idx").on(t.email),
    githubIdx: index("github_idx").on(t.githubId),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const sessions = createTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (t) => ({
    userIdx: index("sessions_user_idx").on(t.userId),
  }),
);

export const emailVerificationCodes = createTable(
  "email_verification_codes",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").unique().notNull(),
    email: text("email").notNull(),
    code: text("code").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (t) => ({
    userIdx: index("email_verif_user_idx").on(t.userId),
    emailIdx: index("email_verif_idx").on(t.email),
  }),
);

export const passwordResetTokens = createTable(
  "password_reset_tokens",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (t) => ({
    userIdx: index("password_reset_user_idx").on(t.userId),
  }),
);

export const forms = createTable(
  "forms",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at"),
    returnUrl: text("return_url"),
    enableEmailNotifications: boolean("send_email_for_new_submissions")
      .default(true)
      .notNull(),
    keys: text("keys").array().notNull(),
    enableSubmissions: boolean("enable_submissions").default(true).notNull(),
    enableRetention: boolean("enable_retention").default(true).notNull(),
  },
  (t) => ({
    userIdx: index("form_user_idx").on(t.userId),
    createdAtIdx: index("form_created_at_idx").on(t.createdAt),
  }),
);

export const formDatas = createTable(
  "form_datas",
  {
    id: text("id").primaryKey(),
    formId: text("form_id").notNull(),
    data: json("data").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    formIdx: index("form_idx").on(t.formId),
    createdAtIdx: index("form_data_created_at_idx").on(t.createdAt),
  }),
);

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

export type FormData = typeof formDatas.$inferSelect;
export type NewFormData = typeof formDatas.$inferInsert;

export type Form = typeof forms.$inferSelect;
export type NewForm = typeof forms.$inferInsert;

export type Session = typeof sessions.$inferSelect;
