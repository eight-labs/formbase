import crypto from "crypto";

import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";

import { apiKeys } from "~/server/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const apiKeysRouter = createTRPCRouter({
  getUserKeys: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.apiKeys.findFirst({
      where: (table, { eq }) => eq(table.userId, ctx.user.id),
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const generatedKey = nanoid(21);

      const hash = crypto
        .createHash("sha256")
        .update(generatedKey)
        .digest("hex");

      await ctx.db
        .insert(apiKeys)
        .values({
          // store the first 6 strings of the random key as part of the id
          // so we display that to the user on their api keys page
          id: generatedKey.slice(0, 6) + nanoid(12),
          userId: ctx.user.id,
          key: hash,
          name: input.name,
        })
        .returning();

      return generatedKey;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const apiKey = await ctx.db.query.apiKeys.findFirst({
        where: (table, { eq }) => eq(table.id, input.id),
      });

      if (!apiKey) {
        throw new Error("API Key not found");
      }

      if (apiKey.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      await ctx.db.delete(apiKeys).where(eq(apiKeys.id, input.id));

      return true;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const apiKey = await ctx.db.query.apiKeys.findFirst({
        where: (table, { eq }) => eq(table.id, input.id),
      });

      if (!apiKey) {
        throw new Error("API Key not found");
      }

      if (apiKey.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      await ctx.db
        .update(apiKeys)
        .set({
          name: input.name,
        })
        .where(eq(apiKeys.id, input.id));

      return true;
    }),
});
