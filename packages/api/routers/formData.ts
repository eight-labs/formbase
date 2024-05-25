import { drizzlePrimitives } from '@formbase/db';
import { formDatas, forms } from '@formbase/db/schema';
import { flattenObject } from '@formbase/utils/flatten-object';
import { generateId } from '@formbase/utils/generate-id';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

const { eq } = drizzlePrimitives;

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
    .query(async ({ ctx, input }) => {
      const formData = await ctx.db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, input.formId),
      });

      return formData.map((data) => ({ ...flattenObject(data), ...data }));
    }),

  setFormData: publicProcedure
    .input(
      z.object({
        formId: z.string(),
        data: z.object({}),
        keys: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx.insert(formDatas).values({
          data: input.data,
          formId: input.formId,
          id: generateId(15),
          createdAt: new Date(),
        });

        await tx
          .update(forms)
          .set({
            updatedAt: new Date(),
            keys: input.keys,
          })
          .where(eq(forms.id, input.formId));
      });
    }),
});
