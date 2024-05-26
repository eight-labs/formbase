import { z } from "zod";

import { drizzlePrimitives } from "@formbase/db";
import { users } from "@formbase/db/schema";

import { createRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createRouter({
  get: protectedProcedure.query(({ ctx }) => ctx.user),
  getUserById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input, ctx }) =>
      ctx.db.query.users.findFirst({
        where: (table, { eq }) => eq(table.id, input.userId),
      }),
    ),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(users)
        .set({
          name: input.name,
        })
        .where(drizzlePrimitives.eq(users.id, ctx.user.id));
    }),
});
