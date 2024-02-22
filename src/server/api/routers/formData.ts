import { eq } from "drizzle-orm";
import { nanoid as generateId } from "nanoid";
import { z } from "zod";

import { formDatas, forms } from "~/server/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const formDataRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.query.formDatas.findFirst({
        where: (table, { eq }) => eq(table.id, input.id),
      }),
    ),

  create: protectedProcedure
    .input(
      z.object({
        data: z.string().min(1),
        formId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = generateId(15);

      await ctx.db
        .insert(formDatas)
        .values({
          id,
          data: input.data,
          formId: input.formId,
        })
        .returning();

      await ctx.db
        .update(forms)
        .set({ updatedAt: new Date() })
        .where(eq(forms.id, input.formId))
        .returning();

      return { id };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(formDatas)
        .set({
          data: input.data,
        })
        .where(eq(formDatas.id, input.id));
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(formDatas).where(eq(formDatas.id, input.id));
    }),

  all: protectedProcedure
    .input(
      z.object({
        formId: z.string(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, input.formId),
        // orderBy: (table, { desc }) => desc(table.createdAt),
      }),
    ),
});
