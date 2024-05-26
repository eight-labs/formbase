import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets";
import { z } from "zod";

export const env = createEnv({
  extends: [vercel()],
  shared: {
    NODE_ENV: z.enum(["development", "test", "production"]).optional(),
  },
  server: {
    PORT: z.coerce.number().default(3000),

    DATABASE_URL: z.string().url().startsWith("postgres"),

    AUTH_GITHUB_ID: z.string().optional(),
    AUTH_GITHUB_SECRET: z.string().optional(),

    GITHUB_CLIENT_ID: z.string().trim().min(1),
    GITHUB_CLIENT_SECRET: z.string().trim().min(1),

    SMTP_HOST: z.string().trim().min(1),
    SMTP_PORT: z.coerce.number().int().min(1),
    SMTP_USER: z.string().trim().min(1),
    SMTP_PASSWORD: z.string().trim().min(1),
    STRIPE_API_KEY: z.string().trim().min(1),

    STRIPE_WEBHOOK_SECRET: z.string().trim().min(1),
    STRIPE_PRO_MONTHLY_PLAN_ID: z.string().trim().min(1),

    ALLOW_SIGNIN_SIGNUP: z.string().trim().min(1),

    UMAMI_TRACKING_ID: z.string().optional(),
    MINIO_ENDPOINT: z.string().trim().min(1),
    MINIO_PORT: z.coerce.number().int().min(1),
    MINIO_USESSL: z.coerce.boolean(),
    MINIO_ACCESSKEY: z.string().trim().min(1),
    MINIO_SECRETKEY: z.string().trim().min(1),
    MINIO_BUCKET: z.string().trim().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env["NODE_ENV"],
    NEXT_PUBLIC_APP_URL: process.env["NEXT_PUBLIC_APP_URL"],
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env["SKIP_ENV_VALIDATION"],
});
