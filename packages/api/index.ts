import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';

import { apiKeysRouter } from './routers/api-keys';
import { authRouter } from './routers/auth';
import { formRouter } from './routers/form';
import { formDataRouter } from './routers/formData';
import { userRouter } from './routers/user';
import { createCallerFactory, createRouter } from './trpc';

export const appRouter = createRouter({
  auth: authRouter,
  user: userRouter,
  form: formRouter,
  formData: formDataRouter,
  apiKeys: apiKeysRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export const createCaller = createCallerFactory(appRouter);

export { createTRPCContext } from './trpc';
export { logApiRequest, cleanupOldAuditLogs } from './lib/audit-log';
