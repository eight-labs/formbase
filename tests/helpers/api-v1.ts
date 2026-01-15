import { getTestDb } from './db';

export async function createApiV1Caller(apiKeyToken?: string) {
  const { createApiV1CallerFactory } = await import('@formbase/api/routers/api-v1');

  const headers = new Headers();
  if (apiKeyToken) {
    headers.set('Authorization', `Bearer ${apiKeyToken}`);
  }

  const ctx = {
    db: getTestDb(),
    headers,
  };

  return createApiV1CallerFactory(() => ctx);
}
