import {
  boolean,
  index,
  json,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createTable } from "~/server/db/util";

export const users = createTable(
  "users",
  {
    id: varchar("id", { length: 21 }).primaryKey(),
    githubId: varchar("github_id", { length: 255 }).unique(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    hashedPassword: varchar("hashed_password", { length: 255 }),
    avatar: varchar("avatar", { length: 255 }),
    stripeSubscriptionId: varchar("stripe_subscription_id", { length: 191 }),
    stripePriceId: varchar("stripe_price_id", { length: 191 }),
    stripeCustomerId: varchar("stripe_customer_id", { length: 191 }),
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
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("user_id", { length: 21 }).notNull(),
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
    userId: varchar("user_id", { length: 21 }).unique().notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    code: varchar("code", { length: 8 }).notNull(),
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
    id: varchar("id", { length: 40 }).primaryKey(),
    userId: varchar("user_id", { length: 21 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (t) => ({
    userIdx: index("password_reset_user_idx").on(t.userId),
  }),
);

export const posts = createTable(
  "posts",
  {
    id: varchar("id", { length: 15 }).primaryKey(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    excerpt: varchar("excerpt", { length: 255 }).notNull(),
    content: text("content").notNull(),
    status: varchar("status", { length: 10, enum: ["draft", "published"] })
      .default("draft")
      .notNull(),
    tags: varchar("tags", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at"),
  },
  (t) => ({
    userIdx: index("posts_user_idx").on(t.userId),
    createdAtIdx: index("post_created_at_idx").on(t.createdAt),
  }),
);

export const forms = createTable(
  "forms",
  {
    id: varchar("id", { length: 15 }).primaryKey(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at"),
    returnUrl: varchar("return_url", { length: 255 }),
  },
  (t) => ({
    userIdx: index("form_user_idx").on(t.userId),
    createdAtIdx: index("form_created_at_idx").on(t.createdAt),
  }),
);

export const formDatas = createTable(
  "form_datas",
  {
    id: varchar("id", { length: 15 }).primaryKey(),
    formId: varchar("form_id", { length: 15 }).notNull(),
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
  posts: many(posts),
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

export const postRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type FormData = typeof formDatas.$inferSelect;
export type NewFormData = typeof formDatas.$inferInsert;

export type Form = typeof forms.$inferSelect;
export type NewForm = typeof forms.$inferInsert;

export type Session = typeof sessions.$inferSelect;
