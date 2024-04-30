import { formRouter } from "./routers/form";
import { formDataRouter } from "./routers/formData";
import { stripeRouter } from "./routers/stripe";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  stripe: stripeRouter,
  form: formRouter,
  formData: formDataRouter,
});

export type AppRouter = typeof appRouter;
