import { createEnv } from '@t3-oss/env-nextjs';
import { vercel } from '@t3-oss/env-nextjs/presets';
import { z } from 'zod';

export const env = createEnv({
  extends: [vercel()],
  shared: {
    NODE_ENV: z.enum(['development', 'test', 'production']).optional(),
  },
  server: {
    PORT: z.coerce.number().default(3000),

    DATABASE_URL: z
      .string()
      .refine(
        (url) => url.startsWith('libsql://') || url.startsWith('file:'),
        'Must be libsql:// or file: URL',
      ),
    TURSO_AUTH_TOKEN: z.string().optional(),

    AUTH_GITHUB_ID: z.string().optional(),
    AUTH_GITHUB_SECRET: z.string().optional(),
    AUTH_GOOGLE_ID: z.string().optional(),
    AUTH_GOOGLE_SECRET: z.string().optional(),

    SMTP_HOST: z.string().trim().min(1).optional(),
    SMTP_PORT: z.coerce.number().int().min(1).optional(),
    SMTP_USER: z.string().trim().min(1).optional(),
    SMTP_PASS: z.string().trim().min(1).optional(),

    ALLOW_SIGNIN_SIGNUP: z.string().trim().min(1),

    UMAMI_TRACKING_ID: z.string().optional(),
    MINIO_ENDPOINT: z.string().trim().min(1),
    MINIO_PORT: z.coerce.number().int().min(1),
    MINIO_USESSL: z.coerce.boolean(),
    MINIO_ACCESSKEY: z.string().trim().min(1),
    MINIO_SECRETKEY: z.string().trim().min(1),
    MINIO_BUCKET: z.string().trim().min(1),

    RESEND_API_KEY: z.string().trim().optional(),
    SMTP_TRANSPORT: z.enum(['smtp', 'resend']).optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env['NODE_ENV'],
    NEXT_PUBLIC_APP_URL: process.env['NEXT_PUBLIC_APP_URL'],
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env['SKIP_ENV_VALIDATION'],
});
