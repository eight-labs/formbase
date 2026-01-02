import { z } from 'zod';

import { drizzlePrimitives } from '@formbase/db';
import { formDatas, forms } from '@formbase/db/schema';
import { flattenObject } from '@formbase/utils/flatten-object';
import { generateId } from '@formbase/utils/generate-id';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

const { eq } = drizzlePrimitives;

const parseJson = (value: string) => {
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const serializeJson = (value: unknown) =>
  typeof value === 'string' ? value : JSON.stringify(value);

export const formDataRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const row = await ctx.db.query.formDatas.findFirst({
        where: (table, { eq }) => eq(table.id, input.id),
      });

      if (!row) return null;

      return {
        ...row,
        data: parseJson(row.data),
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        data: z.unknown(),
        formId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = generateId(15);

      await ctx.db
        .insert(formDatas)
        .values({
          id,
          data: serializeJson(input.data),
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
        data: z.unknown(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(formDatas)
        .set({
          data: serializeJson(input.data),
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

      return formData.map((data) => {
        const parsed = parseJson(data.data);
        const normalized = {
          ...data,
          data: parsed,
        };

        return {
          ...flattenObject({
            ...data,
            data: parsed ?? {},
          } as Record<string, unknown>),
          ...normalized,
        };
      });
    }),

  setFormData: publicProcedure
    .input(
      z.object({
        formId: z.string(),
        data: z.unknown(),
        keys: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const formdata = await tx.insert(formDatas).values({
          data: serializeJson(input.data),
          formId: input.formId,
          id: generateId(15),
          createdAt: new Date(),
        });

        await tx
          .update(forms)
          .set({
            updatedAt: new Date(),
            keys: JSON.stringify(input.keys),
          })
          .where(eq(forms.id, input.formId));

        return formdata;
      });
    }),
});
