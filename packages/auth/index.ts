import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from '@formbase/db';
import * as schema from '@formbase/db/schema';
import { env } from '@formbase/env';

import { sendResetPasswordEmail, sendVerificationEmail } from './email';

const socialProviders = {
  ...(env.AUTH_GITHUB_ID && env.AUTH_GITHUB_SECRET
    ? {
        github: {
          clientId: env.AUTH_GITHUB_ID,
          clientSecret: env.AUTH_GITHUB_SECRET,
        },
      }
    : {}),
  ...(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET
    ? {
        google: {
          clientId: env.AUTH_GOOGLE_ID,
          clientSecret: env.AUTH_GOOGLE_SECRET,
        },
      }
    : {}),
};

export const auth = betterAuth({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: {
      ...schema,
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: env.ALLOW_SIGNIN_SIGNUP === 'false',
    sendResetPassword: async ({ user, token }) => {
      const resetUrl = `${env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;
      await sendResetPasswordEmail({
        email: user.email,
        url: resetUrl,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verifyUrl = `${env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
      await sendVerificationEmail({
        email: user.email,
        url: verifyUrl,
      });
    },
  },
  ...(Object.keys(socialProviders).length > 0 ? { socialProviders } : {}),
  session: {
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.User;
