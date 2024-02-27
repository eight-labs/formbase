import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { nanoid as generateId } from "nanoid";
import { cookies } from "next/headers";

import { github, lucia } from "~/lib/auth";
import { redirects } from "~/lib/constants";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
      headers: { Location: redirects.toLogin },
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const githubUser = (await githubUserResponse.json()) as GitHubProfile;

    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const githubUserEmails = await emailResponse.json();
    const primaryEmail = githubUserEmails.find(
      (email: { primary: boolean }) => email.primary,
    );

    if (!primaryEmail.email || !primaryEmail.verified) {
      return new Response(
        JSON.stringify({
          error: "Your github account must have a verified email address.",
        }),
        { status: 400, headers: { Location: redirects.toLogin } },
      );
    }

    const existingUser = await db.query.users.findFirst({
      where: (table, { eq, or }) =>
        or(
          eq(table.githubId, githubUser.id),
          eq(table.email, primaryEmail.email),
        ),
    });

    if (!existingUser) {
      const userId = generateId(21);
      await db.insert(users).values({
        id: userId,
        name: githubUser.name,
        email: primaryEmail.email,
        emailVerified: true,
        githubId: githubUser.id,
        avatar: githubUser.avatar_url,
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
        headers: { Location: redirects.afterLogin },
      });
    }

    if (
      existingUser.githubId !== githubUser.id ||
      existingUser.avatar !== githubUser.avatar_url
    ) {
      await db
        .update(users)
        .set({
          githubId: githubUser.id,
          emailVerified: true,
          avatar: githubUser.avatar_url,
        })
        .where(eq(users.id, existingUser.id));
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return new Response(null, {
      status: 302,
      headers: { Location: redirects.afterLogin },
    });
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(JSON.stringify({ message: "Invalid code" }), {
        status: 400,
      });
    }

    return new Response(JSON.stringify({ message: "internal server error" }), {
      status: 500,
    });
  }
}

export interface GitHubProfile {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username?: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  private_gists?: number;
  total_private_repos?: number;
  owned_private_repos?: number;
  disk_usage?: number;
  suspended_at?: string | null;
  collaborators?: number;
  two_factor_authentication: boolean;
  plan?: {
    collaborators: number;
    name: string;
    space: number;
    private_repos: number;
  };
  [claim: string]: unknown;
}
