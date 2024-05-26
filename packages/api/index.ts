import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";

import { formRouter } from "./routers/form";
import { formDataRouter } from "./routers/formData";
import { stripeRouter } from "./routers/stripe";
import { userRouter } from "./routers/user";
import { createCallerFactory, createRouter } from "./trpc";

export const appRouter = createRouter({
  user: userRouter,
  form: formRouter,
  stripe: stripeRouter,
  formData: formDataRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export const createCaller = createCallerFactory(appRouter);

export { createTRPCContext } from "./trpc";
