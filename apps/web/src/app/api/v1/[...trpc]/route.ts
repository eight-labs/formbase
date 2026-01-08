import { type NextRequest, NextResponse } from 'next/server';
import { createOpenApiFetchHandler } from 'trpc-to-openapi';

import { apiV1Router, createApiV1Context, type ApiV1Context } from '@formbase/api/routers/api-v1';
import { logApiRequest } from '@formbase/api';
import { db } from '@formbase/db';

export const dynamic = 'force-dynamic';

async function transformErrorResponse(response: Response): Promise<Response> {
  if (response.ok) return response;

  try {
    const body = await response.json();
    const errorResponse = {
      error: {
        code: body.code ?? 'INTERNAL_SERVER_ERROR',
        message: body.message ?? 'An unexpected error occurred',
      },
    };

    const headers = new Headers(response.headers);

    if (response.status === 429 && body.message) {
      const match = body.message.match(/Retry after (\d+) seconds/);
      if (match) {
        headers.set('Retry-After', match[1]);
      }
    }

    return new NextResponse(JSON.stringify(errorResponse), {
      status: response.status,
      headers,
    });
  } catch {
    return response;
  }
}

const handler = async (req: NextRequest) => {
  const startTime = Date.now();
  let ctx: ApiV1Context | null = null;

  const response = await createOpenApiFetchHandler({
    endpoint: '/api/v1',
    router: apiV1Router,
    createContext: async () => {
      ctx = await createApiV1Context({ headers: req.headers });
      return ctx;
    },
    req,
    responseMeta: ({ ctx: responseCtx }) => {
      const headers: Record<string, string> = {};
      const typedCtx = responseCtx as ApiV1Context | undefined;

      if (typedCtx?.rateLimitRemaining !== undefined) {
        headers['X-RateLimit-Remaining'] = String(typedCtx.rateLimitRemaining);
      }
      if (typedCtx?.rateLimitReset !== undefined) {
        headers['X-RateLimit-Reset'] = String(typedCtx.rateLimitReset);
      }

      return { headers };
    },
  });

  const responseTime = Date.now() - startTime;
  const typedCtx = ctx as ApiV1Context | null;

  if (typedCtx?.apiKey) {
    logApiRequest(db, {
      apiKeyId: typedCtx.apiKey.id,
      userId: typedCtx.apiKey.userId,
      method: req.method,
      path: new URL(req.url).pathname,
      statusCode: response.status,
      ipAddress: req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? undefined,
      userAgent: req.headers.get('user-agent') ?? undefined,
      responseTimeMs: responseTime,
    }).catch(() => {});
  }

  return transformErrorResponse(response);
};

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as OPTIONS,
  handler as HEAD,
};
