import { cookies } from 'next/headers';

import { generateState, GitHub, OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';

import { db } from '@formbase/db';
import { oauth, users } from '@formbase/db/schema';
import { env } from '@formbase/env';

import { lucia } from '../lucia';

const github =
  env.AUTH_GITHUB_ID !== undefined && env.AUTH_GITHUB_SECRET !== undefined
    ? new GitHub(env.AUTH_GITHUB_ID, env.AUTH_GITHUB_SECRET)
    : undefined;

export async function createGithubAuthorizationURL(): Promise<Response> {
  if (!github) {
    return new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const state = generateState();
  const url = await github.createAuthorizationURL(state, {
    scopes: ['read:user', 'user:email'],
  });

  cookies().set('github_oauth_state', state, {
    path: '/',
    secure: env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });

  return Response.redirect(url);
}

interface GitHubUser {
  id: string;
  email: string;
  avatar_url: string;
  name: string;
}

type EmailInfo = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: 'private' | null;
};

type EmailList = EmailInfo[];

export async function validateGithubCallback(
  request: Request,
): Promise<Response> {
  if (!github) {
    return new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies().get('github_oauth_state')?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser = (await githubUserResponse.json()) as GitHubUser;

    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const githubUserEmails = (await emailResponse.json()) as EmailList;
    const primaryEmail = githubUserEmails.find(
      (email: { primary: boolean }) => email.primary,
    );

    if (!primaryEmail?.email || !primaryEmail.verified) {
      return new Response(
        JSON.stringify({
          error: 'Your github account must have a primary email address.',
        }),
        { status: 400, headers: { Location: '/login' } },
      );
    }

    const existingUser = await db.query.oauth.findFirst({
      where: (table, { and, eq }) =>
        and(
          eq(table.providerId, 'github'),
          eq(table.providerUserId, githubUser.id),
        ),
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/dashboard',
        },
      });
    }

    const userId = generateId(15);
    await db.insert(users).values({
      id: userId,
      email: primaryEmail.email,
      name: githubUser.name,
      avatar: githubUser.avatar_url,
    });

    await db.insert(oauth).values({
      providerId: 'github',
      providerUserId: githubUser.id,
      userId,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/dashboard',
      },
    });
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
