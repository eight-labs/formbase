import { formRouter } from "./routers/form";
import { postRouter } from "./routers/post";
import { stripeRouter } from "./routers/stripe";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  post: postRouter,
  stripe: stripeRouter,
  form: formRouter,
});

export type AppRouter = typeof appRouter;
