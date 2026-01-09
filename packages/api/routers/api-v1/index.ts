import { initTRPC } from '@trpc/server';

import { formsRouter } from './forms';
import { submissionsRouter } from './submissions';
import { createApiV1Router, type ApiV1Context } from './trpc';

export const apiV1Router = createApiV1Router({
  forms: formsRouter,
  submissions: submissionsRouter,
});

export type ApiV1Router = typeof apiV1Router;

const t = initTRPC.context<ApiV1Context>().create();
export const createApiV1CallerFactory = t.createCallerFactory(apiV1Router);

export { createApiV1Context, type ApiV1Context } from './trpc';
