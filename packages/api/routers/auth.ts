import { createRouter, publicProcedure } from '../trpc';

export const authRouter = createRouter({
  getSession: publicProcedure.query(({ ctx }) => ctx.session),
});
