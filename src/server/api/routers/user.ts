import { eq } from "drizzle-orm";
import { z } from "zod";

import { users } from "~/server/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => ctx.user),
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
        .where(eq(users.id, ctx.user.id));
    }),
});
