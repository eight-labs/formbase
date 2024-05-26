import { z } from "zod";

import { drizzlePrimitives } from "@formbase/db";
import {
  formDatas,
  forms,
  ZInsertFormSchema,
  ZUpdateFormSchema,
} from "@formbase/db/schema";
import { generateId } from "@formbase/utils/generate-id";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const { and, count, eq } = drizzlePrimitives;

export const formRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().int().default(1),
        perPage: z.number().int().default(12),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.query.forms.findMany({
        offset: (input.page - 1) * input.perPage,
        limit: input.perPage,
        orderBy: (table, { desc }) => desc(table.createdAt),
        columns: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
        },
        with: { user: { columns: { email: true } } },
      }),
    ),

  get: protectedProcedure
    .input(z.object({ formId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.forms.findFirst({
        where: (table) =>
          and(eq(table.id, input.formId), eq(table.userId, ctx.user.id)),
        with: { user: { columns: { email: true } } },
      }),
    ),

  create: protectedProcedure
    .input(ZInsertFormSchema)
    .mutation(async ({ ctx, input }) => {
      const id = generateId(15);

      await ctx.db.insert(forms).values({
        id,
        userId: ctx.user.id,
        title: input.title,
        description: input.description ?? null,
        updatedAt: new Date(),
        returnUrl: input.returnUrl ?? null,
        keys: [""],
        enableEmailNotifications: input.enableEmailNotifications ?? true,
        enableSubmissions: input.enableSubmissions ?? true,
      });

      return { id };
    }),

  update: protectedProcedure
    .input(ZUpdateFormSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(forms)
        .set({
          title: input.title,
          description: input.description ?? null,
          updatedAt: new Date(),
          enableSubmissions: input.enableSubmissions ?? true,
          enableEmailNotifications: input.enableEmailNotifications ?? true,
          returnUrl: input.returnUrl ?? null,
        })
        .where(eq(forms.id, input.id));
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(forms).where(eq(forms.id, input.id));
    }),

  userForms: protectedProcedure
    .input(
      z.object({
        page: z.number().int().default(1),
        perPage: z.number().int().default(12),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.query.forms.findMany({
        where: (table) => eq(table.userId, ctx.user.id),
        offset: (input.page - 1) * input.perPage,
        limit: input.perPage,
        // orderBy: (table, { desc }) => desc(table.createdAt),
        columns: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
        with: {
          formData: true,
        },
      }),
    ),

  hasReturiningUrl: protectedProcedure
    .input(
      z.object({
        formId: z.string(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.query.forms.findFirst({
        where: (table) => eq(table.id, input.formId),
        columns: {
          returnUrl: true,
        },
      }),
    ),

  formSubmissions: protectedProcedure
    .input(
      z.object({
        formId: z.string(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db
        .select({ count: count(formDatas.data) })
        .from(formDatas)
        .where(eq(formDatas.formId, input.formId)),
    ),

  getFormById: publicProcedure
    .input(
      z.object({
        formId: z.string(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.query.forms.findFirst({
        where: (table) => eq(table.id, input.formId),
      }),
    ),
});
